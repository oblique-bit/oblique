# 11. Button_Aug Slot Implementation Guide

**Version:** 1.0  
**Date:** September 5, 2025  
**Status:** Work in Progress - Not Yet Approved by Product Owner  
**Purpose:** Converting Button_Aug to Slot Architecture - Proof of concept for slot component pattern

## **Target Audience**
**Primary:** DS/Oblique Designers, DS/Oblique Developers  
**Secondary:** Component Implementation Specialists, Figma Advanced Users  
**Prerequisites:** Understanding of slot component architecture, advanced Figma component knowledge  
**Related Personas:** [Design System Personas](../../02-foundation/02-personas.md)

---

## 11.1 Current State Analysis

**Button_Aug Components:**
- `Button_Aug/Text`: 108 variants
- `Button_Aug/Icon-Only`: 32 variants
- **Children**: Badge (show=off), Tooltip (show=off)

**Current Architecture:**
```
Button_Aug/Text
├── Button Base (fixed)
├── Icon (positional: none|left|right)
├── Text (always visible)
├── Badge (Boolean: show=off default)
└── Tooltip (Boolean: show=off default)
```

---

## 11.2 Step-by-Step Implementation

### 11.2.1 Create Slot Placeholder Components

**11.2.1.1 Create Badge Slot Placeholder**
```
Component: "Badge_Slot_Placeholder"
Design:
- Size: 16x16px (badge default size)
- Fill: Transparent with dashed border (#999999, 1px)
- Text: "Badge" (8px, center aligned)
- Auto Layout: Hug contents
- Constraints: Top-left
```

**11.2.1.2 Create Tooltip Slot Placeholder**
```
Component: "Tooltip_Slot_Placeholder"  
Design:
- Size: 200x32px (tooltip approximate size)
- Fill: Transparent with dashed border (#999999, 1px)
- Text: "Tooltip Content" (12px, center aligned)
- Auto Layout: Hug contents
- Constraints: Top-left
```

**11.2.1.3 Create Icon Slot Placeholder**
```
Component: "Icon_Slot_Placeholder"
Design:
- Size: 16x16px (icon default size)
- Fill: Transparent with dashed border (#999999, 1px)
- Icon: Placeholder icon or "Icon" text
- Auto Layout: Fixed size
- Constraints: Center
```

### 11.2.2 Rebuild Button_Aug with Slot Architecture

**11.2.2.1 Button_Aug/Text Structure**
```
Button_Aug/Text (Main Component)
├── Button Container (Auto Layout: Horizontal, Hug contents)
│   ├── Icon_Slot (Instance Swap Property)
│   │   └── Icon_Slot_Placeholder (default)
│   └── Text Layer (fixed)
├── Badge_Slot (Instance Swap Property)
│   └── Badge_Slot_Placeholder (default)
└── Tooltip_Slot (Instance Swap Property)
    └── Tooltip_Slot_Placeholder (default)
```

**11.2.2.2 Auto Layout Configuration**
```
Main Container:
- Direction: Vertical
- Spacing: 4px (from design tokens)
- Padding: 0 (button handles its own padding)
- Resizing: Hug contents
- Alignment: Top-left

Button Container:
- Direction: Horizontal  
- Spacing: 8px (icon-text gap)
- Padding: Use button token values
- Resizing: Hug contents
- Alignment: Center
```

### 11.2.3 Configure Instance Swap Properties

**11.2.3.1 Icon Slot Configuration**
```
Property Name: "Icon_Content"
Default Value: Icon_Slot_Placeholder
Preferred Instances:
- Icon_Slot_Placeholder (empty state)
- Common icons from icon library
- Custom icon components
```

**11.2.3.2 Badge Slot Configuration**
```
Property Name: "Badge_Content"  
Default Value: Badge_Slot_Placeholder
Preferred Instances:
- Badge_Slot_Placeholder (empty state)
- Badge.sm (from badge library)
- Badge.lg (from badge library)
- Custom badge variants
```

**11.2.3.3 Tooltip Slot Configuration**
```
Property Name: "Tooltip_Content"
Default Value: Tooltip_Slot_Placeholder  
Preferred Instances:
- Tooltip_Slot_Placeholder (empty state)
- Tooltip.top (from tooltip library)
- Tooltip.bottom (from tooltip library)
- Custom tooltip variants
```

### 11.2.4 Create Slot Content Library

**11.2.4.1 Badge Slot Components**
```
Badge.Empty (transparent, 0x0 size)
Badge.sm.primary
Badge.sm.secondary
Badge.lg.primary
Badge.lg.secondary
Badge.notification (red dot)
```

**11.2.4.2 Icon Slot Components**
```
Icon.Empty (transparent, 0x0 size)
Icon.16.outlined (from icon library)
Icon.16.filled (from icon library)
Icon.custom (placeholder for custom icons)
```

**11.2.4.3 Tooltip Slot Components**
```
Tooltip.Empty (transparent, 0x0 size)
Tooltip.top.light
Tooltip.top.dark
Tooltip.bottom.light
Tooltip.bottom.dark
```

### 11.2.5 Implementation in Figma

**11.2.5.1 Component Creation Workflow**
1. Create all placeholder components first
2. Build main Button_Aug component with placeholders
3. Set up Auto Layout on all containers
4. Configure Instance Swap properties
5. Create slot content library
6. Test with various combinations

**11.2.5.2 Testing Checklist**
```
**Note:** Icon slot swaps correctly
**Note:** Badge slot swaps correctly  
**Note:** Tooltip slot swaps correctly
**Note:** Empty states work (invisible slots)
**Note:** Auto Layout responds to size changes
**Note:** Constraints work in different containers
**Note:** Responsive behavior maintained
**Note:** Token values applied correctly
```

---

## 11.3 Migration Strategy

### 11.3.1 Phase 1: Proof of Concept (Week 1)
- Create placeholder components
- Build single Button_Aug/Text with slots
- Test basic slot swapping functionality
- Document learnings and adjustments

### 11.3.2 Phase 2: Implementation (Week 2)
- Create full slot content library
- Build Button_Aug/Icon-Only with slots
- Set up all instance swap properties
- Create usage documentation

### 11.3.3 Phase 3: Integration (Week 3)
- Update existing button instances
- Test in real design contexts
- Gather designer feedback
- Refine slot architecture based on usage

### 11.3.4 Phase 4: Rollout (Week 4)
- Publish to V9 library
- Create migration guide for designers
- Update component documentation
- Monitor adoption and performance

---

## 11.4 Expected Outcomes

### 11.4.1 Variant Reduction
**Before:**
- Button_Aug/Text: 108 variants
- Button_Aug/Icon-Only: 32 variants
- **Total: 140 variants**

**After:**
- Button_Aug/Text: ~12 variants (size × state × button type, no icon variations)
- Button_Aug/Icon-Only: ~8 variants (size × state × button type)
- **Total: ~20 variants** (85% reduction)

### **Flexibility Gains**
- **Unlimited icon combinations** via icon slot
- **Any badge configuration** via badge slot
- **Custom tooltip content** via tooltip slot
- **No detaching required** for custom content

### **Performance Improvements**
- Fewer variants = better Figma performance
- Smaller library file size
- Faster component loading
- Better browser experience

---

## Technical Details

### **Token Integration**
```
Button Container Spacing:
- Icon gap: {ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index}
- Padding: {button-aug token values}

Slot Positioning:
- Badge: Absolute positioned top-right
- Tooltip: Positioned based on tooltip type
- Icon: Inline with text flow
```

### **Responsive Behavior**
```
Container=wide:
- Horizontal layout maintained
- All slots visible

Container=narrow:  
- Responsive stacking if needed
- Tooltip position adjusts
- Badge position maintained
```

### **Component Properties**
```
Button_Aug/Text:
- Size: sm | md | lg (reduced from icon variations)
- State: default | hover | pressed | disabled  
- Button Type: primary | secondary | tertiary
- Icon_Content: Instance Swap Property
- Badge_Content: Instance Swap Property
- Tooltip_Content: Instance Swap Property
```

---

## Success Criteria

### **Designer Experience**
- [ ] Can add custom icons without detaching
- [ ] Can add custom badges without detaching
- [ ] Can add custom tooltips without detaching
- [ ] Slot swapping is intuitive and fast
- [ ] Auto Layout responds predictably

### **System Integrity**
- [ ] Component updates propagate to all instances
- [ ] Design tokens applied consistently
- [ ] Responsive behavior works as expected
- [ ] Performance improved vs. variant-heavy approach

### **Development Handoff**
- [ ] Clear slot documentation for developers
- [ ] Predictable HTML/CSS structure
- [ ] Component API matches slot architecture
- [ ] Token values properly documented

---

This implementation approach transforms Button_Aug from a variant-heavy component to a flexible slot-based architecture while maintaining all current functionality and adding significant new capabilities.
