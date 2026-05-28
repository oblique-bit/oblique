# States Concept

> **Status: Provisional — under active review.** Several naming and structural decisions in this concept are still open. This overview will be revised once the next round of decisions is approved.

**Purpose**: Structural overview of state categories used across components  
**Audience**: Design system maintainers, UX designers, developers  
**Related**: Component tokens, interaction patterns, [Mode collections & resolution chain](./03-design-tokens/02-modes/98-collections-and-resolution-chain.md)

---

## Overview

States are implemented as mode collections (`STS_` prefix). Each category below corresponds to one mode collection; multiple collections can be active simultaneously on a component (e.g. `STS_availability = enabled` + `STS_focus = focused`).

---

## 1. STS_availability

Availability of the component for interaction.

- `enabled` — focusable and editable; available for interaction
- `disabled` — not focusable and not editable
- `read_only` — focusable but not editable

---

## 2. STS_interaction

Pointer and keyboard interaction feedback.

- `rest` — resting state; no interaction feedback
- `hover` — pointer is over an enabled element; not reachable by keyboard or touch
- `active` — transient state while the element is pressed (a.k.a. pressed / down)
- `drag` — the element is being dragged

---

## 3. STS_focus

Input focus state.

- `focused` — element holds input focus; triggered by mouse, touch or keyboard
- `unfocused` — element does not hold input focus

**Text inputs** have two focus indicators:
- **default** — for keyboard navigation (including typing after keyboard focus)
- **subtle** — for mouse navigation (including typing after mouse click)

---

## 4. STS_selection

Persistent selection state.

- `selected` — persistent choice; element stays chosen or its associated view is active
- `unselected` — element is not chosen
- `indeterminate` — mixed / partial selection (e.g. a checkbox group); announced to screen readers as "partially checked"

---

## 5. STS_feedback

Semantic feedback signal — used by components that communicate a system outcome (Infobox, Badge, Pill). Components with no feedback signal do not consume this collection.

- `info` — neutral, informational meaning
- `resolved` — positive outcome (e.g. validation passed)
- `attention` — cautionary meaning; not used for validation errors
- `critical` — negative outcome (an error)
- `fatal` — most severe meaning (e.g. Infobox-level failure)

### Business-specific statuses
e.g. used in Pill component — additional values documented with the component.

---

## 6. STS_process

Async lifecycle state — is the operation in progress?

- `loaded` — operation completed and content is present; resting state
- `loading` — async operation in progress; interaction suppressed
- `empty` — operation completed but returned no content
- `failed` — operation did not complete (e.g. network or data error)

**Note on orthogonality:** `STS_feedback` and `STS_process` are orthogonal — a component can be `loading` and `critical` at the same time. They must remain separate collections (one collection = one active mode at a time).

---

## Component-specific states (`CMP_`)

Some states are scoped to a single component type and are not cascading:

| Collection | Modes | Component |
|---|---|---|
| `CMP_input` | required · autofilled · aifilled | Input fields |
| `CMP_link` | standard · visited | Link |
| `CMP_button` | primary · secondary · tertiary | Button |

---

## Notes

**Visited state** is link-specific — `CMP_link · visited`.

**Collapsed/expanded** is component-level (Accordion, Dropdown, Menu) — documented with each component, not as a core state collection.

---

## Decisions

- [ ] Naming: `active` vs `pressed` (`STS_interaction`)
- [ ] Naming: "Focus" vs "Focused" (Figma boolean property name)
- [ ] `COR_viewport` exact px breakpoint values
