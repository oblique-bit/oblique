# Spinner Component Overview

> Working version on the development line (git branch `tokens-dev`). The spinner tokens are not part of Oblique 16.

## Component Introduction

The spinner tokens describe the Spinner atom of Oblique DS. They cover size, color (active and inactive), border radius, border width and animation.

The spinner has one size token. The token description says it is suitable for both small components like Card and full-page displays. The border is thick enough to stand out against a busy visual environment, and the radius gives the spinner a more organic appearance.

## Token Groups

| Group | Token path | What it covers | Tokens |
|-------|-----------|----------------|--------|
| Size | `ob.c.spinner.size` | Size of the spinner | 1 |
| Color | `ob.c.spinner.color.active`, `ob.c.spinner.color.inactive` | The active and the inactive part of the loading | 2 |
| Border radius | `ob.c.spinner.border_radius` | Radius of the spinner | 1 |
| Border width | `ob.c.spinner.border_width` | Thickness of the spinner border | 1 |
| Animation | `ob.c.spinner.animation.speed`, `ob.c.spinner.animation.pause` | Rotation duration and pause between rotations | 2 |

The family also holds `ob.c.spinner.token_family_docs.description`. This token only carries the description of the family. It is not a style token.

## Variants and States

The spinner token names have no variant segment and no interaction state segment. The two color tokens name the two parts of the loading indicator:

| Part | Token | Color it references |
|------|-------|--------------------|
| Active | `ob.c.spinner.color.active` | `free.indigo` fg `contrast_medium` |
| Inactive | `ob.c.spinner.color.inactive` | `free.indigo` bg `contrast_low` |

Both colors reference the `inversity_normal` variant of a semantic color.

## Animation

Both animation tokens reference `ob.s.motion.duration.instant`. The descriptions say that the spinner has continuous rotation with no delay, and that there is no pause between rotations.

## Modes

A component token follows a mode when the token it references follows that mode. Tokens that reference a static token do not react.

| Mode | Reaction | Reason |
|------|----------|--------|
| `lightness` | Colors follow | The color tokens reference `ob.s.color.free.indigo.*`. These resolve through the lightness level, which has a light file and a dark file. |
| `ui_scale` | Size follows | `size` references `ob.s.dimension.dynamic.ui_scale.container.xl.px`, a `dynamic` token. |
| `motion` | No change in value | The animation tokens reference `ob.s.motion.duration.instant`. This token resolves to `ob.p.motion.duration.instant` in both the `enabled` and the `disabled` motion mode. |
| `emphasis` | No | The free colors are not part of the emphasis level. It only holds the interaction colors. |
| `density` | No | No density token is referenced. |
| `typography_context` | No | No typography context token is referenced. |
| `viewport` | No | No viewport token is referenced. |

The border radius and the border width reference semantic border tokens, which are not mode-reactive.

See [Mode Overview](../../04-modes/00-overview.md), [Lightness](../../04-modes/01-lightness.md), [UI Scale](../../04-modes/03-ui-scale.md) and [Motion](../../04-modes/07-motion.md).

## Tokens

The spinner tokens are `ob.c.spinner.*`. They live in one file: `04_component/atom/spinner.json`. The size token references the `.px` sibling of a semantic dimension token, because tokens are px. See the [Token Usage Guide](../../05-reference/01-token-usage-guide.md#px-vs-rem--which-unit-when-building-a-component).

---

**Next Steps:**
- [Component Architecture](02-architecture.md) - Token tables, design decisions and consumed tokens
