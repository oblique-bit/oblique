# Figma Unsupported Tokens - Implementation Guide

**Version:** 1.0  
**Date:** September 7, 2025  
**Status:** Work in Progress - Not Yet Approved by Product Owner  
**Purpose:** Guidelines for implementing design tokens that Figma cannot support as variables

## **Target Audience**
**Primary:** DS/Oblique Developers, DS/Oblique Designers  
**Secondary:** Product/Project Designers (for limitation awareness)  
**Prerequisites:** Understanding of design tokens, Figma variables, and Token Studio  
**Related Personas:** [Design System Personas](../../02-foundation/02-personas.md)

---

## Overview

Some design properties essential for comprehensive design systems cannot be represented as Figma variables due to platform limitations. This guide provides patterns for creating **developer-only tokens** that maintain design system integrity while acknowledging tool constraints.

### Common Unsupported Token Types

| **Property Type** | **Figma Support** | **Token Required** | **Implementation** |
|------------------|------------------|-------------------|-------------------|
| **Text Vertical Trim** | ❌ Manual only | ✅ Yes | Component tokens |
| **CSS Layout (flex-direction)** | ❌ Not supported | ✅ Yes | Component tokens |
| **Text Alignment** | ❌ Manual only | ✅ Yes | Component tokens |
| **Complex Animations** | ❌ Basic only | ✅ Yes | Custom properties |
| **Multi-value Spacing** | ❌ Single values | ✅ Yes | Responsive tokens |
| **Conditional Logic** | ❌ Not supported | ✅ Yes | Theme tokens |

---

## Implementation Pattern: Text Vertical Trim

### Use Case
You've set vertical trim to "cap height to baseline" in Figma for buttons, but need this as a token for developers.

### Token Architecture

#### 1. Primitive Level Token
```json
{
  "ob": {
    "p": {
      "vertical_trim": {
        "cap_baseline": {
          "$type": "string",
          "$value": "cap-height baseline",
          "$description": "Vertical trim from cap height to baseline - removes extra space above capitals and below baseline. FIGMA LIMITATION: Cannot be used as Figma variable. Set manually in Figma using 'Vertical trim' property. CSS implementation: text-box-trim: cap alphabetic."
        },
        "cap_x_height": {
          "$type": "string",
          "$value": "cap-height x-height",
          "$description": "Vertical trim from cap height to x-height - removes space above capitals and below lowercase. FIGMA LIMITATION: Cannot be used as Figma variable. Set manually in Figma using 'Vertical trim' property."
        },
        "none": {
          "$type": "string",
          "$value": "none",
          "$description": "No vertical trim applied - standard text box behavior with full font metrics."
        }
      }
    }
  }
}
```

#### 2. Component Level Implementation
```json
{
  "ob": {
    "h": {
      "button_aug": {
        "typography": {
          "text_label": {
            "text_vertical_trim": {
              "$type": "string",
              "$value": "{ob.p.vertical_trim.cap_baseline}",
              "$description": "Vertical trim from cap height to baseline for optimal button text alignment. FIGMA LIMITATION: This token is not exported to Figma variables as Figma doesn't support text vertical trim variables. Set manually in Figma components using 'Vertical trim' property. CSS implementation: use 'text-box-trim: cap alphabetic' or equivalent."
            }
          }
        }
      }
    }
  }
}
```

### CSS Implementation
```css
.ob-button {
  /* Modern approach */
  text-box-trim: cap alphabetic;
  text-box-edge: cap alphabetic;
  
  /* Fallback for older browsers */
  line-height: 1;
  display: flex;
  align-items: center;
}
```

### Figma Designer Instructions
1. **Manual Setting**: In button component text layers, set "Vertical trim" to "Cap height to baseline"
2. **Component Variants**: Ensure consistent setting across all button variants
3. **Documentation**: Add note in component description referencing the token

---

## Documentation Requirements

### Token Description Template
```
"$description": "[Property purpose]. FIGMA LIMITATION: [Specific limitation explanation]. [Manual Figma instructions]. [CSS implementation guidance]."
```

### Required Elements
1. **Clear Purpose**: What the token achieves
2. **Limitation Notice**: Explicit "FIGMA LIMITATION" callout
3. **Manual Instructions**: How to set in Figma
4. **Implementation Guidance**: CSS/code implementation details

### Example Descriptions
```json
{
  "text_align": {
    "$description": "Center alignment for button text labels. FIGMA LIMITATION: Not supported by Figma variables - set manually in Figma components. CSS implementation: text-align: center."
  },
  "flex_direction": {
    "$description": "CSS flex-direction for horizontal layout. FIGMA LIMITATION: Cannot be used as Figma variable. Use component variants (compact/full) in Figma. CSS implementation: flex-direction: row."
  }
}
```

---

## Export Control Strategy

### Token Studio Configuration
- **Include in JSON**: ✅ All unsupported tokens remain in token files
- **Exclude from Figma**: ❌ Prevent export to Figma variables to avoid confusion
- **Developer Access**: ✅ Ensure tokens available in code generation

### File Organization
```
src/lib/themes/
├── primitive/typography.json      # Core vertical trim tokens
├── html/button_aug/04 static.json # Component implementation
└── semantic/typography/           # Semantic layer (if needed)
```

---

## Validation Workflow

### MCP Inspection
When using Figma MCP tools, unsupported tokens won't appear in variable definitions:

```bash
# This will NOT find vertical trim tokens
mcp_figma_dev_mod_get_variable_defs

# Instead, reference token files directly
```

### Design-Dev Handoff
1. **Designer Deliverable**: Figma component with manual settings applied
2. **Developer Reference**: Token file with implementation guidance
3. **Validation**: Compare Figma visual with token specifications

---

## Related Patterns

### Similar Implementation Examples
- **[Flex Direction Tokens](../../../04-components/button/flex-direction-token-decision-log.md)**: CSS layout properties
- **[Text Alignment Tokens](./05-figma-variables-limitations-and-restrictions.md)**: Typography positioning
- **[Animation Tokens](./05-figma-variables-limitations-and-restrictions.md)**: Complex micro-interactions

### Cross-Reference Documentation
- **[Figma Limitations Guide](./05-figma-variables-limitations-and-restrictions.md)**: Complete limitation overview
- **[Token Architecture](../../../03-design-tokens/component-tokens.md)**: General token patterns
- **[MCP Workflows](./02-figma-and-tokens-for-developers.md)**: Inspection procedures

---

## Best Practices

### ✅ Do
- **Document Clearly**: Always include FIGMA LIMITATION notices
- **Reference Primitives**: Use primitive tokens for reusability
- **Provide Implementation**: Include specific CSS guidance
- **Validate Manually**: Check Figma component matches token intent

### ❌ Don't
- **Export to Figma**: Avoid unsupported tokens in Figma variables
- **Assume Detection**: Don't expect MCP tools to find these tokens
- **Skip Documentation**: Must document manual Figma procedures
- **Break Semantics**: Maintain token hierarchy and naming consistency

---

## Future Considerations

### Figma Updates
- Monitor Figma releases for new variable type support
- Update export strategies when capabilities expand
- Maintain backward compatibility during transitions

### Token Studio Evolution
- Leverage Token Studio features for export control
- Consider conditional export strategies
- Explore automated documentation generation

---

**Last Updated**: September 7, 2025  
**Next Review**: When Figma variable capabilities expand  
**Related Issues**: [Token Studio Support Inquiry](../../../_private/issues/token-studio/20250907-development-tokens-not-supported-by-figma.md)
