# Figma MCP Prompts Collection

This folder contains ready-to-use prompts for Figma MCP (Model Context Protocol) operations. These prompts are organized by category with numbered prefixes for easy navigation and logical grouping.

## How to Use

1. **Select a prompt file** that matches your current task
2. **Drag and drop** the file into VS Code Copilot Chat
3. **Execute** the prompt to perform the Figma MCP operation
4. **Follow** any follow-up instructions in the prompt

## Prompt Categories

### **Analysis:** 01: Layer Structure & Inspection
- **`01-inspect-layer-structure_simple.md`** - Basic layer structure analysis with optional documentation
- **`01-inspect-layer-structure_detailed.md`** - complete component structure analysis

### **Note:** 02: Component Analysis
- **`02-compare-component-variants.md`** - Compare component variants
- **`02-detect-legacy-components.md`** - Detect deprecated variables and patterns

### **Design:** 03: Token & Variable Analysis
- **`03-extract-variable-definitions.md`** - Extract all variable definitions
- **`03-analyze-semantic-tokens.md`** - Focus on semantic tokens only
- **`03-analyze-viewport-modes.md`** - Analyze responsive behavior

### **Note:** 04: Code Generation
- **`04-generate-html-css.md`** - Generate HTML & CSS
- **`04-generate-react-tailwind.md`** - Generate React + Tailwind components
- **`04-generate-with-context.md`** - Generate with visual context

### **Requirements:** 05: Documentation & Rules
- **`05-update-component-docs.md`** - Power user: direct documentation update
- **`05-create-design-rules.md`** - Create component rules for AI generation

### **Setup:** 06: Manual Operations
- **`06-manual-mcp-commands.md`** - Step-by-step MCP commands for manual execution

## Prerequisites

Before using these prompts, ensure you have:

- **Figma Desktop App** running
- **Dev Mode** enabled in Figma
- **Component selected** in Figma
- **MCP tools** configured in VS Code
- **GitHub Copilot** active

## standard practices

1. **Select the right component** in Figma before running prompts
2. **Use exact component names** from Figma (don't modify them)
3. **Run prompts in sequence** for complete analysis
4. **Save visual context** by using image generation prompts
5. **Document results** for team reference

## Related Documentation

- [12-figma-mcp-inspection-guide.md](../12-figma-mcp-inspection-guide.md) - Complete workflow guide
- [02-figma-and-tokens-for-developers.md](../02-figma-and-tokens-for-developers.md) - Token development guide
- [09-figma-component-decomposition-strategy.md](../09-figma-component-decomposition-strategy.md) - Component strategy

## Troubleshooting

If prompts aren't working:

1. **Check Figma connection** - Ensure desktop app is running
2. **Verify Dev Mode** - Must be enabled for MCP tools
3. **Confirm selection** - Ensure component is properly selected
4. **Restart MCP** - Try restarting VS Code if connection fails

---

**Last Updated:** September 6, 2025  
**Maintainers:** Design System Team
