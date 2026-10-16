# SfN 2026 (Neuroscience 2026) Landing Page

Design source for Biotium's booth landing page at Neuroscience 2026 (SfN), Nov 14-18, 2026, Washington, DC, Booth #1106. Not live yet.

## Pages

- `QuietFieldVariant.dc.html` - the definitive landing page and the HubSpot source. Hero with an ambient neuron field (quiet on the left, dense on the right) and an interactive particle brain overlay (assembles on load, pushes away from the cursor or a dragging finger, ripples on click or tap).

Earlier directions (`Main`, `BrainVariant`, `GlassVariant`, `ScrollVariant`) and the design-canvas layout were removed once Quiet Field became the pick. They're in git history before this change.

## Assets

- `hero-brain.webp` - source image for the Quiet Field particle brain. The page doesn't load it; `tools/brain-particles.py` turns it into the particle data inlined in the page. Rerun it if the image changes.
- `biotium-choice-icon.svg` - Biotium Choice badge.
- `tshirts.webp` - show merch photo.
- `portfolio-*.webp` - portfolio card images.

## HubSpot

`hubspot/` holds the self-contained file to paste into HubSpot Design Manager, built from `QuietFieldVariant.dc.html` with `tools/build-hubspot.py`. See `hubspot/README.md`.

## Artifacts

- Quiet Field: https://claude.ai/artifact/9jy6gG9UWHWavorH6RLzDK
