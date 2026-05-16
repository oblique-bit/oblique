# Typography Builder

Generates the **🔤 Typography – Styles & Specimens** Figma docs page from the
live local **text styles** (not variables). Mirrors the architecture of
`../dimension/dimension.js` and `../color-variables/color-variables.js`:
single `figma-ds-cli run` call with an embedded `PLUGIN_CODE` string plus a
`registry.json` listing the tables and the components used.

## Files

```
typography/
  typography.js    Node orchestrator + embedded PLUGIN_CODE (Figma side)
  registry.json    Per-table: section meta + stylePrefix + grouping
  _readme.md       This file
```

## Outputs

| Output | Where | Purpose |
|---|---|---|
| Figma docs page | `🔤 Typography – Styles & Specimens` (or `--page <name>`) | Visual reference of every local text style — one row per style, with the style's own name rendered as the specimen sample. |

No local file artifacts — the Figma page is the only output.

## Source-of-truth contract

The builder consumes **Figma local text styles**, not variables. Each row
shows:

| Cell | Source |
|---|---|
| Token Name      | `style.name.replace(/\//g, '.')` |
| Specimen        | Rendered in `style.id`, sample text = `style.name` |
| Family          | `style.fontName.family` |
| Weight          | `style.fontName.style` |
| Size            | `style.fontSize` (px) |
| Line Height     | `style.lineHeight` |
| Letter Spacing  | `style.letterSpacing` |
| Description     | `style.description` |

Tables are filtered by `stylePrefix` (registry). Anything matching a deeper
`/_docs/` path segment is skipped.

| Table | subgroup | stylePrefix | Grouping |
|---|---|---|---|
| grouped-static     | scales | `s/typography/grouped/static/`  | size_class (base xs–xl / extended 2xl–4xl) |
| grouped-dynamic    | scales | `s/typography/grouped/dynamic/` | size_class |
| html-heading       | html   | `h/typography/style/heading/`   | none |
| html-body          | html   | `h/typography/style/body/`      | none |
| html-link-state    | html   | `h/link/`                       | none |
| component          | —      | `c/`                            | component |

The `subgroup` field drives a mid-tier wrapper that mirrors the
Tokens-Preview reference (`51tJjbxBSBmjAmKjQmhsz3`, 🔤 Typography page):
each subgroup becomes a VERTICAL `__subgroup_container_<id>` frame holding
a subgroup section bar (an instance of `_docs/typography/section_bar` —
subgroup name in the small `tierLetter` slot, "Styles" in the prominent
title — stretched to row width) above a HORIZONTAL `__subgroup_row_<id>`
frame containing that subgroup's tables side-by-side. Subgroup metadata
(tierLetter / title / subtitle / purpose / guideline) lives under
`registry.subgroups`. Tables without a `subgroup` are appended directly
to the outer wrapper as standalone columns.

Setting a typography_context variable mode on the html tables (for an
interface-vs-prose side-by-side comparison) was attempted via
`setExplicitVariableModeForCollection` and hung the plugin; the html
tables therefore render in the file's default mode. To compare modes,
set the typography_context mode manually on each table frame in Figma.

## Usage

```bash
# Build everything (default): all tables + validate
node typography.js

# Build a single table
node typography.js --table html-heading

# Build on a specific page (skips the timestamped page name)
node typography.js --page "🔤 Typography – Styles & Specimens"

# Validate only — no writes (CI-friendly; exit 1 on errors)
node typography.js --validate
```

Or from the design-system root:
```bash
node scripts-custom/figma-doc-builders/typography/typography.js
```

## Prerequisites

1. Figma Desktop running with **DesignSystem@Tokens V9.7** (file key `QpPWJjCglSlj9oNS5zGHkd`).
2. `figma-ds-cli` connected — `figma-ds-cli connect` (Yolo) or `--safe`.
3. Text styles authored in Figma (typically via Tokens Studio push of the
   `s/typography/grouped/...`, `h/typography/...`, `c/.../typography/...`
   composite tokens).
4. Building-block components in `_building_blocks/typography` on the
   `🔧 Utilities` page (see _Components used_).

## Components used

All inside `_building_blocks/typography` (id `12184:1919821`) on the
`🔧 Utilities` page, plus the shared foundation_bar / group_header:

- `_docs/typography/section_bar` — page-section header with tier letter,
   title, subtitle, purpose, guideline.
- `_docs/typography/header_row`  — header (8 columns).
- `_docs/typography/row`         — data row matching the header columns.
- `_docs/shared/group_header`    — H4 group title above grouped rows.
- `_building_blocks/shared/foundation_bar` — page-level foundation header.

## Validation

Every build runs `validatePage()` at the end. `--validate` runs the same
checks without rebuilding. Per check:

| Code | Check |
|---|---|
| `STRUCT`   | Per registry-listed section name: section exists on the page |
| `DUP`      | Per Table frame: exactly 1, with exactly 1 section bar instance inside |
| `SECTBAR`  | Section bar `__sectionTitle` and `description` populated, not master defaults |
| `COUNT`    | Per table: row count matches style count from prefix filter |
| `EMPTY`    | Token-name text on each row is non-empty |
| `DESC`     | Row's description cell matches the underlying `style.description` exactly |
| `STYLE` (warning) | Row's token name resolves to a local text style |

Exit policy: any error → exit 1. Warnings print but don't block.

## Quirks

- **Specimen rendering** uses `text.setTextStyleIdAsync(style.id)`. If the
  font isn't yet loaded the call falls back to manually setting fontName /
  fontSize / lineHeight / letterSpacing on the specimen — this keeps the
  visual close, but variable bindings on the style won't be reflected.
- **Dynamic styles** (e.g. `s/typography/grouped/dynamic/...`) render at
  whatever ui_scale mode the containing frame is in. The build page has
  no explicit mode set, so it picks the default `md`. Switch the frame's
  ui_scale mode in Figma to inspect sm or lg.
- **No preview-bar** — typography doesn't have a 1-D magnitude in the
  way dimension does, so the row component does not include a preview
  rectangle. The specimen itself is the visual preview.
