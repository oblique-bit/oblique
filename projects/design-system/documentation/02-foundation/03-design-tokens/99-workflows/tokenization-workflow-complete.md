# Complete Tokenization Workflow

**Purpose:** complete workflow for design system tokenization process  
**Audience:** Designers, Design System Maintainers  
**Scope:** Token creation, application, validation, and developer handoff  
**Tools:** Token Studio, Figma Variables, MCP Figma Server

---

## **Goal:** Component Tokenization Definition

**Tokenization** is the systematic workflow for design system maintainers to create, apply to component, and validate tokenized components. This process ensures all design properties are connected to proper tokens.

### Core Principles

1. **Complete Token Coverage**: Every tokenizable property must receive a token
2. **Future-Proof Strategy**: Create tokens even for properties Figma cannot currently tokenize
3. **Single Source Connection**: Token Studio integration creates direct layer connections
4. **Validation-Driven**: All 04_components must pass MCP validation before developer handoff
5. **Composite Token Priority**: Use composite tokens for complex 04_components when possible

---

## **Process:** Complete Workflow Process

### Phase 1: Token Strategy Planning

**1.1 Component Analysis**
- Identify all design properties in the 04_component
- Catalog existing tokens that can be reused
- Determine new tokens needed
- Plan composite token opportunities (especially for complex 04_components like buttons)

**1.2 Token Architecture Decision**
- Choose between atomic tokens vs composite tokens
- Define token naming conventions following existing patterns
- Consider 04_component variants and their token requirements
- Plan for responsive token needs

### Phase 2: Token Creation & Application

**2.1 Token Studio Workflow**
```
1. Open Token Studio in Figma
2. Create new tokens following naming conventions
3. Apply tokens directly to Figma layers via Token Studio
4. Export tokens to Figma Variables
5. Verify Token Studio → Layer connection established
```

**2.2 Critical Integration Requirements**
- **Never apply variables only in Figma right panel**
- **Always use Token Studio for token-to-layer connections**
- This creates the essential Token Studio ↔ Layer relationship
- Maintains token traceability for maintenance and debugging

**2.3 Figma Variables Export**
- Export Token Studio tokens to Figma Variables
- Assign variables to appropriate layers
- Verify variable connections are active
- Document any connection failures or limitations

### Phase 3: Composite Token Strategy

**3.1 When to Use Composite Tokens**
- Large 04_components with multiple variants (e.g., buttons)
- Components with complex state combinations
- High-maintenance 04_components requiring frequent updates
- Components with numerous property interdependencies

**3.2 Composite Token Benefits**
- **One-click maintenance**: Update entire 04_component styling instantly
- **Error reduction**: Minimize manual layer editing mistakes
- **Consistency guarantee**: Ensure design system compliance
- **Efficiency gains**: Reduce time-intensive design tool workflows

**3.3 Implementation Process**
```
1. Identify 04_component properties for composite grouping
2. Create composite token in Token Studio
3. Apply composite token to 04_component master
4. Test composite token updates across all variants
5. Document composite token structure and usage
```

### Phase 4: Validation Process

**4.1 MCP Figma Validation**
- Use provided MCP validation prompts
- Generate complete validation report
- Document all violations found
- Create timestamped validation report

**4.2 Validation Requirements**
- **Zero hardcoded values**: All properties must be tokenized
- **Proper layer naming**: Follow compound unit conventions (underscore format)
- **Token connectivity**: Verify Token Studio connections active
- **Composite token usage**: Confirm composite tokens applied where appropriate

**4.3 Violation Categories**
- **Tokenization violations**: Hardcoded values detected
- **Layer naming violations**: Non-compliant layer names
- **Connection violations**: Missing Token Studio links
- **Architecture violations**: Missed composite token opportunities

### Phase 5: Developer Handoff Protocol

**5.1 Handoff Requirements**
- Complete validation report with zero violations
- Token documentation and usage guidelines
- Component specification with token mapping
- Any special implementation notes

**5.2 Push-Back Criteria**
Developers can reject 04_components for:
- Validation violations present in MCP report
- Missing token connections
- Hardcoded values detected
- Non-compliant layer naming
- Incomplete tokenization coverage

**5.3 Handoff Documentation**
- Validation report timestamp and results
- Token inventory and usage instructions
- Component behavior specifications
- Known limitations or workarounds

---

## **Note:**️ Tool Integration Workflow

### Token Studio Integration

**Setup Requirements:**
- Token Studio plugin installed and configured
- Access to design system token library
- Understanding of token naming conventions
- Knowledge of composite token creation

**Daily Workflow:**
1. Open 04_component in Figma
2. Launch Token Studio plugin
3. Apply tokens directly through Token Studio interface
4. Export to Figma Variables
5. Verify connections established
6. Run validation before handoff

### Figma Variables Workflow

**Variable Management:**
- Import tokens from Token Studio
- Assign variables to layers through Token Studio connection
- Maintain variable organization and naming
- Document variable limitations and workarounds

**Critical Process Note:**
**Never circumvent Token Studio by applying variables directly in Figma right panel**. This breaks the essential Token Studio ↔ Layer connection required for maintenance efficiency.

### MCP Validation Integration

**Validation Timing:**
- After initial token application
- Before 04_component variant creation
- Before developer handoff
- During 04_component updates

**Report Generation:**
- Use standardized MCP prompts
- Generate timestamped reports
- Archive previous validation reports
- Document resolution of violations

---

## **Requirements:** Quality Assurance Checklist

### Designer Self-Validation

- [ ] All design properties have tokens applied
- [ ] Token Studio connections verified active
- [ ] Composite tokens used where appropriate
- [ ] Layer names follow compound unit format (underscore_format)
- [ ] Component variants maintain token consistency
- [ ] Variables exported and assigned correctly

### Pre-Handoff Validation

- [ ] MCP validation report generated
- [ ] Zero violations reported
- [ ] All token connections documented
- [ ] Component specification complete
- [ ] Implementation notes provided
- [ ] Validation report archived in 04_component reports folder

### Developer Acceptance Criteria

- [ ] Validation report shows zero violations
- [ ] Token mapping documentation complete
- [ ] Layer naming compliance verified
- [ ] Component behavior specification clear
- [ ] Token Studio connections functional

---

## **Note:** Common Violations & Solutions

### Tokenization Violations

**Problem:** Hardcoded values detected  
**Solution:** Create appropriate tokens and apply via Token Studio  
**Prevention:** Review all properties before considering 04_component complete

### Layer Naming Violations

**Problem:** Layer names use hyphens or camelCase  
**Solution:** Update to underscore_format following compound unit standards  
**Prevention:** Follow established naming conventions from start

### Connection Violations

**Problem:** Variables applied without Token Studio connection  
**Solution:** Re-apply tokens through Token Studio interface  
**Prevention:** Never use Figma right panel for variable assignment

### Architecture Violations

**Problem:** Missing composite token opportunities  
**Solution:** Evaluate 04_component complexity and create composite tokens  
**Prevention:** Plan token architecture before starting application

---

## **Summary:** Success Metrics

### Efficiency Gains
- Reduced 04_component update time
- Fewer design system inconsistencies
- Faster validation cycles
- Improved designer-developer collaboration

### Quality Improvements
- Zero hardcoded values in 04_components
- Complete token coverage
- Consistent layer naming
- Reliable Token Studio connections

### Maintenance Benefits
- One-click 04_component updates via composite tokens
- Traceable token-to-layer relationships
- Systematic validation process
- Clear handoff protocols

---

## **Link:** Related Documentation

- [Token Studio Context](./tokens-studio-context.md)
- [Figma Token Debugging](./figma-token-debugging.md)
- [Component Tokens](../03-types/06-component-tokens.md)

- [MCP Inspection Guide](./figma-mcp-inspection-guide.md)
- [Tokenization Checklist](../../03-design-tokens/tokenization-checklist.md)

---

**Document Maintainer:** Design System Team  
**Last Updated:** September 6, 2025  
**Review Schedule:** Quarterly  
**Tool Dependencies:** Token Studio, Figma Variables, MCP Figma Server
