# Dimension Builder

Generates the **📐 Dimension: Spacing & Sizing** Figma docs page from the live dimension variables. Renders 6 tables (3 categories × static|dynamic): Typography Context, Density, UI Scale.

Mirrors the architecture of `../color-variables/color-variables.js` and `../color-pairings/color-pairings.js`: a single `figma-ds-cli run` call with an embedded `PLUGIN_CODE` string + a `registry.json` that lists the 6 tables and the components used.

## Files

```
dimension/
  dimension.js     Node orchestrator + embedded PLUGIN_CODE (Figma side)
  registry.json    Per-table mapping: section name → collection + var prefix + modes
  _readme.md       This file
```

## Outputs

| Output | Where | Purpose |
|---|---|---|
| Figma docs page | `📐 Dimension: Spacing & Sizing` (or `--page <name>`) | Visual reference of every dimension variable, by category + mode dimension |

No local file artifacts — the Figma page is the only output.

## Source-of-truth contract

| Table | Collection | Modes | Variable prefix |
|---|---|---|---|
| typography_context — static | `semantic` | (single) | `ob/s/dimension/static/typography_context/` |
| density — static | `semantic` | (single) | `ob/s/dimension/static/density/` |
| ui_scale — static | `semantic` | (single) | `ob/s/dimension/static/ui_scale/` |
| typography_context — dynamic | `typography_context` | `interface`, `prose` | `ob/s/dimension/dynamic/typography_context/` |
| density — dynamic | `density` | `standard`, `compact`, `spacious` | `ob/s/dimension/dynamic/density/` |
| ui_scale — dynamic | `ui_scale` | `sm`, `md`, `lg` | `ob/s/dimension/dynamic/ui_scale/` |

Per-leaf description comes from `variable.description`. Family-doc variables (paths containing `/_docs/`) are filtered out.

## Usage

```bash
# Build everything (default): 6 tables + validate
node dimension.js

# Build a single table
node dimension.js --table density-dynamic

# Build on a different page
node dimension.js --page "📐 Dimension: Spacing & Sizing"

# Validate the current page only — no writes anywhere.
# Exits 1 if any errors (CI-friendly).
node dimension.js --validate
```

Or from the design-system root:
```bash
node scripts-custom/figma-doc-builders/dimension/dimension.js
```

## Prerequisites

1. Figma Desktop running with **DesignSystem@Tokens V9.7** (file key `QpPWJjCglSlj9oNS5zGHkd`).
2. `figma-ds-cli` connected — `figma-ds-cli connect` (Yolo) or `figma-ds-cli connect --safe`.
3. The target page **📐 Dimension: Spacing & Sizing** must exist.

## Components used

All inside the **Dimension Building Blocks** section (`12093:908000`) on the target page:

- `_docs/dimension/section_bar` — page-level section bar component (renamed from `_Section Bar`)
- `_docs/dimension/header_row` / `_docs/dimension/row` — single-mode (static) header + data row
- `_docs/dimension/header_row_2mode` / `_docs/dimension/row_2mode` — 2-mode dynamic (e.g. interface/prose)
- `_docs/dimension/header_row_3mode` / `_docs/dimension/row_3mode` — 3-mode dynamic (e.g. sm/md/lg)

## Validation

Every build runs `validatePage()` at the end. `--validate` runs the same checks without rebuilding. Per check:

| Code | Check |
|---|---|
| `STRUCT` | Per registry-listed section name: section exists on the page |
| `DUP` | Per Table frame: exactly 1, with exactly 1 section bar instance inside |
| `SECTBAR` | Section bar `__sectionTitle` and `description` populated, not master defaults |
| `COUNT` | Per table: row count matches expected count from variable prefix filter (strict) |
| `EMPTY` | Token-name text on each row is non-empty |
| `DESC` | Row's description cell matches the underlying `variable.description` exactly (where the cell exists; 2-mode rows have no description column and are skipped) |
| `TOKEN` (warning) | Row's token name resolves to a variable in the map |

Exit policy: any error → exit 1. Warnings print but don't block.

## Quirks

- The 2-mode component master uses a different child-naming pattern than the 3-mode master: `$token.name` (TEXT directly) + `mode_cell_N` (FRAME) vs. `Cell: Token Name` (FRAME) + `Cell: Mode N` (FRAME). The script handles both via the `findRowNameNode` helper.
- Static dimensions (`ob/s/dimension/static/...`) live in the `semantic` collection — same collection that holds compiled color tokens. Filter by name prefix to separate them.
