# Spinner Architecture

> Working version on the development line (git branch `tokens-dev`). The spinner tokens are not part of Oblique 16.

## Component Overview

The spinner tokens are the component layer (`ob.c.*`) of the Spinner atom. They reference semantic tokens (`ob.s.*`) only. The family has seven style tokens in five groups.

## Component Structure

```
04_component/atom/spinner.json
├── ob.c.spinner.token_family_docs.description   — family description
├── ob.c.spinner.size                            — follows ui_scale
├── ob.c.spinner.color.active / inactive
├── ob.c.spinner.border_radius
├── ob.c.spinner.border_width
└── ob.c.spinner.animation.speed / pause
```

## Size

| Token | References | Description |
|-------|-----------|-------------|
| `ob.c.spinner.size` | `ob.s.dimension.dynamic.ui_scale.container.xl.px` | Optimized spinner size, suitable for both small components like Card and full-page displays. |

## Color

Both tokens reference the `free.indigo` family with the `inversity_normal` variant.

| Token | References | Description |
|-------|-----------|-------------|
| `ob.c.spinner.color.active` | `ob.s.color.free.indigo.foreground.contrast_medium` | Color of the active part of the loading. |
| `ob.c.spinner.color.inactive` | `ob.s.color.free.indigo.background.contrast_low` | Color of the inactive part of the loading. |

## Border Radius

| Token | References | Description |
|-------|-----------|-------------|
| `ob.c.spinner.border_radius` | `ob.s.border_radius.lg` | Radius LG gives the spinner a more organic appearance. |

## Border Width

| Token | References | Description |
|-------|-----------|-------------|
| `ob.c.spinner.border_width` | `ob.s.border_width.3xl` | The spinner border is thick enough to stand out against the busy visual environment around it. |

## Animation

| Token | References | Description |
|-------|-----------|-------------|
| `ob.c.spinner.animation.speed` | `ob.s.motion.duration.instant` | Continuous rotation with no delay. |
| `ob.c.spinner.animation.pause` | `ob.s.motion.duration.instant` | No pause between spinner rotations. |

## Token Architecture Integration

```
ob.c.spinner.size
  → ob.s.dimension.dynamic.ui_scale.container.xl.px  (dynamic = follows ui_scale)
      → roundTo(ob.p.dimension.px.64 × ui_scale multiplier, 0)

ob.c.spinner.color.active
  → ob.s.color.free.indigo.foreground.contrast_medium
      → S1 lightness level (light file or dark file)  (mode-reactive: lightness)

ob.c.spinner.animation.speed
  → ob.s.motion.duration.instant
      → ob.p.motion.duration.instant  (in the enabled and in the disabled motion mode)
```

The size token references a `.px` sibling. See [Dimension Tokens](../../03-token-categories/00-dimension.md) and the [Token Usage Guide](../../05-reference/01-token-usage-guide.md#px-vs-rem--which-unit-when-building-a-component).

## Design Decisions

These decisions are stated in the token descriptions.

| Decision | Source in the descriptions |
|----------|----------------------------|
| One size covers small components and full-page displays. | Size: "suitable for both small components like Card and full-page displays". |
| The spinner is split into an active and an inactive color. | Color: "the active part of the loading" and "the inactive part of the loading". |
| The radius is LG. | Border radius: "to give the spinner a more organic appearance". |
| The border is thick. | Border width: "thick enough to stand out against the busy visual environment surrounding it". |
| The rotation is continuous and has no pause. | Animation: "continuous rotation with no delay" and "No pause between spinner rotations". |

## Consumed Tokens

The spinner references semantic tokens only. It does not reference primitives directly.

| Semantic token | Used for | Resolves to |
|----------------|----------|-------------|
| `ob.s.dimension.dynamic.ui_scale.container.xl.px` | Size | `ob.p.dimension.px.64` multiplied by the `ui_scale` multiplier |
| `ob.s.color.free.indigo.foreground.contrast_medium` | Active color | S1 lightness level |
| `ob.s.color.free.indigo.background.contrast_low` | Inactive color | S1 lightness level |
| `ob.s.border_radius.lg` | Border radius | `ob.p.dimension.px.4` |
| `ob.s.border_width.3xl` | Border width | `ob.p.dimension.px.16` |
| `ob.s.motion.duration.instant` | Speed and pause | `ob.p.motion.duration.instant` |

---

**Component Overview**: See [Spinner Overview](01-overview.md)
