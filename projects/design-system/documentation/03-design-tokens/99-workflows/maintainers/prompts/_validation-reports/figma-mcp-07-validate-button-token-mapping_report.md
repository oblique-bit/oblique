# Figma MCP Prompt Validation Report: figma-mcp-07-validate-button-token-mapping

**Date:** 2025-09-10
**Prompt:** figma-mcp-07-validate-button-token-mapping.md

## Test Context
- Prompt tested for: Button component variant token mapping validation
- Scope: All variants of the selected button component in Figma
- Validation rules: Component token tier scoping, semantic token allowance, red flag for cross-component tokens, border tokens on icon/text, and state naming compliance

## Test Steps
1. Loaded the prompt in VS Code Copilot Chat with MCP Figma Server connected.
2. Selected a button component in Figma with multiple variants (primary, secondary, etc.).
3. Executed the prompt as per instructions.

## Observed Results
- Prompt was clear and actionable for the MCP server.
- All validation rules were interpreted as intended:
  - Tokens were checked for correct scoping (ob.c.button, ob.h.button, etc.).
  - Semantic tokens (ob.s) were allowed as exceptions.
  - Red flags were raised for any cross-component token mapping.
  - Red flags were raised for border tokens mapped to icon or text layers.
  - State naming conventions were validated.
- The report output was structured and highlighted all discrepancies as required.

## Recommendations
- Prompt is ready for use and can be adapted for other components.
- Consider adding more examples or edge cases for future tests.
- No major changes needed at this time.

---

*This report documents the initial validation of the button token mapping prompt. For future prompt changes, update this report or create a new one in this folder.*
