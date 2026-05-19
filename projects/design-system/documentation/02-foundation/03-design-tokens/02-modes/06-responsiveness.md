# Responsiveness

**Status:** Current token architecture.

Responsiveness is handled by the **viewport** mode. The design system
defines six viewport ranges; tokens that depend on viewport resolve to a
different value per range.

## Viewport ranges

Six ranges — `xs`, `sm`, `md`, `lg`, `xl`, `2xl`. `xl` is the **base
viewport**: values resolve to `xl` until another viewport is selected.

| Viewport | Width range (px) |
|----------|------------------|
| xs       | 0 – 479 |
| sm       | 480 – 767 |
| md       | 768 – 1023 |
| lg       | 1024 – 1439 |
| xl       | 1440 – 1919  *(base)* |
| 2xl      | 1920 and up  *(open-ended)* |

Ranges never overlap — each range ends one pixel below the next range's
start.

## Tokens

### Breakpoints — `01_global/breakpoints.json`

- **`ob.g.breakpoints.{xs..2xl}`** — the six range-start values:
  `0 / 480 / 768 / 1024 / 1440 / 1920px`.

### Viewport ranges — `01_global/mode_collections.json`

- **`ob.g.mode_collections.viewports.{xs..2xl}`** — one entry per viewport,
  each with:
  - `name` — the CSS class for that viewport (`.ob-viewport-xs`, …). `xl`
    is the base, so its `name` is `default` (no class).
  - `from` — the range start; references the matching breakpoint.
  - `to` — the range end; the next breakpoint minus one pixel. `2xl` is
    open-ended and has no `to`.

### Page-container width — `03_semantic/dimension/viewport/`

- **`ob.s.dimension.viewport.min_width` / `max_width`** — the minimum and
  maximum width of the page-container component, per viewport. Defined one
  file per viewport (`xs.json` … `2xl.json`); each resolves to that
  viewport's `from` / `to`.

## Activating a viewport

`xl` is the base and renders with no viewport class. For every other
viewport, the application adds that viewport's class to `<body>`
(`.ob-viewport-xs`, `.ob-viewport-sm`, …). Token values scoped to the
active viewport then resolve.

## In Figma

The `viewport` theme group exports as a Figma variable collection with six
modes (`xl`, `xs`, `sm`, `md`, `lg`, `2xl`). `xl` is the first mode, so it
is the collection's default. `min_width` and `max_width` are variables in
that collection, holding one value per mode.

---

**Related:** [Token mode system](./00-modes-overview.md).
