# Popover Component Overview

> Working version on the development line (git branch `tokens-dev`). The popover tokens are not part of Oblique 16.

## Component Introduction

The popover tokens are the component tokens of the Popover molecule in Oblique DS. The token family description names spacing, size and color (`bg`, `border`, `fg`). The component also has typography, border radius and border width tokens.

The token names show these parts of the popover: a padded container, a text bar, a text variant container, a buttons container, custom buttons and a close button. The token descriptions also mention a title, a body text and a status icon. The custom buttons are used in the Service Navigation, for example on ePortal.

## Token Groups

All popover tokens start with `ob.c.popover.`.

| Group | Path | What it covers | Tokens |
|-------|------|----------------|--------|
| spacing | `ob.c.popover.spacing.*` | Padding, gaps and margins of the popover parts | 9 |
| size | `ob.c.popover.size.*` | Widths and a minimum height of the popover parts | 5 |
| color | `ob.c.popover.color.*` | Background, border and foreground color | 3 |
| typography | `ob.c.popover.typography.*` | Text styles for the title, the text and the custom button labels | 3 |
| border_radius | `ob.c.popover.border_radius` | Border radius of the popover | 1 |
| border_width | `ob.c.popover.border_width` | Border width of the popover surface | 1 |

## Parts

The parts below come from the token names. Each part has the tokens listed.

| Part | Tokens | What the descriptions say |
|------|--------|---------------------------|
| `padded_container` | `spacing.padded_container.*`, `size.padded_container.width` | Padding on all four sides, a row gap and a width of 320 px. Top and right padding are equal because of the position of the close button. |
| `text_bar` | `spacing.text_bar.col_gap`, `spacing.text_bar.padding_bottom` | The column gap keeps the title away from the close button (X). |
| `text_variant_container` | `spacing.text_variant_container.padding_top`, `size.text_variant_container.min_height` | The top padding aligns the title with the status icon and the close button on desktop. |
| `buttons_container` | `spacing.buttons_container.margin_top` | The top margin sets the distance from the buttons to the text above. |
| `custom_buttons_container` | `size.custom_buttons_container.width` | - |
| `custom_buttons` | `size.custom_buttons.min_width`, `typography.custom_buttons_label` | The label style is for custom buttons in the Service Navigation, for example on ePortal. |
| `close_button` | `size.close_button.width` | - |
| `title` and `text` | `typography.title`, `typography.text` | - |

## States and Variants

- **States:** the popover tokens do not define any states.
- **Variants:** the token paths do not name variants. The part `text_variant_container` has "variant" in its name, but the tokens do not say which variants exist.
- **Color:** the popover has one set of color tokens. They reference the `inversity_normal` tokens. The component has no tokens for `inversity_flipped`.

## Modes

A component token follows a mode when the token it references follows that mode.

| Tokens | They reference | Mode reaction |
|--------|----------------|---------------|
| `spacing.*` (9 tokens) | `ob.s.dimension.static.ui_scale.*` | None. Static dimension tokens do not change with a mode. |
| `size.*` (5 tokens) | `ob.s.dimension.dynamic.ui_scale.*` | `ui_scale` (`sm`, `md`, `lg`). See [UI Scale Mode](../../04-modes/03-ui-scale.md). |
| `color.*` (3 tokens) | `ob.s.color.neutral.*` | `lightness` (`light`, `dark`). The semantic neutral tokens reference the `ob.s1` lightness tier. See [Lightness Mode](../../04-modes/01-lightness.md). |
| `typography.*` (3 tokens) | `ob.s.typography.authoring.static.*` | None. These authoring typography tokens are independent of the component size mode. |
| `border_radius`, `border_width` | `ob.s.border_radius.lg`, `ob.s.border_width.xs` | None. They resolve to the primitives `ob.p.dimension.px.4` and `ob.p.dimension.px.1`. |

The popover tokens do not reference tokens of the modes `density`, `typography_context`, `viewport` or `motion`. The color references do not pass the `ob.s2` emphasis tier, so the popover does not follow the `emphasis` mode.

The `padded_container` width is described as a fixed default width of 320 px. The token references a dynamic `ui_scale` token, so its value is 320 px in `md`, 256 px in `sm` and 400 px in `lg`.

## Units

All dimension tokens of the popover reference the `.px` sibling of a semantic dimension token, so the values are px. The unit that the CSS uses follows the rule in the [Token Usage Guide](../../05-reference/01-token-usage-guide.md#px-vs-rem--which-unit-when-building-a-component).

## Tokens

The popover tokens are `ob.c.popover.*`. They live in one file: `04_component/molecule/popover.json`. Component tokens reference semantic tokens (`ob.s.*`) only. See [Component Tokens](../../02-token-tiers/04-component.md).

---

**Next Steps:**
- [Component Architecture](02-architecture.md) - All tokens, design decisions and consumed tokens
