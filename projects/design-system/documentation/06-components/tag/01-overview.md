# Tag Component Overview

> Working version on the development line (git branch `tokens-dev`). The tag tokens are not part of Oblique 16.

## Component Introduction

The tag is a molecule component. Its tokens are `ob.c.tag.*`. They describe the container, spacing, border radius and color of the tag, and the typography of the tag label. A second token set is for internal reference and holds the filter styles. It is not meant for direct component assignment.

## Token Groups

The token groups are the structure of the component.

| Group | Token path | File | Tokens |
|-------|------------|------|--------|
| Container | `ob.c.tag.container.spacing.gap` | `01_layout.json.json` | 1 |
| Spacing | `ob.c.tag.spacing.*` | `01_layout.json.json` | 3 |
| Border radius | `ob.c.tag.border_radius.*` | `01_layout.json.json` | 1 |
| Color | `ob.c.tag.color.*` | `01_layout.json.json` | 10 |
| Typography | `ob.c.tag.typography.*` | `02_typography.json.json` | 4 |
| Filter, focus ring (reference only) | `ob.c.tag.filter.focus_ring.*` | `07_reference_only.json.json` | 1 |

What the groups hold:

- **Container**: the spacing between single tags.
- **Spacing**: top and bottom padding, left and right padding, and the horizontal gap between icon and text label. The descriptions say these are for medium size tags.
- **Border radius**: one token for standard tags.
- **Color**: foreground (`fg`) and background (`bg`) colors in five states.
- **Typography**: font family, font weight, font size and text decoration of the label.

## States

The state names in the color token paths are `enabled`, `hover`, `focus`, `selected` and `disabled`. Each state has a foreground and a background token. All of them reference the neutral color family. The tag color tokens have no color names.

The table shows the references. The paths are shortened: every reference starts with `ob.s.color.neutral.`.

| State | `fg` | `bg` |
|---|---|---|
| `enabled` | `fg.contrast_high.inversity_normal` | `bg.contrast_medium.inversity_normal` |
| `hover` | `fg.contrast_high.inversity_normal` | `bg.contrast_high.inversity_normal` |
| `focus` | `fg.contrast_high.inversity_normal` | `bg.contrast_medium.inversity_normal` |
| `selected` | `fg.contrast_medium.inversity_flipped` | `bg.contrast_high.inversity_flipped` |
| `disabled` | `fg.contrast_lowest.inversity_normal` | `bg.contrast_medium.inversity_normal` |

What the references show:

- The `enabled` and `focus` states use the same tokens.
- The `selected` state references the `inversity_flipped` tokens. All other states reference `inversity_normal`.
- The `disabled` background is the same token as the `enabled` background.

## Modes

The tag reacts to a mode when a token references a token that follows that mode. A token that references a static token does not react.

| Tokens | They reference | Mode reaction |
|--------|----------------|---------------|
| `container.spacing.gap`, `spacing.padding.horizontal` | `ob.s.dimension.dynamic.ui_scale.element.xl.px` | `ui_scale` |
| `spacing.padding.vertical`, `spacing.gap` | `ob.s.dimension.dynamic.ui_scale.element.xs.px` | `ui_scale` |
| `typography.font_size` | `ob.s.typography.scale.dynamic.font_size.sm` | `ui_scale` |
| `typography.text_decoration` | `ob.s.typography.scale.dynamic.text_decoration.link.emphasis_low` | `ui_scale` |
| `typography.font_family`, `typography.font_weight` | `ob.s.typography.scale.static.*` | None. The tokens are static. |
| `border_radius.default`, `filter.focus_ring.border_radius` | `ob.s.border_radius.rounded` | None. These tokens do not reference a mode token. |
| `color.*` | `ob.s.color.neutral.*` | `lightness` |

Notes:

- The dimension tokens reference the `.px` variants. The unit rule is in the [Token Usage Guide](../../05-reference/01-token-usage-guide.md#px-vs-rem--which-unit-when-building-a-component).
- The dynamic typography tokens belong to the `ui_scale` collection. See [Typography Tokens](../../03-token-categories/01-typography.md) and [UI Scale Mode](../../04-modes/03-ui-scale.md). The name of the referenced text decoration token contains `emphasis_low`. It is a typography token and not the `emphasis` mode.
- The color tokens resolve through the [lightness mode](../../04-modes/01-lightness.md) (light and dark) because the semantic color tokens they reference do.
- Inversity (`inversity_normal` and `inversity_flipped`) is part of the token path and is not a mode. See [Inversity](../../02-token-tiers/04-component.md#inversity-component-level-contrast-inversion).
- No tag token references a `density`, `typography_context`, `viewport` or `motion` token. The color tokens reference the neutral family and not the interaction family, so the `emphasis` mode does not apply to them.

## Reference-Only Set

The set `07_reference_only.json.json` is described as: "Tag tokens for internal reference — filter styles. Not for direct component assignment."

It has one token: `ob.c.tag.filter.focus_ring.border_radius`. The description says it is a rounded focus ring for the rounded shape of the `tag.filter`.

## Not Covered Here

- The set `07_reference_only.json.json` is not for direct component assignment.
- The descriptions of the padding and gap tokens say "for medium size tags". The tokens define no padding or gap values for other sizes.

## Tokens

The tag tokens are `ob.c.tag.*`. They live in `04_component/molecule/tag/`: `01_layout.json.json` holds container, spacing, border radius and color. `02_typography.json.json` holds the label typography. `07_reference_only.json.json` holds the reference-only token.

---

**Next Steps:**
- [Component Architecture](02-architecture.md) - All tokens, design decisions and consumed tokens
