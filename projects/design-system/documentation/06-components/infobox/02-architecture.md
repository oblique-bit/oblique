# Infobox Architecture

> Working version on the development line (git branch `tokens-dev`). The infobox tokens are not part of Oblique 16.

## Component Overview

The infobox is a molecule in Oblique DS. It has five status variants (`info`, `critical`, `attention`, `resolved`, `fatal`). The color tokens exist once for each variant. The layout tokens that depend on the screen width exist once for each of the six viewport modes. The component has 62 token paths and 187 tokens in the token files.

## Component Structure

```
04_component/molecule/infobox/
├── 01_color.json      — 20 color tokens (ob.c.infobox.color.*)
├── 02_layout.json     — 17 tokens, the same in every viewport
│   ├── ob.c.infobox.container.padding_bottom
│   ├── ob.c.infobox.icon.asset.status.*
│   ├── ob.c.infobox.border_radius.*
│   ├── ob.c.infobox.typography.*
│   └── ob.c.infobox.{status}.button.inversity
└── 03_viewport/       — 25 tokens in each file, one file for each viewport mode
    ├── xs.json
    ├── sm.json
    ├── md.json
    ├── lg.json
    ├── xl.json
    └── 2xl.json
```

Each viewport file holds the same token paths:

```
ob.c.infobox.spacing.*
ob.c.infobox.size.*
ob.c.infobox.border_width.left
ob.c.infobox.container.spacing.*
ob.c.infobox.buttons_order_figma
```

Every file also has a `token_family_docs.description` token that describes the file. These description tokens are not listed in the tables.

## How to Read the Tables

- A table with three columns lists tokens that have the same value in every viewport. The second column shows the reference as written in the token file, without braces, or the literal value of the token.
- A table with the columns xs, sm, md, lg, xl and 2xl lists tokens from `03_viewport/`. The path of the token is shown without the prefix `ob.c.infobox.`. The reference is shown without the prefix `ob.s.dimension.static.ui_scale.`. A reference that starts with `ob.s.` is shown in full. The full tokens and their values in px are in [Consumed Tokens](#consumed-tokens).
- The columns `xs`, `sm` and `md` are identical. The columns `lg`, `xl` and `2xl` are identical.
- The description text is shortened. If a token has no `$description`, the Description column only restates the token name.

## Color Tokens

File: `01_color.json`. The family description is "Color tokens for the Infobox molecule — icon, border, surface, and foreground colors." The color tokens have no individual description.

| Token | References | Description |
|---|---|---|
| `ob.c.infobox.color.icon.info` | `ob.s.color.status.info.fg.contrast_medium.inversity_normal` | Icon color, `info` |
| `ob.c.infobox.color.icon.critical` | `ob.s.color.status.critical.fg.contrast_medium.inversity_normal` | Icon color, `critical` |
| `ob.c.infobox.color.icon.attention` | `ob.s.color.status.attention.fg.contrast_medium.inversity_normal` | Icon color, `attention` |
| `ob.c.infobox.color.icon.resolved` | `ob.s.color.status.resolved.fg.contrast_medium.inversity_normal` | Icon color, `resolved` |
| `ob.c.infobox.color.icon.fatal` | `ob.s.color.status.fatal.fg.contrast_medium.inversity_flipped` | Icon color, `fatal` |
| `ob.c.infobox.color.border.info` | `ob.s.color.status.info.fg.contrast_medium.inversity_normal` | Border color, `info` |
| `ob.c.infobox.color.border.critical` | `ob.s.color.status.critical.fg.contrast_medium.inversity_normal` | Border color, `critical` |
| `ob.c.infobox.color.border.attention` | `ob.s.color.status.attention.fg.contrast_medium.inversity_normal` | Border color, `attention` |
| `ob.c.infobox.color.border.resolved` | `ob.s.color.status.resolved.fg.contrast_medium.inversity_normal` | Border color, `resolved` |
| `ob.c.infobox.color.border.fatal` | `ob.s.color.status.fatal.fg.contrast_medium.inversity_flipped` | Border color, `fatal` |
| `ob.c.infobox.color.surface.info` | `ob.s.color.status.info.bg.contrast_high.inversity_normal` | Surface color, `info` |
| `ob.c.infobox.color.surface.critical` | `ob.s.color.status.critical.bg.contrast_high.inversity_normal` | Surface color, `critical` |
| `ob.c.infobox.color.surface.attention` | `ob.s.color.status.attention.bg.contrast_high.inversity_normal` | Surface color, `attention` |
| `ob.c.infobox.color.surface.resolved` | `ob.s.color.status.resolved.bg.contrast_high.inversity_normal` | Surface color, `resolved` |
| `ob.c.infobox.color.surface.fatal` | `ob.s.color.status.fatal.bg.contrast_high.inversity_flipped` | Surface color, `fatal` |
| `ob.c.infobox.color.fg.info` | `ob.s.color.neutral.fg.contrast_high.inversity_normal` | Foreground color, `info` |
| `ob.c.infobox.color.fg.critical` | `ob.s.color.neutral.fg.contrast_high.inversity_normal` | Foreground color, `critical` |
| `ob.c.infobox.color.fg.attention` | `ob.s.color.neutral.fg.contrast_high.inversity_normal` | Foreground color, `attention` |
| `ob.c.infobox.color.fg.resolved` | `ob.s.color.neutral.fg.contrast_high.inversity_normal` | Foreground color, `resolved` |
| `ob.c.infobox.color.fg.fatal` | `ob.s.color.neutral.fg.contrast_medium.inversity_flipped` | Foreground color, `fatal` |

All color tokens reference semantic color tokens, which follow the `lightness` mode. Inversity is part of the referenced token name (`inversity_normal` or `inversity_flipped`). See [Component Tokens](../../02-token-tiers/04-component.md#inversity-component-level-contrast-inversion).

## Container Tokens

### Container padding (`02_layout.json`)

| Token | References | Description |
|---|---|---|
| `ob.c.infobox.container.padding_bottom` | `ob.s.dimension.static.ui_scale.spacing.xl.px` | Extends the padding of the infobox so the spacing to the right of and below the button stays consistent and looks good. |

### Container spacing (`03_viewport/`)

`container.spacing.*` is a different group from `container.padding_bottom` above. The paths in this table start with `ob.c.infobox.`.

| Token | xs | sm | md | lg | xl | 2xl | Description |
|---|---|---|---|---|---|---|---|
| `container.spacing.row_gap` | `element.xl.px` | `element.xl.px` | `element.xl.px` | `spacing.sm.px` | `spacing.sm.px` | `spacing.sm.px` | Vertical gap between infoboxes. |
| `container.spacing.padding_bottom` | `spacing.xs.px` | `spacing.xs.px` | `spacing.xs.px` | `spacing.sm.px` | `spacing.sm.px` | `spacing.sm.px` | Bottom padding of the container. |
| `container.spacing.padding_top` | `micro.sm.px` | `micro.sm.px` | `micro.sm.px` | `spacing.sm.px` | `spacing.sm.px` | `spacing.sm.px` | Top padding of the container. |
| `container.spacing.padding_left` | `none.px` | `none.px` | `none.px` | `none.px` | `none.px` | `none.px` | Left padding of the container. |
| `container.spacing.padding_right` | `none.px` | `none.px` | `none.px` | `none.px` | `none.px` | `none.px` | Right padding of the container. |

## Spacing Tokens

File: `03_viewport/{viewport}.json`. The paths in this table start with `ob.c.infobox.`. The family description is "Viewport-specific layout tokens for the Infobox molecule at the mobile breakpoint" in `xs`, `sm` and `md`, and "... at the desktop breakpoint" in `lg`, `xl` and `2xl`.

| Token | xs | sm | md | lg | xl | 2xl | Description |
|---|---|---|---|---|---|---|---|
| `spacing.padding_top` | `spacing.xs.px` | `spacing.xs.px` | `spacing.xs.px` | `spacing.sm.px` | `spacing.sm.px` | `spacing.sm.px` | Top padding. Equal to the right padding so the close button sits well. Keeps the text from looking cramped. |
| `spacing.padding_right` | `spacing.xs.px` | `spacing.xs.px` | `spacing.xs.px` | `spacing.sm.px` | `spacing.sm.px` | `spacing.sm.px` | Right padding. Same as the top padding so the position of the close button looks good. |
| `spacing.padding_bottom` | `spacing.xs.px` | `spacing.xs.px` | `spacing.xs.px` | `spacing.sm.px` | `spacing.sm.px` | `spacing.sm.px` | Bottom padding. Keeps the text from looking cramped and improves readability. |
| `spacing.padding_left` | `element.xl.px` | `element.xl.px` | `element.xl.px` | `spacing.sm.px` | `spacing.sm.px` | `spacing.sm.px` | Left padding. Keeps the text from looking cramped. Smaller on mobile to leave more room for the content. |
| `spacing.row_gap` | `spacing.xs.px` | `spacing.xs.px` | `spacing.xs.px` | `spacing.sm.px` | `spacing.sm.px` | `spacing.sm.px` | Minimum vertical gap between `container_top` and the buttons container, for readability. |
| `spacing.container_top.col_gap` | `spacing.xs.px` | `spacing.xs.px` | `spacing.xs.px` | `spacing.xs.px` | `spacing.xs.px` | `spacing.xs.px` | Gap between the status icon and the text blocks, for readability and horizontal rhythm. |
| `spacing.text_blocks.row_gap` | `element.xl.px` | `element.xl.px` | `element.xl.px` | `element.xl.px` | `element.xl.px` | `element.xl.px` | Gap between the title and the body text. Emphasizes the visual hierarchy. |
| `spacing.title_bar.col_gap` | `spacing.xs.px` | `spacing.xs.px` | `spacing.xs.px` | `spacing.sm.px` | `spacing.sm.px` | `spacing.sm.px` | Keeps the title from coming too close to the close button (X). |
| `spacing.body.padding_right` | `spacing.xs.px` | `spacing.xs.px` | `spacing.xs.px` | `container.xl.px` | `container.xl.px` | `container.xl.px` | Right padding of the body. Larger on larger screens, where white space lets the design breathe. Reset on mobile. |
| `spacing.body.padding_bottom` | `element.xl.px` | `element.xl.px` | `element.xl.px` | `spacing.xs.px` | `spacing.xs.px` | `spacing.xs.px` | Bottom padding of the body. |
| `spacing.parentof_buttons_container.padding_left` | `container.xl.px` | `container.xl.px` | `container.xl.px` | `container.xl.px` | `container.xl.px` | `container.xl.px` | Left padding of the buttons container. Aligns the buttons with the text on mobile. |
| `spacing.parentof_buttons_container.padding_bottom` | `spacing.sm.px` | `spacing.sm.px` | `spacing.sm.px` | `element.xs.px` | `element.xs.px` | `element.xs.px` | Spacing from the last button to the lower border of the surface. |
| `spacing.parentof_buttons_container.padding_right` | `element.xs.px` | `element.xs.px` | `element.xs.px` | `element.xs.px` | `element.xs.px` | `element.xs.px` | Right padding of the buttons container. |
| `spacing.infobox_icon_container.padding_top` | `none.px` | `none.px` | `none.px` | `none.px` | `none.px` | `none.px` | Top padding of the icon container. |
| `spacing.title.padding_top` | `micro.sm.px` | `micro.sm.px` | `micro.sm.px` | `micro.sm.px` | `micro.sm.px` | `micro.sm.px` | Aligns the title with the status icon and the close button on desktop. |

## Size Tokens

File: `03_viewport/{viewport}.json`. The paths in this table start with `ob.c.infobox.`.

| Token | xs | sm | md | lg | xl | 2xl | Description |
|---|---|---|---|---|---|---|---|
| `size.icon_size` | `spacing.md.px` | `spacing.md.px` | `spacing.md.px` | `none.px` | `none.px` | `none.px` | Size of the status icon. Slightly larger than the title for readability, because the icon has less contrast than the text. Smaller on mobile to save space for the text. |
| `size.close_button_size` | `spacing.xs.px` | `spacing.xs.px` | `spacing.xs.px` | `none.px` | `none.px` | `none.px` | Size of the close button. |
| `size.title.min_height` | `element.xs.px` | `element.xs.px` | `element.xs.px` | `spacing.xl.px` | `spacing.xl.px` | `spacing.xl.px` | Minimum height of the title container, with or without a close button. |

In `lg`, `xl` and `2xl`, `size.icon_size` and `size.close_button_size` reference `none.px`. This is the value in the token files on the development line.

## Border Width Token

File: `03_viewport/{viewport}.json`. The path in this table starts with `ob.c.infobox.`.

| Token | xs | sm | md | lg | xl | 2xl | Description |
|---|---|---|---|---|---|---|---|
| `border_width.left` | `ob.s.border_width.sm` | `ob.s.border_width.sm` | `ob.s.border_width.sm` | `ob.s.border_width.md` | `ob.s.border_width.md` | `ob.s.border_width.md` | Width of the left colored border. Close to the line thickness of the icon (proximity and consistency principles). Slightly smaller on mobile because the icon is smaller. |

## Border Radius Tokens

File: `02_layout.json`. The same in every viewport.

| Token | References | Description |
|---|---|---|
| `ob.c.infobox.border_radius.top_left` | `ob.s.border_radius.none` | Upper left corner radius is zero, because there is a left colored border and no need for rounded corners. |
| `ob.c.infobox.border_radius.top_right` | `ob.s.border_radius.md` | Rounds the upper right corner to improve the visual appeal of the component. |
| `ob.c.infobox.border_radius.bottom_left` | `ob.s.border_radius.none` | Lower left corner radius is zero, because there is a left colored border and no need for rounded corners. |
| `ob.c.infobox.border_radius.bottom_right` | `ob.s.border_radius.md` | Rounds the lower right corner to improve the visual appeal of the component. |

## Icon Tokens

File: `02_layout.json`. These tokens have the `$type` `asset`. Their value is the name of an icon asset, not a reference. The size of the status icon is the token `size.icon_size` (see Size Tokens).

| Token | Value | Description |
|---|---|---|
| `ob.c.infobox.icon.asset.status.info` | `InfoCircle` | Icon asset for the `info` status. |
| `ob.c.infobox.icon.asset.status.warning` | `WarningTriangle` | Icon asset for the `warning` status. |
| `ob.c.infobox.icon.asset.status.error` | `WarningCircle` | Icon asset for the `error` status. |
| `ob.c.infobox.icon.asset.status.success` | `CheckmarkCircle` | Icon asset for the `success` status. |
| `ob.c.infobox.icon.asset.status.fatal` | `Error-new` | This icon is not yet part of the official icon set. It still has to be drawn. |

The asset tokens use the status names `info`, `warning`, `error`, `success` and `fatal`. The color tokens use `info`, `attention`, `critical`, `resolved` and `fatal`. See [Status Colors](../../03-token-categories/colors/07-semantic-status.md) for the former names `error` and `success`.

## Typography Tokens

File: `02_layout.json`. These tokens have the `$type` `typography`.

| Token | References | Description |
|---|---|---|
| `ob.c.infobox.typography.title` | `ob.s.typography.authoring.static.md.strong` | Text style of the title. A stronger font weight than the body builds visual contrast and emphasizes the hierarchy. |
| `ob.c.infobox.typography.body` | `ob.s.typography.authoring.static.md.normal` | Text style of the body. Medium font weight, to build visual contrast when a title is present. |

## Button Tokens

### Button inversity (`02_layout.json`)

These tokens have the `$type` `text`. Their value is a literal text, not a reference. They have no description.

| Token | Value | Description |
|---|---|---|
| `ob.c.infobox.info.button.inversity` | `normal` | Inversity of the buttons in the `info` infobox. |
| `ob.c.infobox.critical.button.inversity` | `normal` | Inversity of the buttons in the `critical` infobox. |
| `ob.c.infobox.attention.button.inversity` | `normal` | Inversity of the buttons in the `attention` infobox. |
| `ob.c.infobox.resolved.button.inversity` | `normal` | Inversity of the buttons in the `resolved` infobox. |
| `ob.c.infobox.fatal.button.inversity` | `flipped` | Inversity of the buttons in the `fatal` infobox. |

### Buttons order (`03_viewport/`)

This token has the `$type` `text`. Its value is a literal text. The path in this table starts with `ob.c.infobox.`.

| Token | xs | sm | md | lg | xl | 2xl | Description |
|---|---|---|---|---|---|---|---|
| `buttons_order_figma` | `primary-first` | `primary-first` | `primary-first` | `primary-last` | `primary-last` | `primary-last` | Order of the buttons. On desktop the primary button is on the right of a right-aligned button group, as the last element, for intuitive navigation and decision-making. |

## Token Architecture Integration

Infobox tokens sit in the `ob.c.*` component tier. They reference semantic tokens from `ob.s.*` only.

```
ob.c.infobox.color.surface.info
  → ob.s.color.status.info.bg.contrast_high.inversity_normal
      → ob.s1.color.status.info.bg.contrast_high.inversity_normal  (lightness layer: light or dark)
          → ob.p.color.*

ob.c.infobox.spacing.padding_top  (xs, sm, md)
  → ob.s.dimension.static.ui_scale.spacing.xs.px  (static = no mode)
      → ob.p.dimension.px.16
```

The infobox dimension tokens use the `.px` variants of the semantic dimension tokens. The token values are px. The [Token Usage Guide](../../05-reference/01-token-usage-guide.md#px-vs-rem--which-unit-when-building-a-component) explains the px rule.

The viewport mode picks the token set. In the set of the active viewport, the same token paths resolve to the values of that viewport. See [Viewport Mode](../../04-modes/06-viewport.md).

## Design Decisions

These decisions come from the `$description` texts of the tokens.

### Left border, square left corners

The surface has a colored border on the left side. The left corners have a radius of zero, because a left colored border needs no rounded corners. The right corners are rounded to improve the visual appeal of the component.

### Equal top and right padding

Top and right padding are the same, so that the position of the close button looks good. Equal padding also keeps the text from looking cramped.

### Mobile and larger screens

- The left padding is smaller on mobile, to leave more room for the content.
- The right padding of the body is larger on larger screens, where white space lets the design breathe. It is reset on mobile.
- The status icon is smaller on mobile, to save space for the text.
- The left border is slightly smaller on mobile, because the icon is smaller too.
- The buttons container has a left padding that aligns the buttons with the text on mobile.

### Icon size and border width

The icon size is slightly larger than the title. The icon has less contrast than the text and communicates the status, so it must stay readable. The left border width is close to the line thickness of the icon. This follows the design principles of proximity and consistency.

### Title and close button

- `title_bar.col_gap` keeps the title from coming too close to the close button (X).
- `title.padding_top` aligns the title with the status icon and the close button on desktop.
- `size.title.min_height` keeps the height of the title container the same, with or without a close button.

### Typography

The title and the body use different font weights. This builds visual contrast and emphasizes the hierarchy. The body uses a medium font weight so that it contrasts with the title when a title is present. `text_blocks.row_gap` also emphasizes the hierarchy between the title and the body text.

### Button order

On desktop the primary button is on the right of a right-aligned button group, so that it is the last element. This helps intuitive navigation and decision-making. The token has the value `primary-last` in `lg`, `xl` and `2xl` and `primary-first` in `xs`, `sm` and `md`.

### Fatal icon

The icon asset of the `fatal` status (`Error-new`) is not yet part of the official icon set. It still has to be drawn.

### Gap between infoboxes

`container.spacing.row_gap` sets the vertical distance between infoboxes.

## Consumed Tokens

The infobox references only semantic tokens. It does not reference primitives (`ob.p.*`) directly.

### Semantic color tokens

| Token | Used by |
|---|---|
| `ob.s.color.status.info.fg.contrast_medium.inversity_normal` | `color.icon.info`, `color.border.info` |
| `ob.s.color.status.critical.fg.contrast_medium.inversity_normal` | `color.icon.critical`, `color.border.critical` |
| `ob.s.color.status.attention.fg.contrast_medium.inversity_normal` | `color.icon.attention`, `color.border.attention` |
| `ob.s.color.status.resolved.fg.contrast_medium.inversity_normal` | `color.icon.resolved`, `color.border.resolved` |
| `ob.s.color.status.fatal.fg.contrast_medium.inversity_flipped` | `color.icon.fatal`, `color.border.fatal` |
| `ob.s.color.status.info.bg.contrast_high.inversity_normal` | `color.surface.info` |
| `ob.s.color.status.critical.bg.contrast_high.inversity_normal` | `color.surface.critical` |
| `ob.s.color.status.attention.bg.contrast_high.inversity_normal` | `color.surface.attention` |
| `ob.s.color.status.resolved.bg.contrast_high.inversity_normal` | `color.surface.resolved` |
| `ob.s.color.status.fatal.bg.contrast_high.inversity_flipped` | `color.surface.fatal` |
| `ob.s.color.neutral.fg.contrast_high.inversity_normal` | `color.fg.info`, `color.fg.critical`, `color.fg.attention`, `color.fg.resolved` |
| `ob.s.color.neutral.fg.contrast_medium.inversity_flipped` | `color.fg.fatal` |

### Semantic dimension and border tokens

The dimension tokens are in the group `ob.s.dimension.static.ui_scale.*`. The short form is the one used in the viewport tables.

| Short form | Token | Primitive | px |
|---|---|---|---|
| `none.px` | `ob.s.dimension.static.ui_scale.none.px` | `ob.p.dimension.px.0` | 0 |
| `micro.sm.px` | `ob.s.dimension.static.ui_scale.micro.sm.px` | `ob.p.dimension.px.2` | 2 |
| `element.xs.px` | `ob.s.dimension.static.ui_scale.element.xs.px` | `ob.p.dimension.px.4` | 4 |
| `element.xl.px` | `ob.s.dimension.static.ui_scale.element.xl.px` | `ob.p.dimension.px.12` | 12 |
| `spacing.xs.px` | `ob.s.dimension.static.ui_scale.spacing.xs.px` | `ob.p.dimension.px.16` | 16 |
| `spacing.sm.px` | `ob.s.dimension.static.ui_scale.spacing.sm.px` | `ob.p.dimension.px.20` | 20 |
| `spacing.md.px` | `ob.s.dimension.static.ui_scale.spacing.md.px` | `ob.p.dimension.px.24` | 24 |
| `spacing.xl.px` | `ob.s.dimension.static.ui_scale.spacing.xl.px` | `ob.p.dimension.px.32` | 32 |
| `container.xl.px` | `ob.s.dimension.static.ui_scale.container.xl.px` | `ob.p.dimension.px.64` | 64 |
| (full path) | `ob.s.border_width.sm` | `ob.p.dimension.px.2` | 2 |
| (full path) | `ob.s.border_width.md` | `ob.p.dimension.px.3` | 3 |
| (full path) | `ob.s.border_radius.none` | `ob.p.dimension.px.0` | 0 |
| (full path) | `ob.s.border_radius.md` | `ob.p.dimension.px.2` | 2 |

### Semantic typography tokens

| Token | Used by |
|---|---|
| `ob.s.typography.authoring.static.md.strong` | `typography.title` |
| `ob.s.typography.authoring.static.md.normal` | `typography.body` |

### Primitive tokens

The primitives are reached through the semantic tokens above:

- `ob.p.dimension.px.*` for all dimension, border width and border radius tokens (the values 0, 2, 3, 4, 12, 16, 20, 24, 32 and 64).
- `ob.p.color.*` for all colors. The primitive depends on the active `lightness` mode.
- The typography primitives for font family, font weight, font size, line height and letter spacing.

---

**Component Overview**: See [Infobox Overview](01-overview.md)
