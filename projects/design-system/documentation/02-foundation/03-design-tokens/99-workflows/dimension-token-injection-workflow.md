# Dimension Token Injection Workflow

## Overview

This workflow provides a systematic approach for injecting new dimension tokens into the design system. Use this process whenever you need to add missing primitive dimension values or restructure the semantic dimension hierarchy.

**When to Use This Workflow:**
- Missing dimension values identified in design reviews
- New component requirements need additional spacing/sizing tokens
- Design system scale updates require new token ranges
- Fixing gaps in existing dimension coverage

**Prerequisites:**
- Token Studio access and familiarity
- Understanding of primitive → semantic → component token hierarchy
- Git workflow knowledge (tokens-* branch requirements)

## 5-Phase Methodology

### Phase 1: Analysis & Documentation
**Purpose:** Understand current state and plan changes

#### Required Actions:
1. **Create resolved values table** documenting all existing tokens
   - Include token path, resolved value, and usage context
   - Store in `_private/documentation/dimension-tokens-resolved-table.md`
   - Use format: `| Token Path | Resolved Value | Context/Usage |`

2. **Identify missing tokens** through:
   - Design review feedback
   - Component requirement analysis
   - Figma MCP value extraction from actual designs
   - Gap analysis in current primitive coverage

3. **Document required additions** with:
   - Specific pixel values needed
   - REM equivalents (calculated as px ÷ 16)
   - Usage context and justification
   - Impact assessment on existing components

#### Validation Commands:
```bash
# Extract current token values
npm run search-tokens "dimension"
npm run trace-token "ob.s.dimension.static.element.xs"

# Figma validation (select component first)
# Use MCP: get_variable_defs to compare actual Figma values
```

### Phase 2: Primitive Token Additions
**Purpose:** Add missing values to primitive dimension foundation

#### Implementation Steps:
1. **Backup current primitives**: `/src/lib/themes/02_primitive/dimension.json`

2. **Apply REM naming rules**:
   - All REM token names must be divisible by 100
   - NO intermediate values (950, 880, 550, 1050 forbidden)
   - Shift existing tokens when adding new values
   - Example: To add 0.1875rem between existing tokens, shift naming scheme

3. **Add new primitive tokens**:
   - Include both px and rem variants for each new value
   - Exception: 9999px remains px-only (border rounding)
   - Follow existing primitive token structure

4. **Update primitive numbering**:
   - Maintain ascending order by pixel value
   - Ensure REM tokens follow divisible-by-100 naming
   - Document any naming shifts in change notes

#### Example Structure:
```json
{
  "ob": {
    "p": {
      "dimension": {
        "px": {
          "3": { "value": "3", "type": "dimension" },
          "10": { "value": "10", "type": "dimension" }
        },
        "rem": {
          "200": { "value": "0.1875", "type": "dimension" },
          "700": { "value": "0.625", "type": "dimension" }
        }
      }
    }
  }
}
```

#### Validation:
```bash
# Validate JSON syntax
python3 -m json.tool src/lib/themes/02_primitive/dimension.json

# Check for any broken references
node scripts-custom/validate-all-components.js
```

### Phase 3: PX-REM Synchronization
**Purpose:** Ensure complete parity between px and rem token coverage

#### Synchronization Rules:
- **PX tokens are source of truth**: All rem tokens must have corresponding px equivalents
- **Consistent resolved values**: rem value = px value ÷ 16 (assuming 16px base font size)
- **Complete coverage**: Every px token must have exactly one rem equivalent
- **No orphaned tokens**: Remove any rem tokens without px counterparts

#### Implementation:
1. **Generate complete px-rem pairs** for all primitive values
2. **Verify mathematical accuracy** (rem = px ÷ 16)
3. **Update token numbering** to maintain REM divisible-by-100 constraint
4. **Document any removed orphaned tokens**

#### Quality Checks:
- Cross-reference px and rem values for mathematical accuracy
- Ensure no gaps in coverage for newly added primitives
- Validate JSON structure remains intact

### Phase 4: Semantic Layer Restructuring
**Purpose:** Update semantic tokens with new structure and missing values

#### Semantic Group Structure:
Replace deprecated `detail`/`surface` groups with new hierarchy:
- **micro**: Very small UI elements (1-4px range)
- **element**: Basic component parts (4-8px range) 
- **spacing**: General layout spacing (8-16px range)
- **container**: Container and section spacing (16-24px range)
- **layout**: Page layout spacing (24-40px range)
- **macro**: Large page structure (40px+ range)

#### Implementation Strategy:
1. **Update semantic file structure**:
   - `static.json`: Direct primitive references, no multipliers
   - `md.json`: 1:1 primitive mapping (reference scale)
   - `sm.json`: 0.8x scaled using global multipliers
   - `lg.json`: 1.25x scaled using global multipliers

2. **Apply new group structure** to all semantic files
3. **Ensure primitive reference consistency** across all scales
4. **Validate multiplier usage**:
   - Use `{ob.g.multiplier.dimension.sm}` for SM scale
   - Use `{ob.g.multiplier.dimension.lg}` for LG scale
   - NO calc() functions with primitives

#### Critical Architecture Rule:
**SM and LG scales must reference same primitives as MD but with different global multipliers**

✅ **Correct**: 
```json
"sm.json": "{ob.p.dimension.px.8} * {ob.g.multiplier.dimension.sm}"
"md.json": "{ob.p.dimension.px.8}"  
"lg.json": "{ob.p.dimension.px.8} * {ob.g.multiplier.dimension.lg}"
```

❌ **Incorrect**:
```json
"sm.json": "calc({ob.p.dimension.px.8} * 0.8)"
```

### Phase 5: Component Token Updates (Critical Constraints)
**Purpose:** Update component references to use new semantic structure

#### Type and Unit Preservation Rules:
**MANDATORY**: Must preserve static vs dynamic type when updating references
**MANDATORY**: Must preserve px vs rem unit type when updating references

#### Allowed Mappings:
- ✅ **Static px → Static px**: `{ob.s.dimension.static.surface.sm.px}` → `{ob.s.dimension.static.spacing.sm.px}`
- ✅ **Dynamic rem → Dynamic rem**: `{ob.s.dimension.dynamic.element.xs.rem}` → `{ob.s.dimension.dynamic.element.xs.rem}`
- ✅ **Static rem → Static rem**: `{ob.s.dimension.static.container.xs.rem}` → `{ob.s.dimension.static.container.xs.rem}`

#### Forbidden Changes:
- ❌ **Static → Dynamic**: Changes component scaling behavior
- ❌ **Dynamic → Static**: Breaks responsive scaling
- ❌ **px → rem**: Changes unit calculation base
- ❌ **rem → px**: Changes unit calculation base
- ❌ **Primitive references**: Components must use semantic layer (`ob.s.*`), never primitives (`ob.p.*`)

#### Implementation Process:
1. **Use Phase 1 resolved values table** as reference for current token behavior
2. **Check current token type** (static/dynamic) and unit (px/rem)
3. **Find equivalent semantic token** with same type, unit, and resolved value
4. **Update component references** maintaining behavioral consistency
5. **Validate semantic layer compliance** (no `ob.p.*` references in components)

#### Files to Update:
- Component tokens: `/src/lib/themes/04_component/`
- HTML element tokens: `/src/lib/themes/05_html/`

## Technical Constraints

### REM Token Naming Rules
- **Must be divisible by 100**: 800, 900, 1000, 1100, etc.
- **No intermediate values**: 950, 880, 550, 1050 are FORBIDDEN
- **Token name shifting required**: When adding new REM tokens, shift ENTIRE naming scheme
- **No squeeze-between strategy**: Cannot insert tokens between existing ones with *50 values

### Token Hierarchy Rules (STRICT)
```
Primitives (ob.p.*) 
    ↓ ONLY referenced by
Semantics (ob.s.*) 
    ↓ ONLY referenced by  
Components (ob.c.*) & HTML (ob.h.*)
```

**Examples:**
- ✅ **CORRECT**: `ob.c.badge.spacing.padding` → `{ob.s.dimension.static.element.xs.px}`
- ❌ **FORBIDDEN**: `ob.c.badge.spacing.padding` → `{ob.p.dimension.px.4}`

### Exception Rules
- **9999px token**: Remains px-only (used for border rounding), no REM equivalent needed

## Validation & Quality Assurance

### Required Validation Commands
```bash
# Comprehensive validation after each phase
npm run validate:all
python3 scripts-custom/quick-validate.py

# Token reference validation
node scripts-custom/validate-all-components.js
npm run trace-token "token-path"

# JSON syntax validation
python3 -m json.tool file.json > /dev/null && echo "✅ Valid JSON"

# Architecture compliance
node scripts-custom/validate-semantic-mirroring.js
```

### Figma MCP Validation Process
**Tool**: `mcp_figma_dev_mod_get_variable_defs`
1. **Select component in Figma** that uses dimension tokens
2. **Extract actual values** using MCP tool
3. **Compare with resolved table** (convert rem to px using 16px base)
4. **Verify consistency** between design and token implementation

**Example validation**:
```
Figma MCP returns: "ob/h/button/spacing/padding/horizontal": "12"
Token resolves: 0.75rem = 12px ✅ MATCH
```

### Git Workflow Requirements
- **Branch naming**: Must use `tokens-*` prefix
- **Commit format**: `<type>(<package>/<scope>): <subject>` + `OUI-XXXX` footer
- **Validation**: Run full validation suite before commit
- **Merge target**: `tokens-main` branch only

## Common Pitfalls & Prevention

### Architecture Violations
- **Problem**: Using calc() with primitives instead of global multipliers
- **Prevention**: Always use `{ob.g.multiplier.dimension.*}` for scaling
- **Fix**: Copy MD structure and replace multiplier references

### Token Reference Errors
- **Problem**: Components referencing primitives directly
- **Prevention**: Always validate semantic layer compliance
- **Fix**: Replace `{ob.p.*}` with equivalent `{ob.s.*}` references

### Type/Unit Mixing
- **Problem**: Changing static→dynamic or px→rem during updates
- **Prevention**: Use Phase 1 resolved table to verify current behavior
- **Fix**: Find semantic token with same type and unit

### REM Naming Violations
- **Problem**: Creating tokens with names not divisible by 100
- **Prevention**: Plan naming shifts before adding new tokens
- **Fix**: Shift entire token naming scheme to accommodate

## Success Criteria

1. **Consistency**: All semantic MD tokens 1:1 reflect primitives
2. **Completeness**: All required dimension values are available
3. **Scalability**: SM/LG scales work correctly with multipliers
4. **Stability**: No broken token references in validation
5. **Compliance**: All tokens follow hierarchy and naming rules
6. **Documentation**: Changes documented and validated against actual designs

## Files Modified During Process

1. **Primitives**: `/src/lib/themes/02_primitive/dimension.json`
2. **Semantics**: `/src/lib/themes/03_semantic/dimension/` (all scale files)
3. **Components**: Various files in `/src/lib/themes/04_component/`
4. **HTML Elements**: Various files in `/src/lib/themes/05_html/`

## Post-Implementation Maintenance

- Document all changes in project changelog
- Update component documentation if new tokens affect usage
- Validate design system consistency across all platforms
- Share updates with design team for Figma sync verification
- Schedule design review to confirm new tokens meet requirements

---

**Next Steps:** Apply this workflow systematically, validating each phase before proceeding to the next. Document any deviations or issues encountered for future workflow improvements.