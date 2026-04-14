# Icon Component Architecture

## Component Overview

The icon component family is the foundational sizing layer for all icons in the Oblique design system. It consists of three specialized variants covering the full range of icon placement contexts: inside interactive components, inside static structural components, and inline within body text.

## Component Structure

```
04_component/atom/icon/
├── 01_color.json     — color token (ob.c.icon.color.fg)
└── 02_layout.json    — sizing tokens
    ├── ob.c.icon.static.size.*         — fixed sizes, no mode
    ├── ob.c.icon.component.size.*      — reacts to ui_scale mode
    └── ob.c.icon.inline_text.size.*    — reacts to typography_context mode
        └── ob.c.icon.inline_text.body.spacing.vertical.offset
```

## Variant Specifications

### icon-component

| Token | Mode | Default px |
|-------|------|-----------|
| `ob.c.icon.component.size.xs` | `ui_scale` | 16 |
| `ob.c.icon.component.size.sm` | `ui_scale` | 20 |
| `ob.c.icon.component.size.md` | `ui_scale` | 24 |
| `ob.c.icon.component.size.lg` | `ui_scale` | 32 |

Tokens reference `ob.s.dimension.dynamic.component_size.spacing.*` — they resolve to different values depending on which `ui_scale` mode is active on an ancestor frame.

### icon-static

| Token | Mode | px |
|-------|------|---|
| `ob.c.icon.static.size.xs` | none | 16 |
| `ob.c.icon.static.size.sm` | none | 20 |
| `ob.c.icon.static.size.md` | none | 24 |
| `ob.c.icon.static.size.lg` | none | 32 |

Tokens reference `ob.s.dimension.static.component_size.spacing.*` — static dimension tokens that do not react to any mode.

### inline-text

| Token | Mode | Value |
|-------|------|-------|
| `ob.c.icon.inline_text.size.body` | `typography_context` | matches body text |
| `ob.c.icon.inline_text.body.spacing.vertical.offset` | none | 2px / 0.125em |

The vertical offset corrects optical baseline misalignment between icons and adjacent capital letters. Figma uses 2px (px token); CSS implementation should use `0.125em` so the offset scales proportionally with the text size.

## Token Architecture Integration

Icon tokens sit in the `ob.c.*` component layer. They reference semantic dimension tokens from `ob.s.dimension.*`:

```
ob.c.icon.component.size.md
  → ob.s.dimension.dynamic.component_size.spacing.md.rem  (dynamic = mode-reactive)
      → ob.p.dimension.spacing.xl ...or... ob.p.dimension.spacing.md
        (resolved by active ui_scale mode: default=md, mini=xs, etc.)

ob.c.icon.static.size.md
  → ob.s.dimension.static.component_size.spacing.md.rem  (static = no mode)
      → ob.p.dimension.spacing.xl (always)
```

## Design Decisions

### Why three variants instead of flags?

Three distinct variants make intent explicit. A single component with a `mode-reactive` boolean would couple unrelated sizing behaviours into one token namespace and force every consumer to know which flag to set. Three named variants make the choice unavoidable and self-documenting.

### Why separate static from component?

Static and dynamic tokens resolve through different semantic dimension paths (`static` vs `dynamic`). Mixing them in one variant would require conditional token logic that the current token architecture does not support. Separate variants map cleanly to separate semantic token trees.

### Why does inline-text exist separately?

Inline text icons are sized relative to typography, not to ui_scale. They require a different mode relationship (`typography_context` instead of `ui_scale`). A separate variant makes this explicit and prevents a product designer from accidentally applying `ui_scale` to an inline icon.

---

**Component Overview**: See [Icon Overview](01-overview.md)  
**Implementation Details**: See [Icon Implementation Guide](03-implementation.md)  
**Usage Guidelines**: See [Icon Usage Guidelines](04-guidelines.md)
