# List Component Specification

**Version:** 0.1 (provisional)
**Date:** 2026-05-28
**Status:** Draft — token paths and variant set are still being agreed
**Purpose:** Component specification for designers and developers
**Audience:** Design system maintainers, UX designers, developers
**Related:** [Mode collections & resolution chain](../../02-foundation/03-design-tokens/02-modes/98-collections-and-resolution-chain.md), [States](../../02-foundation/04-states.md), [Text Components](../03-text-components/text-components.md), [Button](../01-button/button-overview.md)

---

## Overview

The List component renders a vertical collection of items that share a common anatomy and behavior. It is the canonical pattern for menus, navigation panes, settings groups, search results, selectable collections, and content indexes.

A List is **not** a layout primitive. It owns:

- Item-to-item rhythm (gap, dividers)
- Per-item interaction surface (hover/focus/press target)
- Selection semantics (none / single / multiple)
- Density and viewport response (via modes, not variants)

Layout outside the list (the surrounding container, page rhythm, paragraph spacing) is the responsibility of the parent surface — not the list.

> **Note on scope.** The list is a structural component. The visual style of an individual row's content (typography, link state, icon size) comes from text and icon components, not from list-specific overrides.

---

## Component Architecture

The List is one container plus one item primitive. Different *use cases* are different **variants** of the item, because their anatomy differs. Different *appearances* (hover, selected, disabled, compact, dark…) are **modes**, not variants — see [states as modes](../../02-foundation/04-states.md).

### Structure Mapping

**Figma Structure → Token Structure**
```
list/list_container          → list.container
list/list_item_simple        → list.item.simple
list/list_item_action        → list.item.action
list/list_item_selection     → list.item.selection
list/list_item_disclosure    → list.item.disclosure
```

---

## List Variants

### 1. list.container

The container holds the items, owns the divider strategy, and exposes selection semantics.

**Purpose & Rationale:**
- Owns vertical rhythm between items (gap or divider)
- Owns the bounding background and border (if any)
- Declares whether the list is selectable and how many items can be selected at once

**Figma component properties:**

| Property | Options | Default | Notes |
|----------|---------|---------|-------|
| `dividers` | `on` / `off` | `off` | When `on`, items are separated by a hairline; when `off`, items use gap only |
| `selection` | `none` / `single` / `multiple` | `none` | Drives which item variant is appropriate inside |
| `bounded` | `on` / `off` | `off` | When `on`, the container draws its own border and background; when `off`, it is transparent and inherits from the surface |

**Tokens (provisional):**

| Token | Purpose |
|-------|---------|
| `ob.h.list.container.spacing.gap` | Vertical gap between items when `dividers = off` |
| `ob.h.list.container.divider.color` | Divider color when `dividers = on` |
| `ob.h.list.container.divider.thickness` | Divider thickness |
| `ob.h.list.container.spacing.padding.vertical` | Container top/bottom padding when `bounded = on` |
| `ob.h.list.container.spacing.padding.horizontal` | Container side padding when `bounded = on` |
| `ob.h.list.container.color.bg` | Container background when `bounded = on` |
| `ob.h.list.container.color.border` | Container border when `bounded = on` |
| `ob.h.list.container.border_radius` | Container corner radius when `bounded = on` |

> **No selection state on the container.** Selection lives on items, not on the container.

---

### 2. list.item.simple

**Primary Use Case:** Static, non-interactive rows (read-only data, summaries, info lists).

**Purpose & Rationale:**
- No hover, focus, press, or selection — these modes do not apply
- Provides leading/trailing slots without implying actionability
- Cheaper anatomically than the action variant; do not use it as a stand-in for a disabled action

**Anatomy:**
```
list/list_item_simple
├── Leading slot      (optional: icon, avatar, status pill)
├── Content
│   ├── Primary text   (required)
│   └── Secondary text (optional)
└── Trailing slot      (optional: metadata text, icon, status pill)
```

**Modes that apply:** `lightness`, `emphasis`, `density`, `ui_scale`, `viewport`, `typography-context`. State modes (`selected`, `hover`, `focused`, `pressed`, `disabled`) do **not** apply.

---

### 3. list.item.action

**Primary Use Case:** Interactive rows that trigger an action or navigation when activated (menus, command palettes, settings entries).

**Purpose & Rationale:**
- The whole row is the click/touch target — not just the label
- Uses the full state mode set (`hover`, `focused`, `pressed`, `disabled`) — but **not** `selected`, because activation is transient, not persistent
- Disclosure indicator is optional (use `list.item.disclosure` when navigation away is implied)

**Anatomy:** same as `list.item.simple`, plus an interaction surface that covers the full row.

**Modes that apply:** all of `simple`, plus `hover`, `focused`, `pressed`, `disabled`.

> **Why no `selected` here?** Action items fire and are done. If the row needs to remain visually marked after activation, it is a selection — use `list.item.selection`.

---

### 4. list.item.selection

**Primary Use Case:** Rows that can be selected and remain visibly selected until deselected (filter lists, multi-select tables, side-nav with current page, picker menus).

**Purpose & Rationale:**
- Selection is **persistent**, not transient — the visual difference is owned by the `selected` mode collection, not by a key segment in the token path
- Single vs multiple selection is set on the container; the item variant is the same
- A checkbox or radio is optional and is rendered in the leading slot; selection state is independent of whether that affordance is shown

**Anatomy:**
```
list/list_item_selection
├── Leading slot      (optional checkbox, radio, icon)
├── Content
│   ├── Primary text
│   └── Secondary text (optional)
└── Trailing slot      (optional)
```

**Modes that apply:** all `action` modes plus `selected`. Combinations such as `selected + hover`, `selected + focused`, `selected + disabled` resolve through the standard mode resolution chain — there are no compound-segment tokens like `color.bg.selected.hovered`.

> **Why is `selected` a mode and not a segment?** See [states as modes](../../02-foundation/04-states.md). Any visual difference that can stack with other states (hover-while-selected, focused-while-selected, disabled-while-selected) must be a mode, or we get a combinatorial explosion of compound segments and lose orthogonality.

---

### 5. list.item.disclosure

**Primary Use Case:** Rows that navigate away from the current view (drill-down navigation, accordion headers, "open detail" rows).

**Purpose & Rationale:**
- Behaves like `list.item.action` but always shows a trailing disclosure indicator (chevron) to signal navigation
- The disclosure indicator is part of the variant — not an option on `action`, because its presence is a semantic promise ("activating this leaves the current context")

**Anatomy:**
```
list/list_item_disclosure
├── Leading slot      (optional)
├── Content
│   ├── Primary text
│   └── Secondary text (optional)
└── Disclosure icon   (required, trailing)
```

**Modes that apply:** same as `list.item.action`.

---

## Mode Coverage

| Mode collection | container | item.simple | item.action | item.selection | item.disclosure |
|-----------------|-----------|-------------|-------------|----------------|-----------------|
| `lightness` | yes | yes | yes | yes | yes |
| `emphasis` | yes | yes | yes | yes | yes |
| `ui_scale` | yes | yes | yes | yes | yes |
| `density` | yes | yes | yes | yes | yes |
| `viewport` | yes | yes | yes | yes | yes |
| `typography-context` | — | yes | yes | yes | yes |
| `hover` | — | — | yes | yes | yes |
| `focused` | — | — | yes | yes | yes |
| `pressed` | — | — | yes | yes | yes |
| `selected` | — | — | — | yes | — |
| `disabled` | — | — | yes | yes | yes |

> **No state modes on `container` or `item.simple`.** A container is not interactive; a simple item is not interactive. If interactivity is needed, choose `item.action`, `item.selection`, or `item.disclosure`.

---

## Token Architecture (Provisional)

### Per-item tokens (shared across action / selection / disclosure)

**Layout & Spacing:**
- `ob.h.list.item.spacing.padding.vertical`
- `ob.h.list.item.spacing.padding.horizontal`
- `ob.h.list.item.spacing.gap.leading` — gap between leading slot and content
- `ob.h.list.item.spacing.gap.trailing` — gap between content and trailing slot
- `ob.h.list.item.container.size.min_height`

**Visual Properties:**
- `ob.h.list.item.border_radius`
- `ob.h.list.item.border_width`

**Color (resolved through state mode collections, not segmented in the path):**
- `ob.h.list.item.color.fg.primary` — primary text foreground
- `ob.h.list.item.color.fg.secondary` — secondary text foreground
- `ob.h.list.item.color.bg`
- `ob.h.list.item.color.border`

> **Token path note.** The same `ob.h.list.item.color.bg` token resolves to different values when the `hover`, `focused`, `pressed`, `selected`, or `disabled` mode collection is switched on. There is intentionally no `ob.h.list.item.color.bg.hover` or `ob.h.list.item.color.bg.selected.hovered` token — that is the anti-pattern the states-as-modes model retires.

### Selection-only tokens

- `ob.h.list.item.selection.indicator.color` — the optional rail/marker some products use to show selection (only on `list.item.selection`)
- `ob.h.list.item.selection.indicator.thickness`

### Disclosure-only tokens

- `ob.h.list.item.disclosure.icon.size`
- `ob.h.list.item.disclosure.icon.color`

---

## Selection Behavior

| Container `selection` | Allowed item variant | Behavior |
|-----------------------|----------------------|----------|
| `none` | `simple`, `action`, `disclosure` | No item is ever in the `selected` mode |
| `single` | `selection` (and optionally `disclosure` for "current section" patterns) | At most one item is in the `selected` mode at a time |
| `multiple` | `selection` | Any subset of items may be in the `selected` mode |

> **Mixing `action` and `selection` items in the same container is not supported.** A list is either an action list or a selection list. If both are needed, use two lists or a different component (e.g., a settings group with a button row).

---

## Accessibility (Provisional)

- An interactive list is a `<ul>` (or `<ol>` if order is meaningful) of `<li>` elements with an interactive child (`<button>`, `<a>`, or `role="option"` inside a `role="listbox"` parent depending on use case).
- Selection lists use `role="listbox"` + `role="option"` with `aria-selected`. The `selected` mode mirrors `aria-selected="true"`.
- `disabled` items should be `aria-disabled="true"` — keep them in the tab order so screen readers can announce them; do **not** use `tabindex="-1"` to hide them.
- Focus indicator is owned by the existing focus-ring utility — see [focus_ring](../00-utilities/02-focus_ring/).
- See [a11y skill] before changing any of the above.

---

## Open Questions

These are intentionally left undecided until the component goes from provisional to v1:

1. **Drag-and-drop reordering.** Is it an additional item variant, a container mode, or out of scope for v1?
2. **Empty state.** Does the container own the empty-state slot, or is it the caller's responsibility?
3. **Section headers and grouping.** Are sticky group headers part of `list.container` or a separate `list.section` component?
4. **Virtualization / infinite scroll.** Is the loading row a variant of `list.item.simple` or a dedicated `list.item.loading`?
5. **Nested lists.** What is the indentation token, and does the indent come from the parent item or the nested container?

---

**Implementation Status:** Provisional draft — not production ready.
**Related Documentation:** [States](../../02-foundation/04-states.md) • [Mode collections & resolution chain](../../02-foundation/03-design-tokens/02-modes/98-collections-and-resolution-chain.md) • [Button](../01-button/button-overview.md) • [Text Components](../03-text-components/text-components.md)
