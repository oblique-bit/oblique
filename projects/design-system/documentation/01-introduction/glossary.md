# Glossary
**Version:** 1.0  
**Date:** September 9, 2025  
**Status:** Work in Progress - Not Yet Approved by Product Owner  
**Purpose:** Definitions of key terms and concepts in the Oblique Design System

---

## Core Concepts

### **Token**
A named entity that stores visual design attributes (colors, spacing, typography, etc.) in JSON format. Tokens are the fundamental building blocks of design systems, providing a systematic way to manage design decisions across platforms and tools.

**Context:** Used when discussing:
- JSON files and token management
- Tokens Studio workflows
- Code implementation
- Cross-platform design consistency

**Example:** `ob.c.tag.color.bg.enabled.inversity_normal`

### **Variable**
A reusable value in Figma that can be applied to design properties. Variables are Figma's implementation of design tokens within the Figma environment, allowing for systematic design updates and mode switching.

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

### **Babushka Principle**
A hierarchical inheritance principle where smaller components (children) inherit properties from larger components (parents), similar to Russian nesting dolls. This creates systematic relationships between components of different sizes.

**Application:** Component sizing, spacing relationships, and systematic scaling across the design system.

### **Inversity**
The systematic approach to color contrast management in the Oblique Design System. Instead of traditional light/dark modes, inversity provides normal and flipped variants for every color token to ensure proper contrast relationships.

**Implementation:** 
- `inversity_normal` - Standard contrast relationships
- `inversity_flipped` - Inverted contrast relationships
- Stored flat in color tokens, not as variable modes

### **Mode (Figma Context)**
A set of values for variables in a collection that represents a specific design context. Modes allow switching between different contexts (sizes, themes, languages) without recreating components.

**Examples:**
- Size modes: `sm/md/lg`
- Context modes: `input_mode/filter_mode`
- Theme modes: `light/dark`

### **Collection (Figma Context)**
A group of related variables and their modes. Collections organize variables by purpose or domain (e.g., colors, spacing, typography).

**Organization:** Can contain up to 5,000 variables with groups for further organization.

---

## Component Architecture

### **Component Mode**
Distinct behavioral and visual variants of a component that serve different use cases while maintaining the same fundamental identity.

**Examples:**
- `tag.input_mode` - Tags within form inputs
- `tag.filter_mode` - Tags for filtering interfaces

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
The systematic naming pattern used throughout the Oblique Design System:
```
ob.{category}.{component}.{property}.{variant}.{state}.{inversity}
```

**Examples:**
- `ob.c.tag.color.bg.enabled.inversity_normal`
- `ob.c.button.remove.size.sm`
- `ob.s.spacing.component.sm`

### **Token Categories**
- **`c`** - Component tokens
- **`s`** - System/03_semantic tokens  
- **`g`** - Global/02_primitive tokens
- **`t`** - Typography tokens

---

## Workflow Terminology

### **Variables-First Approach**
The modern strategy (2025) of using Figma variables as the primary method for component property control, with strategic use of variants only for Figma-specific functions.

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

- **Token Architecture:** `../03-design-tokens/` - Detailed token structure and naming
- **Component Documentation:** `../04-components/` - Individual component specifications  
- **Figma Workflows:** `../07-workflow/consumers/figma-component-creation.md` - Variable and variant usage
- **System Overview:** `./system-overview.md` - High-level design system concepts
