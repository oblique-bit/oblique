# Glossary
Definitions of key terms and concepts in the Oblique Design System.

---

## Core Concepts

### **Token**
A named entity that stores a visual design attribute (color, spacing, typography, etc.) in JSON format — the fundamental building block for managing design decisions systematically across platforms and tools.

**Context:** Used when discussing:
- JSON files and token management
- Tokens Studio workflows
- Code implementation
- Cross-platform design consistency

**Example:** `ob.h.link.color.hover`

### **Variable**
A reusable value in Figma that can be applied to design properties — Figma's implementation of design tokens, enabling systematic design updates and mode switching.

**Context:** Used when discussing:
- Figma workflows and component creation
- Design handoffs and Figma-specific processes
- Variable modes and collections
- Figma component properties

**Example:** `tag-color-bg` (Figma variable name)

### **Relationship: Tokens ↔ Variables**
- **Token** ≈ **Variable** (almost the same concept, different contexts)
- **Tokens** live in JSON files and development environments
- **Variables** live in Figma and design workflows
- Both represent the same design decisions, just in different tools
- Variables often map 1:1 to tokens for systematic consistency

---

## Design System Architecture

### **Inversity**
Oblique's approach to color contrast management. Instead of traditional light/dark modes, inversity provides normal and flipped variants for every color token to ensure proper contrast relationships.

**Implementation:** 
- `inversity_normal` - Standard contrast relationships
- `inversity_flipped` - Inverted contrast relationships
- Stored flat in color tokens, not as variable modes

### **Mode**
A single value within a mode collection — `light`, `dark`, `sm`, `md`, `lg`, `compact`, `standard`, `spacious`, `xs`, `2xl`, and so on. Switching a mode swaps one collection's active value; tokens scoped to that collection re-resolve accordingly.

**Examples:**
- in the `lightness` collection: `light`, `dark`
- in the `ui_scale` collection: `sm`, `md`, `lg`
- in the `viewport` collection: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`

### **Mode collection**
An axis along which the design system varies — a named group of mutually exclusive modes that the user, the device, or the application switches between. The Oblique Design System has seven mode collections: `lightness`, `emphasis`, `ui_scale`, `density`, `typography_context`, `motion`, `viewport`. In Figma, each mode collection surfaces as a Figma variable collection with one Figma mode per Oblique mode.

### **Collection (Figma context)**
A Figma-specific term — a group of related variables and their modes. Every Oblique mode collection surfaces as a Figma variable collection, but "collection" by itself in Figma can also describe non-mode groupings.

---

## Component Architecture

### **Modable Property**
A component property where the identity and intent remain the same, but the attribute or value changes based on context.

**Characteristics:**
- Same functional purpose across contexts
- Systematic value relationships
- Suitable for variable mode implementation

**Examples:**
- Size: same button, different dimensions
- Context: same tag, different usage scenarios

---

## Token Structure

### **Token Naming Convention**
The naming pattern used across the Oblique Design System:
```
ob.{tier}.{category}.{...path}
```

The `{tier}` segment identifies the token's layer; the rest of the path varies by token kind. See `../02-foundation/02-design-tokens/03-naming.md` for the full conventions.

**Examples:**
- `ob.h.link.color.hover`
- `ob.s.color.neutral.fg.contrast_high.inversity_normal`
- `ob.g.mode_collection.viewport.css_selector.xs`

### **Token Tiers**
Four tiers; the top one splits into two peer branches by component origin, not a fifth sequential tier.
- **`g`** — Global (`ob.g.*`) — system-wide configuration: mode collections, multipliers, component-level mode overrides.
- **`p`** — Primitive (`ob.p.*`) — atomic, context-agnostic values: colour scales, dimension scales, motion, typography primitives.
- **`s`** — Semantic (`ob.s.*`, `ob.s1.*`, `ob.s2.*`) — mode-aware, role-based tokens.
- **`c`** / **`h`** — Component, split by origin:
  - **`c`** — Custom Oblique component (`ob.c.*`) — tokens owned by components built specifically for Oblique.
  - **`h`** — Native HTML element (`ob.h.*`) — tokens for elements provided by HTML markup (button, link, typography).

---

## Workflow Terminology

### **Variables-First Approach**
The modern (2025) strategy of using Figma variables as the primary method for component property control, reserving variants for Figma-specific functions.

**Benefits:** Token traceability, developer alignment, system scalability

### **Hybrid Variables+Variants Strategy**
The balanced approach using:
- **Variables** for systematic properties (sizes, colors, systematic modes)
- **Variants** for Figma-specific functions (interaction states, prototyping)

### **Design Token**
The W3C standard term for named entities that store visual design attributes. In our context, tokens are the authoritative source of design decisions implemented across tools and platforms.

### **Aliasing**
The practice of having one variable reference another variable, enabling hierarchical token relationships and systematic design token implementation.

**Example:** A component color token referencing a semantic color token, which references a primitive color value.

---

## Related Documentation

- **Token Architecture:** `../02-design-tokens/` - Detailed token structure and naming
