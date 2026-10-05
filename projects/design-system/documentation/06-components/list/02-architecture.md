# List Architecture

> Working version on the development line (git branch `tokens-dev`). The list tokens (ob.h.list.*) are not part of Oblique 16. They style the HTML list elements.

## Component Overview

The list tokens (`ob.h.list.*`) hold the spacing of the HTML list elements. The token family description names two groups: single-item spacing and group spacing. Every token references a semantic dimension token (`ob.s.dimension.static.ui_scale.*`). No token references a primitive directly.

## Component Structure

```
05_html/list.json
├── ob.h.list.token_family_docs         - family description (not a design token)
├── ob.h.list.single_item.spacing       - marker_gap, margin_bottom
└── ob.h.list.group.spacing
    ├── high                            - margin_top
    └── low                             - margin_top
```

## Single Item Spacing

| Token | References | Description |
|-------|------------|-------------|
| `ob.h.list.single_item.spacing.marker_gap` | `ob.s.dimension.static.ui_scale.element.xl.px` | Gap between icon and text. |
| `ob.h.list.single_item.spacing.margin_bottom` | `ob.s.dimension.static.ui_scale.element.xl.px` | Margin bottom of single elements. |

## Group Spacing

| Token | References | Description |
|-------|------------|-------------|
| `ob.h.list.group.spacing.high.margin_top` | `ob.s.dimension.static.ui_scale.element.xl.px` | The description in the token file says "margin bottom of single elements". This does not match the token name `margin_top`. |
| `ob.h.list.group.spacing.low.margin_top` | `ob.s.dimension.static.ui_scale.none.px` | The description in the token file says "margin bottom of single elements". This does not match the token name `margin_top`. |

## Design Decisions

The `$description` texts of the list tokens do not state any design decisions. They only say what a token sets: the gap between icon and text, and a margin.

## Consumed Tokens

The list tokens reference these semantic tokens. Both are static and do not react to a mode.

| Semantic token | Value | Used by |
|----------------|-------|---------|
| `ob.s.dimension.static.ui_scale.element.xl.px` | 12 px (`ob.p.dimension.px.12`) | `single_item.spacing.marker_gap`, `single_item.spacing.margin_bottom`, `group.spacing.high.margin_top` |
| `ob.s.dimension.static.ui_scale.none.px` | 0 px (`ob.p.dimension.px.0`) | `group.spacing.low.margin_top` |

See [Dimension Tokens](../../03-token-categories/00-dimension.md).

---

**Component Overview**: See [List Overview](01-overview.md)
