# Design Tokens: Foundation Architecture

**Purpose**: Core architectural principles and token structure for the Oblique Design System  
**Audience**: Design system maintainers, token architects, technical leads  
**Related**: [Token Naming](02-naming.md) | [System Requirements](../05-reference/02-system-requirements.md) | [Tokenization Process](../05-reference/03-workflows-readme.md)

---

## **Foundation Principles**

### **Code-Figma Token Alignment**
Code and Figma tokens stay in seamless consistency, with narrow, documented exceptions — see [Principles: Seamless Token Consistency](00-principles.md#exceptions).

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
  s1 → Lightness (light/dark mode switching)
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
4. **S1 handles lightness mode switching** - Light/dark values resolved at S1 level
5. **Global tokens exception** - `ob.g.*` tokens can be referenced from any level

### **Token Naming**
Complete naming conventions and patterns are documented in [Token Naming Conventions](02-naming.md).

---

## **Semantic Layer System (S1/S2/ob.s)**

### **S1: Lightness Layer**
- **Purpose**: Light/dark mode switching
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
- **Examples**: `ob.p.color.red.50`, `ob.s.color.neutral.fg.contrast_high.inversity_normal`
- **Modes**: Handled through S1 lightness layer (light/dark)

### **Spacing Tokens**  
- **Structure**: `ob.{layer}.spacing.{size}`
- **Examples**: `ob.s.dimension.dynamic.ui_scale.spacing.md.px`, `ob.c.{component}.spacing.padding`
- **Scaling**: Mathematical multipliers prevent token explosion

### **Typography Tokens**
- **Structure**: `ob.{layer}.typography.{category}.{size}`
- **Examples**: `ob.s.typography.scale.dynamic.font_size.lg`, `ob.h.button.typography.font_size` (planned, not shipped in this release)
- **Foundation**: REM-based with 16px base font size

### **Dimension/Sizing Tokens**
- **Structure**: `ob.{layer}.dimension.{category}.{size}`  
- **Examples**: `ob.s.dimension.dynamic.ui_scale.element.md.rem`, `ob.c.{component}.dimension.height`
- **Modes**: Support density and ui_scale scaling

---

## **Global Token System**

### **Multiplier Architecture**
**Purpose**: Enable proportional scaling without token explosion

**Structure Pattern**:
```
ob.g.mode_collection.{mode_collection}.multiplier.{category}.{size}
```

**Examples**:
```
ob.g.mode_collection.ui_scale.multiplier.dimension.sm    → 0.8   (80% scaling)
ob.g.mode_collection.ui_scale.multiplier.dimension.md    → 1     (100% baseline)  
ob.g.mode_collection.ui_scale.multiplier.dimension.lg    → 1.25  (125% scaling)
```

**Usage**: Mathematical scaling maintains relationships while enabling modes

### **System Configuration**
- **Viewport settings**: Breakpoints and responsive behavior
- **Base values**: System-wide foundations (font size, spacing base)
- **Mode configuration**: Mode switching and management

---

## **File Structure vs Token Names**

### **CRITICAL: Structure Independence**
**Token names DO NOT follow folder and JSON file naming conventions.**

**Example**:
```
File: src/lib/themes/01_global/mode_collection/ui_scale.json
Token Name: ob.g.mode_collection.ui_scale.multiplier.dimension.md
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

### **No Calculations in Consumer Layers**

All calculations, particularly those involving global-tier (01_global) multipliers (`ob.g.*`), **must** occur exclusively within the semantic layer (`ob.s`). Component layers (`ob.h`, `ob.c`) are forbidden from performing calculations and must consume pre-defined `static` or `dynamic` semantic tokens. See the Reference Hierarchy Rules above for the full consumption chain.

### **Architecture Examples**

#### Do: Consume pre-defined semantic tokens in components
Component-level tokens should directly reference a token from the semantic layer (`ob.s`). This keeps the component layer clean and free of logic.

```json
// In: 05_html/link/link.json (Component Layer)
{
  "color": {
    "hover": {
      "$value": "{ob.s.color.interaction.contrast_levels.fg.low.inversity_normal}"
    }
  }
}
```

#### Don't: Perform calculations in the component layer
Calculations using global-tier (01_global) multipliers (`ob.g.*`) are strictly forbidden at the component (`ob.h`, `ob.c`) level. All calculations must be done in the semantic layer.

```json
// In: 05_html/link/link.json (Component Layer)
// THIS IS FORBIDDEN!
{
  "font_size": {
    "$value": "{ob.p.font_size_unitless.400} * {ob.g.mode_collection.ui_scale.multiplier.typography.md}"
  }
}
```

## **Token Naming Reference**

All naming conventions, patterns, and guidelines are documented in [Token Naming Conventions](02-naming.md), including:
- Token hierarchy patterns
- Primitive vs semantic naming principles  
- Compound units system
- Reference chain validation
- Style Dictionary integration

---


## **Configuration & documentation tokens**

Most tokens resolve to a CSS custom property — the styling output the components consume. A distinct group does **not**: the resolver never emits them as CSS. They exist to *configure* the build and Figma, or to *document* the token families. Three groups, all carrying `$type: "other"`:

### **Mode-collection config — `ob.g.mode_collection.*`**

Defines the seven mode axes: lightness, emphasis, ui_scale, density, typography_context, motion, viewport. Per mode it holds the `selector` — the CSS class the application adds to activate the mode (`.ob-lightness-dark`). The `ui_scale` and `density` collections also carry the multipliers; the `viewport` collection carries the breakpoints and per-range bounds. The build reads these to discover the modes and to name the CSS mode blocks; in Figma each collection becomes a variable collection. The tokens are not themselves emitted as custom properties.

The single-mode base groups `static` and `semantic` do **not** have files under `mode_collection/`. Token Studio's single-mode-group semantics already encode them as always-on, and the build pipeline identifies them via set-difference: `$themes.json` groups with no matching `mode_collection/<axis>.json` file are always-on base groups.

### **Documentation nodes — `token_family_docs`**

One per token family, holding the family's `$description`. Documentation, not a styling value. See *Documentation Nodes* below for the format and rules.

`$type: "other"` is the correct type for all three — there is no styling type for a CSS-class selector, a fixed-mode setting, or a family description. See [Token Types](../02-token-tiers/00-overview.md).

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

- The node lives **inside the token file that owns the family**, at the family's namespace root. For `ob.g.mode_collection.lightness` the node is `ob.g.mode_collection.lightness.token_family_docs` inside `01_global/mode_collection/lightness.json`. It is **not** a separate file or folder. (A handful of files — `03_semantic/color/compiled.json` among them — use a `_docs.token_family_info` node instead; check the file before assuming which one applies.)
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
