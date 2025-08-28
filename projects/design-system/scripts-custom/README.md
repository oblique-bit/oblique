# Custom Scripts for Design System Maintenance

This folder contains reusable scripts for design system validation, analysis, and maintenance that are useful for the entire team.

## � **VALIDATION SCRIPTS - Component & Architecture**

**Essential validation scripts for maintaining design system integrity:**

```bash
# 🎯 COMPREHENSIVE: Check all component token references
node scripts-custom/validate-all-components.js
# Validates all 24 component files for broken S3 token references

# 🏗️ ARCHITECTURE: Validate S1↔S3 & S2↔S3 mirroring
node scripts-custom/validate-semantic-mirroring.js  
# Ensures perfect semantic layer mirroring (226 S1↔S3, 28 S2↔S3 refs)

# 🎪 SPECIFIC: Validate spinner component tokens
node scripts-custom/validate-spinner.js
# Focused validation for spinner component S3 references
```

**Key Achievement**: All component S3 token references are now 100% valid (59 total references across 7 components) ✅

## �🔗 **FASTEST: Token Reference Analysis**

**Need to understand token relationships?** Use the super-fast token tracer:

```bash
# 🚀 INSTANT token chain analysis:
npm run trace-token "ob.h.button.color.fg.primary.disabled"

# 🔍 SEARCH for tokens:
npm run search-tokens "button disabled"

# 🎨 FIGMA INTEGRATION - Analyze your current Figma selection:
npm run trace-figma

# 💫 CONVENIENCE alias (add to your shell):
alias "reference chain of"="./scripts-custom/reference-chain-of.sh"
# Then use: reference chain of "ob.h.button.color.fg.primary.disabled"
```

**Figma Integration Features:**
- 🎯 Automatically detects tokens in your current Figma selection
- 🎨 Identifies fill, border, and text color tokens
- 📝 Traces complete reference chains for all found tokens
- ⚡ Shows property types (fill/background, text/foreground, border, etc.)
- 🔗 Works with your existing Figma Dev Mode MCP setup

## 🤖 **EASIEST WAY: Get AI Recommendations**

**Don't know which scripts to run?** AI script recommendations have been moved to private workflow automation.

---

## 🎯 Purpose

These scripts help maintain the quality and consistency of the Oblique Design System by providing automated validation and analysis tools.

## 📋 Script Categories

### Validation Scripts
- **`detect-plural-references.js`** - Validates singular naming conventions across tokens, files, and documentation
  - *Example: Finds "colors.primary.blues" instead of "color.primary.blue" → prevents inconsistent naming that breaks token lookups*
- **`validate-token-syntax.js`** - Quick validation of token reference syntax and common issues
  - *Example: Catches broken references like "{color.primary.undefined}" or missing closing braces → prevents build failures and visual bugs*
- **`validate-consumption-hierarchy.js`** - Validates proper token consumption patterns (primitive → semantic → component)
  - *Example: Ensures buttons don't reference primitive colors directly, but use semantic tokens instead → maintains design flexibility and consistency*
- **`validate-documentation-references.js`** - Validates token references in documentation files after naming convention changes
  - *Example: Ensures all documentation uses new s1/s2/s3 naming instead of old l1/l2/l3 patterns → prevents confusion and outdated examples*
- **`validate-documentation-structure.js`** - Validates structure and consistency of documentation files
- **`validate-token-chain-resolution.js`** - Deep validation of token reference chains and circular references
- **`validate-protected-files.js`** - Validates that protected files haven't been accidentally modified
- **`validate-doc-tokens.js`** - Validates token references within documentation files
- **`validate-orchestrator.js`** - Runs multiple validation scripts in sequence for comprehensive checking

### Analysis & Inspection Scripts
- **`analyze-token-structure.js`** - Inspects and displays token structure for debugging
  - *Example: Displays the full token tree when debugging why a button color isn't applying correctly → speeds up troubleshooting*
- **`analyze-s1-s2-redundancy.js`** - Analyzes redundancy patterns between S1 and S2 token layers
- **`detect-circular-token-references.js`** - Detects circular token references in the system
  - *Example: Finds spacing.large → spacing.xl → spacing.large infinite loop → prevents build crashes and undefined values*
- **`trace-token-chain.js`** - Traces complete reference chains for tokens to understand dependencies
- **`reference-chain-of.js`** - Helper script for quick token reference chain analysis
- **`find-missing-s1-tokens.js`** - Identifies missing tokens in the S1 semantic layer
- **`show-exact-missing-tokens.js`** - Shows exactly which tokens are missing from specific layers

### Utility & Setup Scripts
- **`setup-token-tracking.js`** - Sets up token change tracking and monitoring system
- **`track-token-changes.js`** - Tracks and reports on token changes over time
- **`style-dictionary-setup-helper.js`** - Helper script for Style Dictionary integration setup

## 🛡️ Validation System

**Problem Solved**: Ensures design token consistency and prevents breaking changes through automated validation.

### Multi-Layer Validation:
1. **Syntax Validation** - Checks token reference syntax and structure
2. **Naming Convention** - Ensures consistent singular naming across all tokens
3. **Consumption Hierarchy** - Validates proper token usage patterns (primitive → semantic → component)
4. **Documentation Sync** - Keeps documentation in sync with token changes
5. **Circular Reference Detection** - Prevents infinite loops in token references

### Quick Validation:
```bash
# Run all validations with the orchestrator
node scripts-custom/validate-orchestrator.js

# Individual validations
npm run check:plural-references
npm run check:token-syntax
```

## 🚀 Usage

### NPM Scripts
```bash
# Run validation scripts (configured in package.json)
npm run check:plural-references
npm run check:token-syntax

# Run analysis and debugging scripts manually
node scripts-custom/validate-token-chain-resolution.js
node scripts-custom/analyze-emphasis-structure.js
node scripts-custom/analyze-token-structure.js
node scripts-custom/detect-circular-token-references.js
node scripts-custom/trace-token-chain.js
```

### Direct Execution
```bash
# Validation scripts
node scripts-custom/detect-plural-references.js
node scripts-custom/validate-token-syntax.js
node scripts-custom/validate-consumption-hierarchy.js
node scripts-custom/validate-token-chain-resolution.js
node scripts-custom/validate-orchestrator.js

# Analysis and inspection scripts
node scripts-custom/analyze-token-structure.js
node scripts-custom/analyze-s1-s2-redundancy.js
node scripts-custom/detect-circular-token-references.js
node scripts-custom/trace-token-chain.js

# Utility scripts
node scripts-custom/setup-token-tracking.js
```

## 📁 Script Organization

### scripts-custom/ (This Directory)
✅ **Team-reusable design system scripts**
- Validation and analysis tools
- Token debugging and tracing
- Migration and transformation utilities
- AI-powered recommendations and automation
- Quality assurance and consistency checking

### scripts/
✅ **Development and build scripts**
- Build automation (post-build.ts)
- Linting and formatting (lint.ts)
- Release management (release.ts)

## 🔧 Adding New Scripts

When adding new design system maintenance scripts:

1. **Place in scripts-custom/** if the script is:
   - Useful for team members
   - Validates design system quality
   - Analyzes token structure
   - Maintains codebase consistency
   - Provides debugging or migration utilities

2. **Place in scripts/** if the script is:
   - Build or development tooling
   - CI/CD related
   - Package management

## 📖 Related Documentation

- **Token Guidelines**: `documentation/design-tokens/guidelines-token-consumption.md`
- **Color Tokens**: `documentation/design-tokens/colors.md`
- **Naming Strategy**: Internal documentation available
- **Bug Tracking**: Internal issue tracking system

## ⚠️ Important Notes

- All scripts should be run from the project root directory
- Scripts require Node.js 14+ (all scripts are now JavaScript/Node.js based)
- Some scripts modify files - always commit your work before running migration scripts
- The validation system is integrated into the development workflow via npm scripts
- Use `validate-orchestrator.js` to run multiple validation scripts efficiently

## 🤝 Contributing

When contributing new scripts:
1. Follow the naming convention (kebab-case)
2. Include proper documentation in script headers
3. Add usage examples to this README
4. Test scripts thoroughly before committing
5. Update package.json if adding npm scripts
