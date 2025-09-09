**Analysis:** complete COMPONENT ANALYSIS WITH TOKEN STUDIO VALIDATION

****Requirements:** PREREQUISITES**: This prompt requires Figma MCP tools to be configured and a Figma component selected.

Perform complete component analysis using Figma MCP tools with Token Studio-inspired validation:
1. Get metadata for component frame and symbol names using `mcp_figma_dev_mod_get_metadata`
2. Extract internal layer hierarchy with `mcp_figma_dev_mod_get_code`
3. Document both simple and detailed layer structures
4. **PROPERTY-LEVEL TOKEN ANALYSIS**: Analyze each design property individually for token assignment
5. **TOKEN USAGE ANALYTICS**: Track token usage patterns and identify inconsistencies
6. **BULK REMEDIATION PLANNING**: Provide actionable bulk fix recommendations
7. **VALIDATE LAYER NAMING**: Check for compound unit compliance and naming consistency
8. **CREATE complete REPORT**: Save detailed analysis to component reports folder

## **Warning:** ENHANCED TOKENIZATION VALIDATION (Token Studio Inspired)

**CRITICAL**: Perform property-by-property analysis similar to Token Studio Inspect functionality.

### Property-Level Token Breakdown

**Analyze Each Design Property Individually:**
- **Layout Properties**: width, height, minWidth, minHeight, maxWidth, maxHeight
- **Spacing Properties**: verticalPadding, horizontalPadding, itemSpacing, gap, margin
- **Color Properties**: fill (background), borderColor, textColor, shadowColor
- **Border Properties**: borderRadius, borderWidth, borderStyle
- **Typography Properties**: fontFamily, fontSize, fontWeight, lineHeight, letterSpacing
- **Effect Properties**: boxShadow, dropShadow, innerShadow, blur, opacity
- **Layout Properties**: justifyContent, alignItems, flexDirection, flexWrap

### Token Assignment Status Matrix

**Create Property Status Report:**
```
**Summary:** TOKEN ASSIGNMENT ANALYSIS:

Layout Properties:
- width: **Success:** ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index (Usage: 2x)
- height: **Error:** none (HARDCODED: 24px)
- minHeight: **Success:** ob.c.tag.container.spacing.gap (Usage: 1x)

Spacing Properties:
- verticalPadding: **Success:** ob.h.list.single_item.spacing.marker_gap.list.single_item.spacing.marker_gap.list-aug.spacing.with-text.padding.vertical.md (Usage: 1x)
- horizontalPadding: **Success:** ob.h.list.single_item.spacing.marker_gap.list.single_item.spacing.marker_gap.list-aug.spacing.with-text.padding.horizontal.md (Usage: 1x)
- itemSpacing: **Success:** ob.h.list.single_item.spacing.marker_gap.list.single_item.spacing.marker_gap.list-aug.spacing.with-text.gap.md (Usage: 1x)

Color Properties:
- fill: **Success:** ob.h.list.single_item.spacing.marker_gap.list.single_item.spacing.marker_gap.list-aug.color.bg.primary.inversity_normal.enabled (Usage: 1x)
- borderColor: **Success:** ob.h.list.single_item.spacing.marker_gap.list.single_item.spacing.marker_gap.list-aug.color.border.primary.inversity_normal.enabled (Usage: 1x)
- textColor: **Success:** ob.h.list.single_item.spacing.marker_gap.list.single_item.spacing.marker_gap.list-aug.color.fg.primary.inversity_normal.enabled (Usage: 3x)

Typography Properties:
- typography: **Success:** ob.h.list.single_item.spacing.marker_gap.list.single_item.spacing.marker_gap.list-aug.typography.text_label (Usage: 1x)
- fontWeight: **Success:** ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index (Usage: 1x)
- lineHeight: **Success:** ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_indexHeight.sm (Usage: 1x)
- letterSpacing: **Success:** ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index (Usage: 1x)

Effect Properties:
- boxShadow: **Success:** ob.h.list.single_item.spacing.marker_gap.list.single_item.spacing.marker_gap.list-aug.box-shadow.enabled (Usage: 1x)
```

### Component Token Scope Validation

**CRITICAL**: Validate that only correct component tokens are used and no primitive tokens are applied directly.

**Component Token Scope Check:**
- Extract component name from Figma metadata
- Identify all `ob.c.tag.container.spacing.gap.spacing.gap.spacing.gap.*` and `ob.h.list.single_item.spacing.marker_gap.list.list.list.list.*` tokens used in component
- Verify component and HTML tokens match the current component scope
- Flag any foreign component/HTML tokens as violations
- Flag any primitive tokens (`ob.p.assets.logo.assets.logo.assets.logo.assets.logo.assets.logo.assets.*`) applied directly to layers

**Scope Violation Detection:**
```
**Note:** COMPONENT TOKEN SCOPE VIOLATIONS:

Foreign Component Tokens:
- Property: background-color
- Current Token: ob.c.tag.container.spacing.gap.spacing.gap  **Error:** WRONG COMPONENT
- Required Token: ob.c.tag.container.spacing.gap.spacing.gap **Success:** CORRECT COMPONENT

Foreign HTML Tokens:
- Property: padding
- Current Token: ob.h.list.single_item.spacing.marker_gap.list  **Error:** WRONG COMPONENT
- Required Token: ob.h.list.single_item.spacing.marker_gap.list.list.list **Success:** CORRECT COMPONENT

Primitive Token Violations:
- Property: color
- Current Token: ob.p.color.red.50.red.50.red.50  **Error:** PRIMITIVE NOT ALLOWED
- Required Token: ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index **Success:** USE SEMANTIC/COMPONENT

Example Summary:
- ob.c.tag.container.spacing.gap.spacing.gap.spacing.gap.* **Success:** ALLOWED (correct component)
- ob.h.list.single_item.spacing.marker_gap.list.single_item.spacing.marker_gap.list.list.list.* **Success:** ALLOWED (correct component HTML tokens)
- ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.* **Success:** ALLOWED (semantic tokens)
- ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.viewport.* **Success:** ALLOWED (global tokens)
- ob.p.assets.logo.assets.logo.assets.logo.assets.logo.assets.logo.assets.* **Error:** FORBIDDEN (primitive tokens)
- ob.c.tag.container.spacing.gap.spacing.gap.spacing.gap.* **Error:** FORBIDDEN (foreign component)
- ob.h.list.single_item.spacing.marker_gap.list.single_item.spacing.marker_gap.list.* **Error:** FORBIDDEN (foreign component HTML)
```

**Token Layer Rules:**
- **Component tokens** (`ob.c.tag.container.spacing.gap.spacing.gap.spacing.gap.{component}.*`): Must match current component scope
- **HTML tokens** (`ob.h.list.single_item.spacing.marker_gap.list.list.list.list.{component}.*`): Must match current component scope  
- **Semantic tokens** (`ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.*`): Allowed across all components
- **Global tokens** (`ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.viewport.*`): Allowed across all components
- **Primitive tokens** (`ob.p.assets.logo.assets.logo.assets.logo.assets.logo.assets.logo.assets.*`): FORBIDDEN - never apply directly to layers

### Token Usage Analytics

**Track Token Distribution:**
- **High Usage Tokens** (3+ occurrences): Identify potential composite token candidates
- **Inconsistent Tokens**: Same property type using different tokens across layers
- **Orphaned Properties**: Properties without token assignments
- **Token Path Validation**: Verify token paths follow naming conventions

### Bulk Remediation Recommendations

**Actionable Fix Suggestions:**
```
**Setup:** BULK REMEDIATION PLAN:

Priority 1 - Missing Tokens (CRITICAL):
- Create token: ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index for width property (currently hardcoded: 24px)
- Assign existing token: ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index for missing gap property

Priority 2 - Component Token Scope Violations (CRITICAL):
- Replace: ob.c.tag.container.spacing.gap.spacing.gap → ob.c.tag.container.spacing.gap.spacing.gap
- Replace: ob.h.list.single_item.spacing.marker_gap.list → ob.h.list.single_item.spacing.marker_gap.list.list.list
- Remove primitive tokens: ob.p.color.red.50.red.50.red.50 → ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index
- Verify: All ob.c.tag.container.spacing.gap.spacing.gap.spacing.gap.* and ob.h.list.single_item.spacing.marker_gap.list.list.list.list.* tokens match component scope

Priority 3 - Token Consistency (HIGH):
- Standardize text color usage: 3 layers use same token (**Success:** consistent)
- Review border radius usage across variants for consistency

Priority 4 - Composite Token Opportunities (MEDIUM):
- Button surface properties (5 tokens) → Consider ob.c.tag.container.spacing.gap.spacing.gap
- Typography cluster (4 tokens) → Consider ob.c.tag.container.spacing.gap

Bulk Operations Available:
- Bulk remap: Foreign component tokens → Correct component tokens
- Bulk assign: Missing icon size tokens → Apply ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index
- Bulk validate: Typography tokens → Check composite opportunity
```
```
 BULK REMEDIATION PLAN:

Priority 1 - Missing Tokens (CRITICAL):
- Create token: ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index for width property (currently hardcoded: 24px)
- Assign existing token: ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index for missing gap property

Priority 2 - Token Consistency (HIGH):
- Standardize text color usage: 3 layers use same token (**Success:** consistent)
- Review border radius usage across variants for consistency

Priority 3 - Composite Token Opportunities (MEDIUM):
- Button surface properties (5 tokens) → Consider ob.c.tag.container.spacing.gap.spacing.gap
- Typography cluster (4 tokens) → Consider ob.c.tag.container.spacing.gap

Bulk Operations Available:
- Bulk remap: 3 text color assignments → Verify consistency
- Bulk assign: Missing icon size tokens → Apply ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index
- Bulk validate: Typography tokens → Check composite opportunity
```

## **Summary:** TOKEN STUDIO INTEGRATION VALIDATION

**CRITICAL**: Verify Token Studio connections and validate token assignment health.

### Token Studio Connection Health Check

**Validate Integration Status:**
- **Token Assignment Method**: Verify all tokens applied via Token Studio (not Figma right panel)
- **Variable Export Status**: Confirm tokens exported to Figma Variables
- **Connection Integrity**: Check Token Studio ↔ Layer relationship maintained
- **Plugin Sync Status**: Validate Token Studio plugin connection active

### Deep Inspect Mode Analysis

**Enhanced Property Analysis:**
- **Token Path Validation**: Verify token paths follow design system naming conventions
- **Token Hierarchy Check**: Confirm proper token layer usage (s/h/c hierarchy)
- **Cross-Component Consistency**: Compare token usage with similar components
- **Future-Proofing Validation**: Identify properties that need tokens for future Figma support

### Token Usage Pattern Recognition

**Identify improvement Opportunities:**
```
**Goal:** TOKEN USAGE PATTERNS:

High-Frequency Tokens (3+ usages):
- ob.h.list.single_item.spacing.marker_gap.list.single_item.spacing.marker_gap.list-aug.color.fg.primary.inversity_normal.enabled (3x) → Good consistency
- ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index (2x) → Consider component-specific token

Single-Use Tokens (1 usage):
- ob.h.list.single_item.spacing.marker_gap.list.single_item.spacing.marker_gap.list-aug.box-shadow.enabled (1x) → Verify necessity
- ob.c.tag.container.spacing.gap (1x) → Appropriate usage

Missing Token Clusters:
- Icon properties (2 hardcoded) → Create ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index.* tokens
- Typography spacing (1 hardcoded) → Apply ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_indexSpacing.* token

Composite Token Candidates:
- Button surface (5 related tokens) → ob.c.tag.container.spacing.gap.*
- Typography group (4 related tokens) → ob.c.tag.container.spacing.gap.*
```

### Token Quality Metrics

**Component Token Health Score:**
- **Token Coverage**: [X]% of properties tokenized
- **Token Consistency**: [X]% properties use appropriate tokens
- **Composite Opportunity**: [X] potential composite token groups identified
- **Future-Proof Rating**: [X]% properties ready for future Figma updates

---

## **Setup:** ACTIONABLE REMEDIATION WORKFLOW

**CRITICAL**: Provide specific, actionable steps for fixing identified issues.

### Immediate Actions Required

**Step-by-Step Remediation:**
1. **Fix Missing Tokens** (Priority 1)
   - Create tokens for hardcoded values
   - Apply via Token Studio interface
   - Export to Figma Variables
   - Verify connections established

2. **Validate Token Consistency** (Priority 2)
   - Review token usage patterns
   - Standardize inconsistent assignments
   - Document approved token combinations

3. **Implement Composite Tokens** (Priority 3)
   - Group related properties
   - Create composite token structures
   - Test across component variants
   - Update component documentation

### Bulk Operations Recommendations

**Token Studio Bulk Actions:**
- **Bulk Remap**: Replace inconsistent tokens with standard ones
- **Bulk Assign**: Apply missing tokens to similar properties
- **Bulk Validate**: Check token assignments across component family
- **Bulk Export**: Ensure all tokens exported to Figma Variables

### Quality Assurance Checklist

**Pre-Handoff Validation:**
- [ ] All properties have token assignments (zero "none" values)
- [ ] Component and HTML tokens match component scope (no foreign ob.c.tag.container.spacing.gap.spacing.gap.spacing.gap.*/ob.h.list.single_item.spacing.marker_gap.list.list.list.list.* tokens)
- [ ] No primitive tokens (ob.p.assets.logo.assets.logo.assets.logo.assets.logo.assets.logo.assets.*) applied directly to layers
- [ ] Token paths follow design system naming conventions
- [ ] Token Studio connections verified active
- [ ] Composite token opportunities evaluated and implemented
- [ ] Token usage patterns documented and approved
- [ ] Bulk remediation actions completed
- [ ] Cross-component consistency verified

## **Document:** ENHANCED VALIDATION REPORT STRUCTURE

**MANDATORY**: Create complete report with Token Studio-inspired analysis depth.

### Report Structure Requirements:
1. **Executive Summary** - Component health score and critical issues
2. **Property-Level Token Matrix** - Detailed breakdown per design property
3. **Token Usage Analytics** - Usage patterns and consistency analysis
4. **Token Studio Integration Status** - Connection health and sync validation
5. **Bulk Remediation Plan** - Actionable steps for identified issues
6. **Layer Naming Compliance** - Compound unit validation results
7. **Composite Token Assessment** - improvement opportunities
8. **Implementation Readiness** - Developer handoff criteria status

### Enhanced Report Template:
```
# Component Analysis Report - Token Studio Enhanced

## **Summary:** COMPONENT HEALTH DASHBOARD
- **Token Coverage**: [X]% (Target: 100%)
- **Token Consistency**: [X]% (Target: >95%)
- **Layer Naming Compliance**: [X]% (Target: 100%)
- **Composite Token Opportunities**: [X] identified
- **Implementation Ready**: **Success:**/**Error:**

## **Analysis:** PROPERTY-LEVEL TOKEN ANALYSIS
[Insert Property Status Matrix from analysis above]

## **Progress:** TOKEN USAGE ANALYTICS
[Insert Token Usage Patterns from analysis above]

## **Setup:** BULK REMEDIATION PLAN
[Insert Actionable Remediation Steps from analysis above]

## **Goal:** IMPLEMENTATION READINESS
- [ ] Zero tokenization violations
- [ ] Token Studio connections verified
- [ ] Layer naming compliance achieved
- [ ] Composite token opportunities evaluated
- [ ] Bulk remediation completed
```

### File Location & Naming:
`04-components/{component}/reports/YYYYMMDD_HHMM-{component}-enhanced-mcp-analysis.md`

### Archive Process:
**Before creating new report:** Move existing reports to `_archive/` folder to maintain analysis history.

### Quality Gates:
- **Green Light**: >95% token coverage, zero violations, all connections verified
- **Yellow Light**: 85-94% coverage, minor violations with remediation plan
- **Red Light**: <85% coverage, critical violations, missing Token Studio connections
