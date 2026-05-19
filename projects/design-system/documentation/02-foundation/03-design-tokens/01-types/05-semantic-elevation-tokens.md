# Semantic Elevation Tokens

**Version:** 0.3 (draft)
**Date:** 2026-05-18
**Status:** In stakeholder review — realigned to the modes model

---

## Overview

The semantic elevation tokens describe the visual depth of a surface relative to the page. They answer: *how high above the canvas does this thing sit?*

Each elevation level is a **paired token set**:

- **`ob.s.color.elevation.surface.*`** — the background colour of the level
- **`ob.s.shadow.elevation.*`** — the drop shadow that visually lifts it

Background and shadow are separate tokens — Figma / Tokens Studio cannot hold both in one variable (`$type: color` vs `$type: boxShadow`). A "level" is therefore a *named pairing* of the two, not a single token.

**Elevation is not a mode.** It is not an axis a designer flips. A component does not "set elevation" — its own per-state tokens *alias* an elevation level where applicable. The substrate a component rests on is carried separately, by the `surface` mode collection. See [Mode collections & resolution chain](../02-modes/98-collections-and-resolution-chain.md).

---

## Principles

1. **Use few levels.** Cap the system at four content surface levels. More levels invite over-shadowed UI and ambiguous hierarchy.
2. **Shadow has a function.** Each shadow communicates structure or hierarchy. Decorative shadow without a structural reason is not allowed.
3. **No strong, dominant shadows.** Shadows are subtle by default — depth, not drama. Heavy shadows overwhelm content.
4. **Elevation is reserved for interactivity, overlap, or focus.** A static element sitting in content does not need elevation. A floating dropdown, an interactive card on hover, or a modal claiming user focus does.

---

## How components consume elevation

Elevation tokens are **stateless named values**. A component's interaction-state tokens decide which level applies in which state — the state lives on the component, the elevation token it points to is plain.

```
card.bg     @ regular  → canvas
card.bg     @ hover    → raised
tooltip.bg  @ regular  → overlay
menu.bg                → overlay
```

There are no `*_hovered` / `*_pressed` elevation tokens. State is a mode of the component (the `interaction` collection); a component maps each of its states to whichever elevation level it should show. Some components stay on one level (a tooltip is always `overlay`); others change level by state (an interactive card is `canvas` at rest, `raised` on hover).

Any further background *tint* within a single level (e.g. a hovered row inside a menu) is the component's own colour tokens — not elevation.

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

The pairing is a system rule: a raised surface uses the raised shadow, an overlay surface uses the overlay shadow. Off-diagonal combinations are not part of the system. If a designer wants "shadow without lift", the answer is one of: use a border, move up to `raised`, or rethink the design intent.

---

## Truth Table

The complete token-to-value-to-component reference.

| Token | Aliases to | Components / use |
|---|---|---|
| `ob.s.color.elevation.surface.sunken` | `bg.contrast_low` | Wells, dashboard regions where cards sit, kanban column backdrops |
| `ob.s.color.elevation.surface.canvas` | `bg.contrast_lowest` | Page background, content area, body, flat cards (with border) |
| `ob.s.color.elevation.surface.raised` | `bg.contrast_lowest` + `shadow.elevation.raised` | Cards, expansion panels, sticky header / footer, nav tree, movable kanban cards, in-flow notifications, tables when elevated, drag-active state |
| `ob.s.color.elevation.surface.overlay` | `bg.contrast_lowest` + `shadow.elevation.overlay` | Modal, dialog, dropdown, menu, tooltip, popover, datepicker, FAB, floating toolbar, bottom sheet |
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

In light mode, `canvas`, `raised`, and `overlay` share the same surface colour (`bg.contrast_lowest`). The visual hierarchy comes entirely from the shadow + position, not from a tonal shift on the surface itself. Sunken is the only surface that visibly differs from canvas in light mode.

---

## Token Architecture

All elevation tokens follow Oblique's naming and architecture conventions:

- **Type segment present** — every path includes `color` or `shadow` immediately after the layer prefix (`ob.s.color.*`, `ob.s.shadow.*`). See [Token Types §R1](../04-token-types.md#r1--type-must-appear-in-the-token-path).
- **`$type` field correct** — surface tokens use `$type: color`; shadow tokens use `$type: boxShadow` (Tokens Studio convention required for Figma Effect Style export). See [Token Types §R2](../04-token-types.md#r2--path-segment-and-type-must-correspond).
- **Reference hierarchy** — semantic elevation tokens reference primitive bg-colour and shadow tokens. They are the **last public semantic level for background and shadow**: component tokens (`ob.h.*`, `ob.c.*`) alias elevation tokens, never the underlying neutral primitives directly.
- **Elevation tokens are stateless** — no `_hovered` / `_pressed` suffixes. State is expressed as a component mode; see [How components consume elevation](#how-components-consume-elevation).

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

`sunken` is darker than `canvas`. `raised` and `overlay` use the same surface colour as `canvas` and rely on shadow for visual lift.

### Dark mode

Dark-mode tonal lift — where raised / overlay surfaces become *lighter* than canvas to compensate for shadow rendering — is deferred to a later phase. The current surface aliases use the same neutral bg scale in both modes.

---

## What elevation is not

- **Not a mode.** Elevation is a set of stateless semantic tokens, not a mode collection. The inherited substrate *is* a mode (`surface`); the rise above it is not — it lives in component state tokens. See [Mode collections & resolution chain](../02-modes/98-collections-and-resolution-chain.md).
- **Not z-index.** Elevation describes visual depth (design intent). Stack order describes which element wins overlap conflicts (CSS implementation). The two are coordinated but separate token systems.
- **Not a numeric scale.** Elevation tokens are named by purpose (`sunken / canvas / raised / overlay`), not by number. A component must declare what it *is* (raised? overlay?), not just where it sits.
- **Not unbounded.** The system caps at four content levels. If a layout requires five nested surfaces, the design needs revisiting before a fifth level is added.

---

## Open items

- Naming clash: the bg tokens use a `surface` path segment (`ob.s.color.elevation.surface.*`) while `surface` is also a mode collection. Decide whether to rename the segment.
- Dark-mode tonal lift for `raised` / `overlay`.
- Overflow-shadow values pending production scroll-container UI.

---

**Document Maintainers:** Design System Team
**Review Schedule:** Quarterly
