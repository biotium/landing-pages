# SfN 2026 (Neuroscience 2026) Landing Page

Biotium's booth landing page for Neuroscience 2026 (SfN), Nov 15-18, 2026, Washington, DC, Booth 1106.

- `page.yaml` is the page's content. Edit it, then run `python3 tools/build-pages.py` from the repo root.
- `QuietFieldVariant.dc.html` and `hubspot/sfn-2026-paste-into-design-manager.html` are generated. Don't edit them by hand.
- Layout, styling and behavior come from `../shared/` (see CLAUDE.md).

## Assets

- `hero-brain.js` - the particle brain (data and renderer), included through `scripts:` in `page.yaml`.
- `hero-brain.webp` - source image for the particle brain. `tools/brain-particles.py` turns it into the data in `hero-brain.js`.
- `portfolio-*.webp`, `resource-*.webp`, `promo-neurons.webp`, `tshirts.webp` - page images.

Review copy (SfN 2026 LP): https://claude.ai/artifact/9FFyRbx2a4gxPwBwSMnF1P
