# Tokenization Validation Reports

**Purpose:** Designer-focused token coverage and Token Studio integration validation

## Report Types:
- **Complete Tokenization Validation** - Every design property token coverage
- **Token Studio Integration** - Connection validation between layers and tokens
- **Semantic Token Analysis** - Token meaning and usage validation
- **Variable Definition Analysis** - Token structure and hierarchy
- **Token Mapping Quality** - Designer token application accuracy

## For:
- **Designers** - Tokenization quality assurance
- **Design system maintainers** - Token consistency
- **Token Studio users** - Integration validation

## Related Prompts:
- `figma-mcp-tokenization-validation.md` ⭐ **PRIMARY**
- `figma-mcp-03-analyze-semantic-tokens.md`
- `figma-mcp-03-extract-variable-definitions.md`
- `figma-mcp-03-analyze-viewport-modes.md`

## Report Naming:
`YYYYMMDD_HHMM-component-tokenization-[validation-type]-report.md`

## Validation Criteria:
- ✅ **100% Token Coverage** - No hardcoded values allowed
- ✅ **Token Studio Connected** - All tokens applied via Token Studio
- ✅ **Semantic Accuracy** - Tokens used for intended purpose
- ✅ **Future-Proof Tokens** - Tokens for properties Figma can't tokenize yet
- ✅ **A11y Token Coverage** - Color contrast ratios, focus indicators, text accessibility tokens
