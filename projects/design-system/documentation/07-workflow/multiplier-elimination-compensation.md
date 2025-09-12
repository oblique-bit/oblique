# Multiplier Elimination - Value Compensation Guide

**Goal:** Remove all multipliers and bake their values directly into affected tokens

## Current Multiplier Values
- **mult_responsive (desktop):** 4
- **mult_responsive (mobile):** 5  
- **mult_static:** 4

## Files Requiring Value Compensation

### **1. primitive/border.json** 
**Current multiplier usage:** 2 locations using `{ob.g.scale.mult_responsive}`

#### **borderRadius._base (Line ~59)**
```json
// Current:
"_base": {
  "$type": "borderRadius", 
  "$value": "{ob.g.scale.mult_responsive}"
}

// Replace with compensated value:
"_base": {
  "$type": "borderRadius",
  "$value": "4",
  "$description": "Base border radius - compensated from desktop mult_responsive value"
}
```

#### **borderWidth._base (Line ~98)**  
```json
// Current:
"_base": {
  "$type": "borderWidth",
  "$value": "{ob.g.scale.mult_responsive}" 
}

// Replace with compensated value:
"_base": {
  "$type": "borderWidth", 
  "$value": "4",
  "$description": "Base border width - compensated from desktop mult_responsive value"
}
```

### **2. primitive/sizing.json**
**Current multiplier usage:** 1 location using `{ob.g.scale.mult_responsive}`

#### **size._base (Line ~163)**
```json
// Current:
"_base": {
  "$type": "dimension",
  "$value": "{ob.g.scale.mult_responsive}",
  "$description": "Acts as the foundational size token used to scale all derived sizing values, enabling consistent resizing for responsive modes."
}

// Replace with compensated value:
"_base": {
  "$type": "dimension", 
  "$value": "4",
  "$description": "Base sizing unit - compensated from desktop mult_responsive value. All derived sizing values scale from this foundation."
}
```

### **3. primitive/typography.json**
**Current multiplier usage:** 2 locations using `{ob.g.scale.mult_static}`

#### **fontSize._base (Line ~62)**
```json
// Current:
"_base": {
  "$type": "fontSizes",
  "$value": "{ob.g.scale.mult_static}"
}

// Replace with compensated value:
"_base": {
  "$type": "fontSizes",
  "$value": "4", 
  "$description": "Base font size multiplier - compensated from mult_static value"
}
```

#### **lineHeight._base (Line ~301)**
```json
// Current:
"_base": {
  "$type": "lineHeights", 
  "$value": "{ob.g.scale.mult_static}"
}

// Replace with compensated value:
"_base": {
  "$type": "lineHeights",
  "$value": "4",
  "$description": "Base line height multiplier - compensated from mult_static value" 
}
```

### **4. semantic/spacing/desktop.json & mobile.json**
**Current multiplier usage:** Both files use `{ob.g.scale.mult_responsive}` via `{ob.s.space._base}`

#### **space._base (Line ~83 in both files)**
```json
// Current (desktop.json):
"_base": {
  "$type": "spacing",
  "$value": "{ob.g.scale.mult_responsive}"
}

// Replace with compensated value (desktop):
"_base": {
  "$type": "spacing",
  "$value": "4",
  "$description": "Desktop base spacing unit - compensated from mult_responsive desktop value"
}
```

```json
// Current (mobile.json):
"_base": {
  "$type": "spacing", 
  "$value": "{ob.g.scale.mult_responsive}"
}

// Replace with compensated value (mobile):
"_base": {
  "$type": "spacing",
  "$value": "5", 
  "$description": "Mobile base spacing unit - compensated from mult_responsive mobile value"
}
```

## Impact Validation

### **Expected Outputs (Before & After)**

**Border radius/width:**
- Before: mult_responsive × 1 = 4px (desktop) / 5px (mobile)
- After: 4px direct value (desktop) / 5px direct value (mobile) ✅

**Sizing tokens:**
- Before: size value × mult_responsive = final px
- After: size value × 4 (baked in) = same final px ✅

**Typography:**  
- Before: font value × mult_static(4) = final size
- After: font value × 4 (baked in) = same final size ✅

**Spacing:**
- Before: space value × mult_responsive = final spacing
- After: space value × 4(desktop)/5(mobile) = same final spacing ✅

## Files to Delete After Compensation

**Multiplier definition files:**
- `global/themes-user/viewport/desktop.json` - Remove mult_responsive
- `global/themes-user/viewport/mobile.json` - Remove mult_responsive  
- `global/themes-user/viewport/static.json` - Remove mult_static

**Theme configuration:**
- Update `$themes.json` to remove multiplier references

## Step-by-Step Process

1. **Apply compensations** in primitive and semantic files (above replacements)
2. **Test build** to ensure no broken references
3. **Validate outputs** match expected values 
4. **Delete multiplier definitions** from global/themes-user files
5. **Update theme configuration** 
6. **Final validation** - all systems work without multipliers

---
**Total compensations needed:** 6 value replacements across 5 files  
**Result:** Clean token system with no multiplier dependencies
