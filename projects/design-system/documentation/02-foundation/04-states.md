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
- active (formerly "pressed"; renaming based on research, requires approval)
- active + focus (combined state, relevant for components like text input: field is focused, cursor is inside, component is in active state while typing)
- drag

---

## 3. Focus State

- unfocused
- focused (in Figma: boolean property, naming TBD: "Focus" or "Focused")

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

### b. Business-specific statuses
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

## Decisions

- [ ] Naming: "active" vs "pressed"
- [ ] Naming: "Focus" vs "Focused" (Figma boolean property)
- [ ] Include visited state in this concept or keep link-specific
- [ ] Include system process states
