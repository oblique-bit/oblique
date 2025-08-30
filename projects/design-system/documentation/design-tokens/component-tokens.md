# Component Tokens

**About this document:** This document defines component token patterns, naming conventions, and consumption guidelines for the Oblique Design System.

**Scope:** Component-specific token creation, naming patterns, hierarchical relationships, and best practices.

---

## What Are Component Tokens?

Component tokens are the top level of the token hierarchy, providing component-specific styling definitions that reference semantic tokens. They describe **component-specific styling patterns**, not visual appearance.

**Component Token Purpose:**
- Define component-specific styling patterns
- Establish variant systems within components  
- Provide component-level abstraction over semantic tokens
- Enable component-specific theming and customization

## Component Token Levels

The Oblique Design System uses **two distinct component token levels**:

### **ob.c.* - Custom Oblique Components**
Custom components built specifically for the Oblique Design System with unique styling patterns and behaviors.

```
ob.c.stepper.color.bg.active.enabled
│   │  │       │     │   │      │
│   │  │       │     │   │      └─ Modifier
│   │  │       │     │   └─ Component variant
│   │  │       │     └─ Visual property
│   │  │       └─ Token category
│   │  └─ Custom component identifier
│   └─ Custom component level
└─ Oblique namespace
```

**Examples:** `ob.c.stepper`, `ob.c.datepicker`, `ob.c.navigation`, `ob.c.banner`

### **ob.h.* - HTML Components and Elements**
Native HTML elements and components that require consistent styling across the design system.

```
ob.h.button.color.bg.primary.enabled
│   │  │      │     │   │       │
│   │  │      │     │   │       └─ Modifier
│   │  │      │     │   └─ Component variant
│   │  │      │     └─ Visual property
│   │  │      └─ Token category
│   │  └─ HTML element identifier
│   └─ HTML component level
└─ Oblique namespace
```

**Examples:** `ob.h.button`, `ob.h.form`, `ob.h.input`, `ob.h.table`, `ob.h.select`

---

## Variable Values and Component Defaults

### **Component Variable Values**

Many components support multiple variable values for properties like size, spacing, typography, and other dimensions. These variables enable flexible component usage while maintaining design consistency.

**Common Variable Categories:**
- **Size variants**: `lg` (large), `md` (medium), `sm` (small), `xs` (extra-small)
- **Spacing variants**: `tight`, `comfortable`, `spacious`  
- **Typography variants**: `heading`, `body`, `caption`
- **Emphasis variants**: `primary`, `secondary`, `tertiary`

### **Token Structure for Variable Values**

**Size Variables Example:**
```json
{
  "ob.h.button.size.height.lg": {
    "$value": "{ob.g.size.control.lg}",
    "$description": "Large button height variant"
  },
  "ob.h.button.size.height.md": {
    "$value": "{ob.g.size.control.md}",
    "$description": "Medium button height variant (default)"
  },
  "ob.h.button.size.height.sm": {
    "$value": "{ob.g.size.control.sm}",
    "$description": "Small button height variant"
  }
}
```

**Typography Variables Example:**
```json
{
  "ob.c.card.typography.title.heading": {
    "$value": "{ob.g.typography.heading.md}",
    "$description": "Card title using heading typography"
  },
  "ob.c.card.typography.title.body": {
    "$value": "{ob.g.typography.body.lg}",
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

**DO use descriptive variant names** - Use the actual semantic name (e.g., `md`, `body`, `primary`) and establish defaults through:

1. **Token Documentation**: Clear description indicating default status
2. **Figma Component Setup**: Default variant selection in component properties
3. **Code Implementation**: Default props/values in component libraries  
4. **Design Guidelines**: Documentation specifying default usage patterns

### **Default Indication Methods**

**In Token Descriptions:**
```json
{
  "ob.h.button.size.height.md": {
    "$value": "{ob.g.size.control.md}",
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

### **Variable Value Examples**

**Button Size Variables:**
```json
{
  "ob.h.button.size.height.lg": {
    "$value": "48px",
    "$description": "Large button height for prominent actions"
  },
  "ob.h.button.size.height.md": {
    "$value": "40px", 
    "$description": "Medium button height - standard default size"
  },
  "ob.h.button.size.height.sm": {
    "$value": "32px",
    "$description": "Small button height for compact layouts"
  },
  "ob.h.button.spacing.padding-x.lg": {
    "$value": "24px",
    "$description": "Large button horizontal padding"
  },
  "ob.h.button.spacing.padding-x.md": {
    "$value": "16px",
    "$description": "Medium button horizontal padding (default)"
  },
  "ob.h.button.spacing.padding-x.sm": {
    "$value": "12px", 
    "$description": "Small button horizontal padding"
  }
}
```

**Card Spacing Variables:**
```json
{
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

### **Variable Value Documentation**

Each variable value should include:

```json
{
  "ob.h.input.size.height.md": {
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
Component Tokens (ob.c.* / ob.h.*) → Semantic Tokens (ob.s3.*) → Semantic Processing → Primitives (ob.p.*)
```

**Reference Rules:**
- **Components MUST consume S3 semantic tokens** (only valid pattern)
- **Components must NOT consume S2 semantic tokens directly**
- **Components must NOT consume S1 semantic tokens directly**
- **Components must NOT consume primitive tokens directly**
- **Global tokens (ob.g.*) can be consumed by any level**

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
| **Container Tokens** | `primary-container` | `container-01` | `control-background` | `bg-base` |
| **On-Surface Pattern** | `on-surface` | `text-primary` | `foreground-on-accent` | `fg-base` |
| **Inverse Tokens** | `inverse-surface` | `inverse-01` | `accent-text-inverted` | `inversity-flipped` |
| **State Tokens** | `state-hover` | `hover` | `control-hover` | `hover` |
| **Semantic Hierarchy** | primary/secondary/tertiary | primary/secondary | accent/neutral | primary/secondary/tertiary |

### **Industry Best Practices**

1. **Container Concept**: Most systems use container/background/surface abstraction
2. **On-Surface Pattern**: Contextual foreground tokens for specific backgrounds
3. **State Management**: Consistent hover/focus/active/disabled state patterns
4. **Semantic Categories**: Clear primary/secondary/tertiary or accent/neutral hierarchies
5. **Component Boundaries**: Clear separation between component tokens and semantic tokens

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
  "ob.h.button.color.bg.primary.enabled": {
    "$value": "{ob.s3.color.interaction.emphasis-high.bg-base.contrast-high.inversity-normal}"
  },
  "ob.h.button.color.bg.primary.hover": {
    "$value": "{ob.s3.color.interaction.emphasis-high.bg-hover.contrast-high.inversity-normal}"
  },
  "ob.c.stepper.color.fg.active.enabled": {
    "$value": "{ob.s3.color.interaction.emphasis-high.fg-base.contrast-high.inversity-normal}"
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
  "ob.c.alert.color.bg.error.default": {
    "$value": "{ob.s3.color.status.error.bg-base.contrast-medium.inversity-normal}"
  },
  "ob.c.badge.color.fg.success.default": {
    "$value": "{ob.s3.color.status.success.fg-base.contrast-highest.inversity-normal}"
  },
  "ob.h.input.color.border.error.enabled": {
    "$value": "{ob.s3.color.status.error.border-base.contrast-high.inversity-normal}"
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
  "ob.c.card.color.bg.default.default": {
    "$value": "{ob.s3.color.neutral.bg-base.contrast-low.inversity-normal}"
  },
  "ob.c.divider.color.border.default.default": {
    "$value": "{ob.s3.color.neutral.border-base.contrast-medium.inversity-normal}"
  },
  "ob.h.table.color.bg.header.default": {
    "$value": "{ob.s3.color.neutral.bg-surface.contrast-low.inversity-normal}"
  }
}
```

---

## Component Token Best Practices

### **1. Naming Conventions**

**Component Names:**
- **Custom Components (ob.c.*)**: Use lowercase with hyphens for complex Oblique components: `ob.c.data-table`, `ob.c.stepper`, `ob.c.navigation`
- **HTML Elements (ob.h.*)**: Use standard HTML element names: `ob.h.button`, `ob.h.input`, `ob.h.form`, `ob.h.table`
- Use singular form: `button` not `buttons`  
- Be specific: `search-input` not `input` for custom variants
- Follow atomic design: `button` (atom), `card-header` (molecule)

**Variant Names:**
- Use semantic purpose: `primary`, `secondary`, `destructive`
- Avoid visual descriptions: `red`, `large`, `bold`
- Be consistent: `default` for base variants

**Property Names:**
- Use standard properties: `bg`, `fg`, `border`
- Be specific when needed: `bg-surface`, `fg-label`
- Group related properties: `color.*`, `spacing.*`, `typography.*`

### **2. Token Reference Patterns**

**Component Token Pattern (S3 Consumption Only):**
```json
{
  "ob.h.button.color.bg.primary.enabled": {
    "$value": "{ob.s3.color.interaction.emphasis-high.bg-base.contrast-high.inversity-normal}"
  },
  "ob.c.stepper.color.fg.active.enabled": {
    "$value": "{ob.s3.color.interaction.emphasis-high.fg-base.contrast-high.inversity-normal}"
  },
  "ob.c.header.color.bg.default.default": {
    "$value": "{ob.s3.color.neutral.bg-base.contrast-low.inversity-normal}"
  },
  "ob.h.form.color.border.default.focus": {
    "$value": "{ob.s3.color.interaction.border-base.contrast-medium.inversity-normal}"
  }
}
```

**Forbidden Patterns:**
```json
// DON'T: Direct primitive consumption
{
  "ob.h.button.color.bg.primary.enabled": {
    "$value": "{ob.p.color.blue.500}"
  }
}

// DON'T: Direct S1 consumption  
{
  "ob.c.stepper.color.bg.active.enabled": {
    "$value": "{ob.s1.color.neutral.bg-base.contrast-high.inversity-normal}"
  }
}

// DON'T: Direct S2 consumption
{
  "ob.c.header.color.bg.default.default": {
    "$value": "{ob.s2.color.neutral.bg-base.contrast-low.inversity-normal}"
  }
}
```

### **3. State Management**

**Complete State Coverage:**
```json
{
  "ob.h.button.color.bg.primary.enabled": "{semantic-reference}",
  "ob.h.button.color.bg.primary.hover": "{semantic-reference}",
  "ob.h.button.color.bg.primary.focus": "{semantic-reference}",
  "ob.h.button.color.bg.primary.active": "{semantic-reference}",
  "ob.h.button.color.bg.primary.disabled": "{semantic-reference}"
}
```

**State Naming Rules:**
- `enabled` - Default interactive state (not `default`)
- `disabled` - Non-interactive state
- Use CSS pseudo-class names: `hover`, `focus`, `active`
- Use semantic states: `selected`, `expanded`, `loading`

### **4. Theming Support**

Component tokens should support theming through semantic token selection:

**Emphasis Theming:**
```scss
// High emphasis (default)
.ob-button-primary {
  // Uses emphasis-high semantic tokens
}

// Low emphasis (monochromatic)
.ob-header {
  --ob-theme-emphasis: low;
  
  .ob-button-primary {
    // Automatically uses emphasis-low semantic tokens
  }
}
```

**Inversity Theming:**
```scss
// Normal inversity (default)
.ob-card {
  // Uses inversity-normal semantic tokens
}

// Flipped inversity (inverted)
.ob-modal {
  --ob-theme-inversity: flipped;
  
  // All nested components use inversity-flipped semantic tokens
}
```

### **4. Inversity Pattern: Component-Level Contrast Inversion**

The inversity pattern (`inversity_normal` and `inversity_flipped`) provides component-level contrast inversion, similar to Google Material's `onSurface` pattern. This system allows designers to control whether components use standard or inverted contrast polarity at the component level.

**Core Concept:**
Inversity is a designer's decision made at the component level, not a user preference like light/dark theme switching. It defines whether a component should appear with normal or flipped contrast relative to its surrounding context.

#### **When to Use Each Inversity Type**

**inversity_normal (Standard Appearance):**
- Default component appearance that inherits the host theme
- Most components use normal inversity by default
- Maintains standard foreground/background contrast relationships
- Used for: cards, forms, navigation, tables, most interactive elements

**inversity_flipped (Emphasis Through Inversion):**
- Component-level inversion for visual emphasis and distinction
- Used when components need to "stand out" from their surrounding context
- Designer's intentional choice for specific components or component variants
- Used for: primary buttons, badges, active states, fatal alerts, call-to-action elements

#### **Design Decision Examples**

**Primary Button (inversity_flipped):**
```json
{
  "ob.h.button.color.bg.primary.enabled": {
    "$value": "{ob.s3.color.interaction.emphasis-high.bg-base.contrast-high.inversity-flipped}"
  },
  "ob.h.button.color.fg.primary.enabled": {
    "$value": "{ob.s3.color.interaction.emphasis-high.fg-base.contrast-highest.inversity-flipped}"
  }
}
```

**Badge Component (inversity_flipped):**
```json
{
  "ob.c.badge.color.bg.default.default": {
    "$value": "{ob.s3.color.neutral.bg-base.contrast-high.inversity-flipped}"
  },
  "ob.c.badge.color.fg.default.default": {
    "$value": "{ob.s3.color.neutral.fg-base.contrast-highest.inversity-flipped}"
  }
}
```

**Fatal Infobox (inversity_flipped):**
```json
{
  "ob.c.infobox.color.bg.fatal.default": {
    "$value": "{ob.s3.color.status.error.bg-base.contrast-high.inversity-flipped}"
  },
  "ob.c.infobox.color.fg.fatal.default": {
    "$value": "{ob.s3.color.status.error.fg-base.contrast-highest.inversity-flipped}"
  }
}
```

#### **Inversity vs onSurface Pattern Comparison**

| **Concept** | **Oblique Inversity** | **Material onSurface** |
|-------------|----------------------|------------------------|
| **Purpose** | Component-level contrast inversion | Foreground colors for specific backgrounds |
| **Implementation** | `inversity-normal` / `inversity-flipped` suffixes | `on-primary` / `on-surface` prefixes |
| **Usage** | Designer's component-level decision | Automatic foreground/background pairing |
| **Examples** | Badge needs flipping to stand out | Text color on primary button background |

#### **Implementation Guidelines**

**Component Token Pattern:**
```json
{
  // Standard component (normal inversity)
  "ob.c.card.color.bg.default.default": {
    "$value": "{ob.s3.color.neutral.bg-base.contrast-low.inversity-normal}"
  },
  "ob.c.card.color.fg.default.default": {
    "$value": "{ob.s3.color.neutral.fg-base.contrast-high.inversity-normal}"
  },
  
  // Emphasis component (flipped inversity)
  "ob.c.badge.color.bg.active.default": {
    "$value": "{ob.s3.color.interaction.emphasis-high.bg-base.contrast-high.inversity-flipped}"
  },
  "ob.c.badge.color.fg.active.default": {
    "$value": "{ob.s3.color.interaction.emphasis-high.fg-base.contrast-highest.inversity-flipped}"
  }
}
```

**Theme Configuration:**
```json
{
  "ob.g.component-configuration.infobox.fatal.theme.inversity": {
    "$value": "{ob.g.theme-configuration.inversity.flipped}",
    "$description": "Fatal variant of infobox uses flipped inversity for emphasis"
  },
  "ob.g.component-configuration.badge.default.theme.inversity": {
    "$value": "{ob.g.theme-configuration.inversity.flipped}",
    "$description": "Badge component uses flipped inversity to stand out"
  }
}
```

#### **Visual Behavior**

**In Light Theme:**
- `inversity-normal`: Light background with dark text (standard)
- `inversity-flipped`: Dark background with light text (inverted for emphasis)

**In Dark Theme:**
- `inversity-normal`: Dark background with light text (standard)  
- `inversity-flipped`: Light background with dark text (inverted for emphasis)

**Key Insight:** Inversity flipping occurs before theme switching and is color-neutral. A flipped component maintains its emphasis role across both light and dark themes by always inverting relative to its context.

#### **Advanced Pattern: Double Inversion**

A sophisticated edge case occurs when **components that are inherently flipped by nature** are placed on **flipped backgrounds** or when creating **flipped variants** of already-flipped components.

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
  "ob.c.infobox.color.bg.fatal.default": {
    "$value": "{ob.s3.color.status.error.bg-base.contrast-high.inversity-flipped}"
  },
  
  // Primary button inside fatal infobox uses normal inversity
  // This creates: flipped context + flipped component = normal inversity
  "ob.h.button.color.bg.primary.enabled": {
    "$value": "{ob.s3.color.interaction.emphasis-high.bg-base.contrast-high.inversity-normal}"
  },
  "ob.h.button.color.fg.primary.enabled": {
    "$value": "{ob.s3.color.interaction.emphasis-high.fg-base.contrast-highest.inversity-normal}"
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
  "ob.h.button.color.bg.primary.enabled": {
    "$value": "{ob.s3.color.interaction.emphasis-high.bg-base.contrast-high.inversity-flipped}"
  },
  
  // Primary button flipped variant (double inversion = normal)
  "ob.h.button.color.bg.primary-flipped.enabled": {
    "$value": "{ob.s3.color.interaction.emphasis-high.bg-base.contrast-high.inversity-normal}"
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
  "ob.g.component-configuration.button.primary.theme.inversity": {
    "$value": "{ob.g.theme-configuration.inversity.flipped}",
    "$description": "Primary button is flipped by nature"
  },
  
  // Context-aware resolution in flipped containers
  "ob.h.button.color.bg.primary.enabled.context-flipped": {
    "$value": "{ob.s3.color.interaction.emphasis-high.bg-base.contrast-high.inversity-normal}",
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

#### **Best Practices**

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
- Elements that map directly to HTML semantics

---

## Component Token Creation Guidelines

### **When to Create Component Tokens**

**Create component tokens when:**
- Component has specific styling patterns that differ from semantic defaults
- Component needs variant management (primary/secondary/tertiary)
- Component requires complete state system management
- Component needs component-specific theming overrides
- Component patterns will be reused across multiple instances

**Don't create component tokens when:**
- Simple semantic token consumption is sufficient
- No component-specific patterns exist
- Component is one-off implementation
- Only primitives or global tokens are needed

### **Creation Process**

1. **Identify Component Type**: Interactive, status, or neutral
2. **Define Variant System**: primary/secondary, default/emphasis, etc.
3. **Map State Requirements**: enabled/hover/focus/active/disabled
4. **Choose Semantic References**: S3 semantic token consumption
5. **Document Token Purpose**: Why component token vs direct semantic consumption
6. **Test Theming**: Verify emphasis and inversity theming work correctly

### **Validation Checklist**

- [ ] **No primitive consumption**: Component doesn't reference `ob.p.*` directly
- [ ] **No S1 consumption**: Component doesn't reference `ob.s1.*` directly  
- [ ] **Semantic alignment**: Component purpose matches semantic token type
- [ ] **Complete state coverage**: All necessary interaction states defined
- [ ] **Consistent naming**: Follows established component token conventions
- [ ] **Theming support**: Component works with emphasis/inversity theming
- [ ] **Documentation**: Token purpose and usage patterns documented

---

## Migration and Maintenance

### **Legacy Token Migration**

When migrating from legacy systems:

1. **Audit existing patterns**: Identify current component token usage
2. **Map to semantic hierarchy**: Choose appropriate S3 semantic references
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
- Check semantic alignment: component purpose matches token type

---

## Examples from Current System

### **HTML Button Component (ob.h.*)**
```json
{
  "ob.h.button.color.bg.primary.enabled": {
    "$value": "{ob.s3.color.interaction.emphasis-high.bg-base.contrast-high.inversity-normal}"
  },
  "ob.h.button.color.fg.primary.enabled": {
    "$value": "{ob.s3.color.interaction.emphasis-high.fg-base.contrast-highest.inversity-flipped}"
  }
}
```

### **Custom Alert Component (ob.c.)**  
```json
{
  "ob.c.alert.color.bg.error.default": {
    "$value": "{ob.s3.color.status.error.bg-base.contrast-medium.inversity-normal}"
  },
  "ob.c.alert.color.fg.error.default": {
    "$value": "{ob.s3.color.status.error.fg-base.contrast-highest.inversity-normal}"
  }
}
```

### **HTML Form Elements (ob.h.*)**
```json
{
  "ob.h.input.color.bg.default.enabled": {
    "$value": "{ob.s3.color.neutral.bg-surface.contrast-low.inversity-normal}"
  },
  "ob.h.input.color.border.default.focus": {
    "$value": "{ob.s3.color.interaction.border-base.contrast-high.inversity-normal}"
  }
}
```

---

## Glossary

### **Design Decision Principles**

**UX Scannability**
- Design principle ensuring users can quickly identify and locate interactive elements
- Applied to primary buttons and call-to-action components through inversity flipping
- Creates visual prominence that supports rapid visual scanning patterns
- Essential for accessibility and user experience optimization

**Visual Hierarchy** 
- Design principle that establishes clear distinction between element importance levels
- Implemented through inversity patterns to create primary/secondary/tertiary relationships
- Ensures critical actions (primary buttons) stand out from supporting elements
- Maintains consistent emphasis patterns across component families

### **Inversity Concepts**

**inversity_normal**
- Standard component appearance that inherits the host theme's contrast polarity
- Used by most components to maintain consistency with surrounding context
- Represents the default contrast relationship (light bg/dark text in light theme)

**inversity_flipped** 
- Component-level contrast inversion for emphasis and visual distinction
- Designer's intentional choice for components that need to stand out
- Creates opposite contrast relationship (dark bg/light text in light theme)
- Used strategically for primary buttons, badges, alerts, and call-to-action elements

**Double Inversion**
- Advanced pattern where flipped components are placed in flipped contexts
- Results in cancellation effect: flipped + flipped = normal inversity
- Requires careful token resolution to maintain proper contrast and readability

---

## Related Documentation

- [Token Architecture](./architecture.md) - Overall token hierarchy and patterns
- [Token Consumption Guidelines](./guidelines-token-consumption.md) - How to consume tokens correctly
- [Component Identification](./component-identification.md) - Component classification and naming
- [Semantic Color Architecture](./colors/colors-semantic.md) - Semantic token structure and usage

---

*Last updated: August 30, 2025*
