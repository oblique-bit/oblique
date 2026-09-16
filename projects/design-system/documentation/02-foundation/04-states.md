# States Concept

**Purpose**: Structural overview of state categories used across components  
**Audience**: Design system maintainers, UX designers, developers  
**Related**: Component tokens, interaction patterns

---

## Overview

States are organized into categories that can be combined. Focus exists on a separate layer and is combinable with other states (e.g., enabled + focused, visited + focused).

---

## 1. Component States

- enabled
- read-only
- disabled
- hidden

---

## 2. Interactive States

- default
- hover
- pressed
- pressed + focus (combined state, relevant for components like text input: field is focused, cursor is inside, component is in pressed state while typing)
- drag

---

## 3. Focus State

- unfocused
- focused (in Figma: boolean property named "Focus")

**Text inputs** have two focus indicators:
- **default** — for keyboard navigation (including typing after keyboard focus, ensures accessibility)
- **subtle** — for mouse navigation (including typing)

---

## 4. Selection States

- unselected
- selected
- indeterminate

---

## 5. Status States

### a. Basic (system) status states
- Information
- Error
- Warning
- Success
- Fatal (used only for Infobox)
- None (useful for describing flows and UI behavior)

### b. Free tier statuses
e.g., used in Pill component

### c. Input-specific info states
- Required unfilled
- Prefilled
- Autofilled
- AI-generated

---

## Notes

**Visited state** is link-specific and currently not covered by this states concept.

**System process states** (can be included in the next iteration):
- Idle
- Loading
- Processing
- Saving
- Submitting
- Empty
- Error

---

## Open Scope Questions

- Whether to bring the visited state into this concept or keep it link-specific
- Whether to bring system process states into this concept's next iteration
