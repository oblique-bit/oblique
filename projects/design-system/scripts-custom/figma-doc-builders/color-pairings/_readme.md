# Color Pairings Builder

Generates the **🎨 Colors – Contrast Pairings cli** Figma docs page **and** two consumer-facing artifacts (`contrast-pairings.json`, `accessible-pairings.md`) from the semantic color variables in the live Figma file.

Mirrors the architecture of `../color-variables/build-color-variables.js`: a single `figma-ds-cli run` call with an embedded `PLUGIN_CODE` string + a tiny `registry.json` for layout rules. No JSON dumps to maintain — colors and pairings come from Figma variables, the per-swatch `usage` recommendation (real design-system use cases, from `registry.usage`) and `emph` annotations are computed at build time.

## Files

```
color-pairings/
  build-color-pairings.js   Node orchestrator + embedded PLUGIN_CODE (Figma side)
  registry.json       Layout rules per category + section/group header text
  _readme.md          This file
```

## Outputs

| Output | Path | Purpose |
|---|---|---|
| Figma docs page | `🎨  Colors – Contrast Pairings cli` (page id `12056:43407`) | Visual reference inside the active Figma file |
| JSON | `src/lib/contrast-pairings.json` | Machine-readable, for code consumers and validators |
| Markdown | `src/lib/accessible-pairings.md` | Human/AI-readable, table per category |

The same build produces all three. They are always in sync (single source of truth = Figma vars + registry).

## Usage

```bash
# Build everything (default): Figma docs + JSON + MD + validate
node build-color-pairings.js

# Just rebuild Figma docs + validate (skip writing local files)
node build-color-pairings.js --mode figma

# Just rewrite local JSON + MD (read-only Figma access, no validation)
node build-color-pairings.js --mode export

# Validate the current Figma page only — no writes anywhere.
# Exits 1 if any errors (CI-friendly).
node build-color-pairings.js --mode validate

# Restrict to a single category (for fast iteration during development)
node build-color-pairings.js --category neutral
node build-color-pairings.js --mode figma --category status
```

### Validation

Every build-touching mode (`all`, `figma`) runs `validatePage()` at the end. `--mode validate` runs the same checks without rebuilding. Per swatch:

| Code | Check |
|---|---|
| `STRUCT` | `previewArea` / `metaArea` / `fgRow` / `bgRow` / `WCAG` frames present |
| `VISUAL` | Swatch frame has non-zero size; section bars / group headers stretched |
| `EMPTY` | `fg-value` / `bg-value` / `ratio-value` are populated (not placeholders) |
| `BIND` | `previewArea` fill, both `colorDot`s, every `sample-link` is bound to a variable, and the bound variable's name matches the visible token text |
| `RATIO` | Displayed `ratio-value` within 0.15 of the ratio recomputed from the bound variables' resolved RGB |
| `PILL` | Each of the 4 `docs/WCAG-Pill` instances has the `contrast` property matching its row+level WCAG threshold |
| `COUNT` | Per-category swatch count matches the registry expansion |
| `SECTBAR` | Section bar title / description populated, not default placeholders |
| `PLACEHOLDER` (warning) | Default master text leaked into a slot |

Single-token swatches (e.g. `brand`) skip bg-related checks automatically.

Or from the design-system root:
```bash
node scripts-custom/figma-doc-builders/color-pairings/build-color-pairings.js
```

## Prerequisites

1. Figma Desktop running, with the file you want to build into open and active — typically **DesignSystem@Tokens V9.7** (file key `QpPWJjCglSlj9oNS5zGHkd`), but the builder runs against whatever file is active.
2. `figma-ds-cli` connected — `figma-ds-cli connect` (Yolo) or `figma-ds-cli connect --safe`.
3. The target page **🎨  Colors – Contrast Pairings cli** must exist (the build refuses to run otherwise).

## How it works

1. **Node side** (`build-color-pairings.js`):
   - Reads `registry.json`.
   - Composes a `(async () => { … })()` IIFE with `PAYLOAD = { registry, mode, onlyCategory }` injected as a literal, and the `PLUGIN_CODE` body inlined.
   - Hands the IIFE to `figma-ds-cli run` via a tmp file (same wrapper pattern as `build-color-variables.js`).
   - Receives the IIFE's return value (JSON), writes the local artifacts.

2. **In-Figma side** (`PLUGIN_CODE`):
   - Loads the `semantic` collection + builds a `name → variable` map (also pulls in `ob/h/...` helper vars for text-link colors).
   - For each category in `registry.categories`:
     - Either iterates explicit `blocks`, or expands `groups × perGroup` (+ optional `textLink` block) when the category is templated.
     - For every block, expands to fg/bg pairs by filling path placeholders (`{fg}`, `{bg}`, `{state}`, `{group}`).
     - Resolves each variable to a concrete RGBA (following aliases, max depth 8), computes the WCAG contrast ratio, picks the `usage` recommendation tier from `registry.usage` (contrast tier → real use cases — never a WCAG label), flags `emph` for known patterns (text-link on saturated status bg).
   - If `mode != 'export'`, also builds the visual hierarchy on the target page:
     - Root frame `color-pairing-build` (any prior copy is removed, nothing else on the page is touched).
     - One `category-<name>` frame per category, with `_Section Bar` header.
     - For grouped categories (status, free): `_Color Token Group Header` before each group, then row frames of `_ContrastSwatch` instances with `previewArea` / `colorDot` / `sample-link` fills bound to live variables.

## Registry shape (`registry.json`)

```jsonc
{
  "varPathPrefix": "ob/s/color",
  "targetPageName": "🎨  Colors – Contrast Pairings cli",
  "rootFrameName": "color-pairing-build",
  "componentNames": { … },
  "wcag": { "AA_normal": 4.5, "AA_large": 3.0, "AAA": 7.0 },
  "usage": {                  // contrast tier → use-case recommendation text
    "<tier>": { "recContent", "recComponent", "notContent", "notComponent" }
  },
  "categories": {
    "<name>": {
      "section": { "tier", "title", "purpose", "guideline" },
      "blocks":   [ ... ]   // OR
      "groups":   [...], "perGroup": { ... }, "textLink": { ... }
    }
  }
}
```

Block types:

| Type | Iterates | Purpose |
|---|---|---|
| `grid` | `fgLevels × bgLevels` | Neutral 5×5, status/free per-group 4×4 |
| `states-row` | `states` | Interaction, navigation |
| `textlink-row` | `bgLevels` | Text-link contrast row appended after a grid |
| `single` | one entry | Brand (single token, no pairing) |

Add a new category by adding an entry under `categories`. Add new variables to a category by adjusting `fgLevels` / `bgLevels` / `states` / `groups`. The build will pick them up on the next run.

## Consumer integration

For runtime validation in a consumer project:

```js
import pairings from '@oblique/design-system/contrast-pairings.json';

function isApproved(fg, bg, level = 'aaNormal') {
  for (const list of Object.values(pairings.categories)) {
    const hit = list.find(p => p.fg === fg && p.bg === bg);
    if (hit && hit.wcag && hit.wcag[level]) return true;
  }
  return false;
}
```

For humans / AI reasoning about contrast, read `accessible-pairings.md` — token paths are full text and the tables are searchable.

## Troubleshooting

- **`No result block in CLI stdout`** — the IIFE returned undefined or threw before reaching the return. Re-run with `--category <one>` to narrow the trace; check Figma is connected (`figma-ds-cli eval 'figma.root.name'`).
- **`target page not found`** — the page name in `registry.targetPageName` must match exactly (incl. emoji + double space).
- **`source collection not found: semantic`** — the live Figma file must have a `semantic` variable collection.
- **Missing swatches** — the build logs `X missing` per category. Run with `--mode export` and inspect `src/lib/contrast-pairings.json`: entries with `missing: true` carry the `fgName`/`bgName` we tried to look up. Usually means a path pattern in `registry.json` doesn't match the live variable name.
