# Typography Foundation

**Date**: September 21, 2025  
**Status**: Active  
**Scope**: Typography architecture and implementation decisions  

## Core Typography Decisions

### REM Units and Base Font Size

**Decision**: Use REM units for all typography with a **fixed 16px base font size** across all contexts and viewports.

**Rationale**:
- **Predictable calculations**: 1rem = 16px consistently across all themes
- **Token Studio compatibility**: Avoids complications with changing base font size per viewport
- **Developer experience**: Engineers know rem values convert predictably
- **Figma consistency**: No need to adjust Token Studio base font size settings per theme
- **Accessibility**: REM units respect user browser font size preferences while maintaining design consistency

### Architecture Layers

**Primitive Layer** (`02_primitive/typography.json`):
```json
"fontSizeRem": {
  "300": { "$value": "1rem" },      // 16px
  "400": { "$value": "1.125rem" },  // 18px
  "500": { "$value": "1.4375rem" }, // 23px
  // ... full scale aligned with font_size_unitless calculations
}
```

**Semantic Layer** (`03_semantic/typography/`):
- **Static**: Base semantic scale (xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl)
- **Viewport**: Screen-specific adaptations (`desktop.json`, `mobile_portrait.json`)
- **Context**: Usage-specific applications (`interface.json`, `prose.json`)

**Token Resolution Flow**:
1. **Primitive**: `fontSizeRem.300` = `1rem`
2. **Viewport**: `ob.s.viewport.fontSize.md` = `{ob.p.fontSizeRem.300}` or `{ob.p.fontSizeRem.400}`
3. **Context**: Interface/prose body = `{ob.s.viewport.fontSize.md}`

### Viewport Typography Strategy

**Desktop**: 
- Interface body: 16px (`1rem`)
- Prose body: 18px (`1.125rem`)

**Mobile Portrait**:
- Interface body: 18px (`1.125rem`) - Improved readability on mobile
- Prose headings: Shift one size smaller (H1-H5) for better mobile hierarchy
- Prose body: 18px (`1.125rem`) - Consistent with interface

### Migration from Unitless to REM

**Current State**: Using `font_size_unitless` with multiplier calculations
**Target State**: Using `fontSizeRem` with direct rem values
**Values**: Mathematically equivalent (both resolve to same pixel values)

**Benefits of REM Migration**:
- Direct rem values in CSS output
- No calculation dependencies  
- Standard CSS approach
- Cleaner debugging experience
- Better Token Studio integration

### Implementation Notes

**Token Studio Base Font Size**:
- Set to **16px** and never change
- Global setting affects all Figma files
- Consistent conversion: rem → pixels in Figma UI

**Backward Compatibility**:
- `fontSizeRem` primitives now align exactly with `font_size_unitless` output
- Migration can happen gradually without breaking changes
- Both systems coexist during transition period

---

*This document reflects architectural decisions made during OUI-4066 typography system implementation.*