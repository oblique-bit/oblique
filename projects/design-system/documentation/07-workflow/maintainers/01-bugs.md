# Design System Bug Tracking
**Version:** 1.0  
**Date:** September 2, 2025  
**Status:** Work in Progress - Not Yet Approved by Product Owner  
**Purpose:** Track and document known issues in design system implementation

---

**Status**: Open - requires investigation into Figma's theme resolution mechanism or Token Studio plugin behavior.

## Neutral Foreground Contrast-Lowest Uses Alpha Color

**Issue**: `ob.s3.color.brand references an alpha color primitive in light theme.

**Description**: 
The neutral foreground token for the lowest contrast level uses `{ob.p.color.red.50.cobalt-alpha.400}` which includes transparency. This may be intentional for achieving very subtle text (like disabled states), but should be verified.

**Details**:
- Token: `ob.s3.color.brand
- Light theme value: `{ob.p.color.red.50.cobalt-alpha.400}` (alpha/transparent)
- Use case: Very subtle text for disabled states

**Considerations**:
1. **Intentional Design**: Alpha may be purposeful for disabled/subtle states
2. **Accessibility**: Alpha colors can create unpredictable contrast ratios
3. **Implementation**: Need to verify if this matches design intent

**Impact**: 
- May affect text readability on different backgrounds
- Could cause accessibility compliance issues
- Needs verification against design specifications

**Action Required**: 
Verify with design team if alpha transparency is intentional for contrast-lowest level or if it should use a solid color primitive.

**Files Affected**:
- Semantic color tokens using contrast-lowest
- Components consuming neutral foreground tokens

**Status**: Needs Investigation - verify design intent for alpha usage in contrast-lowest tokens.
