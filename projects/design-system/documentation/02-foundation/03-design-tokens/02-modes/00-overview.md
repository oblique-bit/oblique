# Token Mode System

Navigation hub for the mode documentation in this folder.

## Master reference

**[Mode collections & resolution chain](./98-collections-and-resolution-chain.md)** — the single source of truth: every mode collection, how the colour/state chain resolves, the dimension/typography modes, per-mode definitions, and which component uses which.

## Per-mode docs

- [Lightness](./01-lightness.md) — light / dark theme
- [Emphasis](./02-emphasis.md) — high / low emphasis
- [UI Scale](./03-ui-scale.md) — sm / md / lg component sizing
- [Typography-Context](./04-typography-context.md) — interface / prose text
- [Density](./05-density.md) — compact / standard / spacious spacing
- [Responsiveness](./06-responsiveness.md) — desktop / mobile viewport
- [Modes interplay](./99-modes-interplay.md) — how modes interact

## How modes work

**Mode switching:** user modes (light/dark) switch at the S1 layer through file selection; components consume `ob.s` semantic tokens that reference different S1 files based on the active mode.

**Mode resolution:** when multiple files define the same token, the last file loaded wins ("last wins").
