# SBH DEV Arcade — replacement website

This is a static HTML/CSS/JavaScript replacement for the current SBH DEV website. It keeps the existing logo assets, domain/deployment file (`CNAME`), minimal black-and-white style, and English/Arabic pages.

## Files
- `index.html` — English home page
- `ar.html` — Arabic (RTL) home page
- `style.css` — responsive layout and shared visual system
- `games.js` — mobile navigation, catalog search/category filters, game modal and safe HTTPS iframe handling
- `Black.png`, `White.png` — original logo assets
- `CNAME` — preserved from the original project

## Important: game provider is not connected yet
The catalog currently contains clearly labeled integration slots, not live games. A live game catalog requires a provider account/approval and game embed URLs whose terms permit your site to embed and monetize the games. Do not copy random game files or embed URLs from other portals without permission.

When the provider supplies an approved HTTPS embed URL:
1. Find the relevant `<article class="game-card" ...>` in `index.html` or `ar.html`.
2. Add `data-game-url="https://PROVIDER-APPROVED-EMBED-URL"` to that article element.
3. Replace its sample title, description, category, and search terms with the provider's actual game metadata.
4. Verify the provider's iframe policy, branding requirements, attribution, geographic restrictions, and monetization rules.
5. Test the game on desktop and mobile, and confirm keyboard, touch, fullscreen and privacy behavior.

The modal only accepts HTTPS embed URLs. This is a basic safety guard, not a substitute for provider review.

## Deploying
Upload the contents of this folder to the existing static hosting root, replacing the old `index.html`, `ar.html`, and `style.css` and adding `games.js`. Keep the original logo assets and `CNAME`. Before overwriting production, download a backup of the current site and test these files on a staging copy or local static server.

## Monetization and launch checklist
- Obtain provider approval and verify revenue-share / advertising terms.
- Add a real privacy policy and cookie/advertising disclosures before enabling analytics or ads.
- Add contact/support details and terms of use.
- Replace integration slots with approved games and real descriptions.
- Add unique game pages and search-engine metadata once actual game titles are known.
- Do not expect revenue simply from publishing the website; traffic, retention, game licensing, and advertising/provider approval all matter.


## Original playable games

This version includes three original self-contained HTML5 games in `games/`: `brick-breaker.html`, `snake.html`, and `memory-match.html`. They use inline CSS/JavaScript and no external game provider. The catalog opens these same-origin files in the existing game modal. Test by serving the project through a local web server or deployment; some browser features behave differently when opened directly from disk.
