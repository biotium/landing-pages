"""Build every landing page from its content file and the shared components.

Each event folder has a page.yaml with content only (copy, links, images). Everything else
comes from shared/: components/ (markup), landing-page.css (styling), landing-page.js (behavior),
team.yaml + team/ (the Come say hi headshots). This script renders each page to its .dc.html
(the self-contained page the design canvas and artifacts use) and then builds its HubSpot file.

Usage:
  python3 tools/build-pages.py           build every page
  python3 tools/build-pages.py --check   exit 1 if any generated file is out of date (the deploy runs this)
  python3 tools/build-pages.py sfn-2026  build one event folder

Needs: pip install jinja2==3.1.4 pyyaml
"""
import glob, os, subprocess, sys
import jinja2, yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHARED = os.path.join(ROOT, 'shared')
HUBSPOT_BUILD = os.path.join(ROOT, 'tools', 'build-hubspot.py')

env = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.join(SHARED, 'components')),
    trim_blocks=True, lstrip_blocks=True, keep_trailing_newline=True, autoescape=False,
)


def read(path):
    with open(path, encoding='utf-8') as f:
        return f.read()


def render(event_dir):
    content = yaml.safe_load(read(os.path.join(event_dir, 'page.yaml')))
    out_path = os.path.join(event_dir, content['output'])
    out_dir = os.path.dirname(out_path)
    scripts = []
    for name in content.get('scripts', []):
        scripts.append('<!-- ' + name + ' -->\n<script>\n' + read(os.path.join(event_dir, name)) + '</script>')
    html = env.get_template('page.html').render(
        source=os.path.relpath(os.path.join(event_dir, 'page.yaml'), ROOT),
        shared_css=read(os.path.join(SHARED, 'landing-page.css')).rstrip('\n'),
        shared_js='/* shared/landing-page.js */\n' + read(os.path.join(SHARED, 'landing-page.js')),
        shared_path=os.path.relpath(SHARED, out_dir),
        team=yaml.safe_load(read(os.path.join(SHARED, 'team.yaml'))),
        promo_bar=content.get('promo_bar'),
        nav=content['nav'], event=content['event'], hero=content['hero'], feature=content['feature'],
        sections=content.get('sections', []), footer=content['footer'], page_scripts=scripts,
    )
    hub = content['hubspot']
    hub_path = os.path.join(event_dir, hub['output'])
    return [(out_path, html), (hub_path, None, hub['label'])]


def hubspot(dc_path, label):
    return subprocess.run([sys.executable, HUBSPOT_BUILD, dc_path, label], check=True,
                          capture_output=True, text=True, cwd=ROOT).stdout


def main():
    check = '--check' in sys.argv
    names = [a for a in sys.argv[1:] if a != '--check']
    dirs = [os.path.join(ROOT, n) for n in names] or sorted(os.path.dirname(p) for p in glob.glob(os.path.join(ROOT, '*', 'page.yaml')))
    stale = []
    for d in dirs:
        (dc_path, html), (hub_path, _, label) = render(d)
        current = read(dc_path) if os.path.exists(dc_path) else None
        if check:
            # build the HubSpot file from the freshly rendered page without touching the repo
            tmp = dc_path + '.check.tmp'
            with open(tmp, 'w', encoding='utf-8') as f:
                f.write(html)
            try:
                hub = hubspot(tmp, label)
            finally:
                os.remove(tmp)
            for path, new in [(dc_path, html), (hub_path, hub)]:
                old = read(path) if os.path.exists(path) else None
                if old != new:
                    stale.append(os.path.relpath(path, ROOT))
            continue
        if current != html:
            with open(dc_path, 'w', encoding='utf-8') as f:
                f.write(html)
        hub = hubspot(dc_path, label)
        with open(hub_path, 'w', encoding='utf-8') as f:
            f.write(hub)
        print('built', os.path.relpath(dc_path, ROOT), 'and', os.path.relpath(hub_path, ROOT))
    if stale:
        print('Out of date: ' + ', '.join(stale) + '. Run: python3 tools/build-pages.py')
        sys.exit(1)
    if check:
        print('all pages current')


if __name__ == '__main__':
    main()
