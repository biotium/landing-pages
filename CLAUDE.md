# Landing-Pages

Biotium event landing pages. Manny Criado (mcriado@biotium.com) owns and maintains this repo and works on it from a phone, a laptop and a desktop, mostly through Claude Code cloud sessions.

## Writing rules

- Never use em dashes in any copy: page text, commit messages, READMEs, comments or chat replies. Use commas, periods, colons or parentheses instead.
- Keep trademark symbols on product names (MiniMab™, TyraMax™, CytoLiner™, Biotium Choice™).

## How pages are built

Every landing page is assembled from shared components; only content differs between pages.

```
<event>/page.yaml          content only: copy, links, images, event details, which sections to show
shared/components/*.html   markup, one component per piece (header, quick nav, hero, feature, portfolio, offer,
                           resources, merch, say-hi, ask-form, footer, promo bar, icons, logos)
shared/landing-page.css    all styling (tokens, components, buttons, hero variants)
shared/landing-page.js     all shared behavior (progress bar, header, reveals, nav, faces, swatches, neuron field)
shared/team.yaml + team/   the Come say hi headshots, shared by every page
        |
        v  python3 tools/build-pages.py   (needs: pip install -r tools/requirements.txt)
<event>/...dc.html         generated self-contained page (design canvas, artifacts). Never edit by hand.
<event>/hubspot/*.html     generated HubSpot template (tools/build-hubspot.py inlines images)
```

- To change content, edit the event's `page.yaml`. To change how anything looks or behaves, edit `shared/` (and it changes on every page). Then run `python3 tools/build-pages.py` and commit the generated files too.
- Sections in `page.yaml` are a list; each `type` maps to a component (`portfolio`, `offer`, `resources`, `merch`, `say-hi`, `ask-form`). Reorder, add or drop them per page. The hero has two visuals: `neurons` (SfN's neuron field and particle brain) and `photo`. The feature card media can be `wistia`, `swatches` or an image.
- Page-specific data scripts are listed under `scripts:` (SfN's `hero-brain.js`). Images live in the event folder (paths relative to the generated page); shared images live in `shared/`. `hosted-images.json` next to a page swaps listed images for copies already hosted on learn.biotium.com.
- A new event: copy a `page.yaml` into a new folder, change the content, add its HubSpot upload step to the workflow, build.
- The deploy runs `tools/build-pages.py --check` and refuses to ship if any generated file is out of date.

Events:

- `sfn-2026/`: Neuroscience 2026 (SfN), Washington, DC, Nov 15-18, Booth 1106. Generates `QuietFieldVariant.dc.html`.
- `ascb-cell-bio-2026/`: ASCB Cell Bio 2026, San Diego, Dec 12-15, Booth 1216. Generates `design/Main.dc.html`.

Pages are self-contained HTML: inline CSS and JS, Mulish from Google Fonts, Biotium blue `#0084FF` (links `#0070d9`, the lightest step of the brand hue that passes WCAG AA as text), green `#39B54A`, red `#ED1C24`. Nothing here is served from GitHub.

## Deploying to HubSpot

`.github/workflows/deploy-hubspot.yml` uploads the HubSpot files to Design Manager on every push to `main` that touches them, so merging to `main` is going live (there is no draft step):

- `sfn-2026/hubspot/sfn-2026-paste-into-design-manager.html` → `Landing Pages/sfn-2026.html`
- `ascb-cell-bio-2026/hubspot/ascb-cell-bio-2026-paste-into-design-manager.html` → `Landing Pages/ascb-cell-bio-2026.html`

It authenticates with the repository secret `HUBSPOT_PERSONAL_ACCESS_KEY` (portal 39765345, Design Manager scope) and refuses to deploy pages that don't match a fresh build. It can also be run by hand from the Actions tab. Edits made directly in Design Manager get overwritten on the next deploy, so make changes here. Pasting the file by hand still works as a fallback.

## Button standard

Every Biotium landing page uses these two buttons. Copy them as is; don't add gradients, glass blur, glows or shadows, or hover movement. Both pass WCAG 2.2 AA: white on `#0084FF` is 3.7:1, which only passes as large text, so the primary label is 19px bold.

- **Primary** (one main CTA per section): solid Biotium blue pill, white text.
  ```css
  .bt-btn-primary { display: inline-flex; align-items: center; gap: 8px; background: #0084FF; color: #ffffff; font-weight: 800; font-size: 19px; padding: 14px 30px; border-radius: 999px; border: 1px solid #0084FF; text-decoration: none; transition: background-color 0.2s ease, border-color 0.2s ease; }
  .bt-btn-primary:hover { background: #0062be; border-color: #0062be; color: #ffffff; }
  ```
- **Outline** (secondary actions, card buttons): white pill with a blue outline that inverts to the dark Biotium blue on hover (white 14px text fails AA on `#0084FF`).
  ```css
  .bt-btn-outline { display: inline-flex; align-items: center; gap: 8px; background: #ffffff; color: #0070d9; font-weight: 800; font-size: 14px; padding: 11px 20px; border-radius: 999px; border: 1.5px solid rgba(8,126,236,0.55); text-decoration: none; transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease; }
  .bt-btn-outline:hover { background: #0062be; border-color: #0062be; color: #ffffff; }
  ```
- Icons inside buttons use `stroke="currentColor"` so they flip to white with the text.
- When a whole card is the link, its button is a `<span class="bt-btn-outline">` inside the card's `<a>`, never a second link.
- Small white text never sits on `#0084FF` (it fails AA). Use `#0062be` behind small white text (the promo bar), or set the text at large size (20px bold leads on the blue section).

## Component set

The CSS classes in `shared/landing-page.css` that the components use. New components should be built from these instead of new one-off styles.

- **Tokens** (CSS variables on `.bt-body-scope`). Use a token, never a raw value; the button standard is the only exception.
  - Color: brand (`--bt-blue`, `--bt-blue-dark`, `--bt-link`, `--bt-tint`, blue alphas), neutrals darkest to lightest (`--bt-ink` #2d2d2d, `--bt-text-strong` #444, `--bt-text` #555, `--bt-muted` #6b6b6b, `--bt-subtle` #767676 placeholders only, `--bt-line-input` #8c8c8c form field borders (3:1, WCAG 1.4.11), `--bt-line-strong`, `--bt-line`, `--bt-alt`), dark surfaces (`--bt-dark`, `--bt-dark-line`, `--bt-on-dark`, `--bt-on-dark-muted`).
  - Type: `--bt-fs-2xs` 12, `xs` 13, `sm` 14, `base` 15, `md` 16, `lg` 17, `xl` 20, `h2` 30, `h2-lg` 34, `h1` 56 (phones: 26, 28, 40). Line heights `display` 1.06, `tight` 1.2, `snug` 1.3, `body` 1.5, `relaxed` 1.6. Weights 600, 700, 800.
  - Spacing: 4px grid, `--bt-s-1` 4 through `--bt-s-20` 80, plus `--bt-gap-block` 40, `--bt-gutter` 24, `--bt-pad-card` 24, `--bt-pad-card-lg` 48 (24 on phones).
  - Radius: `--bt-r-sm` 6, `--bt-r-inner` 12, `--bt-r-card` 16, `--bt-r-pill`, `--bt-r-round`.
  - Elevation: `--bt-shadow`, `--bt-shadow-hover`, `--bt-shadow-float`, `--bt-shadow-on-blue`, `--bt-focus-ring`.
- **Header**: two parts. `header.html` is the top header (logo, "Glowing Products for Science™" tagline; on phones the booth pill sits here instead) and scrolls away. `quick-nav.html` is the `.bt-nav` bar of section links plus the `.bt-booth-pill` (opens the floor plan); it sits right under the hero zone and sticks to the top once you scroll past it. Links highlight the section in view; on phones they are an always-visible swipeable chip row. `--bt-header-h` (56px, 52px on phones) sets where anchor jumps land, so update it if the bar height changes.
- **Feature**: `feature.html`, its own grey band (`.bt-feature-band`) right under the quick nav: copy beside the media, no card. The hero date is a plain text line. The photo hero's media is an unframed cutout (`.bt-hero-overlay`) on the hero's bottom-right edge.
- **Section**: `.bt-section` (72/80 padding; 104/112 on desktop) with `--alt` (grey), `--blue`, `--tint` (light brand blue, used by Ask a scientist; links on it use `--bt-blue-dark`), `--compact`, `--join-next`, `--flush-top`.
- **Head**: `.bt-head` (kicker, `.bt-h2`, optional `.bt-lead`, 12px apart; the kicker is a dark-blue text eyebrow, not a pill); `.bt-head--center` for centered section heads. `.bt-h2--lg` only inside feature cards.
- **Surface**: `.bt-surface` (white, hairline, 16px corners), `--raised` adds the shadow, `--lg` 48px padding. `.bt-panel` is the grey inset; `.bt-media` frames video or images.
- **Feature card**: `.bt-feature` with `.bt-feature-copy` plus `.bt-feature-media` or a panel. The sale card still wraps it in `.bt-surface--raised.bt-surface--lg`.
- **Link cards**: `.bt-card.bt-surface` plus `.bt-cat-card` (portfolio row) or `.bt-res-card` (resource), with `.bt-card-title`, `.bt-card-desc`, `.bt-icon-box--lg` / `--sm`, `.bt-card-go` arrow.
- **Text**: `.bt-lead` 16px, `.bt-note` 13px, `.bt-fine` 12px, `.bt-tagline`, `.bt-accent`, `.bt-check-list`, `.bt-link-arrow`.



The ASCB design canvas has been deleted; its layout lives in `shared/` and its content in `ascb-cell-bio-2026/page.yaml`. Make ASCB changes here.

The SfN design canvas (https://claude.ai/artifact/1znzipdNYLjjscsdsNctTp) is retired now that Quiet Field is the pick. Don't sync it.

Event page artifacts (review copies of a built page, published from the generated `.dc.html` with images inlined) are named `<event abbreviation> <year> LP`, set in the page's `<title>`:

- ASCB 2026 LP: https://claude.ai/artifact/4AEUsNqgnPsrY6WbUAWufn
- SfN 2026 LP: https://claude.ai/artifact/9FFyRbx2a4gxPwBwSMnF1P

When a page's build changes, republish its LP artifact to the same link.

## Git workflow

- `main` is the default branch and holds the current version of every page.
- Do work on a branch (cloud sessions create `claude/...` branches automatically). Push before a session ends so any device can pick it up.
- Merge into `main` only when Manny says the work is ready, then delete the branch.
- This repo is public. Don't commit anything sensitive.
