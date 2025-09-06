# Figma and Tokens for Developers

## **Target Audience**
**Primary:** DS/Oblique Developers  
**Secondary:** DS/Oblique Designers, Product/Project Developers  
**Prerequisites:** Figma desktop app, VS Code, basic MCP knowledge  
**Related Personas:** [Design System Personas](../../02-foundation/02-personas.md#12-dsobl)

## Overview

This document outlines the workflow for developers working with the tokenized Design System project. Developers have multiple integrated tools and resources:

### Available Developer Resources

**1. Token Analysis & Documentation**
- **JSON Token Files**: Direct analysis of token structures, values, and relationships
- **Documentation**: Access to `/documentation` folder containing foundation principles, component guidelines, and workflow processes
- **Design System Context**: Complete understanding of S1/S2/S3 semantic architecture and token hierarchy

**2. Design Integration**
- **Figma Dev Mode**: Direct access to design files with token inspection capabilities
- **MCP Integration**: Figma Dev Mode MCP Server integrated into development environment
- **Visual Studio Code + GitHub Copilot** (Recommended): Familiar IDE environment with AI assistance for improved productivity

**3. Unified Workflow**
The integration of these tools creates a development environment where you can move between analyzing token files, reading documentation for context, inspecting designs in Figma, and implementing solutions in your preferred IDE with AI assistance.

## Scope

- **Primary Focus**: Tokenized Design System project
- **Secondary**: Active releases (R14 and above) workflows
- **Integration**: Figma Dev Mode MCP Server with VS Code

## Current State and Workflow Improvements

We use the **Figma Dev Mode MCP Server** as a bridge between design files and development environments. This integration enables developers to:

- Query design metadata directly from their IDE
- Access component information, variants, and token values
- Use AI-powered workflows for improved productivity

### MCP Server Details

**Server:** Figma Dev Mode MCP Server (Official)  
**Endpoint:** `http://127.0.0.1:3845/mcp`  
**Protocol:** Model Context Protocol (MCP)  
**Current Figma File:** [DesignSystem-Tokens-V9](https://www.figma.com/design/uPBStwI7fwQ8np2aMSrMdF/DesignSystem-Tokens-V9?node-id=118-139&m=dev) - Active file for exploring MCP capabilities  
**Documentation:** 
- [Figma for Developers MCP Server](https://github.com/figma/figma-for-developers-mcp-server) - Official GitHub repository
- [Model Context Protocol](https://modelcontextprotocol.io/) - MCP specification and documentation
- [MCP Client Setup Guide](https://modelcontextprotocol.io/quickstart) - Integration with VS Code and other clients

**Functions Used:**
- `mcp_figma_dev_mod_get_variable_defs` - Get variable definitions
- `mcp_figma_dev_mod_get_code` - Generate UI code  
- `mcp_figma_dev_mod_get_image` - Generate design screenshots
- `mcp_figma_dev_mod_get_code_connect_map` - Get Code Connect mappings
- `mcp_figma_dev_mod_get_metadata` - Get design metadata

**Additional Available Functions:**
- `mcp_figma_dev_mod_create_design_system_rules` - Create design system rules for AI code generation
- `mcp_figma_dev_mod_get_variable_defs` - Get variable definitions for specific nodes  
- Other standard MCP Figma functions (see MCP server documentation for complete list)

**Requirements:**
- Figma Desktop App (latest version)
- **Dev Mode Access** (paid feature - not included in free plan)
- MCP client configured in VS Code

## Workflow Architecture

### 1. Figma MCP Server Setup

**Prerequisites:**
- **Figma desktop app (latest version)** - browser version not supported
- **Dev Mode access** (paid feature - contact admin to activate)
- App must be running during development

**Configuration Steps:**
1. Install and launch Figma desktop app
2. **Request Dev Mode access** from admin if not already activated
3. Enable Dev Mode MCP server in Figma Preferences
4. Configure MCP client in VS Code:
   - Add Figma server endpoint: `http://127.0.0.1:3845/mcp`
   - Update `mcp.json` or configure via IDE settings
5. Verify successful VS Code connection

### 2. Component Architecture & Inspection

**Capabilities:**
- Direct component inspection from IDE
- Variant and property analysis
- Layer structure exploration
- Token usage tracking across primitive, semantic, and component levels

### 3. Token Workflows

**Flow Architecture:**
```
Figma → Tokens Studio → Style Dictionary → Code
```

**Developer Responsibilities:**
- Maintain compatibility with semantic layers
- Support theme variations
- Handle viewport variable modes
- Implement automation where possible (CI/CD, Style Dictionary auto-updates, AI validation)

### 4. Standalone vs. Integrated Use

**Requirements:**
- MCP requires standalone Figma desktop app with **Dev Mode access**
- Team infrastructure supports standalone app installation
- Better than browser-based workflows due to deeper MCP access

## Developer Prompts

### Quick Reference

For detailed Figma MCP prompts and workflows, see the dedicated **[Figma MCP Inspection Guide](./12-figma-mcp-inspection-guide.md)**.

### Core Workflow Categories

- **[Layer Structure Inspection](./12-figma-mcp-inspection-guide.md#121-layer-structure-inspection)**: Extract component layer hierarchies and structures
- **[Component Analysis](./12-figma-mcp-inspection-guide.md#122-component-analysis)**: Analyze component variants, legacy detection, and structure comparison
- **[Token & Variable Analysis](./12-figma-mcp-inspection-guide.md#123-token--variable-analysis)**: Extract variable definitions, semantic focus, and viewport analysis
- **[Code Generation](./12-figma-mcp-inspection-guide.md#124-code-generation)**: Generate HTML/CSS, React+Tailwind, and context-aware code
- **[Design System Rules](./12-figma-mcp-inspection-guide.md#125-design-system-rules)**: Create design system rules for AI-guided development

### Quick Copy-Paste Commands

For immediate use, the most common command sequence:

```
🔧 COMMAND 1: Get metadata
mcp_figma_dev_mod_get_metadata

🔧 COMMAND 2: Extract code structure  
mcp_figma_dev_mod_get_code

🔧 COMMAND 3: Get visual reference
mcp_figma_dev_mod_get_image
```

For complete prompt collection and detailed instructions, refer to the **[Figma MCP Inspection Guide](./12-figma-mcp-inspection-guide.md)**.

## Handling Unsupported Tokens in Figma

### Context

Some token types are not natively supported in Figma and cannot be directly inspected or queried via MCP.

### Strategy

1. **Create & Maintain Tokens Anyway**
   - Define tokens in the token library regardless of Figma support
   - Maintain consistency across all token definitions

2. **Documentation & Communication**
   - Mark unsupported tokens clearly as *not available in Figma*
   - Provide documentation for developers
   - Include clear implementation references

3. **Developer Guidance**
   - Implement unsupported tokens directly in code based on documentation
   - Follow documented specifications exactly
   - Maintain consistency with supported token patterns

### Example Implementation Note

```markdown
**Figma Limitation Notice**
These tokens (e.g., responsive typography scales or complex state tokens) are not supported in Figma and cannot be inspected via MCP. They remain part of the design system and must be implemented as documented.
```

## Best Practices

### For Developers

1. **Always verify MCP connection** before starting development sessions
2. **Use semantic tokens** whenever possible, avoid component-level tokens
3. **Test across viewport modes** to ensure responsive behavior
4. **Document any workarounds** for unsupported token types
5. **Use automation** for token validation and updates

### For Maintainers

1. **Keep Figma desktop app updated** to latest version
2. **Monitor MCP server connectivity** across team
3. **Document new token types** and their Figma support status
4. **Maintain Code Connect mappings** for accurate code generation
5. **Review and update workflows** based on team feedback
6. **Manage Dev Mode access** for team members as needed

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
- [Component Identification](./02-component-identification.md)
- [Design Tokens](./design-tokens/)
- [Protected Files](./04-protected-files.md)
