# Token Mode System

Navigation hub for the mode documentation in this folder.

## Master reference

**[Mode collections & resolution chain](./98-collections-and-resolution-chain.md)** — the single source of truth: every mode collection (COR_ / STS_ / CMP_), the full resolution chain, per-mode definitions, and which component uses which.

## Per-mode docs

### Core (`COR_`)
- [COR_lightness](./01-lightness.md) — light · dark
- [COR_emphasis](./02-emphasis.md) — high · low
- [COR_scale](./03-ui-scale.md) — sm · md · lg component sizing
- [COR_typography](./04-typography-context.md) — interface · prose text
- [COR_density](./05-density.md) — compact · standard · spacious spacing
- [COR_viewport](./06-responsiveness.md) — xs · sm · md · lg · xl · 2xl

### Modes interplay
- [Modes interplay](./99-modes-interplay.md) — how modes interact

## Troubleshooting

- [Ghost variables & ghost collections](./97-ghost-variables.md) — why foreign library collections appear in the mode picker, how to find them, and how to remove them at the source

## How modes work

**Mode switching:** a mode set on a parent frame cascades to all descendant components that consume that collection. `COR_` and `STS_` collections cascade; `CMP_` collections are component-scoped and do not cascade.

**Mode resolution:** when multiple collections define an alias for the same token, the collection closest to the component (furthest down the chain) wins ("last wins").
