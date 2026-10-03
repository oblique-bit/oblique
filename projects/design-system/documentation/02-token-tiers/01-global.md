# Global Tokens and Reference Hierarchy

Global tokens (`ob.g.*`) sit outside the strict tier-to-tier reference chain that governs the other levels. This page documents that exception.

## Cross-Level Referencing

Most levels reference only the tier directly below them. Global tokens are the exception: they can be referenced directly by any other level, including:

- **Semantic tokens** — e.g. `ob.s.dimension.dynamic.ui_scale.spacing.md.px` references `ob.g.mode_collection.ui_scale.multiplier.dimension.md`
- **Component tokens** (no component ships one yet in this release) — e.g. `ob.c.{component}.container.spacing.gap` would reference `ob.g.mode_collection.density.multiplier.dimension.standard`

This cross-level referencing is intentional and reflects the foundational role of global tokens: they define system-wide constants and settings that are agnostic to theming depth.

## Why Global Tokens Are an Exception

- Global tokens represent layout, viewport, and environment settings, such as breakpoints, device types, or scaling factors, which don't belong to any single visual level.
- Unlike Primitive, Semantic, and Component levels, which build a visual abstraction hierarchy, Global tokens are external inputs or configuration anchors that influence all levels.
- The typical reference chain (Primitive → Semantic → Component) does not constrain Global token usage: globals can be referenced from any level.

## Reference Rule

Global tokens (`ob.g.*`) can be consumed by any level (Primitive, Semantic, or Component) and are exempt from strict level-to-level reference rules. They act as system-level constants and may appear in token references wherever broader configuration is needed.

## Hierarchy Diagram

```
┌─────────────────┐
│  Global Tokens  │
│    (ob.g.*)     │
└─────┬─────┬─────┘
      │     │
      ▼     │
┌─────────────────┐
│Primitive Tokens │
│    (ob.p.*)     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│Semantic Tokens  │
│    (ob.s.*)     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│Component Tokens │
│    (ob.c.*)     │
└─────────────────┘
```

Global tokens can be referenced directly from any level, while Primitive, Semantic, and Component tokens follow the strict hierarchy shown by the vertical arrows.
