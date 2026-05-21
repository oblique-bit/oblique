# Viewport Mode

**Status:** Current token architecture.

The **viewport** mode collection is how the design system handles
responsiveness. It defines six viewport modes — one per width range — and
tokens scoped to viewport resolve to a different value per mode.

## Viewport ranges

Six modes, one per width range — `xs`, `sm`, `md`, `lg`, `xl`, `2xl`.
`xl` is the **base viewport**: values resolve to `xl` until another
viewport is selected.

| Viewport | Width range (px)            |
|----------|-----------------------------|
| xs       | 0 – 479                     |
| sm       | 480 – 767                   |
| md       | 768 – 1023                  |
| lg       | 1024 – 1439                 |
| xl       | 1440 – 1919  *(base)*       |
| 2xl      | 1920 and up  *(open-ended)* |

Ranges never overlap — each range ends one pixel below the next range's
start.

## Tokens

The viewport mode-collection tokens live in
`01_global/mode_collection/viewport.json`, in three families —
breakpoints, ranges, and CSS selectors. The page-container widths are
semantic tokens in `03_semantic/dimension/viewport/`.

### Breakpoints

- **`ob.g.mode_collection.viewport.breakpoint.{xs..2xl}`** — the lower
  boundary of each range: `0 / 480 / 768 / 1024 / 1440 / 1920px`. The
  range bounds reference these primitives.

### Ranges

- **`ob.g.mode_collection.viewport.range.{xs..2xl}`** — the bounds of each
  range, with two entries:
  - `from` — range start, inclusive; references the matching breakpoint.
  - `to` — range end, inclusive; one pixel below the next breakpoint.
    `2xl` is open-ended and has no `to`.

### CSS selectors

- **`ob.g.mode_collection.viewport.css_selector.{xs..2xl}`** — the class
  the application adds to `<body>` to activate each viewport
  (`.ob-viewport-xs`, `.ob-viewport-sm`, …). `xl` is the base, so its
  value is `default` — no class.

### Page-container width — `03_semantic/dimension/viewport/`

- **`ob.s.dimension.viewport.min_width` / `max_width`** — the minimum and
  maximum width of the page-container component, per viewport. One file
  per viewport (`xs.json` … `2xl.json`). `min_width` resolves to the
  range's `from`, `max_width` to its `to`. `2xl` is open-ended, so its
  `max_width` is a `99999px` sentinel.

## Activating a viewport

`xl` is the base and renders with no viewport class. For every other
viewport, the application adds that viewport's `css_selector` class to
`<body>` (`.ob-viewport-xs`, `.ob-viewport-sm`, …). Token values scoped
to the active viewport then resolve.

## In Figma

The viewport mode collection surfaces as a Figma variable collection with
six modes (`xl`, `xs`, `sm`, `md`, `lg`, `2xl`). `xl` is the first mode,
so it is the collection's default. The page-container `min_width` and
`max_width` surface as variables holding one value per viewport mode.

---

**Related:** [Token mode system](./00-modes-overview.md).
