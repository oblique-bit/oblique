# Component Identification Guidelines

**About this document:** Before researching a component, we validate its use case, name, type, and role. Our design system adopted names from sources like Angular Material, which may no longer align with standards, making benchmarking harder. This document also keeps the scope focused on components, avoiding user flow patterns for efficiency.

---

## Purpose and Role

| Question | Details |
|----------|---------|
| **What is the purpose and role of this component?** | |
| **Where and how is this component used?** | |

---

## Naming

| Question | Details |
|----------|---------|
| ☐ **Is the name clear and aligned with industry naming conventions?** | Ensure the name is widely understandable and not misleading. |
| ☐ **Is the name consistent with the other Oblique components?** | Similar length, writing style. |
| **List component synonyms for easier identification and research** | |

---

## Structure, Classification, Scope

### Does this component belong in the core design system? If yes, at what level?

#### ☐ **Yes, core design system**

| Type | Example |
|------|---------|
| ☐ **Atom** | Smallest unit (e.g., button, input, checkbox). |
| ☐ **Molecule** | Group of atoms forming an interaction (e.g., input + label + validation). |
| ☐ **Organism** | A complex UI block with multiple molecules (e.g., card, navigation bar). |

#### ☐ **No. It is beyond core components; out of scope for redesign project**

| Type | Example |
|------|---------|
| ☐ **Template** | A reusable structure/layout for a common use case. |
| ☐ **User flow** | A sequence of screens forming a complete task (e.g., search + results). |

---

## Next Step

| Action | When to use |
|--------|-------------|
| ☐ **Keep name and place as is** | If the component is correctly classified and named. |
| ☐ **Rename or reorganize** | If the naming is unclear or misleading. |
| ☐ **Merge with another component** | If it's redundant and can be combined with an existing one. |
| ☐ **Split into smaller components** | If it's too large and should be broken down. |

---

*Last updated: August 5, 2025 - Converted from Confluence format*
