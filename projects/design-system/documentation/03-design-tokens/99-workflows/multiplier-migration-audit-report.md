# Multiplier Migration Audit Report

**Date:** September 12, 2025  
**Status:** Step 1 Complete - Audit of existing multiplier usage  
**Next:** Create new folder structure and migrate base values

## Current Multiplier System Analysis

### **Active Multipliers Found**

**1. `ob.g.scale.mult_responsive`** (Viewport responsive multipliers)
- **Desktop value:** 4px (defined in `global/themes-user/viewport/desktop.json`)
- **Mobile value:** 5px (defined in `global/themes-user/viewport/mobile.json`)
- **Note:** Mobile has bug comment indicating it should be 1.25x larger than desktop

**2. `ob.g.scale.mult_static`** (Base scaling multiplier)
- **Value:** 4px (defined in `global/themes-user/viewport/static.json`)
- **Usage:** Base foundation for consistent sizing

### **Files Using Multipliers**

#### **Critical Files - Direct Usage (5 files):**
1. `semantic/spacing/desktop.json` - Line 83: `{ob.g.scale.mult_responsive}`
2. `semantic/spacing/mobile.json` - Line 83: `{ob.g.scale.mult_responsive}`
3. `primitive/border.json` - Lines 59, 98: `{ob.g.scale.mult_responsive}`
4. `primitive/sizing.json` - Line 163: `{ob.g.scale.mult_responsive}`
5. `primitive/typography.json` - Lines 62, 301: `{ob.g.scale.mult_static}`

#### **Configuration Files (2 files):**
- `$themes.json` - Theme configuration references
- Various documentation files (not affecting build)

### **Current System Architecture**

**How it works currently:**
- **Primitive tokens:** Define base values (4, 6, 8, 10, 12, 20px, etc.)
- **Multiplier application:** `{ob.g.scale.mult_responsive}` multiplies these primitive values
- **Final output:** Primitive × Multiplier = Final token value

**Example Current Flow:**
```
Primitive: ob.p.size.250 = 20px (base value)
Desktop: 20px × 4 (mult_responsive) = 80px output
Mobile: 20px × 5 (mult_responsive) = 100px output
```

### **Migration Strategy Correction**

**Current Understanding:** Primitives are base values, multipliers scale them
**Migration Approach:** Keep primitive values unchanged, update multiplier system

**Corrected Migration Formula:**
- **Primitives:** Stay the same (20px remains 20px)  
- **New multipliers:** Desktop 4px → 1.0, Mobile 5px → 1.25
- **Base value adjustment:** Multiply primitives by 4 to compensate

**Example Migration:**
```
Step 1: Current primitive ob.p.size.250 = 20px
Step 2: New primitive ob.p.size.250 = 80px (20 × 4)
Step 3: New multiplier desktop = 1.0, mobile = 1.25
Result: Desktop: 80px × 1.0 = 80px ✅, Mobile: 80px × 1.25 = 100px ✅
```

### **Typography System:**
- **Base multiplier:** `{ob.g.scale.mult_static}` = 4px
- **Non-responsive:** Same across all viewports

## Migration Requirements

### **Base Value Adjustments Needed:**

**1. Primitive sizing tokens (`primitive/sizing.json`):**
- **Current:** Primitives define base values (4, 6, 8, 10, 12, 20px, etc.)
- **Migration:** Multiply all primitive values × 4 to compensate for new multiplier system  
- **Example:** `"250": { "$value": "20" }` → `"250": { "$value": "80" }`
- **Reason:** Maintains same final output when new multipliers (1.0/1.25) are applied

**2. Spacing and border systems:**
- **Current:** Use `{ob.g.scale.mult_responsive}` to multiply primitive values
- **Migration:** Update references to new `{ob.g.02-multipliers.viewport.*}` structure
- **No value changes needed:** Spacing primitives already scale correctly through references

**3. Typography system:**
- **Current:** Uses `{ob.g.scale.mult_static}` = 4px
- **Migration:** Remove static multiplier, typography becomes non-responsive baseline

### **New Multiplier Values:**
- **Desktop:** 1.0 (no scaling from base)
- **Mobile:** 1.25 (25% larger for touch accessibility)

## Files Requiring Migration

### **Priority 1 - Core Token Files:**
1. `primitive/sizing.json` - Multiply all hardcoded values × 4
2. `semantic/spacing/desktop.json` - Update base reference
3. `semantic/spacing/mobile.json` - Update base reference  
4. `primitive/border.json` - Update multiplier references
5. `primitive/typography.json` - Remove static multiplier usage

### **Priority 2 - Configuration:**
1. Create new `global/02-multipliers/viewport/` structure
2. Create new `semantic/01-static/` and `semantic/03-dynamic/` structure
3. Update `$themes.json` references

## Validation Checkpoints

### **Pre-Migration Values to Document:**
- Spacing 4xl desktop output: 4px × 4 × 20 = 320px
- Spacing 4xl mobile output: 5px × 4 × 20 = 400px  
- Size 250 desktop output: 20px × 4 = 80px
- Size 250 mobile output: 20px × 5 = 100px

### **Post-Migration Validation:**
- Same spacing/sizing outputs maintained
- Responsive behavior unchanged
- No broken token references
- Build process successful

## Next Steps

1. **Create folder structure** (Step 2 of migration guide)
2. **Migrate base values** using × 4 formula  
3. **Update token references** to new structure
4. **Test and validate** output consistency

---
**Total files requiring changes:** 7 core files + folder structure creation  
**Migration complexity:** Moderate - straightforward mathematical conversion  
**Breaking change risk:** Low - same output values maintained
