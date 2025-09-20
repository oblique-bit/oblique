**Analysis:** complete TOKENIZATION & STRUCTURE VALIDATION

****Requirements:** PREREQUISITES**: This prompt requires Figma MCP tools to be configured and a Figma component selected.

**🚨 CRITICAL VALIDATION WARNING**: 
**NEVER** confuse MCP-generated code output with actual Figma design issues. The MCP Figma tool converts design tokens to hardcoded values in generated code - this is a TOOL LIMITATION, not a design system violation. Always validate tokenization by examining the actual Figma layers and Token Studio connections, NOT the generated code output.

Perform complete tokenization validation of this component using Figma MCP tools:
1. Get metadata for component frame using `mcp_figma_dev_mod_get_metadata`
2. Extract detailed layer structure with `mcp_figma_dev_mod_get_code`
3. **VALIDATE FIGMA DESIGN DIRECTLY** - Check actual layer properties and Token Studio connections
4. Analyze token coverage and validate tokenization compliance
4. **VALIDATE COMPLETE TOKENIZATION**: Check every design property for token coverage
5. **VALIDATE TOKEN STUDIO CONNECTIONS**: Verify Token Studio integration
6. **VALIDATE LAYER NAMING**: Check compound unit compliance
7. **VALIDATE COMPOSITE TOKEN OPPORTUNITIES**: Assess component complexity
8. **CREATE complete REPORT**: Save analysis to component reports folder

## **Warning:** CRITICAL TOKENIZATION VALIDATION REQUIREMENTS

**ZERO TOLERANCE POLICY**: Every design property MUST be tokenized. No exceptions.

### complete Property Coverage Check:

**Visual Properties:**
- Colors (background, text, borders, shadows, overlays)
- Typography (font-family, font-size, font-weight, line-height, letter-spacing)
- Spacing (padding, margin, gaps, insets)
- Sizing (width, height, min/max dimensions)
- Border properties (radius, width, style)
- Effects (shadows, blur, opacity, transforms)
- Layout properties (flex properties, positioning)

**Interactive Properties:**
- State-based color variations (hover, active, focus, disabled)
- Animation properties (transitions, durations)
- Accessibility properties (contrast ratios, focus indicators)

**Component-Specific Properties:**
- Icon sizing and positioning
- Text alignment and spacing
- Container constraints and behavior
- Responsive breakpoints and scaling

### Future-Proofing Requirements:
**CRITICAL**: Create tokens even for properties Figma cannot currently tokenize, including:
- Advanced typography properties (text-decoration, text-transform)
- Complex animations and micro-interactions
- Advanced layout properties (grid-template, aspect-ratio)
- Custom CSS properties for future design system needs

### Token Studio Integration Validation:
- **Connection Requirement**: All tokens MUST be applied via Token Studio
- **Verification Process**: Check for Token Studio ↔ Layer connections
- **Variable Export Status**: Confirm tokens exported to Figma Variables
- **Integration Health**: Validate no variables applied outside Token Studio

### If ANY Hardcoded Values Found:

**⚠️ IMPORTANT**: Distinguish between actual hardcoded values in Figma layers vs. MCP tool code generation artifacts. Only flag true design system violations.

1. **VERIFY SOURCE FIRST** - Check if values are hardcoded in actual Figma layers or just MCP code output
2. **STOP IMPLEMENTATION** only if actual Figma design violations exist
3. **Document ALL violations** with specific property details (from Figma, not generated code)
4. **Identify missing tokens** and suggest token paths
5. **Push back to designer** with complete violation list
6. **Require complete tokenization** before proceeding

### Tokenization Report Format:
```
**Note:** TOKENIZATION VIOLATIONS DETECTED:

**VALIDATION SOURCE**: [figma-layers | token-studio-connections | design-properties]
**NOT MCP CODE OUTPUT** - Always validate against actual Figma design, not generated code

Category: [Property Category]
- Property: [specific-property] 
- Current Value: [hardcoded-value-in-figma]
- Required Token: [suggested-token-path]
- Priority: [high/medium/low based on frequency of use]
- Validation Method: [figma-layer-inspection | token-studio-panel | design-properties]

Example:
Category: Color Properties
- Property: background-color
- Current Value: #2379a4 (found in Figma layer properties, NOT MCP generated code)
- Required Token: ob/color/03_semantic/primary/bg/enabled
- Priority: High (used across multiple component states)
- Validation Method: Token Studio panel shows no variable connection
```

## **Warning:** COMPOSITE TOKEN OPPORTUNITY ASSESSMENT

**CRITICAL**: Evaluate component complexity for composite token benefits.

### Composite Token Criteria Assessment:
- **Variant Count**: Components with 8+ variants are composite token candidates
- **Update Frequency**: High-maintenance components benefit from composite tokens
- **Property Interdependency**: Related properties that change together
- **Maintenance Risk**: Components prone to design system drift

### Composite Token Evaluation Process:
1. **Count component variants** and state combinations
2. **Identify property groups** that change together
3. **Assess maintenance complexity** and update frequency
4. **Recommend composite token strategy** if criteria met
5. **Document composite token structure** and benefits

### Composite Token Report Format:
```
**Goal:** COMPOSITE TOKEN OPPORTUNITY ASSESSMENT:
Component: [component-name]
Variants: [count] variants detected
Maintenance Risk: [high/medium/low]
Recommendation: [create-composite/atomic-tokens/hybrid-approach]

Composite Token Structure:
- Group 1: [property-group-name] - [properties-list]
- Group 2: [property-group-name] - [properties-list]
Benefits: [maintenance-efficiency, error-reduction, consistency-guarantee]
```

## **Warning:** ENHANCED LAYER NAMING VALIDATION

**CRITICAL**: All layer names MUST follow compound unit standards with underscore format.

### Compound Unit Compliance Check:
- **Format Requirement**: Multi-word identifiers use underscore_format
- **Zero Tolerance**: Any hyphen, camelCase, or other format = VIOLATION
- **Examples**: `text_label`, `icon_holder`, `button_surface`, `close_button`

### Extended Layer Name Categories:
**Button Components:**
- `button_surface` - Main button container
- `text_label` - Button text content
- `icon_holder` - Icon container/wrapper
- `state_overlay` - Interaction state layer

**Container Components:**
- `content_wrapper` - Main content container
- `scroll_container` - Scrollable content area
- `expansion_panel` - Collapsible content section

**Navigation Components:**
- `nav_tree` - Navigation structure
- `menu_item` - Individual navigation item
- `breadcrumb_trail` - Navigation breadcrumb

### Advanced Layer Naming Validation:
1. **Check EVERY layer name** against underscore format
2. **Cross-reference existing compound units** in design system
3. **Suggest alternatives** for non-compliant names
4. **Validate consistency** with related components
5. **Document naming rationale** for new compound units

### Enhanced Layer Naming Report Format:
```
**Note:** LAYER NAMING VIOLATIONS DETECTED:
- Layer: [current-name] → Should be: [underscore_format]
- Impact: [token-inconsistency/css-class-naming/maintenance-issues]
- Related Components: [list-of-affected-components]
- Consistency Check: [passes/fails] compound unit standards

Example:
- Layer: "text-label" → Should be: "text_label"
- Impact: CSS class naming inconsistency, token path mismatch
- Related Components: Badge, Tag, Chip components
- Consistency Check: Fails - conflicts with existing text_label standard
```

## **Document:** complete VALIDATION REPORT

**MANDATORY**: Create complete validation report with all assessment categories.

### Report Structure Requirements:
1. **Executive Summary** - Pass/fail status and critical issues
2. **Tokenization Assessment** - Complete property coverage analysis
3. **Token Studio Integration** - Connection status and health check
4. **Layer Naming Compliance** - Compound unit validation results
5. **Composite Token Evaluation** - Opportunity assessment and recommendations
6. **Implementation Readiness** - Developer handoff criteria status
7. **Violation Resolution** - Step-by-step remediation plan

### File Naming Convention:
`YYYYMMDD_HHMM-{component}-complete-validation-report.md`

### Archive Process:
1. **Before creating new report**: Move existing reports to `_archive/` folder
2. **Generate timestamp**: Use current date/time for uniqueness
3. **Create complete report**: Include all validation categories
4. **Cross-reference documentation**: Link to relevant workflow guides

### Report Completion Criteria:
- [ ] All validation categories assessed
- [ ] Zero tokenization violations or documented remediation plan
- [ ] Layer naming compliance verified
- [ ] Composite token opportunities evaluated
- [ ] Implementation readiness status clear
- [ ] Developer handoff criteria documented

## **Goal:** DEVELOPER HANDOFF VALIDATION

**CRITICAL**: Component must meet ALL criteria before developer handoff approved.

### Handoff Approval Criteria:
- [ ] **Zero tokenization violations** - All properties tokenized
- [ ] **Complete Token Studio integration** - All connections verified
- [ ] **Layer naming compliance** - All names follow compound unit format
- [ ] **Composite token evaluation** - Assessment complete and documented
- [ ] **Validation report generated** - complete analysis archived
- [ ] **Resolution plan documented** - Any remaining issues have clear remediation steps

### Push-Back Authority:
Developers MUST reject components that:
- Show tokenization violations in validation report
- Have non-compliant layer naming
- Missing Token Studio connections
- Incomplete composite token evaluation
- Lack complete validation documentation

### Handoff Success Metrics:
- **First-pass approval rate** - Components passing initial validation
- **Violation resolution time** - Time to fix reported issues
- **Token coverage completeness** - Percentage of tokenized properties
- **Composite token adoption** - Usage rate for eligible components
