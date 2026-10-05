# Badge Component Overview

> Working version on the development line (git branch `tokens-dev`). The badge tokens are not part of Oblique 16.

## Component Introduction

The badge tokens describe the Badge atom of Oblique DS. They cover color (background and text), spacing, size, border radius and typography.

A badge has four color variants (`attention`, `info`, `critical`, `resolved`) and two states (`enabled`, `disabled`). It has two sizes in the token names (`sm` and `lg`). The border radius makes the badge fully rounded.

## Token Groups

| Group | Token path | What it covers | Tokens |
|-------|-----------|----------------|--------|
| Color | `ob.c.badge.color.bg.*`, `ob.c.badge.color.fg.*` | Background and text color per variant and state | 16 |
| Spacing | `ob.c.badge.spacing.padding.*` | Horizontal and vertical padding per size | 4 |
| Size | `ob.c.badge.size.max_width.*`, `min_width.*`, `height.*` | Width limits and height per size | 6 |
| Border radius | `ob.c.badge.border_radius` | Fully rounded corners | 1 |
| Typography | `ob.c.badge.typography.badge_label` | Text style of the label | 1 |

The family also holds `ob.c.badge.token_family_docs.description`. This token only carries the description of the family. It is not a style token.

## Variants and States

The color tokens use two segments in their names:

- Variant: `attention`, `info`, `critical`, `resolved`
- State: `enabled`, `disabled`

Every color token references the `inversity_normal` variant of a semantic color.

| Variant | Background, enabled | Text, enabled | Background, disabled | Text, disabled |
|---------|--------------------|---------------|----------------------|----------------|
| `attention` | `status.attention` bg `contrast_low` | `status.attention` fg `contrast_highest` | `neutral` bg `contrast_low` | `neutral` fg `contrast_highest` |
| `info` | `status.info` bg `contrast_low` | `status.info` fg `contrast_highest` | `neutral` bg `contrast_low` | `neutral` fg `contrast_highest` |
| `critical` | `status.critical` bg `contrast_low` | `status.critical` fg `contrast_highest` | `neutral` bg `contrast_low` | `neutral` fg `contrast_highest` |
| `resolved` | `status.resolved` bg `contrast_low` | `status.resolved` fg `contrast_highest` | `neutral` bg `contrast_low` | `neutral` fg `contrast_highest` |

The disabled tokens of all four variants reference the same neutral tokens. The token set has no hover, pressed or focus tokens.

## Sizes

The sizes `sm` and `lg` are segments of the token names. They are not the `ui_scale` mode. The values below come from the token descriptions.

| Size | Padding (horizontal and vertical) | Min width | Max width | Height |
|------|-----------------------------------|-----------|-----------|--------|
| `sm` | 4 px | 20 px | 20 px | 20 px |
| `lg` | 4 px | 24 px | 64 px | 24 px |

The minimal width equals the height in both sizes. The descriptions say that this makes the badge round. The label has one typography token for both sizes.

## Modes

A component token follows a mode when the token it references follows that mode. Tokens that reference a static token do not react.

| Mode | Reaction | Reason |
|------|----------|--------|
| `lightness` | Colors follow | The color tokens reference `ob.s.color.status.*` and `ob.s.color.neutral.*`. These resolve through the lightness level, which has a light file and a dark file. |
| `ui_scale` | Label text follows | `badge_label` references a `dynamic` typography token. The padding and size tokens reference `static` dimension tokens and do not react. |
| `emphasis` | No | The status and neutral colors are not part of the emphasis level. It only holds the interaction colors. |
| `density` | No | No density token is referenced. |
| `typography_context` | No | No typography context token is referenced. |
| `motion` | No | The badge has no animation token. |
| `viewport` | No | No viewport token is referenced. |

See [Mode Overview](../../04-modes/00-overview.md), [Lightness](../../04-modes/01-lightness.md) and [UI Scale](../../04-modes/03-ui-scale.md).

## Tokens

The badge tokens are `ob.c.badge.*`. They live in one file: `04_component/atom/badge.json`. Dimension and spacing tokens reference the `.px` sibling of a semantic dimension token, because tokens are px. See the [Token Usage Guide](../../05-reference/01-token-usage-guide.md#px-vs-rem--which-unit-when-building-a-component).

---

**Next Steps:**
- [Component Architecture](02-architecture.md) - Token tables, design decisions and consumed tokens
