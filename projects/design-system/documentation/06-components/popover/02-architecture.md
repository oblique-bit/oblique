# Popover Architecture

> Working version on the development line (git branch `tokens-dev`). The popover tokens are not part of Oblique 16.

## Component Overview

The popover tokens are the component tokens (`ob.c.popover.*`) of the Popover molecule. They cover spacing, size, color, typography, border radius and border width. Every token references a semantic token (`ob.s.*`). No token references a primitive directly. For the tier rules see [Component Tokens](../../02-token-tiers/04-component.md).

## Component Structure

```
04_component/molecule/popover.json
├── ob.c.popover.token_family_docs      - family description (not a design token)
├── ob.c.popover.spacing
│   ├── padded_container                - padding_top, padding_right, padding_bottom, padding_left, row_gap
│   ├── text_bar                        - col_gap, padding_bottom
│   ├── text_variant_container          - padding_top
│   └── buttons_container               - margin_top
├── ob.c.popover.size
│   ├── custom_buttons_container        - width
│   ├── custom_buttons                  - min_width
│   ├── padded_container                - width
│   ├── close_button                    - width
│   └── text_variant_container          - min_height
├── ob.c.popover.color                  - bg, border, fg
├── ob.c.popover.typography             - custom_buttons_label, text, title
├── ob.c.popover.border_radius
└── ob.c.popover.border_width
```

## Spacing

Spacing tokens reference static dimension tokens (`ob.s.dimension.static.ui_scale.*`). They do not react to a mode.

| Token | References | Description |
|-------|------------|-------------|
| `ob.c.popover.spacing.padded_container.padding_top` | `ob.s.dimension.static.ui_scale.spacing.sm.px` | Top and right padding are the same so that the position of the close button looks good. |
| `ob.c.popover.spacing.padded_container.padding_right` | `ob.s.dimension.static.ui_scale.spacing.sm.px` | Top and right padding are the same so that the position of the close button looks good. |
| `ob.c.popover.spacing.padded_container.padding_bottom` | `ob.s.dimension.static.ui_scale.spacing.sm.px` | Improves readability and appearance. The text does not look cramped. |
| `ob.c.popover.spacing.padded_container.padding_left` | `ob.s.dimension.static.ui_scale.spacing.sm.px` | Improves readability and appearance. The text does not look cramped. |
| `ob.c.popover.spacing.padded_container.row_gap` | `ob.s.dimension.static.ui_scale.element.xs.px` | Sets a minimum vertical gap between the top container and the buttons container to improve readability. |
| `ob.c.popover.spacing.text_bar.col_gap` | `ob.s.dimension.static.ui_scale.spacing.xs.px` | Keeps the title from coming too close to the close button (X). |
| `ob.c.popover.spacing.text_bar.padding_bottom` | `ob.s.dimension.static.ui_scale.spacing.xs.px` | - |
| `ob.c.popover.spacing.text_variant_container.padding_top` | `ob.s.dimension.static.ui_scale.micro.xs.px` | Aligns the title with the status icon and the close button on desktop. |
| `ob.c.popover.spacing.buttons_container.margin_top` | `ob.s.dimension.static.ui_scale.spacing.xs.px` | Sets a good distance from the buttons to the text above. A gap in the padded container was not used because it also increases the gap between the title and the body. |

## Size

Size tokens reference dynamic dimension tokens (`ob.s.dimension.dynamic.ui_scale.*`). They follow the `ui_scale` mode.

| Token | References | Description |
|-------|------------|-------------|
| `ob.c.popover.size.custom_buttons_container.width` | `ob.s.dimension.dynamic.ui_scale.macro.sm.px` | - |
| `ob.c.popover.size.custom_buttons.min_width` | `ob.s.dimension.dynamic.ui_scale.container.xl.px` | - |
| `ob.c.popover.size.padded_container.width` | `ob.s.dimension.dynamic.ui_scale.macro.sm.px` | Sets a fixed default width (320 px) for popover consistency. It can be overridden for specific requirements. |
| `ob.c.popover.size.close_button.width` | `ob.s.dimension.dynamic.ui_scale.spacing.sm.px` | - |
| `ob.c.popover.size.text_variant_container.min_height` | `ob.s.dimension.dynamic.ui_scale.spacing.md.px` | - |

The referenced token is dynamic, so the 320 px of `padded_container.width` is the value in the `md` mode. In `sm` it is 256 px and in `lg` it is 400 px.

## Color

Color tokens reference semantic neutral colors with the `inversity_normal` suffix. They follow the `lightness` mode through the semantic tier.

| Token | References | Description |
|-------|------------|-------------|
| `ob.c.popover.color.bg` | `ob.s.color.neutral.background.contrast_highest` | Default background color for popovers. |
| `ob.c.popover.color.border` | `ob.s.color.neutral.border.strong` | Default border color for popovers. |
| `ob.c.popover.color.fg` | `ob.s.color.neutral.foreground.contrast_highest` | Default foreground color for popovers. |

## Typography

Typography tokens reference composite typography styles (`ob.s.typography.authoring.static.*`). They are independent of the component size mode.

| Token | References | Description |
|-------|------------|-------------|
| `ob.c.popover.typography.custom_buttons_label` | `ob.s.typography.authoring.static.xs.normal` | Text labels for custom buttons in the Service Navigation, for example on ePortal. |
| `ob.c.popover.typography.text` | `ob.s.typography.authoring.static.sm.normal` | - |
| `ob.c.popover.typography.title` | `ob.s.typography.authoring.static.sm.strong` | - |

## Border

The border radius and the border width are single tokens at the top level of the component.

| Token | References | Description |
|-------|------------|-------------|
| `ob.c.popover.border_radius` | `ob.s.border_radius.lg` | Sets the default border radius for the popover. |
| `ob.c.popover.border_width` | `ob.s.border_width.xs` | Sets the border width of the popover surface. |

## Design Decisions

These statements come from the `$description` texts of the tokens.

| Decision | Tokens |
|----------|--------|
| Top and right padding of the padded container are the same, so the close button has a good position. | `padded_container.padding_top`, `padded_container.padding_right` |
| Bottom and left padding keep the text from looking cramped and improve readability. | `padded_container.padding_bottom`, `padded_container.padding_left` |
| A minimum vertical gap separates the top container from the buttons container. | `padded_container.row_gap` |
| A column gap keeps the title away from the close button (X). | `text_bar.col_gap` |
| The top padding of the text variant container aligns the title with the status icon and the close button on desktop. | `text_variant_container.padding_top` |
| The buttons container has its own top margin. The gap property of the padded container was not used, because it also increases the gap between the title and the body. | `buttons_container.margin_top` |
| The popover has a fixed default width for consistency. The width can be overridden for specific requirements. | `padded_container.width` |
| The background, border and foreground colors and the border radius are described as the default values for popovers. | `color.*`, `border_radius` |

## Consumed Tokens

The popover tokens reference these semantic tokens. Dynamic tokens show the values for `sm`, `md` and `lg`.

| Semantic token | Value | Used by |
|----------------|-------|---------|
| `ob.s.dimension.static.ui_scale.micro.xs.px` | 1 px (`ob.p.dimension.px.1`) | `spacing.text_variant_container.padding_top` |
| `ob.s.dimension.static.ui_scale.element.xs.px` | 4 px (`ob.p.dimension.px.4`) | `spacing.padded_container.row_gap` |
| `ob.s.dimension.static.ui_scale.spacing.xs.px` | 16 px (`ob.p.dimension.px.16`) | `spacing.text_bar.col_gap`, `spacing.text_bar.padding_bottom`, `spacing.buttons_container.margin_top` |
| `ob.s.dimension.static.ui_scale.spacing.sm.px` | 20 px (`ob.p.dimension.px.20`) | `spacing.padded_container.padding_top`, `padding_right`, `padding_bottom`, `padding_left` |
| `ob.s.dimension.dynamic.ui_scale.spacing.sm.px` | 16 / 20 / 25 px | `size.close_button.width` |
| `ob.s.dimension.dynamic.ui_scale.spacing.md.px` | 19 / 24 / 30 px | `size.text_variant_container.min_height` |
| `ob.s.dimension.dynamic.ui_scale.container.xl.px` | 51 / 64 / 80 px | `size.custom_buttons.min_width` |
| `ob.s.dimension.dynamic.ui_scale.macro.sm.px` | 256 / 320 / 400 px | `size.custom_buttons_container.width`, `size.padded_container.width` |
| `ob.s.color.neutral.background.contrast_highest` | Light: `ob.p.color.basic.white`. Dark: `ob.p.color.cobalt.800`. | `color.bg` |
| `ob.s.color.neutral.border.strong` | `ob.p.color.cobalt.300` in light and dark | `color.border` |
| `ob.s.color.neutral.foreground.contrast_highest` | Light: `ob.p.color.cobalt.900`. Dark: `ob.p.color.basic.white`. | `color.fg` |
| `ob.s.typography.authoring.static.xs.normal` | Composite typography style | `typography.custom_buttons_label` |
| `ob.s.typography.authoring.static.sm.normal` | Composite typography style | `typography.text` |
| `ob.s.typography.authoring.static.sm.strong` | Composite typography style | `typography.title` |
| `ob.s.border_radius.lg` | 4 px (`ob.p.dimension.px.4`) | `border_radius` |
| `ob.s.border_width.xs` | 1 px (`ob.p.dimension.px.1`) | `border_width` |

The dynamic dimension tokens are the base primitive times the `ui_scale` multiplier (0.8, 1 and 1.25), rounded to whole pixels. See [UI Scale Mode](../../04-modes/03-ui-scale.md) and [Dimension Tokens](../../03-token-categories/00-dimension.md).

---

**Component Overview**: See [Popover Overview](01-overview.md)
