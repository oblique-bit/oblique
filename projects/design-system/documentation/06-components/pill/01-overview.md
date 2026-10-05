# Pill Component Overview

> Working version on the development line (git branch `tokens-dev`). The pill tokens are not part of Oblique 16.

## Component Introduction

The pill is a molecule component. Its tokens are `ob.c.pill.*`. They describe the layout of the pill (spacing, border radius, surface, color, icon size and minimum height) and the typography of the pill label.

The pill has ten color names. Each color name has a foreground (`fg`) token and a background (`bg`) token in three states: `enabled`, `hover` and `pressed`. A third token set is for internal reference only and is not meant for direct component assignment.

## Token Groups

The token groups are the structure of the component.

| Group | Token path | File | Tokens |
|-------|------------|------|--------|
| Spacing | `ob.c.pill.spacing.*` | `01_layout.json.json` | 3 |
| Border radius | `ob.c.pill.border_radius.*` | `01_layout.json.json` | 1 |
| Surface | `ob.c.pill.surface.min_height.*` | `01_layout.json.json` | 3 |
| Color | `ob.c.pill.color.*` | `01_layout.json.json` | 60 |
| Icon size | `ob.c.pill.icon_size` | `01_layout.json.json` | 1 |
| Minimum height | `ob.c.pill.min_height` | `01_layout.json.json` | 1 |
| Typography | `ob.c.pill.typography.text_label.*` | `02_typography.json.json` | 7 |
| Composite (reference only) | `ob.c.pill.composite.*` | `07_reference_only.json` | 30 |
| Label typography (reference only) | `ob.c.pill.fg_label` | `07_reference_only.json` | 1 |
| Focus ring (reference only) | `ob.c.pill.focus_ring.*` | `07_reference_only.json` | 1 |

What the groups hold:

- **Spacing**: top and bottom padding, left and right padding, and the horizontal gap between icon and text label. The descriptions say these are for medium size pills.
- **Border radius**: one token for standard pills.
- **Surface**: minimum height in three sizes: `sm`, `md` and `lg`.
- **Color**: foreground and background colors per color name and state.
- **Icon size** and **minimum height**: one token each.
- **Typography**: font size, line height, letter spacing, font family, font weight, text decoration and text transform of the label.

## Colors and States

### States

The state names in the color token paths are `enabled`, `hover` and `pressed`. The pill tokens define no other states.

### Color names

The color names are `closed`, `resolved`, `attention`, `pending`, `confirmed`, `progress`, `scheduled`, `info`, `waiting` and `critical`. Each name references one semantic color family:

- One name references the neutral family: `closed`.
- Four names reference `ob.s.color.status.*`: `resolved`, `attention`, `info` and `critical`.
- Five names reference `ob.s.color.free.*`: `pending` (yellow), `confirmed` (teal), `progress` (indigo), `scheduled` (pink) and `waiting` (cobalt).

The table shows which contrast level each color name uses. The paths are shortened: every reference starts with `ob.s.color.` and ends with `.inversity_normal`. The columns `fg`, `bg` enabled and `bg` pressed show the contrast level of the color family in the second column. The column `bg` hover shows the full shortened reference.

| Color name | Color family referenced | `fg` (all three states) | `bg` enabled | `bg` hover | `bg` pressed |
|---|---|---|---|---|---|
| `closed` | `neutral` | `contrast_high` | `contrast_medium` | `neutral.bg.contrast_highest` | `contrast_medium` |
| `resolved` | `status.resolved` | `contrast_high` | `contrast_medium` | `neutral.bg.contrast_highest` | `contrast_medium` |
| `attention` | `status.attention` | `contrast_high` | `contrast_medium` | `neutral.bg.contrast_highest` | `contrast_low` |
| `pending` | `free.yellow` | `contrast_high` | `contrast_medium` | `neutral.bg.contrast_highest` | `contrast_low` |
| `confirmed` | `free.teal` | `contrast_high` | `contrast_medium` | `neutral.bg.contrast_highest` | `contrast_medium` |
| `progress` | `free.indigo` | `contrast_high` | `contrast_medium` | `neutral.bg.contrast_highest` | `contrast_medium` |
| `scheduled` | `free.pink` | `contrast_high` | `contrast_medium` | `neutral.bg.contrast_highest` | `contrast_medium` |
| `info` | `status.info` | `contrast_high` | `contrast_medium` | `neutral.bg.contrast_highest` | `contrast_low` |
| `waiting` | `free.cobalt` | `contrast_high` | `contrast_medium` | `neutral.bg.contrast_highest` | `contrast_medium` |
| `critical` | `status.critical` | `contrast_high` | `contrast_high` | `neutral.bg.contrast_highest` | `contrast_low` |

What the references show:

- The foreground token uses `fg.contrast_high` of its own color family in all three states.
- The hover background of every color name references `neutral.bg.contrast_highest`, also for the status and free colors.
- The pressed background of `attention`, `pending`, `info` and `critical` references `contrast_low`. The other color names use the same token as in the `enabled` state.
- The enabled background of `critical` references `contrast_high`. All other color names reference `contrast_medium`.

The full list of all 60 color tokens is in [Pill Architecture](02-architecture.md#color).

## Modes

The pill reacts to a mode when a token references a token that follows that mode. A token that references a static token does not react.

| Tokens | They reference | Mode reaction |
|--------|----------------|---------------|
| `spacing.padding.vertical`, `spacing.gap` | `ob.s.dimension.dynamic.ui_scale.element.*.px` | `ui_scale` |
| `spacing.padding.horizontal`, `surface.min_height.*`, `min_height` | `ob.s.dimension.dynamic.ui_scale.spacing.*.px` | `ui_scale` |
| `icon_size` | `ob.s.dimension.static.ui_scale.spacing.md.px` | None. The token is static. |
| `typography.text_label.font_size`, `line_height`, `letter_spacing`, `font_weight` | `ob.s.typography.scale.dynamic.*` | `ui_scale` |
| `typography.text_label.font_family` | `ob.s.typography.scale.static.font_family.body` | None. The token is static. |
| `border_radius.default`, `focus_ring.border_radius` | `ob.s.border_radius.*` | None. These tokens do not reference a mode token. |
| `color.*` | `ob.s.color.neutral.*`, `ob.s.color.status.*`, `ob.s.color.free.*` | `lightness` |

Notes:

- The dimension tokens reference the `.px` variants. The unit rule is in the [Token Usage Guide](../../05-reference/01-token-usage-guide.md#px-vs-rem--which-unit-when-building-a-component).
- The dynamic typography tokens belong to the `ui_scale` collection. See [Typography Tokens](../../03-token-categories/01-typography.md) and [UI Scale Mode](../../04-modes/03-ui-scale.md). The description of `font_weight` says it is consistent across all sizes.
- The color tokens resolve through the [lightness mode](../../04-modes/01-lightness.md) (light and dark) because the semantic color tokens they reference do.
- All color tokens reference `inversity_normal`. Inversity is part of the token path and is not a mode. See [Inversity](../../02-token-tiers/04-component.md#inversity-component-level-contrast-inversion).
- No pill token references a `density`, `typography_context`, `viewport` or `motion` token. The color tokens reference the neutral, status and free families and not the interaction family, so the `emphasis` mode does not apply to them.

## Reference-Only Set

The set `07_reference_only.json` is described as: "Pill tokens for internal reference — composite, foreground label, and focus ring. Not for direct component assignment."

| Group | What it holds |
|-------|---------------|
| `composite` | 30 composition tokens, one per color name and state. Each has a `fill` that references the matching `ob.c.pill.color.<name>.fg.<state>` token. |
| `fg_label` | One typography composite for the label. The description says: typography only, simplifies maintenance with Figma and Token Studio, and basically has the same references as `02_typography.json.json`. |
| `focus_ring` | One border radius token. The description says it requires a larger radius than the element itself. |

## Not Covered Here

- The set `07_reference_only.json` is not for direct component assignment.
- `fg_label` is typography only. It has no color.
- The descriptions of the padding and gap tokens say "for medium size pills". The tokens define no padding or gap values for other sizes.

## Tokens

The pill tokens are `ob.c.pill.*`. They live in `04_component/molecule/pill/`: `01_layout.json.json` holds spacing, border radius, surface, color, icon size and minimum height. `02_typography.json.json` holds the label typography. `07_reference_only.json` holds the reference-only tokens.

---

**Next Steps:**
- [Component Architecture](02-architecture.md) - All tokens, design decisions and consumed tokens
