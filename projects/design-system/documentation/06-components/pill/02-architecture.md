# Pill Architecture

> Working version on the development line (git branch `tokens-dev`). The pill tokens are not part of Oblique 16.

## Component Overview

The pill is a molecule. Its tokens are in the component tier (`ob.c.pill.*`). The token files describe layout (spacing, border radius, surface, color, icon size and minimum height), the typography of the label, and a set of tokens for internal reference (composite, foreground label and focus ring).

## Component Structure

```
04_component/molecule/pill/
├── 01_layout.json.json          — spacing, border radius, surface, color, icon size, min height
├── 02_typography.json.json      — label typography (ob.c.pill.typography.text_label.*)
└── 07_reference_only.json       — composite, fg_label, focus_ring (internal reference)
```

The tables use the token path with dots and the reference as written in the token value.

## Spacing

Layout tokens in `01_layout.json.json`.

| Token | References | Description |
|-------|------------|-------------|
| `ob.c.pill.spacing.padding.vertical` | `ob.s.dimension.dynamic.ui_scale.element.xs.px` | Top and bottom padding for medium size pills. |
| `ob.c.pill.spacing.padding.horizontal` | `ob.s.dimension.dynamic.ui_scale.spacing.xs.px` | Left and right padding for medium size pills. |
| `ob.c.pill.spacing.gap` | `ob.s.dimension.dynamic.ui_scale.element.xl.px` | Horizontal gap between icon and text label for medium size pills. |

## Border Radius

| Token | References | Description |
|-------|------------|-------------|
| `ob.c.pill.border_radius.default` | `ob.s.border_radius.rounded` | Border radius of standard pills in Oblique DS. |

## Surface

Minimum height tokens in three sizes. The tokens have no description.

| Token | References | Description |
|-------|------------|-------------|
| `ob.c.pill.surface.min_height.sm` | `ob.s.dimension.dynamic.ui_scale.spacing.xs.px` | - |
| `ob.c.pill.surface.min_height.md` | `ob.s.dimension.dynamic.ui_scale.spacing.xs.px` | - |
| `ob.c.pill.surface.min_height.lg` | `ob.s.dimension.dynamic.ui_scale.spacing.xl.px` | - |

## Icon Size and Minimum Height

The tokens have no description.

| Token | References | Description |
|-------|------------|-------------|
| `ob.c.pill.icon_size` | `ob.s.dimension.static.ui_scale.spacing.md.px` | - |
| `ob.c.pill.min_height` | `ob.s.dimension.dynamic.ui_scale.spacing.xl.px` | - |

## Color

The color group has 60 tokens: ten color names, two parts (`fg` and `bg`) and three states. The token path is `ob.c.pill.color.<name>.<part>.<state>`.

Every reference in the two tables starts with `ob.s.color.` and ends with `.inversity_normal`. The prefix and the suffix are removed from the cells to keep the tables readable. The tokens have no description.

### Foreground (`fg`)

| Color name | `enabled` | `hover` | `pressed` |
|---|---|---|---|
| `closed` | `neutral.fg.contrast_high` | `neutral.fg.contrast_high` | `neutral.fg.contrast_high` |
| `resolved` | `status.resolved.fg.contrast_high` | `status.resolved.fg.contrast_high` | `status.resolved.fg.contrast_high` |
| `attention` | `status.attention.fg.contrast_high` | `status.attention.fg.contrast_high` | `status.attention.fg.contrast_high` |
| `pending` | `free.yellow.fg.contrast_high` | `free.yellow.fg.contrast_high` | `free.yellow.fg.contrast_high` |
| `confirmed` | `free.teal.fg.contrast_high` | `free.teal.fg.contrast_high` | `free.teal.fg.contrast_high` |
| `progress` | `free.indigo.fg.contrast_high` | `free.indigo.fg.contrast_high` | `free.indigo.fg.contrast_high` |
| `scheduled` | `free.pink.fg.contrast_high` | `free.pink.fg.contrast_high` | `free.pink.fg.contrast_high` |
| `info` | `status.info.fg.contrast_high` | `status.info.fg.contrast_high` | `status.info.fg.contrast_high` |
| `waiting` | `free.cobalt.fg.contrast_high` | `free.cobalt.fg.contrast_high` | `free.cobalt.fg.contrast_high` |
| `critical` | `status.critical.fg.contrast_high` | `status.critical.fg.contrast_high` | `status.critical.fg.contrast_high` |

### Background (`bg`)

| Color name | `enabled` | `hover` | `pressed` |
|---|---|---|---|
| `closed` | `neutral.bg.contrast_medium` | `neutral.bg.contrast_highest` | `neutral.bg.contrast_medium` |
| `resolved` | `status.resolved.bg.contrast_medium` | `neutral.bg.contrast_highest` | `status.resolved.bg.contrast_medium` |
| `attention` | `status.attention.bg.contrast_medium` | `neutral.bg.contrast_highest` | `status.attention.bg.contrast_low` |
| `pending` | `free.yellow.bg.contrast_medium` | `neutral.bg.contrast_highest` | `free.yellow.bg.contrast_low` |
| `confirmed` | `free.teal.bg.contrast_medium` | `neutral.bg.contrast_highest` | `free.teal.bg.contrast_medium` |
| `progress` | `free.indigo.bg.contrast_medium` | `neutral.bg.contrast_highest` | `free.indigo.bg.contrast_medium` |
| `scheduled` | `free.pink.bg.contrast_medium` | `neutral.bg.contrast_highest` | `free.pink.bg.contrast_medium` |
| `info` | `status.info.bg.contrast_medium` | `neutral.bg.contrast_highest` | `status.info.bg.contrast_low` |
| `waiting` | `free.cobalt.bg.contrast_medium` | `neutral.bg.contrast_highest` | `free.cobalt.bg.contrast_medium` |
| `critical` | `status.critical.bg.contrast_high` | `neutral.bg.contrast_highest` | `status.critical.bg.contrast_low` |

The `hover` column references `neutral.bg.contrast_highest` for every color name.

## Typography

Typography tokens in `02_typography.json.json` for the pill label.

| Token | References | Description |
|-------|------------|-------------|
| `ob.c.pill.typography.text_label.font_size` | `ob.s.typography.scale.dynamic.font_size.md` | Font size that scales with the typography multiplier. |
| `ob.c.pill.typography.text_label.line_height` | `ob.s.typography.scale.dynamic.line_height.xs` | Line height that scales with the typography multiplier. |
| `ob.c.pill.typography.text_label.letter_spacing` | `ob.s.typography.scale.dynamic.letter_spacing_px.wide` | Letter spacing for pill text labels. |
| `ob.c.pill.typography.text_label.font_family` | `ob.s.typography.scale.static.font_family.body` | Font family for pill text labels. Consistent across all sizes. |
| `ob.c.pill.typography.text_label.font_weight` | `ob.s.typography.scale.dynamic.font_weight.medium` | Font weight for pill text labels. Consistent across all sizes. |
| `ob.c.pill.typography.text_label.text_decoration` | `none (value, not a reference)` | No text decoration for pill labels. |
| `ob.c.pill.typography.text_label.text_transform` | `none (value, not a reference)` | No text transformation for pill labels. |

## Reference-Only Tokens

Tokens in `07_reference_only.json` for internal reference. They are not for direct component assignment.

### Composite

The composite group has 30 tokens: `ob.c.pill.composite.<name>.<state>.fg_color`. Each token has the type `composition` and one property, `fill`. The table shows the reference of `fill`. The tokens have no description.

| Color name | `enabled` | `hover` | `pressed` |
|---|---|---|---|
| `closed` | `ob.c.pill.color.closed.fg.enabled` | `ob.c.pill.color.closed.fg.hover` | `ob.c.pill.color.closed.fg.pressed` |
| `resolved` | `ob.c.pill.color.resolved.fg.enabled` | `ob.c.pill.color.resolved.fg.hover` | `ob.c.pill.color.resolved.fg.pressed` |
| `attention` | `ob.c.pill.color.attention.fg.enabled` | `ob.c.pill.color.attention.fg.hover` | `ob.c.pill.color.attention.fg.pressed` |
| `pending` | `ob.c.pill.color.pending.fg.enabled` | `ob.c.pill.color.pending.fg.hover` | `ob.c.pill.color.pending.fg.pressed` |
| `confirmed` | `ob.c.pill.color.confirmed.fg.enabled` | `ob.c.pill.color.confirmed.fg.hover` | `ob.c.pill.color.confirmed.fg.pressed` |
| `progress` | `ob.c.pill.color.progress.fg.enabled` | `ob.c.pill.color.progress.fg.hover` | `ob.c.pill.color.progress.fg.pressed` |
| `scheduled` | `ob.c.pill.color.scheduled.fg.enabled` | `ob.c.pill.color.scheduled.fg.hover` | `ob.c.pill.color.scheduled.fg.pressed` |
| `info` | `ob.c.pill.color.info.fg.enabled` | `ob.c.pill.color.info.fg.hover` | `ob.c.pill.color.info.fg.pressed` |
| `waiting` | `ob.c.pill.color.waiting.fg.enabled` | `ob.c.pill.color.waiting.fg.hover` | `ob.c.pill.color.waiting.fg.pressed` |
| `critical` | `ob.c.pill.color.critical.fg.enabled` | `ob.c.pill.color.critical.fg.hover` | `ob.c.pill.color.critical.fg.pressed` |

### Label typography

| Token | References | Description |
|-------|------------|-------------|
| `ob.c.pill.fg_label` | Typography composite with six properties (see below) | Typography only. Simplifies maintenance with Figma and Token Studio. Basically the same references as in `02_typography.json.json` of this component. |

The six properties of `ob.c.pill.fg_label`:

| Property | References |
|---|---|
| `fontFamily` | `ob.s.typography.scale.static.font_family.body` |
| `fontWeight` | `ob.s.typography.scale.dynamic.font_weight.medium` |
| `lineHeight` | `ob.s.typography.scale.dynamic.line_height.xs` |
| `letterSpacing` | `ob.s.typography.scale.dynamic.letter_spacing_px.wide` |
| `paragraphSpacing` | `ob.s.typography.scale.dynamic.paragraph_spacing.xs` |
| `fontSize` | `ob.s.typography.scale.dynamic.font_size.md` |

The composite has a `paragraphSpacing` property. `02_typography.json.json` has no matching token.

### Focus ring

| Token | References | Description |
|-------|------------|-------------|
| `ob.c.pill.focus_ring.border_radius` | `ob.s.border_radius.md` | Requires a larger radius than the element itself. |

## Design Decisions

These statements come from the descriptions of the tokens.

- **Medium size.** The padding tokens and the gap token are described as "for medium size pills".
- **Standard pills.** The border radius token `default` is for standard pills in Oblique DS. It references `ob.s.border_radius.rounded`.
- **Typography scales.** The font size and the line height scale with the typography multiplier.
- **Same for all sizes.** The font family and the font weight are consistent across all sizes.
- **Plain label.** The label has no text decoration and no text transformation.
- **Label typography composite.** `fg_label` is typography only. It simplifies maintenance with Figma and Token Studio. It has basically the same references as `02_typography.json.json`.
- **Focus ring radius.** The focus ring requires a larger radius than the pill itself. The token references `ob.s.border_radius.md`.
- **Internal reference.** The tokens in `07_reference_only.json` are for internal reference and not for direct component assignment.

## Consumed Tokens

The pill tokens reference semantic tokens (`ob.s.*`). No pill token references a primitive (`ob.p.*`) directly. The primitives are reached through the semantic tokens. The composite tokens reference the pill color tokens (`ob.c.pill.color.*`).

| Group | Tokens |
|-------|--------|
| Dimension, dynamic (`ui_scale`) | `ob.s.dimension.dynamic.ui_scale.element.xs.px`, `ob.s.dimension.dynamic.ui_scale.element.xl.px`, `ob.s.dimension.dynamic.ui_scale.spacing.xs.px`, `ob.s.dimension.dynamic.ui_scale.spacing.xl.px` |
| Dimension, static | `ob.s.dimension.static.ui_scale.spacing.md.px` |
| Border radius | `ob.s.border_radius.rounded`, `ob.s.border_radius.md` |
| Typography, dynamic | `ob.s.typography.scale.dynamic.font_size.md`, `ob.s.typography.scale.dynamic.line_height.xs`, `ob.s.typography.scale.dynamic.letter_spacing_px.wide`, `ob.s.typography.scale.dynamic.font_weight.medium`, `ob.s.typography.scale.dynamic.paragraph_spacing.xs` (only in `fg_label`) |
| Typography, static | `ob.s.typography.scale.static.font_family.body` |

The color families and contrast levels that the pill color tokens reference:

| Color family | `fg` levels | `bg` levels |
|---|---|---|
| `ob.s.color.neutral` | `contrast_high` | `contrast_highest`, `contrast_medium` |
| `ob.s.color.status.resolved` | `contrast_high` | `contrast_medium` |
| `ob.s.color.status.attention` | `contrast_high` | `contrast_medium`, `contrast_low` |
| `ob.s.color.status.info` | `contrast_high` | `contrast_medium`, `contrast_low` |
| `ob.s.color.status.critical` | `contrast_high` | `contrast_high`, `contrast_low` |
| `ob.s.color.free.yellow` | `contrast_high` | `contrast_medium`, `contrast_low` |
| `ob.s.color.free.teal` | `contrast_high` | `contrast_medium` |
| `ob.s.color.free.indigo` | `contrast_high` | `contrast_medium` |
| `ob.s.color.free.pink` | `contrast_high` | `contrast_medium` |
| `ob.s.color.free.cobalt` | `contrast_high` | `contrast_medium` |

Every color reference ends with `.inversity_normal`. The `.px` dimension variants are used. See the [Token Usage Guide](../../05-reference/01-token-usage-guide.md#px-vs-rem--which-unit-when-building-a-component) and [Dimension Tokens](../../03-token-categories/00-dimension.md).

---

**Component Overview**: See [Pill Overview](01-overview.md)
