# Viewport / Responsiveness Builder

Generates the **📱 Responsiveness** Figma docs page from `src/lib/themes/` JSON files. Renders 5 tables:

1. **Breakpoints** — `ob.g.mode_collection.viewport.breakpoint.<tier>` (6 rows, single-value)
2. **Ranges** — `ob.g.mode_collection.viewport.range.<tier>.{from,to}` (11 rows, single-value; 2xl has no `to`)
3. **CSS Selectors** — `ob.g.mode_collection.viewport.css_selector.<tier>` (6 rows, single-value)
4. **Page Container Widths** — `ob.s.dimension.viewport.{min_width,max_width}` (2 rows, multi-value × 6 modes)
5. **Header Variant** — `ob.c.header.variant` (1 row, multi-value × 6 modes)

Reference visual: section `12380:53968` ("Iteration 03") in file V9.7. The builder reproduces that layout.

## Why JSON (not Figma variables)

`ob.g.*` tokens are not exported as Figma variables (Token Studio: `export: false` on `kind: family_docs` and primary keys are picked up but the umbrella docs aren't). To avoid a partial picture, all 5 tables read the JSON source — including the semantic + component tokens. Range `from` / `to` references and `{ref} - 1` math are resolved Node-side before the plugin runs.

This differs from `../dimension/build-dimension.js`, which reads exclusively from live Figma variables. For viewport, JSON is authoritative.

## Files

```
viewport/
  build-viewport.js   Node orchestrator + embedded PLUGIN_CODE (Figma side)
  registry.json       Per-table spec: source path, section block (tier/title/purpose), modes
  _readme.md          This file
```

## Source-of-truth contract

| Table | JSON | Resolver |
|---|---|---|
| Breakpoints | `01_global/mode_collection/viewport.json` → `breakpoint.<tier>.$value` | literal px |
| Ranges | same → `range.<tier>.{from,to}.$value` | references `breakpoint`, math `{ref} - 1` |
| CSS Selectors | same → `css_selector.<tier>.$value` | literal string |
| Page Container Widths | `03_semantic/dimension/viewport/<mode>.json` → `min_width.$value`, `max_width.$value` | references `viewport.range` |
| Header Variant | `04_component/molecule/header/<mode>.json` → `variant.$value` | literal string |

Section title / purpose / guideline / subtitle / tier letter all come from `registry.json` → `tables[].section`. Single source of truth for human-readable copy; no Figma-side defaults.

## Usage

```bash
# Build all 5 tables + validate
node build-viewport.js

# Build a single table
node build-viewport.js --table breakpoints

# Target a different page
node build-viewport.js --page "Sandbox – Viewport"

# Validate the current page only, no writes (CI-friendly, exit 1 on errors)
node build-viewport.js --validate
```

Or from the design-system root:
```bash
node scripts-custom/figma-doc-builders/viewport/build-viewport.js
```

## Prerequisites

1. Figma Desktop running, with **DesignSystem@Tokens V9.7** (file key `QpPWJjCglSlj9oNS5zGHkd`) open and active.
2. `figma-ds-cli` daemon healthy — `figma-ds-cli daemon diagnose`.
3. Target page **📱 Responsiveness** exists. (Builder creates it if missing.)

## Components used

- `_docs/shared/section_bar` — section header (tier letter, title, subtitle, description)
- `_docs/viewport/header_row` (COMPONENT_SET: `type=single_value`, `type=muliti_value`)
- `_docs/viewport/row` (COMPONENT_SET: same two variants)

The single-value variants are used for tables 1–3; multi-value for tables 4–5.

## Page layout

```
📱 Responsiveness  (page)
└─ Viewport Tables (wrapper, VERTICAL auto-layout, gap=60)
   ├─ Table: breakpoints       (box, white bg bound to bg.contrast_highest, no border, no radius)
   │  ├─ _docs/shared/section_bar
   │  └─ Table  (header_row + 6 single-value rows)
   ├─ Table: ranges            (same shape, 11 rows)
   ├─ Table: css_selectors     (same shape, 6 rows)
   ├─ Table: page_container    (multi-value: 2 rows × 6 modes)
   └─ Table: header_variant    (multi-value: 1 row × 6 modes)
```

Each box is `1628px` wide; inner section_bar and table are `1580px` wide; row vertical rhythm is `42px`.

## Validation

Every build runs `validatePage()` at the end. `--validate` runs the same checks without writes.

| Code | Check |
|---|---|
| `STRUCT` | Each registry-listed table box exists; inner `Table` frame exists |
| `DUP` | Each box has exactly one `_docs/shared/section_bar` instance |
| `SECTBAR` | Section bar `__sectionTitle` is non-empty |
| `COUNT` | Data row count matches materialized row count from JSON |
| `EMPTY` | Each row's `Cell: Token Name` text is non-empty |

Exit policy: any error → exit 1. Warnings print but don't block.

## Idempotency

Re-running the builder removes each `Table: <id>` box and rebuilds it in place. The wrapper frame and page are kept. Manual edits inside a box (e.g. row reordering) are not preserved — registry.json is the source of truth.

## Adding a table

Append an entry to `registry.json` → `tables[]`. Pick a `source.type`:

- `json-tree` — one token per tier (e.g. breakpoints)
- `json-tree-leaves` — N leaves per tier (e.g. ranges)
- `json-per-mode` — multi-value, value per mode read from one file per mode (e.g. page_container)

The builder picks the row component variant from `kind`: `single` or `multi`.

## Quirks

- The multi-value variant in the master is misspelled `type=muliti_value` (missing the second `t`). Discovery matches both spellings — don't "fix" the master without also updating the regex.
- Section bar inner `Layout` frame is FIXED at 794px in the master. The build overrides `layoutSizingHorizontal=FILL` on every nested frame in the chain (Section Content → Layout → Content → Title Row → Section Header → Section Info → Description Group) so subtitle text stretches to the table width.
- Range `from` / `to` math is parsed Node-side: regex `^{<ref>} ([+-]) <n>$`. Anything more complex (parentheses, multiple terms) is not supported — keep `{ref} - 1` style only.
- The Figma bg color variable `ob/s1/color/neutral/bg/contrast_highest/inversity_normal` is bound on each box's fill. If missing, falls back to literal white and logs a warning.
