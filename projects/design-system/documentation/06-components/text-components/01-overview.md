# Text Components Overview

> Working version on the development line (git branch `tokens-dev`). The typography tokens of Oblique 16 are documented in [Typography Tokens](../../03-token-categories/01-typography.md). This page describes how the text components use them.

## Component Introduction

The text components are the building blocks for text in a layout: heading, paragraph, lead and link. Each text component combines three things:

- a text style (font family, size, weight, line height, letter spacing, paragraph spacing),
- a text color,
- the space above and below the text.

A text style holds no color and no spacing between elements. The color and the spacing are separate tokens in the typography context token set. This page describes the token combination of each text component. The token files do not define Figma component properties, so this page does not describe any.

The text components react to the `typography_context` mode collection. It has two modes: `interface` and `prose`. The mode changes the font size, the line height, the weight, the color and the spacing.

## Components

### Heading (H1 to H6)

Six levels. Each level has its own tokens for typography, color and spacing.

- **Text style**: `heading/H1` to `heading/H6` (tokens `ob.h.heading.H1` to `ob.h.heading.H6`)
- **Color**: `ob.h.typography.context.h1.color.fg` to `ob.h.typography.context.h6.color.fg`. The contrast level differs between the levels and between the two typography contexts.
- **Spacing**: `ob.h.typography.context.h1.spacing.top` and `.bottom`, and the same for H2 to H6. H1 has no space above in both contexts.

### Paragraph

Body text.

- **Text style**: `body/normal` (token `ob.h.body.normal`)
- **Color**: `ob.h.typography.context.body.color.fg` (highest contrast)
- **Spacing**: `ob.h.typography.context.p.top` (0 px) and `ob.h.typography.context.p.bottom` (12 px)

### Lead

Introductory paragraph text. It has its own style and its own spacing.

- **Text style**: `body/lead` (token `ob.h.body.lead`)
- **Color**: `ob.h.typography.context.body.color.fg` (highest contrast)
- **Spacing**: `ob.h.typography.context.p_lead.top` (0 px) and `ob.h.typography.context.p_lead.bottom` (28 px)

### Link

Link text inside a text. The link has no top or bottom spacing token.

- **Text style**: `body/link` (token `ob.h.body.link`). It adds an underline to the text.
- **Color**: `ob.h.link.color.default`, `visited`, `hover` and `active`
- **Text decoration of the states**: the text styles `h/link/enabled`, `h/link/hover`, `h/link/focus` and `h/link/active`

The states, the icons and the link tokens are described in [Link Component Overview](../link/01-overview.md).

## Typography Contexts

The two typography contexts are two modes of the `typography_context` mode collection. Both modes define the same token names. Only the values differ.

- **`interface`**: compact typography for UI elements. It is the base mode.
- **`prose`**: generous typography for reading content.

The text styles adapt to the context through variable modes. See [Typography-Context Mode](../../04-modes/04-typography-context.md) for the use cases and for how the context is selected.

### Differences between the contexts

| Element | Font size interface / prose | Line height interface / prose | Color contrast interface / prose |
|---------|-----------------------------|-------------------------------|----------------------------------|
| H1 | 28 px / 48 px | 36 px / 56 px | low / low |
| H2 | 23 px / 40 px | 24 px / 48 px | medium / low |
| H3 | 20 px / 34 px | 20 px / 36 px | high / low |
| H4 | 18 px / 28 px | 24 px / 36 px | high / low |
| H5 | 18 px / 23 px | 24 px / 28 px | high / medium |
| H6 | 18 px / 18 px | 24 px / 24 px | high / high |
| Paragraph (`body/normal`) | 16 px / 18 px | 24 px / 28 px | highest / highest |
| Lead (`body/lead`) | 16 px / 18 px | 28 px / 28 px | highest / highest |
| Link (`body/link`) | 16 px / 18 px | 24 px / 28 px | see link colors |

More differences between the two contexts:

- **Weight**: H1 to H4 are bold (700) in `interface` and semiBold (600) in `prose`. H5 and H6 are bold in both contexts. Paragraph and link are medium (500). Lead and strong are bold (700).
- **Letter spacing**: H1 to H5 have tighter letter spacing in `prose` than in `interface`. H6, paragraph, link and strong have normal letter spacing in both contexts. The architecture page lists the values.
- **Space above and below**: the steps differ between the contexts. For example, H1 has 8 px below in `interface` and 12 px below in `prose`. The architecture page lists all values.

> **Approved note:** in the `interface` context, the H3 font size is 20 px. This size is aligned with the current production size of H3. It is also different from H4 to H6, which are 18 px in this context.

The full token tables for both contexts are on the [Text Components Architecture](02-architecture.md) page.

## Text Styles

These text styles exist in the Figma file. The names are the names as they appear in Figma.

| Style in Figma | Token | Description |
|----------------|-------|-------------|
| `heading/H1` | `ob.h.heading.H1` | Primary page heading |
| `heading/H2` | `ob.h.heading.H2` | Secondary heading |
| `heading/H3` | `ob.h.heading.H3` | Tertiary heading |
| `heading/H4` | `ob.h.heading.H4` | Heading level 4 |
| `heading/H5` | `ob.h.heading.H5` | Heading level 5 |
| `heading/H6` | `ob.h.heading.H6` | Heading level 6 |
| `body/normal` | `ob.h.body.normal` | Body text |
| `body/lead` | `ob.h.body.lead` | Introductory paragraph text |
| `body/link` | `ob.h.body.link` | Link text. Adds an underline |
| `body/strong` | `ob.h.body.strong` | Emphasized text for important information |

The `~authoring` styles are separate from these styles. They are built from the authoring tokens `ob.s.typography.authoring.*`, in the sizes `xs`, `sm`, `md`, `lg`, `2xl`, `3xl`, `4xl` and `5xl`, each as `normal` and `strong`. They are described in [Typography Tokens](../../03-token-categories/01-typography.md).

For headings, the `paragraph_spacing` value in the text style is Figma only. It is the spacing after manual line breaks. The space between separate elements comes from the `spacing.top` and `spacing.bottom` tokens.

## Modes

| Mode collection | Effect on the text components |
|-----------------|-------------------------------|
| `typography_context` (`interface`, `prose`) | Font size, line height, weight, letter spacing, color and spacing change. See the tables above |
| `lightness` (`light`, `dark`) | The text colors change. See [Lightness](../../04-modes/01-lightness.md) |
| `emphasis` (`high`, `low`) | No effect on the heading and body colors. They are neutral colors, which have only light and dark values |
| `ui_scale` | No effect. The text tokens reference the static typography scale and static dimension tokens. See [UI Scale](../../04-modes/03-ui-scale.md) |

The text context tokens are variables in the Figma file, in the `typography_context` collection.

## States

Heading, paragraph and lead have no states. The link has the states enabled, visited, hover, focus and active. See [Link Component Overview](../link/01-overview.md).

## Choosing a Text Component

| Need | Use | Style |
|------|-----|-------|
| Page heading and sub headings | Heading, level 1 to 6 | `heading/H1` to `heading/H6` |
| Body text | Paragraph | `body/normal` |
| Introductory paragraph text | Lead | `body/lead` |
| Link text | Link | `body/link` |
| Emphasized text for important information | none of the four components | `body/strong` |

## Color and Contrast

The body text color is the highest contrast level of the neutral colors. This gives optimal readability. The heading colors use lower contrast levels for the larger headings: see the table above and the full tables on the architecture page.

## Tokens

| Tokens | Location |
|--------|----------|
| `ob.h.typography.context.*` | `05_html/typography/context/interface.json` and `prose.json` |
| `ob.h.heading.*` and `ob.h.body.*` | `05_html/typography/style.json` |
| `ob.h.link.*` | `05_html/link/` (see [Link Architecture](../link/02-architecture.md)) |

---

**Next Steps:**
- [Text Components Architecture](02-architecture.md) - Token tables, design decisions and consumed tokens
- [Link Component Overview](../link/01-overview.md) - States, colors and icons of the link
