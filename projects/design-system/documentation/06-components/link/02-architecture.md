# Link Architecture

> Working version on the development line (git branch `tokens-dev`). The link tokens are not part of Oblique 16.

## Component Overview

The link tokens describe the HTML anchor element: spacing, motion, asset, color and the interaction states enabled, hover, focus and active. The token family is `ob.h.link.*`. The font properties of the link text come from the text style `body/link`, which is described in [Text Components Architecture](../text-components/02-architecture.md).

## Component Structure

```
05_html/link/
├── link.json         — ob.h.link.* spacing, motion, asset, color and text decoration tokens
├── interface.json    — ob.h.link.icon.size for the interface typography context
└── prose.json        — ob.h.link.icon.size for the prose typography context
```

## Tokens

All tokens of the topic are listed here. The column "References" shows the token that the value points to. For the asset tokens the column shows the fixed value, because these tokens do not reference another token.

### Spacing and motion

| Token | References | Description |
|-------|------------|-------------|
| `ob.h.link.spacing.gap` | `ob.s.dimension.static.ui_scale.micro.sm.px` | Gap between icon and text in the text link. Value: 2 px. |
| `ob.h.link.motion.duration` | `ob.s.motion.duration.micro` | Link transition duration for hover and focus states. Value: 100 ms in the `enabled` motion mode, 0 ms in the `disabled` motion mode. |
| `ob.h.link.motion.easing` | `ob.s.motion.easing.standard` | Link transition easing. Value: `cubic-bezier(0, 0, 0.2, 1)`. |

### Asset

The asset tokens are informative only. Developers should not use tokens for icons.

| Token | References | Description |
|-------|------------|-------------|
| `ob.h.link.asset.type.internal` | fixed value `none` | No icon on internal links (except in lists, defined in another token). |
| `ob.h.link.asset.type.internal_list` | fixed value `arrow-right` | Icon displayed for internal links (list only). |
| `ob.h.link.asset.type.external` | fixed value `external` | Icon displayed for all external links. |
| `ob.h.link.asset.type.phone` | fixed value `phone` | Icon displayed for all phone number links. |
| `ob.h.link.asset.type.mail` | fixed value `envelope` | Icon displayed for email links. |

### Color

All four tokens use the `inversity_normal` value.

| Token | References | Description |
|-------|------------|-------------|
| `ob.h.link.color.default` | `ob.s.color.interaction.fg.contrast_medium.inversity_normal` | Default color of unvisited links. |
| `ob.h.link.color.visited` | `ob.s.color.interaction.visited.fg.contrast_low.inversity_normal` | Color of links the user has already visited. |
| `ob.h.link.color.hover` | `ob.s.color.interaction.fg.contrast_low.inversity_normal` | Color of link when hovered with the mouse. |
| `ob.h.link.color.active` | `ob.s.color.interaction.fg.contrast_high.inversity_normal` | Color of link during click interaction. |

> **Open point:** the default link color is dark and has little saturation on thin letters; it may be swapped with the hover color in a later round.

### Text decoration

These tokens have the type `typography` and hold only a text decoration. They exist as text styles in the Figma file.

| Token | Text style in Figma | References | Description |
|-------|---------------------|------------|-------------|
| `ob.h.link.enabled` | `h/link/enabled` | `ob.s.typography.scale.static.text_decoration.link.emphasis_high` (underline) | Text decoration of the enabled state (a:link). |
| `ob.h.link.hover` | `h/link/hover` | `ob.s.typography.scale.static.text_decoration.link.emphasis_high` (underline) | Text decoration of the hover state (a:hover). |
| `ob.h.link.focus` | `h/link/focus` | `ob.s.typography.scale.static.text_decoration.link.emphasis_low` (none) | Text decoration of the focus state (a:focus). It displays already a border. No need for additional visual emphasis. |
| `ob.h.link.active` | `h/link/active` | `ob.s.typography.scale.static.text_decoration.link.emphasis_high` (underline) | Text decoration of the active state (a:active). |

### Icon size

The same token name is defined in two files. The typography context decides which file applies.

| Token | Typography context | References | Description |
|-------|--------------------|------------|-------------|
| `ob.h.link.icon.size` | `interface` | `ob.s.typography.scale.static.font_size.md` (1rem, 16 px) | Link icon tokens for the interface typography context. |
| `ob.h.link.icon.size` | `prose` | `ob.s.typography.scale.static.font_size.lg` (1.125rem, 18 px) | Link icon tokens for the prose typography context. |

## Token Architecture Integration

The link tokens sit in the `ob.h.*` layer for HTML elements. They reference semantic tokens from `ob.s.*`.

```
ob.h.link.color.default
  → ob.s.color.interaction.fg.contrast_medium.inversity_normal
      → ob.s2.color.interaction.fg.contrast_medium.inversity_normal   (follows the emphasis mode)
          → ob.s1.color.interaction.emphasis_high.fg.contrast_medium.inversity_normal
            or ob.s1.color.interaction.emphasis_low.fg.contrast_medium.inversity_normal

ob.h.link.color.visited
  → ob.s.color.interaction.visited.fg.contrast_low.inversity_normal
      → ob.s1.color.interaction.visited.fg.contrast_low.inversity_normal   (no emphasis variant)
```

The hover and active colors follow the same path as the default color, with the contrast levels `contrast_low` and `contrast_high`. The S1 tokens resolve with the `lightness` mode. See [Interaction Colors](../../03-token-categories/colors/06-semantic-interaction.md).

The gap and the icon size are values, not colors. The gap references a static dimension token, so it does not react to the `ui_scale` mode. See [Dimension Tokens](../../03-token-categories/00-dimension.md). The icon size references the static font size scale and changes with the `typography_context` mode collection. See [Typography-Context Mode](../../04-modes/04-typography-context.md).

## Design Decisions

### Informative asset tokens

The asset tokens only record which icon belongs to which type of link. Their descriptions state that they are informative only and that developers should not use tokens for icons. Internal links show no icon. The exception is the internal link in a list, which has its own token.

### Focus without underline

The focus state uses the text decoration `emphasis_low`, which is none. The reason in the token description: the focus state displays already a border, so it needs no additional visual emphasis. The other three states use the underline, which the semantic token describes as the standard text link decoration.

### Motion

The duration token is meant for hover and focus transitions. It references the semantic `micro` duration, which becomes an instant transition when the `motion` mode collection is set to `disabled`.

### Open point: default link color

The default link color is dark and has little saturation on thin letters. It may be swapped with the hover color in a later round.

## Consumed Tokens

| Token | Used by | Value |
|-------|---------|-------|
| `ob.s.dimension.static.ui_scale.micro.sm.px` | `ob.h.link.spacing.gap` | 2 px |
| `ob.s.motion.duration.micro` | `ob.h.link.motion.duration` | 100 ms (`enabled`), 0 ms (`disabled`) |
| `ob.s.motion.easing.standard` | `ob.h.link.motion.easing` | `cubic-bezier(0, 0, 0.2, 1)` |
| `ob.s.color.interaction.fg.contrast_medium.inversity_normal` | `ob.h.link.color.default` | follows `lightness` and `emphasis` |
| `ob.s.color.interaction.visited.fg.contrast_low.inversity_normal` | `ob.h.link.color.visited` | follows `lightness` |
| `ob.s.color.interaction.fg.contrast_low.inversity_normal` | `ob.h.link.color.hover` | follows `lightness` and `emphasis` |
| `ob.s.color.interaction.fg.contrast_high.inversity_normal` | `ob.h.link.color.active` | follows `lightness` and `emphasis` |
| `ob.s.typography.scale.static.text_decoration.link.emphasis_high` | `ob.h.link.enabled`, `ob.h.link.hover`, `ob.h.link.active` | underline |
| `ob.s.typography.scale.static.text_decoration.link.emphasis_low` | `ob.h.link.focus` | none |
| `ob.s.typography.scale.static.font_size.md` | `ob.h.link.icon.size` (interface) | 1rem (16 px) |
| `ob.s.typography.scale.static.font_size.lg` | `ob.h.link.icon.size` (prose) | 1.125rem (18 px) |

---

**Component Overview**: See [Link Overview](01-overview.md)
