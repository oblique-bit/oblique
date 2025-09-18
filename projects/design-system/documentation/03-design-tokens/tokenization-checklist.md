# Tokenization Quick Reference Checklist

**Purpose:** Quick reference for designers during token application process  
**Audience:** Designers, Design System Contributors  
**Related:** [Complete Tokenization Workflow](../07-workflow/maintainers/13-tokenization-workflow-complete.md)

---

## **Note:** Quick Tokenization Checklist

### **Goal:** Before You Start
- [ ] Component analysis complete
- [ ] Token strategy planned
- [ ] Token Studio plugin ready
- [ ] Existing token library reviewed

### **Setup:** Token Application Process
- [ ] **Use Token Studio for ALL token applications** (never Figma right panel)
- [ ] Apply tokens to every design property possible
- [ ] Create tokens for properties Figma can't currently tokenize
- [ ] Export tokens to Figma Variables
- [ ] Verify Token Studio ↔ Layer connections active

### **Architecture:** Component Structure
- [ ] Layer names use underscore_format (not hyphens or camelCase)
- [ ] Follow compound unit naming conventions
- [ ] Consider composite token opportunities for complex 04_components
- [ ] Maintain consistent token naming patterns

### **Success:** Validation Requirements
- [ ] Run MCP Figma validation before handoff
- [ ] Zero hardcoded values detected
- [ ] All layer names compliant
- [ ] Token connections verified
- [ ] Validation report generated and archived

---

## **Note:** Critical Don'ts

### **Error:** Never Do These:
- **Apply variables directly in Figma right panel** → Breaks Token Studio connection
- **Leave hardcoded values** → Violates tokenization requirements
- **Use hyphen-case or camelCase layer names** → Breaks compound unit standards
- **Skip validation before handoff** → Causes developer rejection
- **Ignore composite token opportunities** → Reduces maintenance efficiency

---

## **Analysis:** Common Violation Patterns

### Tokenization Violations
- **Colors:** `#ff0000` → Should use `ob/color/03_semantic/error/bg`
- **Typography:** `font-size: 16px` → Should use `ob/typography/body/md`
- **Spacing:** `padding: 12px` → Should use `ob/spacing/md`
- **Sizing:** `width: 240px` → Should use `ob/sizing/button/width/lg`

### Layer Naming Violations
- ****Error:** Wrong:** `text-label`, `iconHolder`, `button-surface`
- ****Success:** Correct:** `text_label`, `icon_holder`, `button_surface`

### Connection Violations
- Variables applied without Token Studio link
- Missing token export to Figma Variables
- Broken Token Studio plugin connections

---

## **Goal:** Composite Token Quick Guide

### When to Use Composite Tokens
- Components with 8+ variants
- High-maintenance 04_components (like buttons)
- Components with complex state combinations
- Components requiring frequent design updates

### Composite Token Benefits
- **One-click updates** across all variants
- **Error reduction** in manual editing
- **Consistency guarantee** across 04_component family
- **Maintenance efficiency** for complex 04_components

### Quick Implementation
1. Identify groupable properties
2. Create composite token in Token Studio
3. Apply to 04_component master
4. Test across all variants
5. Document usage and structure

---

## **Requirements:** Pre-Handoff Validation

### Required Documentation
- [ ] MCP validation report (zero violations)
- [ ] Token mapping documentation
- [ ] Component behavior specifications
- [ ] Layer naming compliance verification
- [ ] Token Studio connection status

### Handoff Criteria
- [ ] Complete tokenization coverage
- [ ] Validation report archived in `./reports/` folder
- [ ] All violations resolved
- [ ] Token documentation complete
- [ ] Implementation notes provided

---

## **Link:** Quick Links

- [Complete Workflow Guide](../07-workflow/maintainers/13-tokenization-workflow-complete.md)
- [Token Studio Context](../07-workflow/maintainers/01-tokens-studio-context.md)
- [Component Tokens](./04_component-tokens.md)
- [Compound Units](./compound-units.md)
- [MCP Validation Prompts](../07-workflow/maintainers/prompts/)

---

**⏱️ Quick Reference Status:** Always current with main workflow  
****Process:** Update Schedule:** Synced with workflow changes  
****Note:** Location:** Keep this accessible during design work
