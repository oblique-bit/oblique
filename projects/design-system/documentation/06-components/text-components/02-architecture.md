# Text Components Architecture

> Working version on the development line (git branch `tokens-dev`). The typography tokens of Oblique 16 are documented in [Typography Tokens](../../03-token-categories/01-typography.md). This page describes how the text components use them.

## Component Overview

The text components are heading (H1 to H6), paragraph, lead and link. They are not separate token families. Each text component is a combination of tokens that already exist:

- a text style from `05_html/typography/style.json`,
- a color and the spacing above and below from the typography context token set,
- for the link, the link tokens `ob.h.link.*`.

The typography context token set exists twice, once for each mode of the `typography_context` mode collection. Both files define the same token names. Only the values differ.

## Component Structure

```
05_html/typography/
├── context/
│   ├── interface.json    — ob.h.typography.context.* for the interface context
│   └── prose.json        — ob.h.typography.context.* for the prose context
└── style.json            — text styles
    ├── ob.h.heading.H1 … ob.h.heading.H6
    └── ob.h.body.normal, ob.h.body.link, ob.h.body.strong, ob.h.body.lead

05_html/link/             — link tokens, see Link Architecture
```

| Component | Text style | Color | Space above and below |
|-----------|------------|-------|-----------------------|
| Heading | `ob.h.heading.H1` to `H6` | `ob.h.typography.context.h<n>.color.fg` | `ob.h.typography.context.h<n>.spacing.top` and `.bottom` |
| Paragraph | `ob.h.body.normal` | `ob.h.typography.context.body.color.fg` | `ob.h.typography.context.p.top` and `.bottom` |
| Lead | `ob.h.body.lead` | `ob.h.typography.context.body.color.fg` | `ob.h.typography.context.p_lead.top` and `.bottom` |
| Link | `ob.h.body.link` | `ob.h.link.color.*` | none |

## Tokens

All tokens of the text components are listed here. In the token names, `h<n>` stands for `h1` to `h6`. The column "References" shows the token that the value points to. The value tables below the token tables show the result for each heading level or body style in the two contexts. Font sizes and line heights are rem values at a root font size of 16 px. The px value is given in brackets.

### Text styles

The text styles are in `05_html/typography/style.json`. A style holds six properties: font family, font size, font weight, letter spacing, line height and paragraph spacing. The style `ob.h.body.link` also holds the text decoration. The styles adapt to the typography context through variable modes.

| Token | References | Description |
|-------|------------|-------------|
| `ob.h.heading.H1` | `ob.h.typography.context.h1.<property>` | Dynamic primary page heading that adapts between the typography contexts via variable modes. |
| `ob.h.heading.H2` | `ob.h.typography.context.h2.<property>` | Dynamic secondary heading that adapts between the typography contexts via variable modes. |
| `ob.h.heading.H3` | `ob.h.typography.context.h3.<property>` | Dynamic tertiary heading that adapts between the typography contexts via variable modes. |
| `ob.h.heading.H4` | `ob.h.typography.context.h4.<property>` | Dynamic heading level 4 that adapts between the typography contexts via variable modes. |
| `ob.h.heading.H5` | `ob.h.typography.context.h5.<property>` | Dynamic heading level 5 that adapts between the typography contexts via variable modes. |
| `ob.h.heading.H6` | `ob.h.typography.context.h6.<property>` | Dynamic heading level 6 that adapts between the typography contexts via variable modes. |
| `ob.h.body.normal` | `ob.h.typography.context.body.normal.<property>` | Dynamic body text style that adapts between the typography contexts via variable modes. |
| `ob.h.body.link` | `ob.h.typography.context.body.link.<property>` and `ob.s.typography.scale.static.text_decoration.link.emphasis_high` | Dynamic link text style that adapts between the typography contexts via variable modes. Adds an underline to the text. |
| `ob.h.body.strong` | `ob.h.typography.context.body.strong.<property>` | Dynamic strong text style that adapts between the typography contexts via variable modes. Emphasized text for important information. |
| `ob.h.body.lead` | `ob.h.typography.context.body.lead.<property>` | Dynamic lead text style that adapts between the typography contexts via variable modes. Introductory paragraph text. |

In the heading styles, `<property>` is `font_family`, `font_size`, `font_weight`, `letter_spacing`, `line_height` and `paragraph_spacing`. In the body styles, `<property>` is `font_size`, `font_weight`, `line_height` and `letter_spacing`. The font family of the body styles references `ob.s.typography.scale.static.font_family.body` directly. The paragraph spacing of the body styles references `ob.h.typography.context.body.paragraph_spacing`.

### Heading tokens

These tokens exist in `interface.json` and in `prose.json` with the same names.

| Token | References | Description |
|-------|------------|-------------|
| `ob.h.typography.context.h<n>.font_family` | `ob.s.typography.scale.static.font_family.heading` | Font family of the heading. |
| `ob.h.typography.context.h<n>.font_size` | `ob.s.typography.scale.static.font_size.<step>` | Font size of the heading. H3 is described in [Design Decisions](#design-decisions). |
| `ob.h.typography.context.h<n>.font_weight` | `ob.s.typography.scale.static.font_weight.<weight>` | Font weight of the heading. |
| `ob.h.typography.context.h<n>.line_height` | `ob.s.typography.scale.static.line_height.<step>` | Line height of the heading. |
| `ob.h.typography.context.h<n>.letter_spacing` | `ob.s.typography.scale.static.letter_spacing_px.<step>` | Letter spacing of the heading. |
| `ob.h.typography.context.h<n>.color.fg` | `ob.s.color.neutral.fg.<contrast>.inversity_normal` | Foreground color of the heading. The contrast level differs between the interface and prose typography contexts. |
| `ob.h.typography.context.h<n>.paragraph_spacing` | `ob.s.typography.scale.static.paragraph_spacing.<step>` | Figma only. Spacing after manual line breaks. |
| `ob.h.typography.context.h<n>.spacing.top` | `ob.s.dimension.static.typography_context.<step>` | Space above the heading. |
| `ob.h.typography.context.h<n>.spacing.bottom` | `ob.s.dimension.static.typography_context.<step>` | Space below the heading. |

#### Heading values in the interface context

| Property | H1 | H2 | H3 | H4 | H5 | H6 |
|---|---|---|---|---|---|---|
| `font_size` | `3xl` 1.75rem (28 px) | `2xl` 1.4375rem (23 px) | `xl` 1.25rem (20 px) | `lg` 1.125rem (18 px) | `lg` 1.125rem (18 px) | `lg` 1.125rem (18 px) |
| `line_height` | `2xl` 2.25rem (36 px) | `md` 1.5rem (24 px) | `sm` 1.25rem (20 px) | `md` 1.5rem (24 px) | `md` 1.5rem (24 px) | `md` 1.5rem (24 px) |
| `font_weight` | `bold` (700) | `bold` (700) | `bold` (700) | `bold` (700) | `bold` (700) | `bold` (700) |
| `letter_spacing` | `narrow` (-0.5 px) | `narrow` (-0.5 px) | `normal` (auto) | `normal` (auto) | `normal` (auto) | `normal` (auto) |
| `color.fg` | `contrast_low` | `contrast_medium` | `contrast_high` | `contrast_high` | `contrast_high` | `contrast_high` |
| `spacing.top` | `none` (0 px) | `sm` (12 px) | `sm` (12 px) | `sm` (12 px) | `sm` (12 px) | `sm` (12 px) |
| `spacing.bottom` | `xs` (8 px) | `xs` (8 px) | `xs` (8 px) | `xs` (8 px) | `xs` (8 px) | `xs` (8 px) |
| `paragraph_spacing` | `none` (0 px) | `none` (0 px) | `none` (0 px) | `none` (0 px) | `none` (0 px) | `none` (0 px) |

#### Heading values in the prose context

| Property | H1 | H2 | H3 | H4 | H5 | H6 |
|---|---|---|---|---|---|---|
| `font_size` | `6xl` 3rem (48 px) | `5xl` 2.5rem (40 px) | `4xl` 2.125rem (34 px) | `3xl` 1.75rem (28 px) | `2xl` 1.4375rem (23 px) | `lg` 1.125rem (18 px) |
| `line_height` | `4xl` 3.5rem (56 px) | `3xl` 3rem (48 px) | `2xl` 2.25rem (36 px) | `2xl` 2.25rem (36 px) | `lg` 1.75rem (28 px) | `md` 1.5rem (24 px) |
| `font_weight` | `semiBold` (600) | `semiBold` (600) | `semiBold` (600) | `semiBold` (600) | `bold` (700) | `bold` (700) |
| `letter_spacing` | `superNarrow` (-1.5 px) | `superNarrow` (-1.5 px) | `superNarrow` (-1.5 px) | `narrower` (-1 px) | `narrow` (-0.5 px) | `normal` (auto) |
| `color.fg` | `contrast_low` | `contrast_low` | `contrast_low` | `contrast_low` | `contrast_medium` | `contrast_high` |
| `spacing.top` | `none` (0 px) | `md` (16 px) | `md` (16 px) | `md` (16 px) | `md` (16 px) | `sm` (12 px) |
| `spacing.bottom` | `sm` (12 px) | `sm` (12 px) | `xs` (8 px) | `xs` (8 px) | `xs` (8 px) | `xs` (8 px) |
| `paragraph_spacing` | `3xl` (24 px) | `3xl` (24 px) | `3xl` (24 px) | `3xl` (24 px) | `3xl` (24 px) | `3xl` (24 px) |

### Body, paragraph and lead tokens

These tokens exist in `interface.json` and in `prose.json` with the same names. In the token names, `<style>` stands for `normal`, `link`, `strong` and `lead`.

| Token | References | Description |
|-------|------------|-------------|
| `ob.h.typography.context.body.<style>.font_family` | `ob.s.typography.scale.static.font_family.body` | Font family of the body style. |
| `ob.h.typography.context.body.<style>.font_size` | `ob.s.typography.scale.static.font_size.<step>` | Font size of the body style. |
| `ob.h.typography.context.body.<style>.font_weight` | `ob.s.typography.scale.static.font_weight.<weight>` | Font weight of the body style. |
| `ob.h.typography.context.body.<style>.line_height` | `ob.s.typography.scale.static.line_height.<step>` | Line height of the body style. |
| `ob.h.typography.context.body.<style>.letter_spacing` | `ob.s.typography.scale.static.letter_spacing_px.<step>` | Letter spacing of the body style. |
| `ob.h.typography.context.body.color.fg` | `ob.s.color.neutral.fg.contrast_highest.inversity_normal` | Foreground color of body in all typography context modes. Highest contrast for optimal readability. |
| `ob.h.typography.context.body.paragraph_spacing` | `ob.s.typography.scale.static.paragraph_spacing.3xl` (24 px) | Paragraph spacing of the body text styles. Same value in both contexts. |
| `ob.h.typography.context.p.top` | `ob.s.dimension.static.typography_context.none` (0 px) | Space above a paragraph. |
| `ob.h.typography.context.p.bottom` | `ob.s.dimension.static.typography_context.sm` (12 px) | Space below a paragraph. |
| `ob.h.typography.context.p_lead.top` | `ob.s.dimension.static.typography_context.none` (0 px) | Space above a lead paragraph. |
| `ob.h.typography.context.p_lead.bottom` | `ob.s.dimension.static.typography_context.2xl` (28 px) | Space below a lead paragraph. |

The font family, the color, the paragraph spacing and the spacing around `p` and `p_lead` have the same value in both contexts.

#### Body values in the interface context

| Property | normal | link | strong | lead |
|---|---|---|---|---|
| `font_size` | `md` 1rem (16 px) | `md` 1rem (16 px) | `md` 1rem (16 px) | `md` 1rem (16 px) |
| `line_height` | `md` 1.5rem (24 px) | `md` 1.5rem (24 px) | `md` 1.5rem (24 px) | `lg` 1.75rem (28 px) |
| `font_weight` | `medium` (500) | `medium` (500) | `bold` (700) | `bold` (700) |
| `letter_spacing` | `normal` (auto) | `normal` (auto) | `normal` (auto) | `narrow` (-0.5 px) |

#### Body values in the prose context

| Property | normal | link | strong | lead |
|---|---|---|---|---|
| `font_size` | `lg` 1.125rem (18 px) | `lg` 1.125rem (18 px) | `lg` 1.125rem (18 px) | `lg` 1.125rem (18 px) |
| `line_height` | `lg` 1.75rem (28 px) | `lg` 1.75rem (28 px) | `lg` 1.75rem (28 px) | `lg` 1.75rem (28 px) |
| `font_weight` | `medium` (500) | `medium` (500) | `bold` (700) | `bold` (700) |
| `letter_spacing` | `normal` (auto) | `normal` (auto) | `normal` (auto) | `narrow` (-0.5 px) |

## Token Architecture Integration

The text component tokens sit in the `ob.h.*` layer for HTML elements. They reference semantic tokens from `ob.s.*`. The typography context decides which step a context token references.

```
ob.h.heading.H1                                    (text style)
  → ob.h.typography.context.h1.font_size           (differs per typography context)
      → ob.s.typography.scale.static.font_size.3xl   (interface)
          → ob.p.font_size_rem.700                   (1.75rem = 28 px)
      → ob.s.typography.scale.static.font_size.6xl   (prose)
          → ob.p.font_size_rem.1000                  (3rem = 48 px)

ob.h.typography.context.h1.color.fg
  → ob.s.color.neutral.fg.contrast_low.inversity_normal   (both contexts)
      → ob.s1.color.neutral.fg.contrast_low.inversity_normal   (resolved with the lightness mode)

ob.h.typography.context.h1.spacing.bottom
  → ob.s.dimension.static.typography_context.xs   (interface, 8 px)
  → ob.s.dimension.static.typography_context.sm   (prose, 12 px)
```

The text tokens use only the static tokens `ob.s.typography.scale.static.*` and `ob.s.dimension.static.*`. They do not react to the `ui_scale` mode. The text color tokens are neutral colors. They follow the `lightness` mode and have no `emphasis` variant. See [Typography Tokens](../../03-token-categories/01-typography.md), [Dimension Tokens](../../03-token-categories/00-dimension.md) and [Typography-Context Mode](../../04-modes/04-typography-context.md).

## Design Decisions

### H3 size in the interface context

Approved: in the `interface` context, the H3 font size is 20 px. The token `ob.s.typography.scale.static.font_size.xl` (1.25rem, 20 px) was inserted between `lg` and `2xl` for this purpose. It aligns H3 in the interface context with the current production font size. In the token description, H3 is distinct from H4 to H6, which use `lg` (18 px) in the interface context.

### Heading color differs between levels and contexts

The foreground color of each heading level has its own token. The contrast level differs between the interface and the prose typography context. The larger headings use lower contrast levels. See the value tables above.

### Body color

The body color is the same in all typography contexts. It uses the highest contrast level for optimal readability.

### Spacing is set per element

The space above and below an element is set by the element tokens `spacing.top` and `spacing.bottom`, and by `p` and `p_lead`. These tokens reference the static `typography_context` dimension tokens. The description of that token group says that this surrounding spacing remains constant regardless of the typography context mode. The interface and the prose files choose different steps from the same scale.

### Paragraph spacing of headings is Figma only

For headings, the `paragraph_spacing` token is Figma only. It sets the spacing after manual line breaks. The static paragraph spacing steps are half of the matching line height.

### Letter spacing

The letter spacing scale uses tighter values for larger font sizes, for a more compact visual appearance. The normal value is the default for body text and labels. The tables above show the step of each element.

### Link text style

The link text style `body/link` adds an underline. The text decoration of the link states is defined by the link tokens. See [Link Architecture](../link/02-architecture.md).

## Consumed Tokens

| Token | Used by | Value |
|-------|---------|-------|
| `ob.s.typography.scale.static.font_family.heading` | all heading `font_family` tokens | `ob.p.font_family.sans`: Noto Sans with system fallbacks |
| `ob.s.typography.scale.static.font_family.body` | all body `font_family` tokens and the body styles | `ob.p.font_family.sans`: Noto Sans with system fallbacks |
| `ob.s.typography.scale.static.font_size.*` | `font_size` tokens | `md` 1rem, `lg` 1.125rem, `xl` 1.25rem, `2xl` 1.4375rem, `3xl` 1.75rem, `4xl` 2.125rem, `5xl` 2.5rem, `6xl` 3rem |
| `ob.s.typography.scale.static.line_height.*` | `line_height` tokens | `sm` 1.25rem, `md` 1.5rem, `lg` 1.75rem, `2xl` 2.25rem, `3xl` 3rem, `4xl` 3.5rem |
| `ob.s.typography.scale.static.font_weight.*` | `font_weight` tokens | `medium` 500, `semiBold` 600, `bold` 700 |
| `ob.s.typography.scale.static.letter_spacing_px.*` | `letter_spacing` tokens | `superNarrow` -1.5 px, `narrower` -1 px, `narrow` -0.5 px, `normal` auto |
| `ob.s.typography.scale.static.paragraph_spacing.*` | `paragraph_spacing` tokens | `none` 0 px, `3xl` 24 px |
| `ob.s.typography.scale.static.text_decoration.link.emphasis_high` | `ob.h.body.link` | underline |
| `ob.s.dimension.static.typography_context.*` | `spacing.top`, `spacing.bottom`, `p`, `p_lead` | `none` 0 px, `xs` 8 px, `sm` 12 px, `md` 16 px, `2xl` 28 px |
| `ob.s.color.neutral.fg.contrast_low.inversity_normal` | heading color (H1, and H2 to H4 in prose) | follows `lightness` |
| `ob.s.color.neutral.fg.contrast_medium.inversity_normal` | heading color (H2 in interface, H5 in prose) | follows `lightness` |
| `ob.s.color.neutral.fg.contrast_high.inversity_normal` | heading color (H3 to H6 in interface, H6 in prose) | follows `lightness` |
| `ob.s.color.neutral.fg.contrast_highest.inversity_normal` | body color | follows `lightness` |

---

**Component Overview**: See [Text Components Overview](01-overview.md)
