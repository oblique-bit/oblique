# Design Tokens: Foundation Architecture

**Purpose**: Core architectural principles and token structure for the Oblique Design System  
**Audience**: Design system maintainers, token architects, technical leads  
**Related**: [Token Naming](./03-naming.md) | [System Requirements](./01-system-requirements.md) | [Tokenization Process](./99-workflows/tokenization-process.md)

---

## **Foundation Principles**

### **Code-Figma Token Alignment**
**"100% consistency between design and code environments"**

**Implementation:**
- **Same Token Names**: `ob.p.color.red.50` exists identically in both code and Figma
- **Same Token Values**: `#2379A4` appears exactly the same in both environments  
- **Same Token Structure**: Hierarchical organization mirrors across platforms
- **Synchronized Updates**: Token changes propagate simultaneously to both environments

**Benefits:**
- Eliminates design-development handoff friction
- Ensures visual and behavioral consistency  
- Provides shared vocabulary between teams
- Single source of truth for design decisions

### **Figma-First Token Creation**
Following the [Tokenization Process](./03-workflows/tokenization-process.md):
- **Primary Rule**: If a token cannot be used in Figma, it should not be created
- **Implementation Flexibility**: Developers can work around code limitations through creative implementation
- **Design Intent Preservation**: All design decisions preserved (tokenized or documented)

---

## **Token Architecture Hierarchy**

### **Layer Structure**
```
ob.{layer}.{category}.{...path}

Foundation Layers:
  g  → Global tokens (system-wide foundation)
  p  → Primitive (raw foundation values)

Semantic Layers:
  s1 → Lightness (light/dark theme switching)
  s2 → Emphasis (high/low emphasis variations)  
  s3 → Compilation (complete semantic colors)

Application Layers:
  c  → Component tokens
  h  → HTML element tokens
```

### **Reference Hierarchy Rules**
1. **Components consume S3** - Primary consumption layer for component tokens
2. **Never consume primitives directly** - Components must never reference `ob.p.*` tokens
3. **S2/S3 reference S1 directly** - Simplified reference chain: S2→S1→Primitive, S3→S1→Primitive  
4. **S1 handles theme switching** - Light/dark themes resolved at S1 level
5. **Global tokens exception** - `ob.g.*` tokens can be referenced from any level

### **Token Naming**
Complete naming conventions and patterns are documented in [Token Naming Conventions](./03-naming.md).

---

## **Semantic Layer System (S1/S2/S3)**

### **S1: Lightness Layer**
- **Purpose**: Light/dark theme switching
- **Files**: `light.json`, `dark.json`  
- **References**: Direct primitive consumption
- **Usage**: Referenced by S2 and S3, never consumed directly by components

### **S2: Emphasis Layer**  
- **Purpose**: High/low emphasis variations
- **Files**: `high.json`, `low.json`
- **References**: S1 lightness tokens  
- **Usage**: Non-interactive components, fallback for missing S3 tokens

### **S3: Compilation Layer**
- **Purpose**: Complete semantic color collection (no modes)
- **Files**: `semantic.json` 
- **References**: S1 lightness tokens
- **Usage**: **Primary consumption layer** for interactive components

### **Reference Chain Simplification**
```
Before (Complex): S3 → S2 → S1 → Primitive
After (Simple):   S2 → S1 → Primitive
                  S3 → S1 → Primitive
```

**Benefits:**
- Reduced complexity in token resolution
- Faster build performance  
- Clearer mental model for maintainers
- Direct control over semantic compilation

---

## **Token Categories**

### **Color Tokens**
- **Structure**: `ob.{layer}.color.{color_name}.{shade}`
- **Examples**: `ob.p.color.red.50`, `ob.s3.color.primary.bg`
- **Modes**: Handled through S1 lightness layer (light/dark)

### **Spacing Tokens**  
- **Structure**: `ob.{layer}.spacing.{size}`
- **Examples**: `ob.s2.spacing.md`, `ob.c.button.spacing.padding`
- **Scaling**: Mathematical multipliers prevent token explosion

### **Typography Tokens**
- **Structure**: `ob.{layer}.typography.{category}.{size}`
- **Examples**: `ob.s2.typography.heading.lg`, `ob.h.button.typography.label`
- **Foundation**: REM-based with 16px base font size

### **Dimension/Sizing Tokens**
- **Structure**: `ob.{layer}.dimension.{category}.{size}`  
- **Examples**: `ob.s2.dimension.component.md`, `ob.c.button.dimension.height`
- **Modes**: Support density and component-size scaling

---

## **Global Token System**

### **Multiplier Architecture**
**Purpose**: Enable proportional scaling without token explosion

**Structure Pattern**:
```
ob.g.multiplier.{category}.{size}
```

**Examples**:
```
ob.g.multiplier.dimension.sm    → 0.8  (80% scaling)
ob.g.multiplier.dimension.md    → 1.0  (100% baseline)  
ob.g.multiplier.dimension.lg    → 1.2  (120% scaling)
```

**Usage**: Mathematical scaling maintains relationships while enabling modes

### **System Configuration**
- **Viewport settings**: Breakpoints and responsive behavior
- **Base values**: System-wide foundations (font size, spacing base)
- **Theme configuration**: Mode switching and theme management

---

## **File Structure vs Token Names**

### **CRITICAL: Structure Independence**
**Token names DO NOT follow folder and JSON file naming conventions.**

**Example**:
```
File: src/lib/themes/01_global/multipliers/dimension/md.json
Token Name: ob.g.multiplier.dimension.md
```

**Rule**: You cannot create tokens by knowing only file paths. You must understand the documented architecture patterns and naming conventions.

### **Development Organization**
File structure is for:
- Development convenience and organization
- Build system processing  
- Team workflow optimization
- Tokens Studio synchronization

Token names are for:
- Design and code consumption
- Cross-platform consistency
- Semantic meaning and hierarchy
- User-facing implementation

---

## **Technical Architecture Requirements**

### **Core Architectural Layers**

1. **Three Core Layers**: The architecture consists of three primary layers:
   - **Primitives (`ob.p`)**: The single source of truth for raw, context-free values
   - **Semantics (`ob.s`)**: The contextual layer that maps primitives to specific use cases  
   - **Component Themes (`ob.h`, `ob.c`)**: The consumption layer that applies semantic tokens to UI components

2. **Unidirectional Flow**: The token flow is strictly unidirectional: `Primitives` -> `Semantics` -> `Components`. A layer can only reference the layer directly above it.

3. **No Calculations in Consumer Layers**: All calculations, particularly those involving 01_global multipliers (`ob.g.*`), **must** occur exclusively within the semantic layer (`ob.s`). Component theme layers (`ob.h`, `ob.c`) are forbidden from performing calculations and must consume pre-defined `static` or `dynamic` semantic tokens.

### **Architecture Examples**

#### ✔️ Do: Consume pre-defined semantic tokens in components
Component-level tokens should directly reference a token from the semantic layer (`ob.s`). This keeps the component layer clean and free of logic.

```json
// In: ob.h.button.json (Component Theme Layer)
{
  "min_height": {
    "$value": "{ob.s.dimension.dynamic.container.xs.rem}"
  }
}
```

#### ❌ Don't: Perform calculations in the component layer
Calculations using 01_global multipliers (`ob.g.*`) are strictly forbidden at the component (`ob.h`, `ob.c`) level. All calculations must be done in the semantic layer.

```json
// In: ob.h.button.json (Component Theme Layer)
// THIS IS FORBIDDEN!
{
  "font_size": {
    "$value": "{ob.p.fontSizeUnitless.400} * {ob.g.multiplier.typography}"
  }
}
```

## **Token Naming Reference**

All naming conventions, patterns, and guidelines are documented in [Token Naming Conventions](./03-naming.md), including:
- Token hierarchy patterns
- Primitive vs semantic naming principles  
- Compound units system
- Reference chain validation
- Style Dictionary integration

---

