# Link Component Overview

> Working version on the development line (git branch `tokens-dev`). The link tokens are not part of Oblique 16.

## Component Introduction

The link component is the HTML anchor element (`<a>`). Its tokens define the color and the text decoration for each state, the transition motion, the gap between an icon and the link text, and the icon size for each typography context. They also name the icon that each type of link shows.

The font, size, weight and line height of the link text do not come from the link tokens. They come from the text style `body/link`. See [Text Components Overview](../text-components/01-overview.md).

## Structure

A link is built from three parts:

| Part | Source |
|------|--------|
| Link text | Text style `body/link` (font, size, weight, line height) plus the link color and the text decoration of the current state |
| Icon | Only for some link types (see [Icons](#icons)). The size follows the typography context |
| Gap | `ob.h.link.spacing.gap` (2 px) between the icon and the text |

The link has no top or bottom spacing token. The only spacing token of the link is the gap between icon and text.

## States

The link has five states. Color and text decoration are defined by separate tokens, so the states do not match one to one.

| State | Color token | Text decoration | Text style in Figma |
|-------|-------------|-----------------|---------------------|
| Enabled | `ob.h.link.color.default` | `ob.h.link.enabled`: underline | `h/link/enabled` |
| Visited | `ob.h.link.color.visited` | no own token | none |
| Hover | `ob.h.link.color.hover` | `ob.h.link.hover`: underline | `h/link/hover` |
| Focus | no color token | `ob.h.link.focus`: none | `h/link/focus` |
| Active | `ob.h.link.color.active` | `ob.h.link.active`: underline | `h/link/active` |

The focus state shows a border already. It needs no additional visual emphasis, so its text decoration is none.

## Colors

The link colors reference the semantic interaction colors (`ob.s.color.interaction.*`). All four use the `inversity_normal` value.

| State | Color | Semantic token it references |
|-------|-------|------------------------------|
| Enabled | `ob.h.link.color.default` | `ob.s.color.interaction.fg.contrast_medium.inversity_normal` |
| Visited | `ob.h.link.color.visited` | `ob.s.color.interaction.visited.fg.contrast_low.inversity_normal` |
| Hover | `ob.h.link.color.hover` | `ob.s.color.interaction.fg.contrast_low.inversity_normal` |
| Active | `ob.h.link.color.active` | `ob.s.color.interaction.fg.contrast_high.inversity_normal` |

There are no link color tokens for the `inversity_flipped` surface.

> **Open point:** the default link color is dark and has little saturation on thin letters; it may be swapped with the hover color in a later round.

## Text Decoration

The text decoration is stored in four typography tokens. Each token holds only a text decoration and no font properties. They exist as four text styles in the Figma file:

- `h/link/enabled`
- `h/link/hover`
- `h/link/focus`
- `h/link/active`

Enabled, hover and active use the underline. Focus uses no underline. The visited state has no text decoration token.

## Icons

The icon tokens are informative. They name the icon that belongs to a type of link. Developers should not use these tokens to set an icon.

| Link type | Token | Icon |
|-----------|-------|------|
| Internal link | `ob.h.link.asset.type.internal` | none |
| Internal link in a list | `ob.h.link.asset.type.internal_list` | `arrow-right` |
| External link | `ob.h.link.asset.type.external` | `external` |
| Phone number link | `ob.h.link.asset.type.phone` | `phone` |
| Email link | `ob.h.link.asset.type.mail` | `envelope` |

The icon size depends on the typography context:

| Typography context | Token | Size |
|--------------------|-------|------|
| `interface` | `ob.h.link.icon.size` | 1rem (16 px) |
| `prose` | `ob.h.link.icon.size` | 1.125rem (18 px) |

## Modes

| Mode collection | Effect on the link |
|-----------------|--------------------|
| `lightness` (`light`, `dark`) | The link colors change. See [Lightness](../../04-modes/01-lightness.md) |
| `emphasis` (`high`, `low`) | The enabled, hover and active colors change, because the semantic interaction colors follow this mode. The visited color has no emphasis variant. See [Emphasis](../../04-modes/02-emphasis.md) |
| `typography_context` (`interface`, `prose`) | The icon size changes. See [Typography-Context Mode](../../04-modes/04-typography-context.md) |
| `motion` (`enabled`, `disabled`) | The transition duration is 100 ms in `enabled` and 0 ms in `disabled`. See [Motion](../../04-modes/07-motion.md) |
| `ui_scale` | No effect. The gap references a static dimension token. See [UI Scale](../../04-modes/03-ui-scale.md) |

## In Figma

The link tokens are variables in the Figma file: the gap, the motion duration and easing, the four colors and the icon size. The four text styles listed above carry the text decoration of the states.

## Tokens

The link tokens are `ob.h.link.*`. They live in `05_html/link/`: `link.json` holds the spacing, motion, asset, color and text decoration tokens. `interface.json` and `prose.json` hold the icon size for the two typography contexts.

---

**Next Steps:**
- [Link Architecture](02-architecture.md) - Token tables, design decisions and consumed tokens
- [Text Components Overview](../text-components/01-overview.md) - The text style `body/link` and the other text components
