# Infobox Component Overview

> Working version on the development line (git branch `tokens-dev`). The infobox tokens are not part of Oblique 16. The token `ob.c.infobox.buttons_order_figma` is named for Figma and holds the order of the buttons.

## Component Introduction

The infobox is a molecule in Oblique DS. Its tokens describe a message box with a status icon, a title, a body text, a close button, a group of buttons and a colored border on the left side.

The tokens are split into three families:

- **Color tokens**: icon, border, surface and foreground colors.
- **Layout tokens**: container padding, icon asset, border radius, typography and button inversity.
- **Viewport-specific layout tokens**: spacing, sizes, border width and button order. There is one token set for each of the six viewport modes. The sets of `xs`, `sm` and `md` are described as the mobile breakpoint. The sets of `lg`, `xl` and `2xl` are described as the desktop breakpoint.

Five status variants exist: `info`, `critical`, `attention`, `resolved` and `fatal`.

## Parts Named in the Tokens

The token names and descriptions refer to these parts of the infobox:

| Name in the tokens | What the tokens say about it |
|---|---|
| `container` | The outer container. `container.spacing.row_gap` is the vertical distance between infoboxes. |
| `container_top` | Holds the status icon and the text blocks. The gap between them is `container_top.col_gap`. |
| `infobox_icon_container` | The container of the status icon. |
| `text_blocks` | The title and the body text. The gap between them is `text_blocks.row_gap`. |
| `title_bar` | The title and the close button (X). The gap between them is `title_bar.col_gap`. |
| `title`, `body` | The title text and the body text. Each has a typography token. |
| `parentof_buttons_container` | The parent of the buttons container. Its left padding aligns the buttons with the text on mobile. |
| `border_width.left` | The colored border on the left side. The left corners are square and the right corners are rounded. |

## Token Groups

| Group | Token path | Tokens | File |
|---|---|---|---|
| Color | `ob.c.infobox.color.{icon, border, surface, fg}.{status}` | 20 | `01_color.json` |
| Container padding | `ob.c.infobox.container.padding_bottom` | 1 | `02_layout.json` |
| Icon asset | `ob.c.infobox.icon.asset.status.*` | 5 | `02_layout.json` |
| Border radius | `ob.c.infobox.border_radius.*` | 4 | `02_layout.json` |
| Typography | `ob.c.infobox.typography.{title, body}` | 2 | `02_layout.json` |
| Button inversity | `ob.c.infobox.{status}.button.inversity` | 5 | `02_layout.json` |
| Spacing | `ob.c.infobox.spacing.*` | 15 per viewport | `03_viewport/{viewport}.json` |
| Size | `ob.c.infobox.size.*` | 3 per viewport | `03_viewport/{viewport}.json` |
| Border width | `ob.c.infobox.border_width.left` | 1 per viewport | `03_viewport/{viewport}.json` |
| Container spacing | `ob.c.infobox.container.spacing.*` | 5 per viewport | `03_viewport/{viewport}.json` |
| Buttons order | `ob.c.infobox.buttons_order_figma` | 1 per viewport | `03_viewport/{viewport}.json` |

The component has 62 token paths. The 25 viewport paths exist once in each of the six viewport files, so the token files hold 187 tokens in total.

## Variants

The status names in the token paths are `info`, `critical`, `attention`, `resolved` and `fatal`. Four of them reference `inversity_normal` tokens. `fatal` is the only variant that references `inversity_flipped` tokens. Its foreground uses `contrast_medium`, the other variants use `contrast_high`.

| Variant | Icon and border color | Surface color | Foreground color | Button inversity |
|---|---|---|---|---|
| `info` | `ob.s.color.status.info.fg.contrast_medium.inversity_normal` | `ob.s.color.status.info.bg.contrast_high.inversity_normal` | `ob.s.color.neutral.fg.contrast_high.inversity_normal` | `normal` |
| `critical` | `ob.s.color.status.critical.fg.contrast_medium.inversity_normal` | `ob.s.color.status.critical.bg.contrast_high.inversity_normal` | `ob.s.color.neutral.fg.contrast_high.inversity_normal` | `normal` |
| `attention` | `ob.s.color.status.attention.fg.contrast_medium.inversity_normal` | `ob.s.color.status.attention.bg.contrast_high.inversity_normal` | `ob.s.color.neutral.fg.contrast_high.inversity_normal` | `normal` |
| `resolved` | `ob.s.color.status.resolved.fg.contrast_medium.inversity_normal` | `ob.s.color.status.resolved.bg.contrast_high.inversity_normal` | `ob.s.color.neutral.fg.contrast_high.inversity_normal` | `normal` |
| `fatal` | `ob.s.color.status.fatal.fg.contrast_medium.inversity_flipped` | `ob.s.color.status.fatal.bg.contrast_high.inversity_flipped` | `ob.s.color.neutral.fg.contrast_medium.inversity_flipped` | `flipped` |

Each variant has four color tokens: `icon`, `border`, `surface` and `fg`. The `icon` and `border` tokens of a variant reference the same token. See [Status Colors](../../03-token-categories/colors/07-semantic-status.md) for the status color families.

### Icon asset names

The icon asset tokens use older status names. They do not use the same names as the color tokens.

| Asset token | Asset name | Color variant (status colors page) |
|---|---|---|
| `ob.c.infobox.icon.asset.status.info` | `InfoCircle` | `info` |
| `ob.c.infobox.icon.asset.status.warning` | `WarningTriangle` | `attention` (warnings, review needed) |
| `ob.c.infobox.icon.asset.status.error` | `WarningCircle` | `critical` (formerly `error`) |
| `ob.c.infobox.icon.asset.status.success` | `CheckmarkCircle` | `resolved` (formerly `success`) |
| `ob.c.infobox.icon.asset.status.fatal` | `Error-new` | `fatal` |

The `fatal` icon `Error-new` is not yet part of the official icon set. It still has to be drawn.

## Modes

The infobox reacts to a mode only when its tokens reference a token that follows that mode. The infobox tokens reference only semantic tokens (`ob.s.*`) and literal values.

| Mode collection | Reaction | Reason |
|---|---|---|
| `lightness` | Color tokens react | The color tokens reference `ob.s.color.status.*` and `ob.s.color.neutral.*`. These point to `ob.s1.color.*`, the lightness layer. See [Lightness Mode](../../04-modes/01-lightness.md). |
| `emphasis` | No reaction | No infobox token references an interaction color token. |
| `ui_scale` | No reaction | All dimension tokens reference `ob.s.dimension.static.ui_scale.*`. These static tokens do not react to a mode. |
| `density` | No reaction | No infobox token references a density token. |
| `typography_context` | No reaction | The typography tokens reference `ob.s.typography.authoring.static.md.*`. The description of this semantic group says it is independent of the component size mode. |
| `viewport` | Layout tokens differ | One token set exists for each viewport mode (see below). |

Border width and border radius reference `ob.s.border_width.*` and `ob.s.border_radius.*`. These tokens point to primitive values and do not follow a mode.

### Viewport

The viewport sets are `03_viewport/xs`, `sm`, `md`, `lg`, `xl` and `2xl`. The ranges of the viewport modes are listed in [Viewport Mode](../../04-modes/06-viewport.md).

The six sets hold the same 25 tokens, but only two different value sets exist:

- `xs`, `sm` and `md` have identical values. Their family description says "mobile breakpoint".
- `lg`, `xl` and `2xl` have identical values. Their family description says "desktop breakpoint".

17 of the 25 tokens differ between the two groups. 8 tokens have the same value in all six viewports.

**Tokens that differ between `xs`, `sm`, `md` and `lg`, `xl`, `2xl`:**

| Token (after `ob.c.infobox.`) | `xs`, `sm`, `md` | `lg`, `xl`, `2xl` |
|---|---|---|
| `spacing.padding_top` | `spacing.xs.px` | `spacing.sm.px` |
| `spacing.padding_right` | `spacing.xs.px` | `spacing.sm.px` |
| `spacing.padding_bottom` | `spacing.xs.px` | `spacing.sm.px` |
| `spacing.padding_left` | `element.xl.px` | `spacing.sm.px` |
| `spacing.row_gap` | `spacing.xs.px` | `spacing.sm.px` |
| `spacing.title_bar.col_gap` | `spacing.xs.px` | `spacing.sm.px` |
| `spacing.body.padding_right` | `spacing.xs.px` | `container.xl.px` |
| `spacing.body.padding_bottom` | `element.xl.px` | `spacing.xs.px` |
| `spacing.parentof_buttons_container.padding_bottom` | `spacing.sm.px` | `element.xs.px` |
| `size.icon_size` | `spacing.md.px` | `none.px` |
| `size.close_button_size` | `spacing.xs.px` | `none.px` |
| `size.title.min_height` | `element.xs.px` | `spacing.xl.px` |
| `border_width.left` | `ob.s.border_width.sm` | `ob.s.border_width.md` |
| `container.spacing.row_gap` | `element.xl.px` | `spacing.sm.px` |
| `container.spacing.padding_bottom` | `spacing.xs.px` | `spacing.sm.px` |
| `container.spacing.padding_top` | `micro.sm.px` | `spacing.sm.px` |
| `buttons_order_figma` | `primary-first` | `primary-last` |

The short forms such as `spacing.xs.px` stand for `ob.s.dimension.static.ui_scale.spacing.xs.px`. The values in px are in the [Architecture](02-architecture.md#consumed-tokens) page.

**Tokens with the same value in all viewports:** `spacing.container_top.col_gap`, `spacing.text_blocks.row_gap`, `spacing.parentof_buttons_container.padding_left`, `spacing.parentof_buttons_container.padding_right`, `spacing.infobox_icon_container.padding_top`, `spacing.title.padding_top`, `container.spacing.padding_left` and `container.spacing.padding_right`.

The `xl` viewport is the base viewport. Values resolve to `xl` until another viewport is selected.

## Tokens

The infobox tokens are `ob.c.infobox.*`. They live in `04_component/molecule/infobox/`: `01_color.json` holds the colors, `02_layout.json` holds the layout tokens that do not depend on the viewport, and `03_viewport/` holds one file for each viewport (`xs.json`, `sm.json`, `md.json`, `lg.json`, `xl.json`, `2xl.json`). For the component tier see [Component Tokens](../../02-token-tiers/04-component.md).

---

**Next Steps:**
- [Component Architecture](02-architecture.md) - All tokens, references and design decisions
