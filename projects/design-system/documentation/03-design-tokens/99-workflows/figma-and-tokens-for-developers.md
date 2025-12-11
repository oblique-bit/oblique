# Figma and Tokens for Developers

## **Target Audience**
**Primary:** DS/Oblique Developers  
**Secondary:** DS/Oblique Designers, Product/Project Developers  
**Prerequisites:** Figma desktop app, VS Code, basic MCP knowledge  
**Related Personas:** [Design System Personas](../../02-foundation/02-personas.md#12-dsobl)

## Overview

This document covers the developer workflow for working with design tokens through Figma MCP integration.

### Your Development Environment

1. **Figma MCP Server** - Inspect design tokens and components directly from VS Code
2. **JSON Token Files** - Direct access to all token definitions, including unsupported ones
3. **Component Documentation** - Implementation guides and token mapping references

### Key Integration: Figma Dev Mode MCP Server

**Endpoint:** `http://127.0.0.1:3845/mcp`  
**Current File:** [DesignSystem-Tokens-V9](https://www.figma.com/design/uPBStwI7fwQ8np2aMSrMdF/DesignSystem-Tokens-V9?node-id=118-139&m=dev)

**Main Functions:**
- `mcp_figma_dev_mod_get_variable_defs` - Get variable definitions
- `mcp_figma_dev_mod_get_code` - Generate UI code  
- `mcp_figma_dev_mod_get_metadata` - Get design metadata

## Setup

### Prerequisites
- **Figma desktop app** (latest version) - browser version not supported
- **Dev Mode access** (paid feature - contact admin to activate)
- **VS Code** with MCP client configured

### Configuration Steps
1. Install and launch Figma desktop app
2. **Request Dev Mode access** from admin if not already activated
3. Configure MCP client in VS Code:
   - Add Figma server endpoint: `http://127.0.0.1:3845/mcp`
   - Update `mcp.json` or configure via IDE settings
4. Verify successful VS Code connection

## Token Workflow

**Flow:** `Figma → Tokens Studio → Style Dictionary → Code`

**Your Responsibilities:**
- Use semantic tokens (`ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index`) when available
- Support theme variations and viewport modes
- Check JSON files for Figma-unsupported tokens

## Figma MCP Inspection

For detailed Figma MCP prompts and workflows, see the **[Figma MCP Inspection Guide](./12-figma-mcp-inspection-guide.md)**.

### Quick Start Commands

```
**Setup:** COMMAND 1: Get metadata
mcp_figma_dev_mod_get_metadata

**Setup:** COMMAND 2: Extract code structure  
mcp_figma_dev_mod_get_code

**Setup:** COMMAND 3: Get visual reference
mcp_figma_dev_mod_get_image
```

### Common Workflows
- **[Layer Structure Inspection](./12-figma-mcp-inspection-guide.md#121-layer-structure-inspection)**: Extract component layer hierarchies
- **[Token & Variable Analysis](./12-figma-mcp-inspection-guide.md#123-token--variable-analysis)**: Extract variable definitions and semantic tokens
- **[Code Generation](./12-figma-mcp-inspection-guide.md#124-code-generation)**: Generate HTML/CSS and React components

## Handling Unsupported Tokens in Figma

Some token types are not natively supported in Figma and cannot be directly inspected or queried via MCP.

When MCP tools can't find certain tokens in Figma:

1. **Check the JSON token files** - All tokens are defined in the token library regardless of Figma support
2. **Look for "Figma Limitation" notices** in component documentation 
3. **Implement based on documented specifications** - Follow the exact values from token files

### Common Unsupported Token Types

| **Property** | **Example Token** | **Figma Workaround** | **Developer Implementation** |
|-------------|------------------|---------------------|----------------------------|
| **Text Vertical Trim** | `ob.h.button_aug.typography.text_label.text_vertical_trim` | Manual "Vertical trim" setting | `text-box-trim: cap alphabetic` |
| **CSS Layout** | `ob.h.button_aug.container.flex_direction` | Component variants | `flex-direction: row` |
| **Text Alignment** | `ob.h.button_aug.typography.text_label.text_align` | Manual text alignment | `text-align: center` |

### Implementation Note Template

```markdown
**Figma Limitation Notice**
These tokens (e.g., text vertical trim, responsive typography scales, or complex state tokens) are not supported in Figma and cannot be inspected via MCP. They remain part of the design system and must be implemented as documented.
```

**Related Guide:** [Figma Unsupported Properties](./figma-unsupported-properties.md)

## standard practices

1. **Always verify MCP connection** before starting development sessions
2. **Use semantic tokens** whenever possible, avoid component-level tokens
3. **Test across viewport modes** to ensure responsive behavior
4. **Document any workarounds** for unsupported token types
5. **Use automation** for token validation and updates

## Troubleshooting

### Common Issues

- **MCP Connection Failed**: Ensure Figma desktop app is running and Dev Mode is enabled
- **Dev Mode Not Available**: Request access from admin to activate Dev Mode
- **Token Not Found**: Check if token type is supported in Figma or requires manual implementation
- **Variant Mismatch**: Verify component variants match between Figma and code implementation
- **Browser vs Desktop**: Confirm using Figma desktop app, not browser version

### Support Resources

- Internal design system documentation
- Figma Dev Mode MCP Server documentation
- Team communication channels for workflow questions

---

**Last Updated**: September 2025  
**Related Documents**: 
- [Figma MCP Inspection Guide](./12-figma-mcp-inspection-guide.md) - Complete collection of Figma MCP prompts and workflows
- [Component Identification](./readme.md)
- [Design Tokens](./design-tokens/)
- [Protected Files](./readme.md)
