# Semantic Elevation Tokens

**Version:** 0.2 (draft)
**Date:** 2026-05-08
**Status:** In stakeholder review

---

## Overview

The semantic elevation tokens describe the visual depth of a surface relative to the page. They answer: *how high above the canvas does this thing sit?*

Elevation is implemented through two coordinated, parallel token groups:

- **`ob.s.color.elevation.surface.*`** — the background color of the elevated area
- **`ob.s.shadow.elevation.*`** — the drop shadow that visually lifts the surface

Both groups live under the `elevation` namespace and are designed to be paired per level. Z-index (logical stacking order) is a separate concern handled by stack-order tokens — see [What elevation is not](#what-elevation-is-not).

---

## Principles

1. **Use few levels.** Cap the system at four content surface levels. More levels invite over-shadowed UI and ambiguous hierarchy.
2. **Shadow has a function.** Each shadow communicates structure or hierarchy. Decorative shadow without a structural reason is not allowed.
3. **No strong, dominant shadows.** Shadows are subtle by default — depth, not drama. Heavy shadows overwhelm content.
4. **Elevation is reserved for interactivity, overlap, or focus.** A static element sitting in content does not need elevation. A floating dropdown, an interactive card on hover, or a modal claiming user focus does.

---

## Token Groups

The semantic elevation tokens are organized into two top-level groups under the `elevation` namespace:

### Surface (`ob.s.color.elevation.surface.*`)

Background color tokens for the four elevation levels plus the backdrop. Each surface aliases the existing `ob.s.color.neutral.bg.contrast_*` scale.

```
ob.s.color.elevation.surface.sunken
ob.s.color.elevation.surface.canvas
ob.s.color.elevation.surface.canvas_hovered
ob.s.color.elevation.surface.canvas_pressed
ob.s.color.elevation.surface.raised
ob.s.color.elevation.surface.raised_hovered
ob.s.color.elevation.surface.raised_pressed
ob.s.color.elevation.surface.overlay
ob.s.color.elevation.surface.overlay_hovered
ob.s.color.elevation.surface.overlay_pressed
ob.s.color.elevation.surface.backdrop
```

Each surface token carries `inversity_normal` and `inversity_flipped` mode variants, e.g. `ob.s.color.elevation.surface.canvas.inversity_normal`.

### Shadow (`ob.s.shadow.elevation.*`)

Drop-shadow tokens that pair with the lifting surfaces. Each shadow aliases the existing `ob.s.shadow.*` scale.

```
ob.s.shadow.elevation.raised
ob.s.shadow.elevation.overlay
ob.s.shadow.elevation.overflow.spread
ob.s.shadow.elevation.overflow.perimeter
```

Surface and shadow live in separate type namespaces (`color` vs `shadow`) per the [token naming](../03-naming.md) rule that the type segment must immediately follow the layer prefix. The `elevation` umbrella name appears in both paths to mark the design intent.

---

## Surface Levels

Oblique defines four content surface levels plus a backdrop. Each level has a clear purpose and a single defensible use range.

| Level | Purpose | Example components |
|---|---|---|
| **sunken** | Recessed region. Holds elevated content underneath. | Wells, dashboard regions where cards sit, kanban column backdrops |
| **canvas** | The page itself. Baseline content surface. | Body, content area, page background, flat cards (paired with a border) |
| **raised** | Lifted in-layout surface. Part of the document flow, visually lifted via shadow. | Cards, expansion panels, sticky header / footer, nav tree, movable kanban cards, in-flow notifications, tables when elevated, drag-active states |
| **overlay** | Floating out-of-layout surface. Dismisses on outside click or ESC. | Modal, dialog, dropdown, menu, tooltip, popover, datepicker, FAB, floating toolbar, bottom sheet |
| **backdrop** | Alpha dim layer behind blocking overlays. Not a content surface. | Modal / dialog scrim |

### The raised vs overlay test

Three questions decide between `raised` and `overlay`:

| Question | raised | overlay |
|---|---|---|
| Is it part of the document flow? | yes | no |
| Does clicking outside dismiss it? | no | yes |
| Does it block interaction with the rest of the UI? | no | sometimes (modal-class) |

A card on a dashboard passes all three in the *raised* direction. A tooltip fails all three → *overlay*.

---

## Surface ↔ Shadow Pairings

| Surface level | Paired shadow | Notes |
|---|---|---|
| `surface.sunken` | — | No shadow. Recessed regions don't lift. |
| `surface.canvas` | — | No shadow. Use a border for flat-card visual definition if needed. |
| `surface.raised` | `shadow.elevation.raised` | Required pairing. |
| `surface.overlay` | `shadow.elevation.overlay` | Required pairing. Add `surface.backdrop` for modal-class overlays. |
| `surface.backdrop` | — | No shadow. Alpha dim only. |

The pairing is enforced as a system rule: a raised surface uses the raised shadow, an overlay surface uses the overlay shadow. Off-diagonal combinations are not part of the system. If a designer wants "shadow without lift", the answer is one of: use a border, move up to `raised`, or rethink the design intent.

---

## State Variants

`canvas`, `raised`, and `overlay` each ship with `_hovered` and `_pressed` variants for interactive surfaces.

| Token suffix | Maps to | Use |
|---|---|---|
| (rest) | `bg.contrast_lowest` | Default state |
| `_hovered` | `bg.contrast_low` | Hover state — subtle bg shift, paired shadow unchanged |
| `_pressed` | `bg.contrast_medium` | Pressed / active state — deeper bg shift, paired shadow unchanged |

Sunken and backdrop don't have state variants. Sunken is a passive backdrop region; backdrop is a non-interactive alpha dim.

---

## Truth Table

The complete token-to-value-to-component reference.

| Token | Aliases to | Components / use |
|---|---|---|
| `ob.s.color.elevation.surface.sunken` | `bg.contrast_low` | Wells, dashboard regions where cards sit, kanban column backdrops |
| `ob.s.color.elevation.surface.canvas` | `bg.contrast_lowest` | Page background, content area, body, flat cards (with border) |
| `ob.s.color.elevation.surface.canvas_hovered` | `bg.contrast_low` | Canvas-level interactive surface on hover |
| `ob.s.color.elevation.surface.canvas_pressed` | `bg.contrast_medium` | Canvas-level interactive surface on press |
| `ob.s.color.elevation.surface.raised` | `bg.contrast_lowest` + `shadow.elevation.raised` | Cards, expansion panels, sticky header / footer, nav tree, movable kanban cards, in-flow notifications, tables when elevated, drag-active state |
| `ob.s.color.elevation.surface.raised_hovered` | `bg.contrast_low` + `shadow.elevation.raised` | Card / panel on hover |
| `ob.s.color.elevation.surface.raised_pressed` | `bg.contrast_medium` + `shadow.elevation.raised` | Card / panel on press |
| `ob.s.color.elevation.surface.overlay` | `bg.contrast_lowest` + `shadow.elevation.overlay` | Modal, dialog, dropdown, menu, tooltip, popover, datepicker, FAB, floating toolbar, bottom sheet |
| `ob.s.color.elevation.surface.overlay_hovered` | `bg.contrast_low` + `shadow.elevation.overlay` | Overlay item on hover (e.g., dropdown row) |
| `ob.s.color.elevation.surface.overlay_pressed` | `bg.contrast_medium` + `shadow.elevation.overlay` | Overlay item on press |
| `ob.s.color.elevation.surface.backdrop` | `ob.p.color.cobalt_alpha.700` | Modal / dialog scrim — alpha dim only, not a content surface |
| `ob.s.shadow.elevation.raised` | `ob.s.shadow.md` | Pair with `surface.raised` |
| `ob.s.shadow.elevation.overlay` | `ob.s.shadow.lg` | Pair with `surface.overlay` |
| `ob.s.shadow.elevation.overflow.spread` | `ob.s.shadow.sm` | Soft scroll-cue shadow at vertical content cutoff |
| `ob.s.shadow.elevation.overflow.perimeter` | `ob.s.shadow.sm` | Edge scroll-cue shadow at horizontal content cutoff |

### Mental model

```
sunken    ── deeper bg, no shadow
canvas    ── page bg, no shadow
raised    ── same bg as canvas, + shadow (in layout)
overlay   ── same bg as canvas, + bigger shadow (out of layout)
backdrop  ── alpha dim, only for dialog (not a content surface)
```

In light mode, `canvas`, `raised`, and `overlay` share the same surface color (`bg.contrast_lowest`). The visual hierarchy comes entirely from the shadow + position, not from a tonal shift on the surface itself. Sunken is the only surface that visibly differs from canvas in light mode.

---

## Token Architecture

All elevation tokens follow Oblique's naming and architecture conventions:

- **Type segment present** — every path includes `color` or `shadow` immediately after the layer prefix (`ob.s.color.*`, `ob.s.shadow.*`). See [Token Types §R1](../04-token-types.md#r1--type-must-appear-in-the-token-path).
- **`$type` field correct** — surface tokens use `$type: color`; shadow tokens use `$type: boxShadow` (Tokens Studio convention required for Figma Effect Style export). See [Token Types §R2](../04-token-types.md#r2--path-segment-and-type-must-correspond).
- **Reference hierarchy** — semantic elevation tokens reference primitive bg-color and shadow tokens. No semantic-to-semantic skipping. See [Token Naming](../03-naming.md#valid-reference-hierarchy).
- **Compound identifiers** — state-variant tokens use lowercase + underscore (`canvas_hovered`, `raised_pressed`).

---

## Backdrop

The backdrop is a special-case surface that exists only behind blocking overlays.

- **Use it for**: modal / dialog backdrops where interaction with the rest of the UI must be blocked.
- **Do not use it for**: dropdowns, tooltips, popovers, menus, or any overlay that dismisses on outside click.
- **Value**: alpha-based dim, references `ob.p.color.cobalt_alpha.700` — semi-transparent so the underlying UI is still visible but visually muted.

---

## Overflow shadows

Two shadow-only tokens cue scrollable content at the cutoff edge.

- **`shadow.elevation.overflow.spread`** — soft spread at vertical content cutoff (top / bottom of a scroll container)
- **`shadow.elevation.overflow.perimeter`** — edge fade at horizontal content cutoff (left / right of a scroll container)

These are shadow-only; there is no paired surface. Values are provisional and subject to refinement once production scroll-container UI is finalized.

---

## Mode behavior

### Light mode

`sunken` is darker than `canvas`. `raised` and `overlay` use the same surface color as `canvas` and rely on shadow for visual lift.

### Dark mode

Surface tokens carry `inversity_normal` and `inversity_flipped` variants for mode switching. Dark-mode tonal lift — where raised / overlay surfaces become *lighter* than canvas to compensate for shadow rendering — is deferred to a later phase. The current surface aliases use the same neutral bg scale in both modes.

---

## What elevation is not

- **Not z-index.** Elevation describes visual depth (design intent). Stack order describes which element wins overlap conflicts (CSS implementation). The two are coordinated but separate token systems.
- **Not a numeric scale.** Elevation tokens are named by purpose (`sunken / canvas / raised / overlay`), not by number. A "level 3" component must declare what it *is* (raised? overlay?), not just where it sits.
- **Not unbounded.** The system caps at four content levels. If a layout requires five nested surfaces, the design needs revisiting before a fifth level is added.

---

**Document Maintainers:** Design System Team
**Review Schedule:** Quarterly
