# Argi Garbi System — Figma → HTML / CSS / JavaScript

Implementation of the six Figma frames (file `fgPHAfxg27B5YhDPIndKzC`), which are the source of truth:

| Route | Figma node | Frame |
|---|---|---|
| `#home` | `2208:646` (+ hover `2224:1309`) | Home, **Figma** tab, Figma-source card |
| `#react` | `2210:1653` (+ hover `2224:1165`) | Home, **React** tab, 3 components + View all |
| `#react-view-all` | `2210:2060` | All 9 components + View less |
| `#button` | `2290:1614` | Interactive Component (Button), intro with `img/button-card.png` |

## Run
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Architecture
- `css/tokens-v2.1.css`, `css/tokens-semantic-v2.1.css` — your tokens, unchanged.
- `css/button.css` — your Button component (v2.1). Every button on the site is a real `.btn btn--{type} btn--{size}`.
- `css/styles.css` — layout layer; consumes the tokens. Literal Figma fills that have no token are named once at the top.
- `js/assets.js` — every Figma asset URL in one place.
- `js/app.js` — router + interactions.

## Interactive Component page (`#button`)
- **Playground**: TYPE / SIZE / STATUS tags drive the real Button (`btn--secondary`, `btn--sm`, `disabled`…). Hover, pressed and focus come from `button.css`.
- **Modal**: Cancel / X closes it (a "Reopen modal" button appears); "Yes, delete" confirms.
- **Date picker**: trigger toggles the panel, pick a day, change month, Cancel / Select.
- Fab (top right) returns to the component list.

## Assets — one step left
Figma's MCP asset URLs expire after ~7 days and could not be downloaded from the build sandbox. On a machine with internet:
```bash
node tools/localize-assets.mjs
```
It saves every file in `js/assets.js` to `/assets` and rewrites the paths. If a URL has expired, re-export that asset from Figma.

## Figma inconsistencies kept / decided
- Status tag reads **"LIve"** in Figma (capital I) — kept as designed.
- Playground frame shows STATUS = *Disabled* selected but renders an enabled button; the page starts on *Default* so tags and button agree.
- Hover frame `2224:1165` shows the Link row with the "completed" icon; other frames show it in progress — kept in progress.
- Calendar follows the Figma grid (Aug 1 in the Tuesday column) and the header says "Mon, Aug 17" while 17 sits in the Thursday column; after you pick a day the weekday is derived from the grid.
