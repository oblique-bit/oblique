# Component Tokens
**Version:** 1.0  
**Date:** September 2, 2025  
**Status:** Work in Progress - Not Yet Approved by Product Owner  
**Purpose:** Define component token patterns and consumption guidelines

**About this document:** This document defines component token patterns, naming conventions, and consumption guidelines for the Oblique Design System.

**Scope:** Component-specific token creation, naming patterns, hierarchical relationships, and standard practices.

---

## What Are Component Tokens?

Component tokens are the top level of the token hierarchy, providing component-specific styling definitions that reference 03_semantic tokens. They describe **component-specific styling patterns**, not visual appearance.

**Component Token Purpose:**
- Define component-specific styling patterns
- Establish variant systems within components  
- Provide component-level abstraction over 03_semantic tokens
- Enable component-specific theming and customization
- Act as a shield to protect developers from changes when refactoring happens only on config, primitive or 03_semantic token level

## Component Token Levels

The Oblique Design System uses **two distinct component token levels**:

### **ob.c.* - Custom Oblique Components**
Custom components built specifically for the Oblique Design System with unique styling patterns and behaviors.

```
ob.c.{component}.{category}.{property}.{variant}.{state}
│   │  │           │          │          │         │
│   │  │           │          │          │         └─ Modifier
│   │  │           │          │          └─ Component variant
│   │  │           │          └─ Visual property
│   │  │           └─ Token category
│   │  └─ Custom component identifier
│   └─ Custom component level
└─ Oblique namespace
```

**Examples:** `ob.c.icon.color.fg`, `ob.c.badge.color.bg.critical.enabled`, `ob.c.infobox.color.surface.error`

### **ob.h.* - HTML Components and Elements**
Native HTML elements and components that require consistent styling across the design system.

```
ob.h.{element}.{category}.{property}.{variant}.{state}
│   │  │         │          │          │         │
│   │  │         │          │          │         └─ Modifier
│   │  │         │          │          └─ Element variant
│   │  │         │          └─ Visual property
│   │  │         └─ Token category
│   │  └─ HTML element identifier
│   └─ HTML component level
└─ Oblique namespace
```

**Examples:** `ob.h.button.color.fg.primary.inversity_normal.enabled`, `ob.h.link.color.default`, `ob.h.list.single_item.spacing.marker_gap`, `ob.h.typography.style.heading.H1`

---

## Variant Values and Component Defaults

### **Component Variant Values**

Many components support multiple variant values for properties like size, spacing, typography, and other dimensions. These variants enable flexible component usage while maintaining design consistency.

**Common Variant Categories:**
- **Size variants**: `lg` (large), `md` (medium), `sm` (small), `xs` (extra-small)
- **Spacing variants**: `tight`, `comfortable`, `spacious`  
- **Typography variants**: `heading`, `body`, `caption`
- **Emphasis variants**: `primary`, `secondary`, `tertiary`

### **Token Structure for Variant Values**

**Size Variants Example:**
```json
{
  "ob.h.button.label_icon.container.size.min_height.lg": {
    "$value": "{ob.s.dimension.dynamic.ui_scale.element.lg.rem}",
    "$description": "Large button height variant"
  },
  "ob.h.button.label_icon.container.size.min_height.md": {
    "$value": "{ob.s.dimension.dynamic.ui_scale.element.md.rem}",
    "$description": "Medium button height variant (default)"
  },
  "ob.h.button.label_icon.container.size.min_height.sm": {
    "$value": "{ob.s.dimension.dynamic.ui_scale.element.sm.rem}",
    "$description": "Small button height variant"
  }
}
```

**Typography Variables Example:**
```json
{
  "ob.c.card.typography.title.heading": {
    "$value": "{ob.s.typography.grouped.dynamic.md.bold}",
    "$description": "Card title using heading typography"
  },
  "ob.c.card.typography.title.body": {
    "$value": "{ob.s.typography.grouped.dynamic.md.normal}",
    "$description": "Card title using body typography (default)"
  }
}
```

### **Default Value Strategy**

Component tokens establish **default values** to ensure visual consistency, interaction behavior consistency, and simplified workflows for design system consumers.

**Why Defaults Matter:**
- **Visual Consistency**: Ensures components look cohesive when used without explicit variant specification
- **Behavioral Consistency**: Provides predictable interaction patterns across the design system
- **Developer Experience**: Reduces cognitive load by providing sensible defaults
- **Design Workflow**: Accelerates design process with ready-to-use component configurations

### **Default Naming Conventions**

**NEVER use "default" as a variant name** - This overwrites the actual distinctive name and makes the specific variant invisible.

**DO use descriptive variant names** - Use the actual 03_semantic name (e.g., `md`, `body`, `primary`) and establish defaults through:

1. **Token Documentation**: Clear description indicating default status
2. **Figma Component Setup**: Default variant selection in component properties
3. **Code Implementation**: Default props/values in component libraries  
4. **Design Guidelines**: Documentation specifying default usage patterns

### **Default Indication Methods**

**In Token Descriptions:**
```json
{
  "ob.h.button.label_icon.container.size.min_height.md": {
    "$value": "{ob.s.dimension.dynamic.ui_scale.element.md.rem}",
    "$description": "Medium button height variant (default)"
  }
}
```

**In Figma Components:**
- Set the default variant as the primary option in component properties
- Add visual indicators (TBD: specific characters or wording) to signal default variants
- Use default variant selection in component instances

**In Code Implementation:**
```typescript
interface ButtonProps {
  size?: 'lg' | 'md' | 'sm'; // md is default
  variant?: 'primary' | 'secondary' | 'tertiary'; // primary is default
}

const Button: React.FC<ButtonProps> = ({ 
  size = 'md',      // Default size
  variant = 'primary', // Default variant
  ...props 
}) => {
  // Component implementation
};
```

**In Design Guidelines:**
```markdown
### Button Component
**Default Configuration:**
- Size: Medium (`md`)
- Variant: Primary (`primary`)
- State: Enabled (`enabled`)

Use the default configuration for most use cases. Override only when specific design requirements demand alternative variants.
```

### **Variant Value Examples**

**Button Size Variables:**
```json
{
  "ob.h.button.label_icon.container.size.min_height.lg": {
    "$value": "48px",
    "$description": "Large button height for prominent actions"
  },
  "ob.h.button.label_icon.container.size.min_height.md": {
    "$value": "40px", 
    "$description": "Medium button height - standard default size"
  },
  "ob.h.button.label_icon.container.size.min_height.sm": {
    "$value": "32px",
    "$description": "Small button height for compact layouts"
  },
  "ob.h.button.label_icon.spacing.padding.horizontal.md": {
    "$value": "16px",
    "$description": "Medium button horizontal padding (default)"
  },
  "ob.c.card.spacing.padding.comfortable": {
    "$value": "24px",
    "$description": "Comfortable card padding for most content"
  },
  "ob.c.card.spacing.padding.tight": {
    "$value": "16px",
    "$description": "Tight card padding for dense layouts (default)"
  },
  "ob.c.card.spacing.padding.spacious": {
    "$value": "32px",
    "$description": "Spacious card padding for important content"
  }
}
```

### **Default Selection Criteria**

**Choose defaults based on:**

1. **Usage Frequency**: Most common use case becomes the default
2. **Visual Hierarchy**: Medium sizes often provide optimal visual balance
3. **Accessibility**: Ensure defaults meet accessibility requirements  
4. **Brand Guidelines**: Align with brand personality and visual identity
5. **User Research**: Base decisions on actual usage patterns and user testing

**Size Defaults (typical patterns):**
- **Buttons**: Medium (`md`) - balances prominence and space efficiency
- **Typography**: Body text (`body`) - optimal reading experience
- **Spacing**: Comfortable (`comfortable`) - good balance of density and breathing room
- **Emphasis**: Primary (`primary`) - most common interaction pattern

### **Variant Value Documentation**

Each variable value should include:

```json
{
  "ob.h.input.container.size.height.md": {
    "$value": "40px",
    "$description": "Medium input height - default size providing optimal touch targets and visual balance",
    "$extensions": {
      "accessibility": "Meets 44px minimum touch target when including border and margin",
      "usage": "Default size for most form contexts",
      "figma": "Set as default variant in Figma component properties"
    }
  }
}
```

**Required Documentation:**
- **$description**: Clear explanation of the variant and default status
- **Usage context**: When to use this variant vs alternatives  
- **Accessibility notes**: How the variant supports accessibility requirements
- **Figma integration**: How the variant is configured in design tools

---

### **Hierarchical Position**

```
Component Tokens (ob.c.* / ob.h.*) → Semantic Tokens (ob.s.*) → S2 (ob.s2.*) → S1 (ob.s1.*) → Primitives (ob.p.*)
Note: Global tokens (ob.g.*) can be consumed by any level
```

### **Token Structure Pattern**

**Custom Components (ob.c.*):**
```
ob.c.{component}.{category}.{property}.{variant}.{state}
│   │  │           │          │          │         │
│   │  │           │          │          │         └─ Modifier
│   │  │           │          │          └─ Component variant
│   │  │           │          └─ Visual property
│   │  │           └─ Token category
│   │  └─ Custom component identifier
│   └─ Custom component level
└─ Oblique namespace
```

**HTML Components (ob.h.*):**
```
ob.h.{element}.{category}.{property}.{variant}.{state}
│   │  │         │          │          │         │
│   │  │         │          │          │         └─ Modifier
│   │  │         │          │          └─ Element variant
│   │  │         │          └─ Visual property
│   │  │         └─ Token category
│   │  └─ HTML element identifier
│   └─ HTML component level
└─ Oblique namespace
```

---

## Industry Analysis: Component Token Patterns

### **Leading Design Systems Comparison**

Based on analysis of 40+ design systems including Material Design, Carbon, Fluent, Ant Design, and others:

| **Pattern** | **Material Design** | **Carbon** | **Fluent** | **Oblique** |
|-------------|-------------------|-----------|-----------|-------------|
| **Container Tokens** | `primary-container` | `container-01` | `control-background` | `bg_base` |
| **On-Surface Pattern** | `on-surface` | `text-primary` | `foreground-on-accent` | `fg_base` |
| **Inverse Tokens** | `inverse-surface` | `inverse-01` | `accent-text-inverted` | `inversity_flipped` |
| **State Tokens** | `state-hover` | `hover` | `control-hover` | `hover` |
| **Semantic Hierarchy** | primary/secondary/tertiary | primary/secondary | accent/neutral | primary/secondary/tertiary |

### **Industry standard practices**

1. **Container Concept**: Most systems use container/background/surface abstraction
2. **On-Surface Pattern**: Contextual foreground tokens for specific backgrounds
3. **State Management**: Consistent hover/focus/active/disabled state patterns
4. **Semantic Categories**: Clear primary/secondary/tertiary or accent/neutral hierarchies
5. **Component Boundaries**: Clear separation between component tokens and 03_semantic tokens

---

## Component Token Categories

### **1. Interactive Components**

Components that respond to user interaction and require complete state systems.

**Token Pattern:**
```
ob.c.{component}.color.{property}.{variant}.{state}  # Custom components
ob.h.{element}.color.{property}.{variant}.{state}    # HTML elements
```

**Examples:**
```json
{
  "ob.h.button.color.bg.primary.inversity_normal.enabled": {
    "$value": "{ob.s.color.interaction.standard_states.bg.enabled.inversity_flipped}"
  },
  "ob.h.button.color.fg.primary.inversity_normal.enabled": {
    "$value": "{ob.s.color.interaction.standard_states.fg.enabled.inversity_flipped}"
  },
  "ob.c.tag.color.bg.enabled": {
    "$value": "{ob.s.color.neutral.bg.contrast_low.inversity_normal}"
  }
}
```

**Required States:**
- `enabled` - Default interactive state
- `hover` - Mouse hover state
- `focus` - Keyboard focus state  
- `active` - Pressed/clicked state
- `disabled` - Non-interactive state

### **2. Status Components** 

Components that communicate system or user feedback.

**Token Pattern:**
```
ob.c.{component}.color.{property}.{status}.{state}  # Custom components
ob.h.{element}.color.{property}.{status}.{state}    # HTML elements
```

**Examples:**
```json
{
  "ob.c.infobox.color.surface.error": {
    "$value": "{ob.s.color.status.error.bg.contrast_low.inversity_normal}"
  },
  "ob.c.infobox.color.border.warning": {
    "$value": "{ob.s.color.status.warning.border.contrast_high.inversity_normal}"
  },
  "ob.c.badge.color.bg.critical.enabled": {
    "$value": "{ob.s.color.status.error.bg.contrast_high.inversity_flipped}"
  }
}
```

**Common Status Types:**
- `error` - Error states and validation failures
- `warning` - Caution and attention states
- `success` - Completion and positive feedback
- `info` - Informational content

### **3. Neutral/Structural Components**

Components that provide structure, layout, or neutral information display.

**Token Pattern:**
```
ob.c.{component}.color.{property}.{variant}.{state}  # Custom components
ob.h.{element}.color.{property}.{variant}.{state}    # HTML elements
```

**Examples:**
```json
{
  "ob.c.card.color.bg.surface": {
    "$value": "{ob.s.color.neutral.bg.contrast_lowest.inversity_normal}"
  },
  "ob.c.card.color.border.default": {
    "$value": "{ob.s.color.neutral.border.contrast_low.inversity_normal}"
  },
  "ob.c.card.color.fg.default": {
    "$value": "{ob.s.color.neutral.fg.contrast_highest.inversity_normal}"
  }
}
```

---

## Component Token standard practices

### **1. Naming Conventions**

**Component Names:**
- **Custom Components (ob.c.*)**: Use lowercase with underscores for complex Oblique components: `ob.c.infobox.*`, `ob.c.badge.*`, `ob.c.tag.*`
- **HTML Elements (ob.h.*)**: Use standard HTML element names: `ob.h.button.*`, `ob.h.link.*`, `ob.h.list.*`, `ob.h.typography.*`
- Use singular form: `button` not `buttons`  
- Be specific: `search-input` not `input` for custom variants
- Follow atomic design: `button` (atom), `card-header` (molecule)

**Variant Names:**
- Use 03_semantic purpose: `primary`, `secondary`, `destructive`
- Avoid visual descriptions: `red`, `large`, `bold`
- Be consistent: `default` for base variants

**Property Names:**
- Use standard properties: `bg`, `fg`, `border`
- Be specific when needed: `bg-surface`, `fg-label`
- Group related properties: `color.*`, `spacing.*`, `typography.*`

### **2. Token Reference Patterns**

**Component Token Pattern (ob.s Consumption Only):**
```json
// DO: Reference ob.s.* (compiled semantic tokens)
{
  "ob.h.button.color.bg.primary.inversity_normal.enabled": {
    "$value": "{ob.s.color.interaction.standard_states.bg.enabled.inversity_flipped}"
  },
  "ob.c.infobox.color.surface.error": {
    "$value": "{ob.s.color.status.error.bg.contrast_low.inversity_normal}"
  },
  "ob.c.icon.color.fg": {
    "$value": "{ob.s.color.neutral.fg.contrast_highest.inversity_normal}"
  }
}

// DON'T: Direct S1 consumption  
{
  "ob.c.infobox.color.surface.error": {
    "$value": "{ob.s1.color.status.error.bg.contrast_low.inversity_normal}"
  }
}

// DON'T: Direct S2 consumption
{
  "ob.h.button.color.bg.primary.inversity_normal.enabled": {
    "$value": "{ob.s2.color.interaction.standard_states.bg.enabled.inversity_flipped}"
  }
}

// DON'T: Direct primitive consumption
{
  "ob.c.badge.color.bg.critical.enabled": {
    "$value": "{ob.p.color.red.500}"
  }
}
```

### **3. State Management**

**Complete State Coverage:**
```json
{
  "ob.h.button.color.bg.primary.inversity_normal.enabled": "{ob.s.color.interaction.standard_states.bg.enabled.inversity_flipped}",
  "ob.h.button.color.bg.primary.inversity_normal.hover": "{ob.s.color.interaction.standard_states.bg.hover.inversity_flipped}",
  "ob.h.button.color.bg.primary.inversity_normal.focus": "{ob.s.color.interaction.standard_states.bg.focus.inversity_flipped}",
  "ob.h.button.color.bg.primary.inversity_normal.active": "{ob.s.color.interaction.standard_states.bg.pressed.inversity_flipped}",
  "ob.h.button.color.bg.primary.inversity_normal.disabled": "{ob.s.color.interaction.standard_states.bg.disabled.inversity_flipped}"
}
```

**State Naming Rules:**
- `enabled` - Default interactive state (not `default`)
- `disabled` - Non-interactive state
- Use CSS pseudo-class names: `hover`, `focus`, `active`
- Use 03_semantic states: `selected`, `expanded`, `loading`

### **4. Theming Support**

Component tokens should support theming through 03_semantic token selection:

**Emphasis Theming:**
```scss
// High emphasis (default)
.ob-button-primary {
  // Uses emphasis_high 03_semantic tokens
}

// Low emphasis (monochromatic)
.ob-header {
  --ob-theme-emphasis: low;
  
  .ob-button-primary {
    // Automatically uses emphasis_low 03_semantic tokens
  }
}
```

**Inversity Theming:**
```scss
// Normal inversity (default)
.ob-card {
  // Uses inversity_normal 03_semantic tokens
}

// Flipped inversity (inverted)
.ob-modal {
  --ob-theme-inversity: flipped;
  
  // All nested components use inversity_flipped 03_semantic tokens
}
```

### **4. Inversity Pattern: Component-Level Contrast Inversion**

The inversity pattern (`inversity_normal` and `inversity_flipped`) provides component-level contrast inversion, similar to Google Material's `onSurface` pattern. This system allows designers to control whether components use standard or inverted contrast polarity at the component level.

**Core Concept:**
Inversity is a designer's decision made at the component level, not a user preference like light/dark theme switching. It defines whether a component should appear with normal or flipped contrast relative to its surrounding context.

#### **When to Use Each Inversity Type**

Components are categorized into two groups based on their inversity requirements:

#### **Reserved Components (Fixed Inversity)**
Components with **mandatory inversity settings** that cannot be changed due to brand consistency, UX scannability, or design system requirements.

| **Component** | **Required Inversity** | **Reasoning** | **Examples** |
|---------------|----------------------|---------------|--------------|
| **Primary Buttons** | `inversity_flipped` | **UX Scannability**: Must stand out as primary call-to-action | `ob.h.button.color.bg.primary.inversity_flipped.*` |
| **Badges** | `inversity_flipped` | **Visual Distinction**: Need to stand out from surrounding content | `ob.c.badge.color.bg.*.inversity_flipped.*` |
| **Fatal Alerts** | `inversity_flipped` | **Brand Consistency**: Critical error states require consistent high-contrast appearance | `ob.c.infobox.color.surface.fatal.inversity_flipped` |
| **Active States** | `inversity_flipped` | **UX Scannability**: Selected/active items must be immediately identifiable | `ob.c.nav.color.bg.active.inversity_flipped` |

#### **Flexible Components (Contextual Inversity)**
Components that can use either `inversity_normal` or `inversity_flipped` depending on their context and surrounding components.

| **Component** | **Default Inversity** | **Alternative Use** | **Examples** |
|---------------|---------------------|-------------------|--------------|
| **Secondary Buttons** | `inversity_normal` | `inversity_flipped` in dark containers | `ob.h.button.color.bg.secondary.inversity_normal.*` |
| **Tertiary Buttons** | `inversity_normal` | `inversity_flipped` for emphasis in specific contexts | `ob.h.button.color.bg.tertiary.inversity_normal.*` |
| **Cards** | `inversity_normal` | `inversity_flipped` for featured/highlighted cards | `ob.c.card.color.bg.surface.inversity_normal` |
| **Forms** | `inversity_normal` | `inversity_flipped` in dark themes or special contexts | `ob.h.input.color.bg.inversity_normal.*` |
| **Navigation** | `inversity_normal` | `inversity_flipped` for active/current page indicators | `ob.c.nav.color.bg.inversity_normal` |
| **Tables** | `inversity_normal` | `inversity_flipped` for header emphasis | `ob.h.table.color.bg.header.inversity_normal` |
| **Info/Warning Alerts** | `inversity_normal` | `inversity_flipped` for higher urgency | `ob.c.infobox.color.surface.info.inversity_normal`, `ob.c.infobox.color.surface.warning.inversity_normal` |

#### **Design Decision Examples**

**Primary Button (inversity_flipped):**
```json
{
  "ob.h.button.color.bg.primary.inversity_normal.enabled": {
    "$value": "{ob.s.color.interaction.standard_states.bg.enabled.inversity_flipped}"
  },
  "ob.h.button.color.fg.primary.inversity_normal.enabled": {
    "$value": "{ob.s.color.interaction.standard_states.fg.enabled.inversity_flipped}"
  }
}
```

**Badge Component (inversity_flipped):**
```json
{
  "ob.c.badge.color.bg.critical.enabled": {
    "$value": "{ob.s.color.status.error.bg.contrast_high.inversity_flipped}"
  },
  "ob.c.badge.color.fg.critical.enabled": {
    "$value": "{ob.s.color.status.error.fg.contrast_high.inversity_flipped}"
  },
  "ob.c.badge.color.bg.info.enabled": {
    "$value": "{ob.s.color.interaction.contrast_levels.bg.high.inversity_flipped}"
  },
  "ob.c.badge.color.fg.info.enabled": {
    "$value": "{ob.s.color.interaction.contrast_levels.fg.high.inversity_flipped}"
  }
}
```

#### **Inversity vs onSurface Pattern Comparison**

| **Concept** | **Oblique Inversity** | **Material onSurface** |
|-------------|----------------------|------------------------|
| **Purpose** | Component-level contrast inversion | Foreground colors for specific backgrounds |
| **Implementation** | `inversity_normal` / `inversity_flipped` suffixes | `on-primary` / `on-surface` prefixes |
| **Usage** | Designer's component-level decision | Automatic foreground/background pairing |
| **Examples** | Badge needs flipping to stand out | Text color on primary button background |

#### **Implementation Guidelines**

**Component Token Pattern:**
```json
{
  // Standard component (normal inversity)
  "ob.c.card.color.bg.surface.inversity_normal": {
    "$value": "{ob.s.color.neutral.bg.contrast_lowest.inversity_normal}"
  },
  "ob.c.card.color.fg.default.inversity_normal": {
    "$value": "{ob.s.color.neutral.fg.contrast_highest.inversity_normal}"
  },

  // Flipped component (flipped inversity)
  "ob.c.card.color.bg.surface.inversity_flipped": {
    "$value": "{ob.s.color.neutral.bg.contrast_lowest.inversity_flipped}"
  },
  "ob.c.card.color.fg.default.inversity_flipped": {
    "$value": "{ob.s.color.neutral.fg.contrast_highest.inversity_flipped}"
  }
}
```

**Theme Configuration:**
```json
{
  "ob.g.theme_configuration.infobox.fatal.inversity": {
    "$value": "{ob.g.theme_configuration.inversity.flipped}",
    "$description": "Fatal variant of infobox uses flipped inversity for emphasis"
  },
  "ob.g.theme_configuration.badge.default.inversity": {
    "$value": "{ob.g.theme_configuration.inversity.flipped}",
    "$description": "Badge component uses flipped inversity to stand out"
  }
}
```

#### **Visual Behavior**

**In Light Theme:**
- `inversity_normal`: Light background with dark text (standard)
- `inversity_flipped`: Dark background with light text (inverted for emphasis)

**In Dark Theme:**
- `inversity_normal`: Dark background with light text (standard)  
- `inversity_flipped`: Light background with dark text (inverted for emphasis)

**Key Insight:** Inversity flipping occurs before theme switching and is color-neutral. A flipped component maintains its emphasis role across both light and dark themes by always inverting relative to its context.

#### **Advanced Pattern: Double Inversion**

A advanced edge case occurs when **components that are inherently flipped by nature** are placed on **flipped backgrounds** or when creating **flipped variants** of already-flipped components.

**The Double Inversion Rule:** 
When a flipped component is placed in a flipped context, it uses `inversity_normal` to cancel out the double inversion effect.

##### **Two-Layer Designer Decision Framework**

This pattern involves **two distinct levels of designer decisions**:

**Layer 1: Child Component Decision (UX Scannability)**
- **Component Level**: Designer decides that `button.primary` should appear flipped to stand out as a call-to-action
- **Design Principle**: **UX Scannability** - Primary buttons need visual prominence for quick user recognition
- **Design Principle**: **Visual Hierarchy** - Flipped appearance creates clear distinction from secondary elements
- **Scope**: Applied at the atomic/molecular component level
- **Example**: `button.primary` inherently uses `inversity_flipped` for emphasis

**Layer 2: Parent Component Decision (Contextual Adaptation)**
- **Container Level**: Designer building a parent component (e.g., `infobox.fatal`) that is itself flipped
- **Decision Point**: When placing a primary button inside a flipped parent, designer intentionally selects the flipped component variant
- **Implementation**: Uses `button.primary.inversity_flipped` which resolves to `inversity_normal` due to double inversion
- **Scope**: Applied at the organism/template component level
- **Example**: Primary button inside fatal infobox uses normal inversity to maintain readability

**Decision Flow:**
```
Child Level Decision:
button.primary → flipped (for UX scannability and visual hierarchy)

Parent Level Decision:
infobox.fatal (flipped context) + button.primary (flipped nature) → button.primary.inversity_flipped (resolves to normal)
```

##### **Use Case 1: Primary Button on Flipped Background**

**Scenario:** Primary button (flipped in nature) placed inside infobox.fatal (flipped background)

```json
{
  // Infobox.fatal uses flipped inversity (dark background)
  "ob.c.infobox.color.surface.fatal": {
    "$value": "{ob.s.color.status.error.bg.contrast_high.inversity_flipped}"
  },
  
  // Primary button inside fatal infobox uses normal inversity
  // This creates: flipped context + flipped component = normal inversity
  "ob.h.button.color.bg.primary.inversity_flipped.enabled": {
    "$value": "{ob.s.color.interaction.standard_states.bg.enabled.inversity_normal}"
  },
  "ob.h.button.color.fg.primary.inversity_flipped.enabled": {
    "$value": "{ob.s.color.interaction.standard_states.fg.enabled.inversity_normal}"
  }
}
```

**Visual Result:**
- Fatal infobox: Dark background (flipped)
- Primary button inside: Light background with dark text (normal)
- The button appears readable and accessible within the dark container

##### **Use Case 2: Explicit Component Variants**

**Scenario:** Creating explicit "flipped" variants of inherently flipped components

```json
{
  // Standard primary button (flipped in nature)
  "ob.h.button.color.bg.primary.inversity_normal.enabled": {
    "$value": "{ob.s.color.interaction.standard_states.bg.enabled.inversity_flipped}"
  },
  
  // Primary button flipped variant (double inversion = normal)
  "ob.h.button.color.bg.primary.inversity_flipped.enabled": {
    "$value": "{ob.s.color.interaction.standard_states.bg.enabled.inversity_normal}"
  }
}
```

**Component Inversion Logic:**
```
Normal Components:
├── secondary.normal → inversity_normal (light bg, dark text)
└── secondary.flipped → inversity_flipped (dark bg, light text)

Flipped Components:
├── primary.normal → inversity_flipped (dark bg, light text)
└── primary.flipped → inversity_normal (light bg, dark text)
```

##### **Context-Aware Token Resolution**

**Implementation Pattern:**
```json
{
  // Component defines its base inversity nature
  "ob.g.theme_configuration.button.primary.inversity": {
    "$value": "{ob.g.theme_configuration.inversity.flipped}",
    "$description": "Primary button is flipped by nature"
  },
  
  // Context-aware resolution in flipped containers
  "ob.h.button.color.bg.primary.inversity_flipped.enabled": {
    "$value": "{ob.s.color.interaction.standard_states.bg.enabled.inversity_normal}",
    "$description": "Primary button in flipped context uses normal inversity"
  }
}
```

##### **Real-World Applications**

| **Scenario** | **Component Nature** | **Context** | **Resolved Inversity** | **Visual Result** |
|--------------|---------------------|-------------|------------------------|-------------------|
| Secondary button in card | Normal | Normal | `inversity_normal` | Light bg, dark text |
| Primary button in card | Flipped | Normal | `inversity_flipped` | Dark bg, light text |
| Secondary button in fatal infobox | Normal | Flipped | `inversity_flipped` | Dark bg, light text |
| **Primary button in fatal infobox** | **Flipped** | **Flipped** | **`inversity_normal`** | **Light bg, dark text** |

#### **standard practices**

1. **Use inversity_flipped sparingly** - Only for components that need to stand out
2. **Be consistent within component families** - All badges should use the same inversity
3. **Consider user accessibility** - Ensure sufficient contrast in both inversity states
4. **Document component decisions** - Clearly specify which components use flipped inversity
5. **Test across themes** - Verify inversity works correctly in both light and dark themes
6. **Handle double inversion carefully** - When flipped components are in flipped contexts, use `inversity_normal`
7. **Validate visual hierarchy** - Ensure double inversion doesn't break the intended emphasis patterns

### **Component Level Usage Guidelines**

**When to use ob.c.* (Custom Components):**
- Complex, multi-part components unique to Oblique
- Components with custom behavior or styling patterns
- Composite components built from multiple HTML elements
- Components requiring specific design system integration

**When to use ob.h.* (HTML Elements):**
- Standard HTML elements requiring consistent styling
- Form elements, buttons, inputs, tables
- Basic interactive elements with standard behavior
- Elements that map directly to HTML 03_semantics

---

## Component Token Creation Guidelines

### **When to Create Component Tokens**

**Create component tokens when:**
- Component has specific styling patterns that differ from 03_semantic defaults
- Component needs variant management (primary/secondary/tertiary)
- Component requires complete state system management
- Component needs component-specific theming overrides
- Component patterns will be reused across multiple instances

**Don't create component tokens when:**
- Simple 03_semantic token consumption is sufficient
- No component-specific patterns exist
- Component is one-off implementation
- Only primitives or global tokens are needed

### **Creation Process**

1. **Identify Component Type**: Interactive, status, or neutral
2. **Define Variant System**: primary/secondary, default/emphasis, etc.
3. **Map State Requirements**: enabled/hover/focus/active/disabled
4. **Choose Semantic References**: S3 03_semantic token consumption
5. **Document Token Purpose**: Why component token vs direct 03_semantic consumption
6. **Test Theming**: Verify emphasis and inversity theming work correctly

### **Validation Checklist**

- [ ] **No primitive consumption**: Component doesn't reference `ob.p.*` directly
- [ ] **No S1 consumption**: Component doesn't reference `ob.s1.*` directly  
- [ ] **Semantic alignment**: Component purpose matches 03_semantic token type
- [ ] **Complete state coverage**: All necessary interaction states defined
- [ ] **Consistent naming**: Follows established component token conventions
- [ ] **Theming support**: Component works with emphasis/inversity theming
- [ ] **Documentation**: Token purpose and usage patterns documented

---

## Migration and Maintenance

### **Legacy Token Migration**

When migrating from legacy systems:

1. **Audit existing patterns**: Identify current component token usage
2. **Map to 03_semantic hierarchy**: Choose appropriate S3 03_semantic references
3. **Preserve visual consistency**: Ensure migration doesn't break designs
4. **Update component implementations**: Modify CSS/JS to use new tokens
5. **Test theme compatibility**: Verify all theming scenarios work
6. **Document changes**: Update component documentation and examples

### **Ongoing Maintenance**

**Regular Reviews:**
- Validate token references resolve correctly
- Check for unused component tokens
- Ensure new components follow established patterns
- Update documentation when patterns change

**Quality Assurance:**
- Use validation scripts: `node scripts-custom/validate-all-components.js`
- Test theming scenarios: emphasis and inversity variations
- Verify state coverage: all interaction states defined
- Check 03_semantic alignment: component purpose matches token type

---

## Examples from Current System

### **HTML Button Component (ob.h.button.*)**
```json
{
  "ob.h.button.color.bg.primary.inversity_normal.enabled": {
    "$value": "{ob.s.color.interaction.standard_states.bg.enabled.inversity_flipped}"
  },
  "ob.h.button.color.fg.primary.inversity_normal.enabled": {
    "$value": "{ob.s.color.interaction.standard_states.fg.enabled.inversity_flipped}"
  }
}
```

### **Custom Alert Component (ob.c.infobox.*)**  
```json
{
  "ob.c.infobox.color.surface.error": {
    "$value": "{ob.s.color.status.error.bg.contrast_low.inversity_normal}"
  },
  "ob.c.infobox.color.icon.error": {
    "$value": "{ob.s.color.status.error.fg.contrast_high.inversity_normal}"
  }
}
```

### **HTML Form Elements (ob.h.input.*)**
```json
{
  "ob.h.input.color.bg.enabled": {
    "$value": "{ob.s.color.neutral.bg.contrast_lowest.inversity_normal}"
  },
  "ob.h.input.color.border.enabled": {
    "$value": "{ob.s.color.neutral.border.contrast_high.inversity_normal}"
  }
}
```

---

## Related Documentation

- Token Hierarchy - Overall token hierarchy and patterns
- Token Consumption Guidelines - How to consume tokens correctly
- Component Identification - Component classification and naming
- Semantic Color Architecture - Semantic token structure and usage

---

*Last updated: April 16, 2026*
