# Semantic Colors

**About this document:** This document defines the semantic color system structure, static colors, and organization within the Oblique Design System.

**Scope:** All semantic color tokens including hierarchical layers, static values, and category organization.

---

## **Semantic Color Architecture**

The semantic color system is organized into **dimensional layers** and **static values**:

### ****Structure:** File Structure**

```
src/lib/themes/03_semantic/color/
├── s1-lightness/          # Semantic Level 1: Light/Dark theme variations
│   ├── light.json         # Light theme colors
│   └── dark.json          # Dark theme colors
├── s2-emphasis/           # Semantic Level 2: High/Low emphasis variations
│   ├── high.json          # High emphasis colors
│   └── low.json           # Low emphasis colors
└── s3-semantic/           # Semantic Level 3: Complete semantic color collection
    └── semantic.json      # Final semantic color compilation
```

### **Semantic Level System Logic**

#### **S1 - Lightness Semantic Level** (`s1-lightness/`)
- **Purpose**: Light/dark theme adaptation
- **Contains**: `neutral`, `interaction`, and `status` categories
- **Files**: `light.json`, `dark.json`
- **Inversity**: Each token has flat `inversity_normal` and `inversity_flipped` variants (not a separate semantic level)
- **Example token**: `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index`

#### **S2 - Emphasis Semantic Level** (`s2-emphasis/`)
- **Purpose**: High/low emphasis variations for interaction elements  
- **Contains**: `interaction` category only (buttons, links, form controls)
- **Files**: `high.json`, `low.json`
- **Reference**: All S2 tokens reference S1 tokens directly
- **Example token**: `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index`

#### **S3 - Semantic Compilation** (`s3-semantic/`)
- **Purpose**: Complete, clean collection of all semantic colors
- **Contains**: All categories (neutral, interaction, status, static brand colors)  
- **File**: `semantic.json`
- **Reference**: Compiles tokens from S1, S2, and static sources
- **Usage**: Primary consumption point for component tokens

#### **L3 - Semantic Compilation** (`s3-semantic/`)
- **Purpose**: Complete semantic color compilation and final token definitions
- **Contains**: Final compiled semantic colors combining all layer variations plus static colors
- **Files**: `semantic.json`
- **Inversity**: Flat inversity variants preserved in final compilation (not dimensional)
- **Example token**: `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index

---

## **Static Colors**

Static colors are **non-themeable** values that remain constant across all theme modes and variations. These are now integrated into the **s3-semantic semantic level**.

### **Brand Colors**

#### **Static Brand**
```json
{
  "ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index
    "description": "Static color to be used in the brand relevant UI elements."
  }
}
```

- **Purpose**: Consistent brand identity
- **Usage**: Brand elements, logos, primary brand touches  
- **Behavior**: Never changes with theme modes
- **Location**: `s3-semantic/03_semantic.json`

### **Neutral Utilities**

#### **No Color / Transparent**
```json
{
  "ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index}",
    "description": "Static value when no color respectively 0% opacity is needed."
  }
}
```

- **Purpose**: Transparent/invisible elements
- **Usage**: Hidden borders, transparent backgrounds
- **Behavior**: Always transparent (0% opacity)
- **Location**: `s3-semantic/03_semantic.json`

### **Static Interaction Indicators**

#### **Selection States**
```json
{
  "ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index}"
  },
  "ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index}",
    "description": "Semantic Interaction color for not selected items. Used in Main Navigation, Navigation Tree, Tabs."
  }
}
```

- **Purpose**: Clear selection indication
- **Usage**: Navigation states, tab selection, tree selection
- **Behavior**: Static brand color for selected, transparent for unselected

---

## **Category Organization**

The semantic color system is organized into **four main categories**:

### **Brand Category**
- **Location**: `s3-semantic/03_semantic.json` (integrated with final compilation)
- **Purpose**: Brand identity elements
- **Includes**: Single brand color for consistent identity

### **Neutral Category**
- **Location**: L1 semantic level files (`s1-lightness/`) + S3 compilation (`s3-semantic/`)
- **Purpose**: Non-interactive UI elements
- **Includes**: 
  - Background colors (`bg`)
  - Text colors (`fg`)
  - Border colors (`border`)
  - Surface colors
  - Utility colors (transparent/no_color)

### **Interaction Category**
- **Location**: L1 semantic level files (`s1-lightness/`) + S2 emphasis (`s2-emphasis/`) + S3 compilation (`s3-semantic/`)
- **Purpose**: Interactive UI elements
- **Includes**:
  - Button colors
  - Link colors  
  - Focus states
  - Hover states
  - Active states
  - Emphasis variations

### **Status Category**
- **Location**: L1 semantic level files (`s1-lightness/`) + S3 compilation (`s3-semantic/`)
- **Purpose**: System state communication
- **Includes**:
  - Reserved statuses (info, resolved, critical, attention)
  - Flexible statuses (pending, confirmed, progress, etc.)
  - Foreground and background variations

---

## **Token Resolution Flow**

### **Layered Token Example**
```
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index
│
└─ L3 (Semantic): Direct static value (bundesrot) - no theme, emphasis, or inversity variations
```

### **Inversity as Flat Property**
- **Not a layer or mode** - inversity is simply a token variant
- **Available everywhere** - most tokens have both `inversity_normal` and `inversity_flipped`
- **Component-level choice** - developers choose which inversity variant to use
- **Simple implementation** - no complex mode switching, just token selection

---

## **Usage Guidelines**

### **When to Use Layered Colors (L1/L2/L3)**
- **UI backgrounds** that should adapt to themes
- **Interactive elements** that need emphasis variations
- **Text colors** that should maintain contrast in all modes
- **Component colors** that should be themeable

### **When to Use Static Colors**
- **Brand elements** that must maintain visual identity
- **Logo colors** that should never change
- **Transparent/utility** values that are always the same
- **Fixed indicators** that need consistent meaning

### **Anti-Patterns**
- - **Don't use static colors** for general UI backgrounds
- - **Don't use layered colors** for brand elements
- - **Don't mix static and layered** unnecessarily
- - **Don't create static colors** that could be themed

---

## **File Organization Rationale**

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

## **Related Documentation**

- [Color Tokens Overview](./colors-overview.md) - Complete color system documentation
- [Modes System](../../02-modes/) - How modes work with semantic colors
- [Token Consumption Guidelines](../guidelines-token-consumption.md) - How to use tokens properly
- [Token Architecture](../architecture.md) - Token structure and naming patterns

---

*Last updated: August 11, 2025 - Updated token structure: removed static wrapper, moved no_color to neutral category, established four main semantic color groups*
