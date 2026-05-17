# Color Variables Builder

Generates the **🎨 Colors – Tokens** Figma docs page (or any page passed via `--page`) from the live Figma color variables. Renders 14 tables across 4 tiers (primitive, s1, s2, s3) — one table per `<tier>-<category>` combination — with header rows, group headers, swatches, and per-token descriptions.

Mirrors the architecture of `../color-pairings/build-color-pairings.js`: a single `figma-ds-cli run` call with an embedded `PLUGIN_CODE` string + a `registry.json` that lists the 14 tables and the components used. Source of truth = Figma variables; the script reads them and the family-doc STRING vars (`_docs/token_family_info`) in one eval, no JSON-token dependency.

## Files

```
color-variables/
  build-color-variables.js   Node orchestrator + embedded PLUGIN_CODE (Figma side)
  registry.json        Table list, table widths, component-name lookups
  _readme.md           This file
```

## Outputs

| Output | Where | Purpose |
|---|---|---|
| Figma docs page | `🎨 Colors – Tokens` (or `--page <name>`) | Visual reference of every color variable, by tier + category |

The script does not emit local files — the Figma page is the only artifact. Per-token descriptions come from `variable.description` (set in Figma; populated upstream via the Tokens Studio export of `src/lib/themes/03_semantic/color/**/*.json` `$description` fields).

## Usage

```bash
# Build all 14 tables on the default page
node build-color-variables.js

# Build a single table
node build-color-variables.js --table s1-status

# Build all tables in a tier
node build-color-variables.js --tier s3

# Build on a different page (e.g. the cli sandbox)
node build-color-variables.js --page "🎨 Color - Variables docs cli"

# Validate the current page only — no writes anywhere.
# Exits 1 if any errors (CI-friendly).
node build-color-variables.js --validate
```

### Validation

Every build runs `validatePage()` at the end. `--validate` runs the same checks without rebuilding. Per check:

| Code | Check |
|---|---|
| `DUP` | Per Token Set frame: exactly 1 set heading. Per tier section: exactly 1 section bar. Per page: exactly 1 `Color Tokens` container. (Catches the duplicate-set-heading class of bug.) |
| `SECTBAR` | Section bar `__sectionTitle` and `$description` populated, not master defaults |
| `EMPTY` | Token-name text on each row is non-empty |
| `DESC` | Row's description cell matches the underlying `variable.description` exactly |
| `TOKEN` (warning) | Row's token name resolves to a variable in the map |

Exit policy: any `error` → exit 1. Warnings print but don't block.

Or from the design-system root:
```bash
node scripts-custom/figma-doc-builders/color-variables/build-color-variables.js
```

## Source-of-truth contract

| Tier | Figma collection | Modes | Path prefix |
|---|---|---|---|
| primitive | `static` | (single) | `ob/p/color/...` |
| s1 | `s1_lightness` | light, dark | `ob/s1/color/...` |
| s2 | `s2_emphasis` | high, low | `ob/s2/color/...` |
| s3 | `semantic` | (single, resolved) | `ob/s/color/...` |

- **Family docs** (the description in each tier's Section Bar): STRING var at `<family>/_docs/token_family_info` in the same collection as the family's leaves. The build script ignores any variable path that contains `/_docs/`.
- **Per-leaf descriptions** (the Description column in token tables): `variable.description`. If no variable in a table has one, the slimmer header variant is used and the column is omitted.

## Prerequisites

1. Figma Desktop running, with the file you want to build into open and active — typically **DesignSystem@Tokens V9.7** (file key `QpPWJjCglSlj9oNS5zGHkd`), but the builder runs against whatever file is active.
2. `figma-ds-cli` connected — `figma-ds-cli connect` (Yolo) or `figma-ds-cli connect --safe`.
3. The target page must exist (default: `🎨 Colors – Tokens`; or whatever `--page` says).

## How it works

1. **Node side** (`build-color-variables.js`):
   - Reads `registry.json`.
   - Composes a `(async () => { … })()` IIFE with `PAYLOAD = { registry, tableFilter, validateOnly, pageOverride }` injected as a literal and the `PLUGIN_CODE` body inlined.
   - Hands the IIFE to `figma-ds-cli run` via a tmp file (same wrapper pattern as `build-color-pairings.js`).
   - Receives the IIFE's return value (JSON) and prints a per-table summary + cache stats.

2. **In-Figma side** (`PLUGIN_CODE`):
   - Discovers all required components by name (`_docs/color-variables/*` + `_docs/shared/group_header`), caches them per Figma file in `_private/.cache/v2-discovery.json` to skip the slow walk on subsequent runs.
   - Reads every color variable + every family-doc STRING variable.
   - Builds / refreshes the page structure: container `Color Tokens` → tier sections → section bars → tables.
   - For each table: ensures structure, places header row, group headers, then one row per token; binds each swatch's fills to the token's variable; writes the Description cell from `variable.description`.

## Registry shape (`registry.json`)

```jsonc
{
  "page": "🎨 Colors – Tokens",
  "tableWidths": { "primitive": 1000, "s1": 1500, "s2": 1500, "s3": 1530 },
  "componentNames": {
    "rowSet":       { "2-mode", "4-mode", "rowLow", "primitive" },
    "headerSet":    { "2-mode", "4-mode", "primitive" },
    "groupHeaderSet":     "_docs/shared/group_header",
    "separatorComponent": "_docs/color-variables/separator_emphasis_partial",
    "setHeadingComponent":"_docs/color-variables/set_heading",
    "swatchSet":          "_docs/color-variables/swatch"
  },
  "tables": [
    { "id": "p-set1", "title": "Primitive: Set 1", … },
    …
  ]
}
```

Each table entry declares its tier, category, header variant, row variant, and which prefix filter to apply against the variable map.

## Components used

All inside `_docs/color-variables/*` (under the Building Blocks frame on the cli page), plus the shared components `_docs/shared/group_header`, `_docs/shared/section_bar`, `_docs/shared/temp_pill`, `_docs/shared/section_breadcrumb`, and `_docs/shared/section_breadcrumb_building_blocks`:

- `_docs/shared/section_bar` — shared badge-based guidance bar (COMPONENT_SET in the `_building_blocks/shared` section): tier-letter, title, purpose, guideline, breadcrumb, badges (variants: tier=p|s1|s2|s). Also used by the typography docs builder.
- `header_row_2mode` / `header_row_4mode` / `header_row_primitive` — column headers, with/without Description.
- `row_2mode` / `row_4mode` / `row_4mode_low` / `row_primitive` — data rows for each table variant.
- `swatch` — color swatch with Alpha=None|Light|Dark variants.
- `set_heading` — primitive "Set N" labels.
- `separator_emphasis_partial` — row separator for s2 4-mode tables.
- `_docs/shared/section_breadcrumb` / `_docs/shared/section_breadcrumb_building_blocks` — breadcrumb building blocks (shared, in `_building_blocks/shared`).
- `_docs/shared/temp_pill` — badge pill; the section_bar role badges are instances of it (shared, in `_building_blocks/shared`).
- `_docs/shared/group_header` — shared with color-pairings (Size=H3|H4 variants, groupTitle + groupDescription text properties).

## Troubleshooting

- **`Components found: N/7` with N < 7** — at least one expected component is missing or renamed. Check `registry.json → componentNames` vs the live Figma component names.
- **`Family docs found: 0`** — the family-doc STRING vars under `_docs/token_family_info` don't exist in the current file yet. Section Bar `$description` will fall back to a default placeholder. Export them via Tokens Studio first.
- **A table has no Description column** — no variable in that table has `variable.description` set. Either add descriptions to those variables (via Tokens Studio sync from `src/lib/themes/03_semantic/color/**/*.json` `$description` fields), or accept the slimmer header variant.
- **Slow first run** — discovery cache is cold. First run walks the document; subsequent runs hydrate from `_private/.cache/v2-discovery.json`.

## See also

- [`../color-pairings/_readme.md`](../color-pairings/_readme.md) — sibling builder for the contrast-pairings page.
- [`../../../documentation/02-foundation/03-design-tokens/01-types/08-color-tokens/03-colors-semantic.md`](../../../documentation/02-foundation/03-design-tokens/01-types/08-color-tokens/03-colors-semantic.md) — design-token consumer docs.
