# Designer Workflow: Token Assignment in Figma

**Purpose:** Complete workflow guide for designers applying tokens to components and layouts  
**Audience:** Designers using Figma with Tokens Studio  
**Related:** [Tokenization Process](../tokenization-process.md) | [Token Assignment Guidelines](../developers/token-assignment-guidelines.md)

---

## **Quick Start Checklist**

### **Before You Start**
- [ ] Component analysis complete
- [ ] Token strategy planned  
- [ ] Tokens Studio plugin installed and ready
- [ ] Existing token library reviewed
- [ ] [Tokenization Process](../tokenization-process.md) understanding confirmed

### **Token Application Process**  
- [ ] **Use Tokens Studio for ALL token applications** (never Figma right panel)
- [ ] Apply tokens to every design property possible
- [ ] Create tokens for properties Figma can't currently tokenize  
- [ ] Export tokens to Figma Variables
- [ ] Verify Tokens Studio ↔ Layer connections active

### **Component Structure Standards**
- [ ] Layer names use `underscore_format` (not hyphens or camelCase)
- [ ] Follow compound unit naming conventions
- [ ] Consider composite token opportunities for complex components
- [ ] Maintain consistent token naming patterns

### **Validation & Handoff**
- [ ] Run MCP Figma validation before handoff
- [ ] Zero hardcoded values detected
- [ ] All layer names compliant
- [ ] Token connections verified
- [ ] Validation report generated and archived

---

## **Token Hierarchy for Designers**

### **Layer Structure Overview**
- **`ob.g.*`** - Global tokens (system-wide foundation)
- **`ob.p.*`** - Primitive tokens (raw values) - **❌ DON'T USE DIRECTLY**
- **`ob.s1.*`** - Semantic Level 1 (lightness variations) - **❌ DON'T USE DIRECTLY**
- **`ob.s2.*`** - Semantic Level 2 (emphasis variations) - **✅ USE FOR NON-INTERACTIVE**
- **`ob.s3.*`** - Semantic Level 3 (compiled semantic colors) - **✅ USE FOR INTERACTIVE**
- **`ob.c.*`** - Component tokens (inherit from semantic) - **✅ USE WHEN AVAILABLE**
- **`ob.h.*`** - HTML element tokens (inherit from semantic/component) - **✅ USE WHEN AVAILABLE**

### **Designer Token Selection Rules**

1. **✅ Primary Choice: Component Tokens** - Use `ob.c.*` tokens when working with specific components
2. **✅ Interactive Elements: S3 Semantic** - Use `ob.s3.*` tokens for all interactive color decisions
3. **✅ Non-Interactive Elements: S2 Semantic** - Use `ob.s2.*` for static components  
4. **✅ Other Properties: S2/S3 Semantic** - Use `ob.s2.*` or `ob.s3.*` for spacing, typography, sizing
5. **❌ Avoid Lower Layers** - Don't use `ob.s1.*` or `ob.p.*` directly in component designs
6. **✅ Verify Token Existence** - Always confirm tokens exist in the actual system before applying

---

## **Real Token Examples**

### **Spacing Tokens (Always Available)**
```
ob.s2.spacing.none         (0)
ob.s2.spacing.xs           (0.5 units)
ob.s2.spacing.sm           (1 unit)  
ob.s2.spacing.md           (1.5 units)
ob.s2.spacing.lg           (2 units)
ob.s2.spacing.xl           (2.5 units)
ob.s2.spacing.2xl          (3 units)
ob.s2.spacing.3xl          (4 units)
ob.s2.spacing.4xl          (5 units)
ob.s2.spacing.5xl          (6 units)
ob.s2.spacing.6xl          (7 units)
```

### **Button Tokens (HTML Layer)**
```
ob.h.button.primary.bg.default
ob.h.button.primary.bg.hover
ob.h.button.primary.text.default
ob.h.button-label.font-size.md
```

### **Component Tokens**  
```
ob.c.card.container.bg
ob.c.card.container.border.color
ob.c.card.container.border.radius
ob.c.card.container.spacing.padding
ob.c.modal.overlay.bg
ob.c.tooltip.container.shadow
```

---

## **Step-by-Step Workflow**

### **1. Preparation Phase**
1. **Analyze Component Requirements**
   - Identify all visual properties that need tokens
   - Determine if component is interactive or static
   - Check existing component tokens for this element type

2. **Set Up Tokens Studio**
   - Ensure plugin is connected to correct token library
   - Verify theme and mode settings match design requirements
   - Test connection with simple token application

### **2. Token Application Phase**
1. **Start with Component Tokens**
   - Apply `ob.c.*` tokens first if available for your component
   - Use component-specific tokens for consistent behavior

2. **Apply Semantic Tokens**
   - **Interactive elements**: Use `ob.s3.*` tokens for colors
   - **Static elements**: Use `ob.s2.*` tokens for colors
   - **All elements**: Use `ob.s2.*`/`ob.s3.*` for spacing, typography, sizing

3. **Layer Naming Standards**
   - Use `underscore_format` for all layer names
   - Examples: `button_surface`, `text_label`, `icon_holder`
   - Avoid: `button-surface`, `textLabel`, `iconHolder`

### **3. Validation Phase**
1. **Visual Validation**
   - Preview component with different themes
   - Test mode switching (light/dark, emphasis levels)
   - Verify visual consistency with design intent

2. **Technical Validation**
   - Run MCP Figma validation tool
   - Check for remaining hardcoded values
   - Verify all layer names comply with standards
   - Generate validation report

### **4. Handoff Preparation**
1. **Export Tokens to Figma Variables**
   - Use Tokens Studio export function
   - Verify variables appear correctly in Figma Variables panel
   - Test that variables work in Figma's native interface

2. **Documentation**
   - Note any design decisions that couldn't be tokenized
   - Document in component handoff MD file for developers
   - Include validation report and any special considerations

---

## **❌ Critical Don'ts**

### **Never Do These:**
- **❌ Apply variables directly in Figma right panel** → Breaks Tokens Studio connection
- **❌ Leave hardcoded values** → Violates tokenization requirements  
- **❌ Use hyphen-case or camelCase layer names** → Breaks compound unit standards
- **❌ Skip validation before handoff** → Causes developer rejection
- **❌ Ignore composite token opportunities** → Reduces maintenance efficiency
- **❌ Use primitive tokens directly** → Breaks semantic hierarchy

---

## **Common Violation Patterns & Solutions**

### **❌ Tokenization Violations**
| **Wrong** | **Correct** | **Reason** |
|---|---|---|
| `#ff0000` | `ob.s3.color.error.bg` | Use semantic color tokens |
| `font-size: 16px` | `ob.s2.typography.body.md` | Use typography tokens |
| `padding: 12px` | `ob.s2.spacing.md` | Use spacing tokens |
| `width: 240px` | `ob.s2.sizing.button.width.lg` | Use sizing tokens |

### **❌ Layer Naming Violations**
| **Wrong** | **Correct** | **Format Rule** |
|---|---|---|
| `text-label` | `text_label` | Use underscores, not hyphens |
| `iconHolder` | `icon_holder` | Use underscores, not camelCase |
| `button-surface` | `button_surface` | Use underscores consistently |

---

## **Troubleshooting**

### **Token Not Applying?**
1. Check if token exists in current theme/mode
2. Verify Tokens Studio connection is active
3. Confirm layer supports the token type
4. Try refreshing Tokens Studio plugin

### **Validation Failing?**
1. Check for remaining hardcoded values
2. Verify layer naming follows underscore format
3. Ensure all interactive elements use S3 tokens
4. Confirm component tokens are applied where available

### **Handoff Issues?**  
1. Generate fresh validation report
2. Export updated tokens to Figma Variables
3. Document non-tokenizable design decisions
4. Include theme/mode context in handoff notes

---

**Next Steps:** After completing token assignment, refer to [Token Assignment Guidelines](../../token-assignment-guidelines.md) for technical implementation details that developers will use.

*This workflow ensures consistent, maintainable token application that bridges design intent with development implementation.*