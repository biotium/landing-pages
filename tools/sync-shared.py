"""Copy the shared styling and behavior into every landing page.

shared/landing-page.css and shared/landing-page.js are the single source of truth for how every
Biotium landing page looks and behaves. Each page keeps its own copy inline (so it stays
self-contained for the design canvas, artifacts and HubSpot), and this script keeps those copies
identical to the shared files. Pages differ only in content.

Usage:
  python3 tools/sync-shared.py            rewrite every page's copy from shared/
  python3 tools/sync-shared.py --check    exit 1 if any page's copy differs (used by the deploy)
  python3 tools/sync-shared.py page.html  sync specific files (e.g. an artifact copy)

A page opts in by containing <script data-shared="landing-page.js">. Its first <style> block in
<helmet> (or, for standalone copies, the <style> block holding the design system) is the CSS copy.
"""
import glob, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSS = open(os.path.join(ROOT, 'shared/landing-page.css'), encoding='utf-8').read().rstrip('\n')
JS = open(os.path.join(ROOT, 'shared/landing-page.js'), encoding='utf-8').read()
CSS_HEAD = '    /* Generated from shared/landing-page.css by tools/sync-shared.py. Edit that file, not this copy. */\n'
JS_OPEN = '<script data-shared="landing-page.js">\n/* Generated from shared/landing-page.js by tools/sync-shared.py. Edit that file, not this copy. */\n'

HELMET_STYLE = re.compile(r'(<helmet>\n.*?\n  <style>\n)(.*?)(\n[ \t]*</style>\n</helmet>)', re.S)
LOOSE_STYLE = re.compile(r'(<style>\n?)(' + re.escape(CSS_HEAD) + r'.*?)(\n[ \t]*</style>)', re.S)
SCRIPT = re.compile(r'<script data-shared="landing-page\.js">\n.*?</script>', re.S)


def sync(text):
    css_re = HELMET_STYLE if '<helmet>' in text else LOOSE_STYLE
    text, n = css_re.subn(lambda m: m.group(1) + CSS_HEAD + CSS + m.group(3), text, count=1)
    if n != 1:
        raise SystemExit('no CSS block found')
    text, n = SCRIPT.subn(lambda m: JS_OPEN + JS + '</script>', text, count=1)
    if n != 1:
        raise SystemExit('no shared script block found')
    return text


def pages():
    out = []
    for p in sorted(glob.glob(os.path.join(ROOT, '**/*.dc.html'), recursive=True)):
        if '<script data-shared="landing-page.js">' in open(p, encoding='utf-8').read():
            out.append(p)
    return out


def main():
    args = [a for a in sys.argv[1:] if a != '--check']
    check = '--check' in sys.argv
    targets = args or pages()
    stale = []
    for p in targets:
        old = open(p, encoding='utf-8').read()
        new = sync(old)
        rel = os.path.relpath(p, ROOT)
        if new != old:
            if check:
                stale.append(rel)
            else:
                open(p, 'w', encoding='utf-8').write(new)
                print('synced', rel)
        else:
            print('current', rel)
    if stale:
        print('Out of sync with shared/: ' + ', '.join(stale) + '. Run: python3 tools/sync-shared.py')
        sys.exit(1)


if __name__ == '__main__':
    main()
