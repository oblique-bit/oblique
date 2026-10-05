# Tooltip Component Overview

> Working version on the development line (git branch `tokens-dev`). The tooltip tokens are not part of Oblique 16.

## Component Introduction

The tooltip tokens describe the Tooltip atom of Oblique DS. They cover spacing, color (background and text), typography, border radius, shadow and animation.

The tooltip uses an inverted background color to stand out in a busy layout. The paddings around the text are increased to boost readability. The border radius is different from the radius of buttons, so that the tooltip does not look clickable.

## Token Groups

| Group | Token path | What it covers | Tokens |
|-------|-----------|----------------|--------|
| Spacing | `ob.c.tooltip.spacing.padding_*` | Padding on the four sides | 4 |
| Color | `ob.c.tooltip.color.bg`, `ob.c.tooltip.color.fg` | Background and text color | 2 |
| Typography | `ob.c.tooltip.typography.label` | Text style of the label | 1 |
| Border radius | `ob.c.tooltip.border_radius` | Corner radius | 1 |
| Shadow | `ob.c.tooltip.shadow` | Shadow of the tooltip | 1 |
| Animation | `ob.c.tooltip.animation.speed` | Duration of the fade on hover | 1 |

The family also holds `ob.c.tooltip.token_family_docs.description`. This token only carries the description of the family. It is not a style token.

## Variants and States

The tooltip token names have no variant segment and no state segment. There is one color pair (`bg` and `fg`) and one label style.

Both color tokens reference the `inversity_flipped` variant of the neutral colors:

| Token | Color it references |
|-------|--------------------|
| `ob.c.tooltip.color.bg` | `neutral` bg `contrast_high`, `inversity_flipped` |
| `ob.c.tooltip.color.fg` | `neutral` fg `contrast_highest`, `inversity_flipped` |

See the section on inversity in [Component Tokens](../../02-token-tiers/04-component.md).

## Animation

The description of `ob.c.tooltip.animation.speed` states: 200ms on hover with an ease_out effect, from 0% to 100% opacity and back. The family has no easing token. The token references `ob.s.motion.duration.smooth`.

## Modes

A component token follows a mode when the token it references follows that mode. Tokens that reference a static token do not react.

| Mode | Reaction | Reason |
|------|----------|--------|
| `lightness` | Colors follow | The color tokens reference `ob.s.color.neutral.*`. These resolve through the lightness level, which has a light file and a dark file. |
| `motion` | Animation follows | `animation.speed` references `ob.s.motion.duration.smooth`. In the `enabled` mode it resolves to `ob.p.motion.duration.medium` (200ms). In the `disabled` mode it resolves to `ob.p.motion.duration.instant` (0ms). |
| `ui_scale` | No | The padding tokens reference `static` dimension tokens and the label references a `static` typography token. |
| `emphasis` | No | The neutral colors are not part of the emphasis level. It only holds the interaction colors. |
| `density` | No | No density token is referenced. |
| `typography_context` | No | No typography context token is referenced. |
| `viewport` | No | No viewport token is referenced. |

The border radius and the shadow reference semantic tokens that are not mode-reactive.

See [Mode Overview](../../04-modes/00-overview.md), [Lightness](../../04-modes/01-lightness.md) and [Motion](../../04-modes/07-motion.md).

## Tokens

The tooltip tokens are `ob.c.tooltip.*`. They live in one file: `04_component/atom/tooltip.json`. The padding tokens reference the `.px` sibling of a semantic dimension token, because tokens are px. See the [Token Usage Guide](../../05-reference/01-token-usage-guide.md#px-vs-rem--which-unit-when-building-a-component).

---

**Next Steps:**
- [Component Architecture](02-architecture.md) - Token tables, design decisions and consumed tokens
