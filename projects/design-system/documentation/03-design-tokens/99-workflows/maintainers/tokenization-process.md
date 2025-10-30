# Tokenization Process: Creating and Assigning Tokens

**Purpose**: Define the process for creating tokens and assigning them within the design system workflow.

---

## **Token Creation Rule**

> **If a token cannot be used in Figma, then it should not be created.**

If a token cannot be directly used in code, the developer may propose alternative approaches:

1. **Component Anatomy Refactoring**: Collaborate with designers to refactor the Figma component structure and create another token that is viable in code
2. **Design Decision Acceptance**: Accept the token as a documented design decision and work around it to find a proper implementation path in code that functionally and visually matches what the token achieves in Figma

## **Token Assignment Process**

After tokens are created, they must be properly assigned to components and elements:

1. **Figma Assignment**: Designer applies tokens through Figma Variables UI
2. **Code Assignment**: Developer implements tokens through generated CSS/SCSS  
3. **Validation**: Verify visual and functional consistency between Figma preview and code output

**Detailed Assignment Rules**: See [Token Assignment Guidelines](./workflows/developers/token-assignment-guidelines.md) for comprehensive rules on which tokens to use in different scenarios, layer consumption patterns, and semantic hierarchy requirements.

This process prioritizes **Figma compatibility for token creation** while allowing **flexible code implementation strategies** to achieve the desired UX result.

---

## **Token Exclusion Criteria**

### **Design-Only Limitations**

If a design decision is technically feasible in code but **Figma cannot consume or resolve the token**, we do not tokenize it.

**Example: Text Alignment**
```css
/* ❌ DO NOT CREATE - Figma cannot consume this token */
{
  "text": {
    "alignment": {
      "center": {
        "$type": "other",
        "$value": "center"
      }
    }
  }
}
```

**Rationale**: While the designer can preview text alignment using hardcoded settings in Figma's right panel, it makes no sense to create a token that Figma cannot resolve. This creates uncertainty about whether developers will actually use the token, leading to guesswork in the development territory. Instead, designers document this design specification in the component handoff MD as a clear, written directive that developers can reference without needing to inspect Figma elements.

### **Code Implementation Flexibility**

If a design decision works in Figma but poses implementation challenges in code, we **still create the token** and work collaboratively to find solutions.

**Example: Complex Figma Effects**
```json
/* ✅ CREATE TOKEN - Work with developer to find implementation path */
{
  "effects": {
    "brand-signature-blur": {
      "$type": "effect",
      "$value": "advanced-blur-with-brand-noise"
    }
  }
}
```

**Developer Options:**
1. **Propose Refactoring**: "Can we break this into multiple simpler effects that achieve the same visual result?"
2. **Accept & Implement**: Use CSS filters, backdrop-filter, or SVG filters to approximate the Figma effect
3. **Document Deviation**: If perfect match is impossible, document the closest achievable implementation

---

## **Alternative Documentation Strategy**

### **Component Handoff Documentation**

For design decisions that cannot be tokenized due to platform limitations, we document them in **component handoff specifications** as a **second stage of specs after tokens**.

**Location**: `/documentation/04-components/[component-name]/[component-name]-handoff.md`

**Purpose**: 
- Preserve design intent without relying on unresolvable tokens
- Provide clear written specifications so developers don't need to inspect Figma elements
- Eliminate guesswork in the development territory
- Create explicit design directives in the developer's natural work environment (documentation)
- Document non-tokenizable design decisions as structured exceptions

### **Handoff Documentation Structure**

```markdown
## Design Specifications (Non-Tokenized)

### Text Alignment
- **Design Intent**: Center-aligned button text for visual balance
- **Implementation**: `text-align: center` applied to button text wrapper  
- **Designer Preview**: Set manually in Figma right panel for design validation
- **Developer Directive**: Apply center alignment programmatically - do not rely on Figma inspection
- **Exception Rationale**: Cannot be tokenized due to Figma token resolution limitations

### Responsive Behavior  
- **Design Intent**: Automatic density switching on mobile viewports
- **Implementation**: CSS media queries with `density="compact"` class
- **Designer Preview**: Multiple Figma frames showing different viewport scenarios
- **Developer Directive**: Implement automatic switching - designer cannot preview token-driven responsive behavior
- **Exception Rationale**: Cannot be tokenized - Figma cannot resolve responsive token logic
```

---

## **Token Viability Assessment**

Before creating any token, validate across both platforms:

### **Figma Validation Checklist**
- [ ] Can Figma Variables consume this token type?
- [ ] Can designers preview the effect in Figma?
- [ ] Does the token resolve correctly in Figma's UI?
- [ ] Can the token be applied to relevant Figma elements?

### **Code Implementation Assessment**
- [ ] Can Style Dictionary process this token type?
- [ ] Is direct implementation possible with current CSS/Angular capabilities?
- [ ] If not directly implementable, can the visual/functional result be achieved through alternative methods?
- [ ] Does the token provide meaningful design value that justifies implementation effort?

### **Token Viability Classification**
- [ ] ✅ **VIABLE TOKEN**: Figma can consume (required)
- [ ] 🔧 **IMPLEMENTATION CHALLENGE**: Figma works, code needs creative solution
- [ ] ❌ **NON-VIABLE TOKEN**: Figma cannot consume or resolve
- [ ] 📝 **HANDOFF DOCUMENTATION**: Document Figma-incompatible decisions as exceptions

---

## **Benefits of This Approach**

### **Design-Development Alignment**
- Tokens guarantee consistency between design preview and production
- Eliminates "design vs. implementation" discrepancies
- Ensures tokens serve their bridging purpose

### **Maintainability**
- No orphaned tokens that work in only one environment
- Cleaner token architecture with guaranteed utility
- Reduced complexity in token management

### **Communication Clarity**
- Clear separation between tokenized and non-tokenized decisions
- Component handoff documents preserve all design intent
- Teams understand which decisions are automated vs. manual

---

## **Implementation Guidelines**

### **For Design System Maintainers**

1. **Token Creation Process**
   - Always validate bilateral compatibility before creating tokens
   - Use handoff documentation for platform-specific design decisions
   - Regularly audit existing tokens for continued bilateral viability

2. **Documentation Responsibility**
   - Maintain clear component handoff documentation
   - Update handoff specs when design decisions change
   - Ensure all design intent is preserved (tokenized or documented)

### **For Designers**

1. **Token Usage**
   - Use only existing, validated tokens in designs
   - Understand that all tokens will work in final implementation
   - Communicate non-tokenizable design intent through handoff documentation

2. **Design Decision Making**
   - Consider token viability when making design choices
   - Prefer tokenizable solutions when multiple options exist
   - Document platform-specific requirements clearly

### **For Developers**

1. **Token Implementation**
   - All tokens are guaranteed to be implementable
   - Refer to handoff documentation for non-tokenized design decisions
   - Report any token implementation issues immediately

2. **Code Generation**
   - Trust that tokens will generate valid CSS/SCSS
   - Use component handoff specs for manual implementation details
   - Maintain Style Dictionary transforms for token processing

---

*This philosophy ensures our design tokens fulfill their core purpose: bridging design and development with reliable, bilateral compatibility.*