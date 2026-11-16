# ASCB Cell Bio 2026: HubSpot landing page

`ascb-cell-bio-2026-paste-into-design-manager.html` is generated from `../design/Main.dc.html`. Don't edit it by hand.

Rebuild after changing the page:

```
python3 sfn-2026/tools/build-hubspot.py ascb-cell-bio-2026/design/Main.dc.html "Biotium – ASCB Cell Bio 2026 Landing Page" > ascb-cell-bio-2026/hubspot/ascb-cell-bio-2026-paste-into-design-manager.html
```

The build inlines local images, except the ones listed in `../design/hosted-images.json`, which point at copies already hosted on learn.biotium.com.

Merging to `main` deploys it to Design Manager (`Landing Pages/ascb-cell-bio-2026.html`) through `.github/workflows/deploy-hubspot.yml`. Pasting it in by hand still works as a fallback.
