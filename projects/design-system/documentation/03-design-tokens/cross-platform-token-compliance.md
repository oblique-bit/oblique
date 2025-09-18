# Cross-Platform Token Type Compliance Analysis

*Generated: September 12, 2025*

This document provides a comprehensive analysis of design token type compatibility across W3C DTCG standards, Figma native support, and Tokens Studio plugin capabilities, with recommendations prioritizing Figma-first workflows.

## Compliance Table

| Token Type | W3C DTCG Standard | Figma Native Support | Tokens Studio Plugin | Recommendation (Figma Priority) |
|------------|------------------|---------------------|---------------------|--------------------------------|
| **`color`** | ✅ **Valid** | ✅ **Native Variables** | ✅ **Full Support** | ✅ **Use `"color"`** - Universal compatibility |
| **`dimension`** | ✅ **Valid** | ✅ **Native Variables** | ✅ **Full Support** | ✅ **Use `"dimension"`** - W3C compliant, works everywhere |
| **`fontFamily`** | ✅ **Valid** | ✅ **Text Properties** | ✅ **`fontFamilies` type** | ✅ **Use `"fontFamily"`** - W3C compliant |
| **`fontWeight`** | ✅ **Valid** | ✅ **Text Properties** | ✅ **`fontWeights` type** | ✅ **Use `"fontWeight"`** - W3C compliant |
| **`duration`** | ✅ **Valid** | ❌ **Not supported** | ❌ **Not supported** | ⚠️ **Limited use** - No Figma support |
| **`cubicBezier`** | ✅ **Valid** | ❌ **Not supported** | ❌ **Not supported** | ⚠️ **Limited use** - No Figma support |
| **`spacing`** | ❌ **Invalid** | ✅ **Auto Layout** | ✅ **Native Support** | ✅ **Keep `"spacing"`** - Figma priority, wide plugin support |
| **`borderRadius`** | ❌ **Invalid** | ✅ **Corner Radius** | ✅ **Native Support** | ✅ **Keep `"borderRadius"`** - Figma priority, essential UI property |
| **`sizing`** | ❌ **Invalid** | ✅ **Width/Height** | ✅ **Native Support** | ⚠️ **Use `"dimension"`** - W3C compliant alternative available |
| **`borderWidth`** | ❌ **Invalid** | ✅ **Stroke Properties** | ✅ **Native Support** | ✅ **Keep `"borderWidth"`** - No W3C alternative, essential |
| **`opacity`** | ❌ **Invalid** | ✅ **Opacity Property** | ✅ **Native Support** | ✅ **Keep `"opacity"`** - No W3C alternative, widely used |
| **`boxShadow`** | ❌ **Invalid** | ✅ **Effects** | ✅ **Native Support** | ✅ **Keep `"boxShadow"`** - No W3C alternative, essential UI |
| **`typography`** | ❌ **Invalid** | ✅ **Text Styles** | ✅ **Native Support** | ✅ **Keep `"typography"`** - Composite token, widely used |

## Key Insights & Recommendations

### ✅ **Priority 1: Figma-First Compatibility**
Since your design system is Figma-first, these token types should be prioritized for maximum tooling support:

1. **`spacing`** - Keep as-is (non-W3C but essential for Figma Auto Layout)
2. **`borderRadius`** - Keep as-is (non-W3C but essential for UI design)
3. **`borderWidth`**, **`opacity`**, **`boxShadow`** - Keep as-is (no W3C alternatives)
4. **`typography`** - Keep as-is (composite token, widely supported)

### ✅ **Priority 2: W3C Compliant & Universally Supported**
These are the ideal tokens that work everywhere:

1. **`color`** - Universal compatibility
2. **`dimension`** - W3C compliant replacement for sizing
3. **`fontFamily`** & **`fontWeight`** - W3C compliant text properties

### ⚠️ **Priority 3: Strategic Decisions Needed**

**For `sizing` tokens:** You have two options:
- **Option A:** Migrate from `"sizing"` to `"dimension"` (W3C compliant)
- **Option B:** Keep `"sizing"` for Figma compatibility

**Recommendation:** Migrate `sizing` → `dimension` since it's W3C compliant and Figma supports both.

### 🔄 **Migration Strategy**

For your current primitive token files:

```json
// ✅ Already compliant
"color.json": { "$type": "color" }

// ✅ Already compliant  
"sizing.json": { "$type": "dimension" } // Keep current "dimension"

// ❌ Keep for Figma priority
"spacing.json": { "$type": "spacing" } // Non-W3C but essential

// ❌ Keep for Figma priority  
"border.json": { "$type": "borderRadius" } // Non-W3C but essential
```

### 🎯 **Final Recommendation**

**Balanced Approach:** Maintain Figma-first functionality while adopting W3C compliance where practical:

1. ✅ Use W3C types when they exist AND are well-supported (`color`, `dimension`, `fontFamily`, `fontWeight`)
2. ✅ Keep non-W3C types when they're essential for Figma workflows (`spacing`, `borderRadius`, `borderWidth`, `opacity`, `boxShadow`, `typography`)
3. ⚠️ Avoid W3C types with poor tooling support (`duration`, `cubicBezier`)

This strategy gives you the best of both worlds: standards compliance where practical, and maximum Figma/tooling compatibility where needed.

## Research Sources

### W3C Design Tokens Community Group (DTCG)
- **Valid Token Types:** `color`, `dimension`, `fontFamily`, `fontWeight`, `duration`, `cubicBezier`
- **Invalid Types:** All others not explicitly defined in the specification
- **Specification Focus:** Interoperability across design tools and platforms

### Carbon Design System Analysis
- Uses **`layout`** type for all spatial tokens (non-W3C compliant)
- Consolidates spacing/sizing under semantic approach
- Prioritizes design system organization over strict W3C compliance

### Tokens Studio for Figma Plugin
- **Supported Types:** All commonly used design token types
- **Key Features:** TypeScript definitions, Figma plugin compatibility, $themes.json schema
- **Strengths:** Comprehensive support for both W3C and non-W3C types

### Figma Native Variable Support
- **Native Variables:** Color, number (dimension), string, boolean
- **Plugin-Enhanced:** Spacing, borderRadius, typography, boxShadow, etc.
- **Design Integration:** Direct binding to component properties and styles

---

*This analysis supports the design system's Figma-first approach while maintaining standards awareness for future interoperability.*
