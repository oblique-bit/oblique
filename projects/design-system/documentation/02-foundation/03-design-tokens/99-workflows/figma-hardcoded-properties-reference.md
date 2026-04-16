# Figma Hardcoded Properties Reference

**Generated:** September 26, 2025  
**Purpose:** Complete list of Figma properties that cannot be controlled by variables  
**Source:** Oblique Design System analysis + Figma MCP extraction findings  

## Overview

Figma variables have significant limitations in what properties they can control. Many layout, positioning, and behavioral properties must be set manually or "hardcoded" in Figma designs. This creates a disconnect between design system tokens and actual Figma implementation.

## 📋 Complete List of Hardcoded Figma Properties

### 🎯 Layout & Auto Layout Properties

#### **Auto Layout Configuration**
- **`direction`** - Row vs Column layout direction ❌
- **`spacing`** - Gap between auto layout items (partially supported ⚠️)
- **`padding`** - Internal padding (partially supported ⚠️)
- **`justify-content`** - Alignment along primary axis ❌
- **`align-items`** - Alignment along cross axis ❌
- **`wrap`** - Whether items wrap to new lines ❌

#### **Sizing Behavior**
- **`hug contents`** - Component hugs its content ❌
- **`fill container`** - Component fills parent container ❌
- **`fixed width/height`** - Fixed dimensions (variables can set values but not behavior) ❌

#### **Constraints & Positioning**
- **`constraints`** - How objects respond to parent resizing ❌
  - Left/Right/Center/Left & Right
  - Top/Bottom/Center/Top & Bottom
- **`absolute positioning`** - Position relative to parent frame ❌
- **`z-index`** - Stacking order of layers ❌

### 🎨 Visual Properties (Variable Limitations)

#### **Typography Behavior**
- **`text-align`** - Text alignment (left/center/right) ❌
- **`vertical-align`** - Vertical text alignment ❌
- **`text-decoration`** - Underline, strikethrough ❌
- **`text-transform`** - Uppercase, lowercase, capitalize ❌
- **`vertical-trim`** - Cap height to baseline trimming ❌
- **`text-overflow`** - How text handles overflow ❌

#### **Advanced Text Properties**
- **`paragraph-spacing`** - Space between paragraphs ❌
- **`list-style`** - Bullet/number styles ❌
- **`text-case`** - Case transformation behavior ❌

### 🖼️ Visual Effects & Styling

#### **Effects & Filters**
- **`blend-modes`** - How layers blend together ❌
- **`opacity`** - Transparency (can use variables for values but not behavior) ⚠️
- **`drop-shadow`** - Shadow effects (can use variables for values) ⚠️
- **`blur`** - Blur effects ⚠️
- **`mask`** - Layer masking ❌

#### **Border & Stroke Properties**
- **`border-style`** - Solid, dashed, dotted ❌
- **`stroke-align`** - Inside, outside, center ❌
- **`stroke-caps`** - Line endings ❌
- **`stroke-joins`** - Corner styles ❌

### ⚡ Interactive & Behavioral Properties

#### **Component Behavior**
- **`component-variants`** - Which variant is shown ❌
- **`instance-swap`** - Swapping component instances ❌
- **`override-behavior`** - How properties can be overridden ❌
- **`resize-behavior`** - How components respond to resizing ❌

#### **Prototyping Properties**
- **`click-targets`** - Interactive areas ❌
- **`hover-states`** - Hover behavior ❌
- **`transitions`** - Animation between states ❌
- **`scroll-behavior`** - How content scrolls ❌

#### **State Management**
- **`visibility`** - Show/hide behavior ❌
- **`disabled-state`** - Interactive vs non-interactive ❌
- **`focus-behavior`** - Focus ring and navigation ❌

### 🗂️ Organizational Properties

#### **Layer Organization**
- **`layer-names`** - How layers are named ❌
- **`layer-grouping`** - Group vs frame behavior ❌
- **`layer-locking`** - Whether layers can be edited ❌
- **`layer-visibility`** - Show/hide in layer panel ❌

#### **Component Structure**
- **`component-nesting`** - How components are nested ❌
- **`slot-behavior`** - How slots work in components ❌
- **`auto-instance`** - Automatic instance creation ❌

## 🔍 Figma MCP Extracted Evidence

### From Button Component Analysis

The attached image shows **"W 113 Hug"** - this demonstrates Figma's hug behavior cannot be controlled by variables:

```json
// From extracted button component (ButtonLabelIcon-generated-code.md)
// These properties were hardcoded in the generated component:

{
  "layout": "auto", // ❌ Cannot be variable
  "sizing": "hug",  // ❌ Cannot be variable 
  "constraints": "left-right", // ❌ Cannot be variable
  "alignment": "center" // ❌ Cannot be variable
}
```

### From Design Token Analysis

```json
// NO-FIGMA-SUPPORT tokens from codebase:
{
  "ob.h.button.flex_direction.row.flex_direction": "[NO-FIGMA-SUPPORT] CSS flex-direction",
  "ob.h.button.flex_direction.row.align_items": "[NO-FIGMA-SUPPORT] CSS align-items", 
  "ob.h.button.flex_direction.row.justify_content": "[NO-FIGMA-SUPPORT] CSS justify-content",
  "ob.p.typography.vertical_trim.cap_alphabetic": "[NO-FIGMA-SUPPORT] Vertical trim from cap height",
  "ob.h.button.typography.text_align": "[NO-FIGMA-SUPPORT] Center alignment for button text"
}
```

## ⚠️ Impact on Design System

### Token Architecture Gaps

1. **Layout Tokens**: Cannot be applied in Figma
   - `flex-direction: row|column`
   - `justify-content: center|flex-start|flex-end`
   - `align-items: center|stretch|flex-start`

2. **Sizing Behavior Tokens**: Must be manually configured
   - `width: hug|fill|fixed`
   - `height: hug|fill|fixed`
   - `min-width/max-width` behavior

3. **Typography Behavior Tokens**: Cannot control alignment
   - `text-align: center|left|right`
   - `vertical-trim: cap|baseline`

### Workarounds & Solutions

#### 1. Component Variants for Behavior
```
Instead of: size-behavior variable (hug/fill/fixed)
Use: Component variants (Size: hug | Size: fill | Size: fixed)
```

#### 2. Manual Configuration Documentation
```
Token: ob.h.button.flex_direction.row.align_items: "center"
Figma: Set manually in Auto Layout → Align Items → Center
CSS: align-items: center;
```

#### 3. MCP-Generated Code Adaptation
```typescript
// Generated from Figma (hardcoded behavior)
className="content-stretch flex gap-[6px] items-center"

// Needs manual adaptation for responsive behavior
className={`
  content-stretch flex gap-[6px] 
  ${alignItems || 'items-center'}
  ${justifyContent || 'justify-center'}
`}
```

## 📋 Design System Integration Strategy

### For Designers

1. **Use Component Variants** for behavioral differences
2. **Document hardcoded settings** in component specifications
3. **Create behavior checklists** for component creation
4. **Use naming conventions** to indicate hardcoded vs variable properties

### For Developers

1. **Extract behavior patterns** from Figma MCP code generation
2. **Create abstraction layers** for hardcoded properties
3. **Build responsive utilities** that Figma cannot represent
4. **Document gaps** between design and implementation

### For Design System Maintainers

1. **Track NO-FIGMA-SUPPORT tokens** as shown in codebase
2. **Create parallel documentation** for Figma vs CSS implementation
3. **Use MCP tools** to identify hardcoded properties in components
4. **Maintain behavior inventories** as components evolve

## 🔧 Tools & Detection Methods

### MCP-Based Detection
```bash
# Use Figma MCP to detect hardcoded properties
mcp_figma_dev_mod_get_metadata   # Shows layout structure
mcp_figma_dev_mod_get_code       # Reveals hardcoded CSS classes
mcp_figma_dev_mod_get_variable_defs # Shows what IS variable-controlled
```

### Code Analysis
```bash
# Search for NO-FIGMA-SUPPORT tokens
grep -r "NO-FIGMA-SUPPORT" src/lib/themes/
# Find hardcoded layout properties
grep -r "hug\|fill\|constraints\|auto-layout" documentation/
```

### Component Auditing
```typescript
// Check generated components for hardcoded classes
// Look for: flex, items-center, justify-*, gap-*, p-*, m-*
// These often indicate hardcoded Figma behavior
```

## 📚 Related Documentation


---

*This list is based on analysis of Figma MCP code generation, Oblique Design System token architecture, and real-world component implementation gaps. Properties marked ❌ cannot be controlled by variables, ⚠️ indicates partial variable support.*