# Icon Component Architecture

> Working version on the development line (git branch `tokens-dev`). The icon tokens are not part of Oblique 16.

## Component Overview

The icon component family is the foundational sizing layer for all icons in Oblique DS. It consists of three specialized variants covering the full range of icon placement contexts: inside interactive components, inside static structural components, and inline within body text.

## Component Structure

```
04_component/atom/icon/
├── 01_color.json     — color token (ob.c.icon.color.fg)
└── 02_layout.json    — sizing tokens
    ├── ob.c.icon.static.size.*                — fixed sizes, no mode
    ├── ob.c.icon.ui_scale.size.*              — reacts to ui_scale mode
    ├── ob.c.icon.typography_context.size.*    — reacts to typography_context mode
    └── ob.c.icon.inline_text.body.spacing.vertical.offset
```

## Variant Specifications

### icon-component

| Token | Mode | Default px |
|-------|------|-----------|
| `ob.c.icon.ui_scale.size.xs` | `ui_scale` | 16 |
| `ob.c.icon.ui_scale.size.sm` | `ui_scale` | 20 |
| `ob.c.icon.ui_scale.size.md` | `ui_scale` | 24 |
| `ob.c.icon.ui_scale.size.lg` | `ui_scale` | 32 |

Tokens reference `ob.s.dimension.dynamic.ui_scale.spacing.*` — they resolve to different values depending on which `ui_scale` mode is active on an ancestor frame. The multipliers are 0.8 (sm), 1 (md, default) and 1.25 (lg), rounded to whole pixels: the `md` icon is 19 px in mode sm, 24 px in md and 30 px in lg.

### icon-static

| Token | Mode | px |
|-------|------|---|
| `ob.c.icon.static.size.xs` | none | 16 |
| `ob.c.icon.static.size.sm` | none | 20 |
| `ob.c.icon.static.size.md` | none | 24 |
| `ob.c.icon.static.size.lg` | none | 32 |

Tokens reference `ob.s.dimension.static.ui_scale.spacing.*` — static dimension tokens that do not react to any mode.

### inline-text

| Token | Mode | Value |
|-------|------|-------|
| `ob.c.icon.typography_context.size.body` | `typography_context` | 16 px in `interface`, 20 px in `prose` |
| `ob.c.icon.inline_text.body.spacing.vertical.offset` | none | 2px / 0.125em |

The vertical offset corrects optical baseline misalignment between icons and adjacent capital letters. Figma uses 2px (px token); CSS implementation should use `0.125em` so the offset scales proportionally with the text size.

## Token Architecture Integration

Icon tokens sit in the `ob.c.*` component layer. They reference semantic dimension tokens from `ob.s.dimension.*`:

```
ob.c.icon.ui_scale.size.md
  → ob.s.dimension.dynamic.ui_scale.spacing.md.px  (dynamic = mode-reactive)
      → roundTo(ob.p.dimension.px.24 × ui_scale multiplier, 0)
        (the multiplier comes from the active ui_scale mode: sm 0.8, md 1 (default), lg 1.25)

ob.c.icon.static.size.md
  → ob.s.dimension.static.ui_scale.spacing.md.px  (static = no mode)
      → ob.p.dimension.px.24 (always)
```

The icon size tokens use the `.px` variants: icons are pixel-perfect, and Figma number variables have no unit, so a `.rem` sibling would arrive in Figma as the same number as its `.px` sibling. The inline text size uses a `typography_context` token, which has no `.px` or `.rem` pair. See [Dimension Tokens](../../03-token-categories/00-dimension.md).

## Design Decisions

### Why three variants instead of flags?

Three distinct variants make intent explicit. A single component with a `mode-reactive` boolean would couple unrelated sizing behaviours into one token namespace and force every consumer to know which flag to set. Three named variants make the choice unavoidable and self-documenting.

### Why separate static from component?

Static and dynamic tokens resolve through different semantic dimension paths (`static` vs `dynamic`). Mixing them in one variant would require conditional token logic that the current token architecture does not support. Separate variants map cleanly to separate semantic token trees.

### Why does inline-text exist separately?

Inline text icons are sized relative to typography, not to ui_scale. They require a different mode relationship (`typography_context` instead of `ui_scale`). A separate variant makes this explicit and prevents a product designer from accidentally applying `ui_scale` to an inline icon.

---

**Component Overview**: See [Icon Overview](01-overview.md)
