# Color Doc Review Page — Initial Setup Rules

**Purpose**: Structural one-time rules for building the Figma "Colors – Doc Review" page from scratch.  
**Distinction**: These rules apply only when constructing the page structure. For content refreshes (rebuild tables, push descriptions, update token counts) see the regular builder workflow in README.md.

**Figma file**: `51tJjbxBSBmjAmKjQmhsz3`  
**Target page**: `🎨 Colors – Doc Review`  
**Last reviewed**: 2025-04-14

---

## Column Width Rules

### Cell: Role

Displays the `$description` field from primitive color JSON tokens.

| Measurement | Value |
|---|---|
| Source field | `$description` in `src/lib/themes/02_primitive/color.json` |
| Longest current description | 120 chars |
| Buffer (future flexibility) | +5 chars |
| Effective target length | 125 chars |
| Font | Noto Sans Medium 12px |
| Estimated avg char width | ~6.6px |
| Horizontal padding | 8px left + 8px right = 16px |
| **Calculated cell width** | (125 × 6.6) + 16 = 841px → **848px** (nearest 8px grid) |
| Inner text layer width | 848 − 16 = **832px** |
| Previous cell width | 450px (sized for semantic role names like "bg", "fg") |

**Longest $description (as of 2025-04-14)**:
```
"Role: Shared. Fully transparent color. CSS 'transparent' keyword for optimal browser compatibility and semantic clarity."
```
(120 chars, from `basic.transparent` primitive)

**Recalculate when**: `$description` values in `color.json` are edited or extended.  
**Formula**: `ceil(longest_chars + 5) × 6.6 + 16`, rounded up to nearest multiple of 8.

---

## Resize Script

File: `resize-cell-role.js` (same directory as this file)

Run via Figma Desktop Bridge plugin when structure needs updating:

```
node scripts-custom/figma-builders/color-tokens/mcp-executor.js \
  --script resize-cell-role.js
```

Or paste directly into the Desktop Bridge plugin console.

---

## Row Component Dimensions

| Component | Node ID | Width | Height |
|---|---|---|---|
| `_Primitive Color Row` | `9544:35346` | 1580px | 46px |
| `_Set Heading` instance (S2 section) | `9966:20037` | — | — |

---

## Cell: Role — Affected Tables

`Cell: Role` frames exist in the 2-mode and 4-mode semantic table rows. Primitive rows do NOT currently populate Cell: Role (field extracted from token name — "bg", "fg", etc. — not from `$description`).

When the primitive builder is updated to populate `Cell: Role` from `$description`, all primitive row cells must be at least 848px wide to accommodate the longest description.

---

## Notes

- All widths must align to an 8px grid.
- Cell: Role frames are regular FRAME nodes (not component instances) — resizing requires iterating all frames on the page.
- The inner text layer (`Role`) uses no padding variable; 8px left/right margin is hardcoded in the frame structure.
