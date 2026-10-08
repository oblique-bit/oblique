# Tag Architecture

> Working version on the development line (git branch `tokens-dev`). The tag tokens are not part of Oblique 16.

## Component Overview

The tag is a molecule. Its tokens are in the component tier (`ob.c.tag.*`). The token files describe the container, spacing, border radius and color of the tag, the typography of the label, and one token for internal reference (the focus ring of the filter styles).

## Component Structure

```
04_component/molecule/tag/
├── 01_layout.json.json          — container, spacing, border radius, color
├── 02_typography.json.json      — label typography (ob.c.tag.typography.*)
└── 07_reference_only.json.json  — filter focus ring (internal reference)
```

The tables use the token path with dots and the reference as written in the token value. A "-" in the description column means the token has no description.

## Container

| Token | References | Description |
|-------|------------|-------------|
| `ob.c.tag.container.spacing.gap` | `ob.s.dimension.dynamic.ui_scale.element.xl.px` | Spacing between single tags. |

## Spacing

| Token | References | Description |
|-------|------------|-------------|
| `ob.c.tag.spacing.padding.vertical` | `ob.s.dimension.dynamic.ui_scale.element.xs.px` | Top and bottom padding for medium size tags. |
| `ob.c.tag.spacing.padding.horizontal` | `ob.s.dimension.dynamic.ui_scale.element.xl.px` | Left and right padding for medium size tags. |
| `ob.c.tag.spacing.gap` | `ob.s.dimension.dynamic.ui_scale.element.xs.px` | Horizontal gap between icon and text label for medium size tags. |

## Border Radius

| Token | References | Description |
|-------|------------|-------------|
| `ob.c.tag.border_radius.default` | `ob.s.border_radius.rounded` | Border radius of standard tags in Oblique DS. |

## Color

The color group has 10 tokens: two parts (`fg` and `bg`) and five states. All tokens reference the neutral color family.

| Token | References | Description |
|-------|------------|-------------|
| `ob.c.tag.color.fg.enabled` | `ob.s.color.neutral.foreground.contrast_high` | - |
| `ob.c.tag.color.fg.hover` | `ob.s.color.neutral.foreground.contrast_high` | - |
| `ob.c.tag.color.fg.focus` | `ob.s.color.neutral.foreground.contrast_high` | - |
| `ob.c.tag.color.fg.selected` | `ob.s.color.neutral.foreground.contrast_medium_inverse` | - |
| `ob.c.tag.color.fg.disabled` | `ob.s.color.neutral.foreground.contrast_lowest` | - |
| `ob.c.tag.color.bg.enabled` | `ob.s.color.neutral.background.contrast_medium` | - |
| `ob.c.tag.color.bg.hover` | `ob.s.color.neutral.background.contrast_high` | - |
| `ob.c.tag.color.bg.focus` | `ob.s.color.neutral.background.contrast_medium` | - |
| `ob.c.tag.color.bg.selected` | `ob.s.color.neutral.background.contrast_high_inverse` | - |
| `ob.c.tag.color.bg.disabled` | `ob.s.color.neutral.background.contrast_medium` | - |

## Typography

Typography tokens in `02_typography.json.json` for the tag label.

| Token | References | Description |
|-------|------------|-------------|
| `ob.c.tag.typography.font_family` | `ob.s.typography.scale.static.font_family.code` | - |
| `ob.c.tag.typography.font_weight` | `ob.s.typography.scale.static.font_weight.medium` | - |
| `ob.c.tag.typography.font_size` | `ob.s.typography.scale.dynamic.font_size.sm` | - |
| `ob.c.tag.typography.text_decoration` | `ob.s.typography.scale.dynamic.text_decoration.link.emphasis_low` | - |

## Reference-Only Tokens

Tokens in `07_reference_only.json.json` for internal reference. They are not for direct component assignment.

### Filter focus ring

| Token | References | Description |
|-------|------------|-------------|
| `ob.c.tag.filter.focus_ring.border_radius` | `ob.s.border_radius.rounded` | Rounded focus ring for the rounded shape of the `tag.filter`. |

## Design Decisions

These statements come from the descriptions of the tokens.

- **Space between tags.** The spacing between single tags is its own token in the group `container`. It is separate from the padding and the gap inside one tag.
- **Medium size.** The padding tokens and the gap token are described as "for medium size tags".
- **Standard tags.** The border radius token `default` is for standard tags in Oblique DS. It references `ob.s.border_radius.rounded`.
- **Rounded focus ring.** The focus ring of the `tag.filter` is rounded for the rounded shape of the tag. It references `ob.s.border_radius.rounded`.
- **Internal reference.** The tokens in `07_reference_only.json.json` are for internal reference and not for direct component assignment.

## Consumed Tokens

The tag tokens reference semantic tokens (`ob.s.*`). No tag token references a primitive (`ob.p.*`) directly. The primitives are reached through the semantic tokens.

| Group | Tokens |
|-------|--------|
| Dimension, dynamic (`ui_scale`) | `ob.s.dimension.dynamic.ui_scale.element.xs.px`, `ob.s.dimension.dynamic.ui_scale.element.xl.px` |
| Border radius | `ob.s.border_radius.rounded` |
| Typography, dynamic | `ob.s.typography.scale.dynamic.font_size.sm`, `ob.s.typography.scale.dynamic.text_decoration.link.emphasis_low` |
| Typography, static | `ob.s.typography.scale.static.font_family.code`, `ob.s.typography.scale.static.font_weight.medium` |
| Color, neutral | `ob.s.color.neutral.foreground.contrast_high`, `ob.s.color.neutral.foreground.contrast_medium_inverse`, `ob.s.color.neutral.foreground.contrast_lowest`, `ob.s.color.neutral.background.contrast_medium`, `ob.s.color.neutral.background.contrast_high`, `ob.s.color.neutral.background.contrast_high_inverse` |

The `.px` dimension variants are used. See the [Token Usage Guide](../../05-reference/01-token-usage-guide.md#px-vs-rem--which-unit-when-building-a-component) and [Dimension Tokens](../../03-token-categories/00-dimension.md).

---

**Component Overview**: See [Tag Overview](01-overview.md)
