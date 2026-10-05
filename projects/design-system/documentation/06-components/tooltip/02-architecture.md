# Tooltip Architecture

> Working version on the development line (git branch `tokens-dev`). The tooltip tokens are not part of Oblique 16.

## Component Overview

The tooltip tokens are the component layer (`ob.c.*`) of the Tooltip atom. They reference semantic tokens (`ob.s.*`) only. The family has ten style tokens in six groups.

## Component Structure

```
04_component/atom/tooltip.json
├── ob.c.tooltip.token_family_docs.description   — family description
├── ob.c.tooltip.spacing.padding_*               — four paddings, no mode
├── ob.c.tooltip.color.bg / fg                   — follows lightness
├── ob.c.tooltip.typography.label
├── ob.c.tooltip.border_radius
├── ob.c.tooltip.shadow
└── ob.c.tooltip.animation.speed                 — follows motion
```

## Spacing

All four padding tokens reference the same static semantic dimension token.

| Token | References | Description |
|-------|-----------|-------------|
| `ob.c.tooltip.spacing.padding_top` | `ob.s.dimension.static.ui_scale.element.xl.px` | Increased padding around the text boosts its readability. |
| `ob.c.tooltip.spacing.padding_right` | `ob.s.dimension.static.ui_scale.element.xl.px` | Increased padding around the text boosts its readability. |
| `ob.c.tooltip.spacing.padding_bottom` | `ob.s.dimension.static.ui_scale.element.xl.px` | Increased padding around the text boosts its readability. |
| `ob.c.tooltip.spacing.padding_left` | `ob.s.dimension.static.ui_scale.element.xl.px` | Increased padding around the text boosts its readability. |

## Color

Both tokens reference the `inversity_flipped` variant.

| Token | References | Description |
|-------|-----------|-------------|
| `ob.c.tooltip.color.bg` | `ob.s.color.neutral.bg.contrast_high.inversity_flipped` | Inverted background color to stand out in a busy layout. |
| `ob.c.tooltip.color.fg` | `ob.s.color.neutral.fg.contrast_highest.inversity_flipped` | Text color for the inverted background color. |

## Typography

| Token | References | Description |
|-------|-----------|-------------|
| `ob.c.tooltip.typography.label` | `ob.s.typography.authoring.static.sm.strong` | Bold since it is 14px to reach AAA. |

## Border Radius

| Token | References | Description |
|-------|-----------|-------------|
| `ob.c.tooltip.border_radius` | `ob.s.border_radius.sm` | Radius SM for a subtle look. It is distinct from buttons, so that the tooltip does not look clickable. |

## Shadow

| Token | References | Description |
|-------|-----------|-------------|
| `ob.c.tooltip.shadow` | `ob.s.shadow.md` | Default shadow for tooltips. |

## Animation

| Token | References | Description |
|-------|-----------|-------------|
| `ob.c.tooltip.animation.speed` | `ob.s.motion.duration.smooth` | Animation of the tooltip: 200ms on hover with an ease_out effect, from 0% to 100% opacity and back. |

## Token Architecture Integration

```
ob.c.tooltip.color.bg
  → ob.s.color.neutral.bg.contrast_high.inversity_flipped
      → S1 lightness level (light file or dark file)  (mode-reactive: lightness)

ob.c.tooltip.spacing.padding_top
  → ob.s.dimension.static.ui_scale.element.xl.px  (static = no mode)
      → ob.p.dimension.px.12 (always)

ob.c.tooltip.animation.speed
  → ob.s.motion.duration.smooth  (mode-reactive: motion)
      → ob.p.motion.duration.medium   (motion mode enabled, 200ms)
      → ob.p.motion.duration.instant  (motion mode disabled, 0ms)
```

The padding tokens reference the `.px` sibling. See [Dimension Tokens](../../03-token-categories/00-dimension.md) and the [Token Usage Guide](../../05-reference/01-token-usage-guide.md#px-vs-rem--which-unit-when-building-a-component).

## Design Decisions

These decisions are stated in the token descriptions.

| Decision | Source in the descriptions |
|----------|----------------------------|
| The paddings are increased. | Padding: "Increased paddings around text boost its readability". |
| The background is inverted. | Background: "Inverted background color to stand out in a busy layout". The text color is chosen for the inverted background. |
| The label is bold. | Typography: "Bold since it is 14px to reach AAA". |
| The radius is SM and different from the button radius. | Border radius: "subtle aesthetics, distinct from buttons to avoid looking clickable". |
| The shadow is the default shadow for tooltips. | Shadow: "Default shadow for tooltips". |
| The tooltip fades in and out on hover. | Animation: "200ms on hover with ease_out effect from 0% to 100% opacity and back". |

## Consumed Tokens

The tooltip references semantic tokens only. It does not reference primitives directly.

| Semantic token | Used for | Resolves to |
|----------------|----------|-------------|
| `ob.s.dimension.static.ui_scale.element.xl.px` | The four paddings | `ob.p.dimension.px.12` |
| `ob.s.color.neutral.bg.contrast_high.inversity_flipped` | Background | S1 lightness level |
| `ob.s.color.neutral.fg.contrast_highest.inversity_flipped` | Text color | S1 lightness level |
| `ob.s.typography.authoring.static.sm.strong` | Label text style | `ob.s.typography.scale.static.*` tokens |
| `ob.s.border_radius.sm` | Border radius | `ob.p.dimension.px.1` |
| `ob.s.shadow.md` | Shadow | Composite shadow value (`ob.p.color.cobalt_alpha.50` as color) |
| `ob.s.motion.duration.smooth` | Animation duration | `ob.p.motion.duration.medium` (motion `enabled`), `ob.p.motion.duration.instant` (motion `disabled`) |

---

**Component Overview**: See [Tooltip Overview](01-overview.md)
