# Semantic Colors

**About this document:** This document defines the semantic color system structure, static colors, and organization within the Oblique Design System.

**Scope:** All semantic color tokens including hierarchical layers, static values, and category organization.

---

## 🏗️ **Semantic Color Architecture**

The semantic color system is organized into **dimensional layers** and **static values**:

### **📁 File Structure**

```
src/lib/themes/semantic/color/
├── s1-lightness/          # Layer 1: Light/Dark theme variations
│   ├── light.json         # Light theme colors
│   └── dark.json          # Dark theme colors
├── s2-inversity/          # Layer 2: Normal/Flipped contrast variations  
│   ├── normal.json        # Normal contrast colors
│   └── flipped.json       # Flipped contrast colors
├── s3-emphasis/           # Layer 3: High/Low emphasis variations
│   ├── high.json          # High emphasis colors
│   └── low.json           # Low emphasis colors
└── s0-static.json       # Static colors (non-themeable)
```

### **🎯 Layer System Logic**

#### **L1 - Lightness Layer** (`s1-lightness/`)
- **Purpose**: Light/dark theme adaptation
- **Contains**: `neutral` and `interaction` categories
- **Files**: `light.json`, `dark.json`
- **Example token**: `ob.s1.color.neutral.bg.contrast-high.inversity-normal`

#### **L2 - Inversity Layer** (`s2-inversity/`)
- **Purpose**: Normal/flipped contrast contexts
- **Contains**: Theme variations for different contrast scenarios
- **Files**: `normal.json`, `flipped.json`
- **Example token**: `ob.s2.color.interaction.emphasis-high.bg-base.contrast-high.inversity-normal`

#### **L3 - Emphasis Layer** (`s3-emphasis/`)
- **Purpose**: High/low emphasis variations
- **Contains**: Emphasis level adaptations
- **Files**: `high.json`, `low.json`
- **Example token**: `ob.s3.color.interaction.emphasis-high.fg-base`

---

## 🎨 **Static Colors**

Static colors are **non-themeable** values that remain constant across all theme modes and variations.

### **Brand Colors**

#### **Static Brand**
```json
{
  "ob.s.color.static.brand": {
    "value": "{ob.p.color.basic.bundesrot}",
    "description": "Static color to be used in the brand relevant UI elements."
  }
}
```

- **Purpose**: Consistent brand identity
- **Usage**: Brand elements, logos, primary brand touches
- **Behavior**: Never changes with theme modes

### **Utility Colors**

#### **No Color / Transparent**
```json
{
  "ob.s.color.static.no-color": {
    "value": "{ob.p.color.basic.transparent}",
    "description": "Static value when no color respectively 0% opacity is needed."
  }
}
```

- **Purpose**: Transparent/invisible elements
- **Usage**: Hidden borders, transparent backgrounds
- **Behavior**: Always transparent (0% opacity)

### **Static Interaction Indicators**

#### **Selection States**
```json
{
  "ob.s.color.interaction.indicator.selected": {
    "value": "{ob.s.color.static.brand}"
  },
  "ob.s.color.interaction.indicator.unselected": {
    "value": "{ob.s.color.static.no-color}",
    "description": "Semantic Interaction color for not selected items. Used in Main Navigation, Navigation Tree, Tabs."
  }
}
```

- **Purpose**: Clear selection indication
- **Usage**: Navigation states, tab selection, tree selection
- **Behavior**: Static brand color for selected, transparent for unselected

---

## 📊 **Category Organization**

### **Neutral Category**
- **Location**: L1 layer files (`s1-lightness/`)
- **Purpose**: Non-interactive UI elements
- **Includes**: 
  - Background colors (`bg`)
  - Text colors (`fg`)
  - Border colors (`border`)
  - Surface colors

### **Interaction Category**
- **Location**: L1 layer files (`s1-lightness/`)
- **Purpose**: Interactive UI elements
- **Includes**:
  - Button colors
  - Link colors  
  - Focus states
  - Hover states
  - Active states

### **Static Category**
- **Location**: `s0-static.json` file
- **Purpose**: Non-themeable constants
- **Includes**:
  - Brand colors
  - Utility colors (transparent)
  - Fixed interaction indicators

---

## 🔄 **Token Resolution Flow**

### **Layered Token Example**
```
ob.s2.color.interaction.emphasis-high.bg-base.contrast-high.inversity-normal
│
├─ L1 (Lightness): Resolves based on light/dark theme
├─ L2 (Inversity): Applies normal/flipped contrast
└─ L3 (Emphasis): Applies high/low emphasis level
```

### **Static Token Example**
```
ob.s.color.static.brand
│
└─ Static: Always resolves to the same value (bundesrot)
```

---

## 🎯 **Usage Guidelines**

### **When to Use Layered Colors (L1/L2/L3)**
- ✅ **UI backgrounds** that should adapt to themes
- ✅ **Interactive elements** that need emphasis variations
- ✅ **Text colors** that should maintain contrast in all modes
- ✅ **Component colors** that should be themeable

### **When to Use Static Colors**
- ✅ **Brand elements** that must maintain visual identity
- ✅ **Logo colors** that should never change
- ✅ **Transparent/utility** values that are always the same
- ✅ **Fixed indicators** that need consistent meaning

### **Anti-Patterns**
- ❌ **Don't use static colors** for general UI backgrounds
- ❌ **Don't use layered colors** for brand elements
- ❌ **Don't mix static and layered** unnecessarily
- ❌ **Don't create static colors** that could be themed

---

## 🔍 **File Organization Rationale**

### **Why Separate Files by Layer?**
1. **Dimensional separation** - Each layer represents a different axis of variation
2. **Theme mode efficiency** - Only load the relevant theme files
3. **Figma integration** - Each file corresponds to a Figma variable mode
4. **Maintenance clarity** - Easy to understand which tokens change together

### **Why Static File Separate?**
1. **Behavioral difference** - Static colors never change, layered colors do
2. **Performance** - Static colors can be loaded once and cached
3. **Semantic clarity** - Clear distinction between themeable and non-themeable
4. **Maintenance** - Easy to identify which colors are truly fixed

---

## 📚 **Related Documentation**

- [Color Tokens Overview](./colors.md) - Complete color system documentation
- [Theming Guide](../theming.md) - How themes work with semantic colors
- [Token Consumption Guidelines](../guidelines-token-consumption.md) - How to use tokens properly
- [Token Architecture](../architecture.md) - Token structure and naming patterns

---

*Last updated: July 13, 2025 - Documented semantic color architecture and static color consolidation*
