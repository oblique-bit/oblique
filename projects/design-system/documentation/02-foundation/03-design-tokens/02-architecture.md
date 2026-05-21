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
Following the Tokenization Process:
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
  s  → Compilation (complete semantic colors)

Application Layers:
  c  → Component tokens
  h  → HTML element tokens
```

### **Reference Hierarchy Rules**
1. **Components consume ob.s** - Primary consumption layer for component tokens
2. **Never consume primitives directly** - Components must never reference `ob.p.*` tokens
3. **S2/ob.s reference S1 directly** - Simplified reference chain: S2→S1→Primitive, ob.s→S1→Primitive  
4. **S1 handles theme switching** - Light/dark themes resolved at S1 level
5. **Global tokens exception** - `ob.g.*` tokens can be referenced from any level

### **Token Naming**
Complete naming conventions and patterns are documented in [Token Naming Conventions](./03-naming.md).

---

## **Semantic Layer System (S1/S2/ob.s)**

### **S1: Lightness Layer**
- **Purpose**: Light/dark theme switching
- **Files**: `light.json`, `dark.json`  
- **References**: Direct primitive consumption
- **Usage**: Referenced by S2 and ob.s, never consumed directly by components

### **S2: Emphasis Layer**  
- **Purpose**: High/low emphasis variations
- **Files**: `high.json`, `low.json`
- **References**: S1 lightness tokens  
- **Usage**: Non-interactive components, fallback for missing ob.s tokens

### **ob.s: Compilation Layer**
- **Purpose**: Complete semantic color collection (no modes)
- **Files**: `semantic.json` 
- **References**: S1 lightness tokens
- **Usage**: **Primary consumption layer** for interactive components



---

## **Token Categories**

### **Color Tokens**
- **Structure**: `ob.{layer}.color.{color_name}.{shade}`
- **Examples**: `ob.p.color.red.50`, `ob.s.color.primary.bg`
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
- **Modes**: Support density and ui_scale scaling

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


## **Token Classification**

Most tokens are ordinary, consumable design values. A few are "special" — documentation nodes, or values that one environment uses and the other does not. There is no hidden flag system: a token's role is readable from three visible signals — its name, its tier, and its description.

### **Signal 1 — Name: token vs documentation**

A node named `token_family_docs` is a documentation node, **not a token**. It carries the family-level `$description` shown as the heading in the Figma living-documentation tables. It has no `$value`, so the build and the resolver treat it as a non-token automatically, and pipelines locate it by its key name. Every other node is a real token. See *Documentation Nodes* below.

### **Signal 2 — Folder / tier: who consumes it**

The tier a token lives in says whether it is for direct use:

- **Primitive (`ob.p.*`)** — raw material; never consumed directly (see the Reference Hierarchy Rules above).
- **Semantic (`ob.s`, `ob.s1`, `ob.s2`), component (`ob.c.*`), HTML (`ob.h.*`)** — the working tokens consumers use.

### **Signal 3 — Description: consumption labels**

A token's `$description` may begin with **at most one** label. The label lives in the description because the description is the only field that publishes through to Figma, where designers can read it.

| Label | Meaning |
|---|---|
| *(none)* | Normal — used in both Figma and code. |
| `[FIGMA-ONLY]` | Figma applies it automatically; developers can ignore it. |
| `[NO-FIGMA]` | Not in Figma; developers apply it in code. |
| `[NO-CODE]` | Exists only to complete a set — used by neither Figma nor code. |

`[NO-CODE]` is **not** the same as `[FIGMA-ONLY]`: `[FIGMA-ONLY]` means Figma actively applies the token; `[NO-CODE]` means the token is used nowhere and exists only so a set is structurally complete.

### **`$extensions`**

The W3C Design Token Community Group specification reserves the `$extensions` key for non-standard, tooling-specific metadata. **Oblique does not use `$extensions` to classify or mark tokens** — classification uses the three signals above. `$extensions` carries no Oblique metadata and is not read by the build, the resolver, or Figma.

Tokens Studio writes its own `$extensions` entry on some tokens (for example a colour modifier). That belongs to Tokens Studio and is not an Oblique marker.

---

## **Documentation Nodes (`token_family_docs`)**

Each token family carries one `token_family_docs` node holding the family's human-readable description for the Figma living-documentation tables.

### **Purpose and location**

- The node lives **inside the token file that owns the family**, at the family's namespace root. For `ob.s.color.neutral` the node is `ob.s.color.neutral.token_family_docs` inside `03_semantic/color/compiled.json`; for `ob.p.color` it is inside `02_primitive/color.json`. It is **not** a separate file or folder.
- It is identified by its **key name**, `token_family_docs`.
- It holds only a `$description`. It has **no `$value`** — so it is not a token, and the build, resolver and exporters skip it automatically. It carries **no `$extensions`**.

### **Node format**

```json
"token_family_docs": {
  "$description": {
    "$type": "other",
    "$value": "Foundational colors for backgrounds, text, borders, and surfaces."
  }
}
```

### **Separation of concerns**

Builder configuration for the Figma documentation tables holds **structural data only** — tier, component type, role, token groups. Text content — descriptions and usage guidance — belongs in the `token_family_docs` node inside the token file, never in builder configuration.
