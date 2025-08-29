# Underscore Migration Plan

## Executive Summary

Developer request: "change - into _ so it stays the same after resolving" + "devs dont want camelcase"

**Recommendation: PROCEED with underscore migration**

This addresses the core developer pain point: inconsistent naming between token sources and CSS output.

## Current vs Proposed Workflow

### Current (Problematic)
```
Token Studio: ob-p-color-blue-500
      ↓ (Style Dictionary transformation)
CSS Output:   obPColorBlue500
      ↓ (Developer confusion)
Problem:      Names don't match!
```

### Proposed (Consistent)
```
Token Studio: ob_p_color_blue_500
      ↓ (No transformation needed)
CSS Output:   ob_p_color_blue_500
      ↓ (Developer happiness)
Result:       Names match perfectly!
```

## Technical Implementation

### 1. Token Studio Changes
- Export all tokens with underscores instead of hyphens
- Update $themes.json structure
- Maintain Figma Variable sync

### 2. Style Dictionary Configuration
- Remove camelCase transformations
- Keep underscore names unchanged
- Preserve existing functionality

### 3. CSS Output Format
```css
/* Current (camelCase) */
--ob-p-color-blue-500: #3b82f6;

/* Proposed (underscore) */
--ob_p_color_blue_500: #3b82f6;
```

### 4. Migration Steps

#### Phase 1: Preparation
1. Backup current token files
2. Create migration scripts
3. Update Style Dictionary config
4. Test with subset of tokens

#### Phase 2: Token Conversion
1. Convert all JSON token files
2. Update $themes.json
3. Regenerate CSS variables
4. Update documentation

#### Phase 3: Code Updates
1. Update component references
2. Update SCSS imports
3. Update documentation examples
4. Run comprehensive tests

#### Phase 4: Validation
1. Figma sync verification
2. Token Studio export test
3. CSS build validation
4. Component functionality tests

## Benefits

### For Developers
- - Consistent naming across all platforms
- - No more camelCase confusion
- - Predictable token names
- - Easier debugging and maintenance

### For Design System
- - Simplified build process (no transformation)
- - Better tool compatibility
- - Reduced cognitive load
- - Future-proof architecture

### For Token Studio/Figma
- - Works seamlessly with underscores
- - Maintains existing functionality
- - No sync issues

## Compatibility Matrix

| Platform | Hyphens | Underscores | CamelCase |
|----------|---------|-------------|-----------|
| Token Studio | - | - | ❌ |
| Figma Variables | - | - | ❌ |
| CSS Variables | ❌* | - | - |
| JavaScript | ❌ | - | - |
| SCSS | ❌* | - | - |

*Requires transformation

## Risk Assessment

### Low Risk
- Figma compatibility ✅
- Token Studio compatibility ✅
- CSS specification compliance ✅

### Medium Risk
- Migration effort (manageable with scripts)
- Temporary inconsistency during migration

### Mitigation Strategies
- Automated migration scripts
- Phased rollout approach
- Comprehensive testing
- Clear communication plan

## Recommendation

**PROCEED with underscore migration**

This change addresses the core developer request and eliminates the need for camelCase transformations, creating a more consistent and maintainable design token system.

## Next Steps

1. **Approve migration plan**
2. **Create migration scripts**
3. **Schedule implementation**
4. **Execute in phases**
5. **Monitor and validate**

---

*This plan transforms a "breaking change" into a "developer experience improvement"*
