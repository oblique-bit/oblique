# Badge Architecture

> Working version on the development line (git branch `tokens-dev`). The badge tokens are not part of Oblique 16.

## Component Overview

The badge tokens are the component layer (`ob.c.*`) of the Badge atom. They reference semantic tokens (`ob.s.*`) only. The colors cover four variants and two states. The dimensions cover two sizes.

## Component Structure

```
04_component/atom/badge.json
├── ob.c.badge.token_family_docs.description   — family description
├── ob.c.badge.color.bg.*                      — background, per variant and state
├── ob.c.badge.color.fg.*                      — text, per variant and state
├── ob.c.badge.spacing.padding.*               — horizontal and vertical padding
├── ob.c.badge.size.*                          — max_width, min_width, height
├── ob.c.badge.border_radius
└── ob.c.badge.typography.badge_label
```

## Color

Every color token references an `inversity_normal` semantic color. The `neutral` tokens are used for the disabled state of all variants.

| Token | References | Description |
|-------|-----------|-------------|
| `ob.c.badge.color.bg.attention.enabled` | `ob.s.color.status.attention.background.contrast_low` | Attention status background in the enabled state. |
| `ob.c.badge.color.bg.attention.disabled` | `ob.s.color.neutral.background.contrast_low` | Disabled attention badge background, using neutral tokens. |
| `ob.c.badge.color.bg.info.enabled` | `ob.s.color.status.info.background.contrast_low` | Info status background in the enabled state. |
| `ob.c.badge.color.bg.info.disabled` | `ob.s.color.neutral.background.contrast_low` | Disabled info badge background, using neutral tokens. |
| `ob.c.badge.color.bg.critical.enabled` | `ob.s.color.status.critical.background.contrast_low` | Critical status background in the enabled state. |
| `ob.c.badge.color.bg.critical.disabled` | `ob.s.color.neutral.background.contrast_low` | Disabled critical badge background, using neutral tokens. |
| `ob.c.badge.color.bg.resolved.enabled` | `ob.s.color.status.resolved.background.contrast_low` | Resolved status background in the enabled state. |
| `ob.c.badge.color.bg.resolved.disabled` | `ob.s.color.neutral.background.contrast_low` | Disabled resolved badge background, using neutral tokens. |
| `ob.c.badge.color.fg.info.enabled` | `ob.s.color.status.info.foreground.contrast_highest` | Maximum contrast text color of the info badge in the enabled state. |
| `ob.c.badge.color.fg.info.disabled` | `ob.s.color.neutral.foreground.contrast_highest` | Maximum contrast text color of the disabled info badge, for consistency with the badge design pattern. |
| `ob.c.badge.color.fg.attention.enabled` | `ob.s.color.status.attention.foreground.contrast_highest` | Maximum contrast text color of the attention badge in the enabled state. |
| `ob.c.badge.color.fg.attention.disabled` | `ob.s.color.neutral.foreground.contrast_highest` | Maximum contrast text color of the disabled attention badge, for consistency with the badge design pattern. |
| `ob.c.badge.color.fg.critical.enabled` | `ob.s.color.status.critical.foreground.contrast_highest` | Maximum contrast text color of the critical badge in the enabled state. |
| `ob.c.badge.color.fg.critical.disabled` | `ob.s.color.neutral.foreground.contrast_highest` | Maximum contrast text color of the disabled critical badge, for consistency with the badge design pattern. |
| `ob.c.badge.color.fg.resolved.enabled` | `ob.s.color.status.resolved.foreground.contrast_highest` | Maximum contrast text color of the resolved badge in the enabled state. |
| `ob.c.badge.color.fg.resolved.disabled` | `ob.s.color.neutral.foreground.contrast_highest` | Maximum contrast text color of the disabled resolved badge, for consistency with the badge design pattern. |

## Spacing

All four padding tokens reference the same static semantic dimension token.

| Token | References | Description |
|-------|-----------|-------------|
| `ob.c.badge.spacing.padding.horizontal.sm` | `ob.s.dimension.static.ui_scale.element.xs.px` | Horizontal padding of the small badge (4px). Absolute minimum for compact display. |
| `ob.c.badge.spacing.padding.horizontal.lg` | `ob.s.dimension.static.ui_scale.element.xs.px` | Horizontal padding of the large badge (4px). Minimal spacing for consistency. |
| `ob.c.badge.spacing.padding.vertical.sm` | `ob.s.dimension.static.ui_scale.element.xs.px` | Vertical padding of the small badge (4px). Absolute minimum for compact display. |
| `ob.c.badge.spacing.padding.vertical.lg` | `ob.s.dimension.static.ui_scale.element.xs.px` | Vertical padding of the large badge (4px). Minimal spacing for consistency. |

## Size

All size tokens reference static semantic dimension tokens. They do not react to the `ui_scale` mode.

| Token | References | Description |
|-------|-----------|-------------|
| `ob.c.badge.size.max_width.sm` | `ob.s.dimension.static.ui_scale.spacing.sm.px` | Maximum width of the small badge (20px, the standard icon size). |
| `ob.c.badge.size.max_width.lg` | `ob.s.dimension.static.ui_scale.container.xl.px` | Maximum width of the large badge (64px, the XL surface size). |
| `ob.c.badge.size.min_width.sm` | `ob.s.dimension.static.ui_scale.spacing.sm.px` | Minimal width of the small badge (20px). This makes the badge round. |
| `ob.c.badge.size.min_width.lg` | `ob.s.dimension.static.ui_scale.spacing.md.px` | Minimal width of the large badge (24px). This makes the badge round. |
| `ob.c.badge.size.height.sm` | `ob.s.dimension.static.ui_scale.spacing.sm.px` | Height of the small badge (20px). This makes the badge round. |
| `ob.c.badge.size.height.lg` | `ob.s.dimension.static.ui_scale.spacing.md.px` | Height of the large badge (24px). This makes the badge round. |

## Border Radius

| Token | References | Description |
|-------|-----------|-------------|
| `ob.c.badge.border_radius` | `ob.s.border_radius.rounded` | For entirely rounded badges. |

## Typography

| Token | References | Description |
|-------|-----------|-------------|
| `ob.c.badge.typography.badge_label` | `ob.s.typography.authoring.dynamic.sm.strong` | Strong font weight for optimal scannability. |

This is the only token of the family that follows the `ui_scale` mode. It references a `dynamic` typography token.

## Token Architecture Integration

```
ob.c.badge.color.bg.info.enabled
  → ob.s.color.status.info.background.contrast_low
      → S1 lightness level (light file or dark file)  (mode-reactive: lightness)

ob.c.badge.size.height.lg
  → ob.s.dimension.static.ui_scale.spacing.md.px  (static = no mode)
      → ob.p.dimension.px.24 (always)

ob.c.badge.typography.badge_label
  → ob.s.typography.authoring.dynamic.sm.strong  (dynamic = follows ui_scale)
```

The dimension tokens reference `.px` siblings. See [Dimension Tokens](../../03-token-categories/00-dimension.md) and the [Token Usage Guide](../../05-reference/01-token-usage-guide.md#px-vs-rem--which-unit-when-building-a-component).

## Design Decisions

These decisions are stated in the token descriptions.

| Decision | Source in the descriptions |
|----------|----------------------------|
| The disabled state uses neutral colors for all four variants. | Disabled background tokens: "using neutral tokens for disabled state". |
| Text uses the highest contrast level in both states. | "Maximum contrast text color" for enabled tokens. "Maximum contrast disabled ... text color for consistency with badge design pattern" for disabled tokens. |
| Padding is 4px in both sizes. | Small badge: "Absolute minimum for compact display". Large badge: "Minimal spacing for consistency". |
| The minimal width equals the height in each size, which makes the badge round. | Descriptions of `min_width` and `height`: "makes badge round". |
| The small badge has a maximum width of 20px, the large badge of 64px. | "20px - standard icon size" and "64px - XL surface size". |
| The badge is fully rounded. | Border radius: "For entire rounded badges". |
| The label uses a strong font weight. | Typography: "Strong font weight for optimal scannability". |

## Consumed Tokens

The badge references semantic tokens only. It does not reference primitives directly.

| Semantic token | Used for | Resolves to |
|----------------|----------|-------------|
| `ob.s.color.status.{attention,info,critical,resolved}.bg.contrast_low.inversity_normal` | Enabled backgrounds | S1 lightness level |
| `ob.s.color.status.{attention,info,critical,resolved}.fg.contrast_highest.inversity_normal` | Enabled text | S1 lightness level |
| `ob.s.color.neutral.background.contrast_low` | Disabled backgrounds | S1 lightness level |
| `ob.s.color.neutral.foreground.contrast_highest` | Disabled text | S1 lightness level |
| `ob.s.dimension.static.ui_scale.element.xs.px` | Padding | `ob.p.dimension.px.4` |
| `ob.s.dimension.static.ui_scale.spacing.sm.px` | Small size: min width, max width, height | `ob.p.dimension.px.20` |
| `ob.s.dimension.static.ui_scale.spacing.md.px` | Large size: min width, height | `ob.p.dimension.px.24` |
| `ob.s.dimension.static.ui_scale.container.xl.px` | Large size: max width | `ob.p.dimension.px.64` |
| `ob.s.border_radius.rounded` | Border radius | `ob.p.dimension.px.9999` |
| `ob.s.typography.authoring.dynamic.sm.strong` | Label text style | `ob.s.typography.scale.*` tokens |

---

**Component Overview**: See [Badge Overview](01-overview.md)
