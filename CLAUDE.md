# Landing-Pages

Biotium event landing pages. Manny Criado (mcriado@biotium.com) owns and maintains this repo and works on it from a phone, a laptop and a desktop, mostly through Claude Code cloud sessions.

## Writing rules

- Never use em dashes in any copy: page text, commit messages, READMEs, comments or chat replies. Use commas, periods, colons or parentheses instead.
- Keep trademark symbols on product names (MiniMab™, TyraMax™, CytoLiner™, Biotium Choice™).

## Layout

Each event has its own folder:

- `sfn-2026/`: Neuroscience 2026 (SfN), Washington, DC, Nov 15-18, Booth 1106. Not live yet.
  - `QuietFieldVariant.dc.html` is the page. Earlier hero directions were removed and live in git history.
  - `hubspot/` holds the single copy-paste file for HubSpot Design Manager, built from `QuietFieldVariant.dc.html` by `tools/build-hubspot.py`. Rebuild it after changing that page.
- `ascb-cell-bio-2026/`: ASCB Cell Bio 2026, San Diego, Dec 12-15. `design/` holds the source, `hubspot/` holds the HubSpot file.

Pages are self-contained HTML: inline CSS and JS, Mulish from Google Fonts, Biotium blue `#0084FF` (links `#087eec`), green `#39B54A`, red `#ED1C24`. Nothing here is served from GitHub. Live pages are pasted into HubSpot Design Manager by hand.

## Button standard

Every Biotium landing page uses these two buttons. Copy them as is; don't add gradients, glass blur, glows or hover movement.

- **Primary** (one main CTA per section): solid Biotium blue pill, white text.
  ```css
  .bt-btn-primary { display: inline-flex; align-items: center; gap: 8px; background: #0084FF; color: #ffffff; font-weight: 800; font-size: 16px; padding: 15px 28px; border-radius: 999px; border: 1px solid #0084FF; text-decoration: none; transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; box-shadow: 0 8px 20px rgba(0,132,255,0.22); }
  .bt-btn-primary:hover { background: #0062be; border-color: #0062be; color: #ffffff; box-shadow: 0 10px 24px rgba(0,98,190,0.28); }
  ```
- **Outline** (secondary actions, card buttons): white pill with a blue outline that inverts to solid Biotium blue on hover.
  ```css
  .bt-btn-outline { display: inline-flex; align-items: center; gap: 8px; background: #ffffff; color: #087eec; font-weight: 800; font-size: 14px; padding: 11px 20px; border-radius: 999px; border: 1.5px solid rgba(8,126,236,0.55); text-decoration: none; transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease; }
  .bt-btn-outline:hover { background: #0084FF; border-color: #0084FF; color: #ffffff; }
  ```
- Icons inside buttons use `stroke="currentColor"` so they flip to white with the text.
- When a whole card is the link, its button is a `<span class="bt-btn-outline">` inside the card's `<a>`, never a second link.



Manny still edits the ASCB design canvas visually on claude.ai: https://claude.ai/artifact/FgTJhZHtbTBDJn3a1jJz7g (shared with the Biotium org). It can fall behind this repo, or get ahead of it. Before syncing in either direction, check which side is newer and ask.

The SfN design canvas (https://claude.ai/artifact/1znzipdNYLjjscsdsNctTp) is retired now that Quiet Field is the pick. Don't sync it.

The Quiet Field page is also published as a standalone artifact: https://claude.ai/artifact/9jy6gG9UWHWavorH6RLzDK. When `QuietFieldVariant.dc.html` changes, ask whether to republish it.

## Git workflow

- `main` is the default branch and holds the current version of every page.
- Do work on a branch (cloud sessions create `claude/...` branches automatically). Push before a session ends so any device can pick it up.
- Merge into `main` only when Manny says the work is ready, then delete the branch.
- This repo is public. Don't commit anything sensitive.
