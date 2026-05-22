# Viewport / Responsiveness Builder

Generates the **entire 📱 Responsiveness** Figma docs page from `src/lib/themes/` JSON files. One full build owns the whole page inside a single **Viewport Output** frame — the foundation bar, 5 token tables, and the Applied Viewport Modes illustration. No hand-built content is left on the page; `node build-viewport.js` reproduces it end to end.

The 5 tables:

1. **Breakpoints** — `ob.g.mode_collection.viewport.breakpoint.<tier>` (6 rows, single-value)
2. **Ranges** — `ob.g.mode_collection.viewport.range.<tier>.{from,to}` (11 rows, single-value; 2xl has no `to`)
3. **CSS Selectors** — `ob.g.mode_collection.viewport.css_selector.<tier>` (6 rows, single-value)
4. **Page Container Widths** — `ob.s.dimension.viewport.{min_width,max_width}` (2 rows, multi-value × 6 modes)
5. **Header Variant** — `ob.c.header.variant` (1 row, multi-value × 6 modes)

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

The **foundation bar** description is the umbrella family-doc text at `01_global/mode_collection/viewport.json` → `ob.g.mode_collection.viewport.token_family_docs.$description`. Token Studio does not push family-docs to Figma variables (`export: false` on `kind: family_docs`), so the builder reads it Node-side. The foundation name (`Responsiveness`) comes from `registry.json` → `foundationName`.

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

- `_building_blocks/shared/foundation_bar` — page header bar (foundation name, description, build-provenance meta). The shared master the dimension / typography / colour builders also populate.
- `_docs/viewport/applied_viewport_modes` — the Applied Viewport Modes illustration, componentised onto the **🔧 Utilities** page (`_building_blocks/viewport` section). The builder only places an instance; the artwork lives in the master and is edited there.
- `_docs/shared/section_bar` — section header (tier letter, title, subtitle, description)
- `_docs/viewport/header_row` (COMPONENT_SET: `type=single_value`, `type=muliti_value`)
- `_docs/viewport/row` (COMPONENT_SET: same two variants)

The single-value variants are used for tables 1–3; multi-value for tables 4–5.

## Page layout

The builder owns one outer **Viewport Output** frame (a direct page child) that
holds the whole page as a VERTICAL stack: foundation bar, the tables wrapper,
then the Applied Viewport Modes instance. Tables are grouped by tier: a tier
with more than one table becomes a column with its own tier-header bar; a
single-table tier sits directly in the wrapper.

```
📱 Responsiveness  (page)
└─ Viewport Output                (outer frame, direct page child — VERTICAL, gap=64)
   ├─ __foundation_bar            (instance of _building_blocks/shared/foundation_bar)
   ├─ Viewport Tables             (wrapper, HORIZONTAL auto-layout, gap=64)
   │  ├─ Column: G                (VERTICAL, gap=64)
   │  │  ├─ _docs/shared/section_bar   (tier-G header — full 1628 width)
   │  │  ├─ Table: breakpoints         (box; section_bar tier letter hidden)
   │  │  ├─ Table: ranges
   │  │  └─ Table: css_selectors
   │  ├─ Table: page_container    (S — standalone box, section_bar keeps tier letter)
   │  └─ Table: header_variant    (C — standalone box)
   └─ __applied_viewport_modes    (instance of _docs/viewport/applied_viewport_modes)
```

Each table box is `1628px` wide; inner section_bar and table are `1580px` wide. A
single-table tier has no column and no separate tier-header bar — its own
section bar carries the tier letter. A multi-table tier gets a column with a
tier-header bar, and the per-table bars inside hide their tier letter. The
foundation bar fills the outer-frame width; the Applied Viewport Modes instance
keeps its master width.

## Validation

Every build runs `validatePage()` at the end. `--validate` runs the same checks without writes.

| Code | Check |
|---|---|
| `STRUCT` | Each registry-listed table box exists; inner `Table` frame exists |
| `DUP` | Each box has exactly one `_docs/shared/section_bar` instance |
| `SECTBAR` | Section bar `__sectionTitle` is non-empty |
| `COUNT` | Data row count matches materialized row count from JSON |
| `EMPTY` | Each row's `Cell: Token Name` text is non-empty |
| `FBAR` | Outer frame has exactly one `__foundation_bar` instance (warns if its `$build_generation_meta` is empty) |
| `WRAP` | Outer frame has exactly one `Viewport Tables` wrapper |
| `APPLIED` | Outer frame has exactly one `__applied_viewport_modes` instance |

`FBAR` / `WRAP` / `APPLIED` are page-chrome checks — they run on a full build and on `--validate`, but are skipped for a `--table <id>` refresh. Exit policy: any error → exit 1. Warnings print but don't block.

## Idempotency

A full build (`node build-viewport.js`, no `--table`) clears the **Viewport Tables** wrapper and rebuilds every tier from scratch, then refreshes the `__foundation_bar` (name, description, provenance meta) and re-asserts the `__applied_viewport_modes` instance. The outer **Viewport Output** frame and the page are kept; child order is re-enforced to `[foundation_bar, tables, applied]`. `--table <id>` replaces just that one table box in place, wherever it sits (directly in the wrapper or inside a tier column), and leaves the page chrome untouched. Manual edits inside the outer frame are not preserved — `registry.json` plus the token JSON are the source of truth.

## Adding a table

Append an entry to `registry.json` → `tables[]`. Pick a `source.type`:

- `json-tree` — one token per tier (e.g. breakpoints)
- `json-tree-leaves` — N leaves per tier (e.g. ranges)
- `json-per-mode` — multi-value, value per mode read from one file per mode (e.g. page_container)

The builder picks the row component variant from `kind`: `single` or `multi`.

## Quirks

- The Applied Viewport Modes artwork is a **component master** on the 🔧 Utilities page (`_docs/viewport/applied_viewport_modes`, in the `_building_blocks/viewport` section). To change the illustration, edit that master — the builder only ever places an instance. Detaching or deleting the master breaks the build (`APPLIED` error).
- The foundation bar has two `__sectionTitle` text nodes: the ExtraLight one keeps the fixed "Oblique Foundations" branding; the builder writes the foundation name only into the SemiBold one.
- The multi-value variant in the master is misspelled `type=muliti_value` (missing the second `t`). Discovery matches both spellings — don't "fix" the master without also updating the regex.
- Section bar inner `Layout` frame is FIXED at 794px in the master. The build overrides `layoutSizingHorizontal=FILL` on every nested frame in the chain (Section Content → Layout → Content → Title Row → Section Header → Section Info → Description Group) so subtitle text stretches to the table width.
- Range `from` / `to` math is parsed Node-side: regex `^{<ref>} ([+-]) <n>$`. Anything more complex (parentheses, multiple terms) is not supported — keep `{ref} - 1` style only.
- The Figma bg color variable `ob/s1/color/neutral/bg/contrast_highest/inversity_normal` is bound on each box's fill. If missing, falls back to literal white and logs a warning.
