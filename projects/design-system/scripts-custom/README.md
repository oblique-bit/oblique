# Custom Scripts for Design System Maintenance

This folder contains reusable scripts for design system validation, analysis, and maintenance that are useful for the entire team.

## 🎯 Purpose

These scripts help maintain the quality and consistency of the Oblique Design System by providing automated validation and analysis tools.

## 📋 Script Categories

### Validation Scripts
- **`find-plural-references.py`** - Validates singular naming conventions across tokens, files, and documentation
  - *Example: Finds "colors.primary.blues" instead of "color.primary.blue" → prevents inconsistent naming that breaks token lookups*
- **`quick-validate-token-syntax.py`** - Quick validation of token reference syntax and common issues
  - *Example: Catches broken references like "{color.primary.undefined}" or missing closing braces → prevents build failures and visual bugs*
- **`validate-consumption-hierarchy.py`** - Validates proper token consumption patterns (primitive → semantic → component)
  - *Example: Ensures buttons don't reference primitive colors directly, but use semantic tokens instead → maintains design flexibility and consistency*
- **`validate-token-chain-resolution.js`** - Deep validation of token reference chains and circular references
- **`validate-l1-l2-redundancy.py`** - Analyzes redundancy between L1 and L2 token levels
  - *Example: Confirms L2 tokens are 99.2% redundant with L1 → enables build script optimization to reduce CSS variables*

### Analysis & Inspection Scripts
- **`analyze-emphasis-structure.js`** - Analyzes emphasis token structure and relationships
  - *Example: Shows how emphasis.high relates to emphasis.medium and identifies missing emphasis levels → ensures complete design coverage*
- **`inspect-token-structure.js`** - Inspects and displays token structure for debugging
  - *Example: Displays the full token tree when debugging why a button color isn't applying correctly → speeds up troubleshooting*
- **`detect-circular-token-references.js`** - Detects circular token references in the system
  - *Example: Finds spacing.large → spacing.xl → spacing.large infinite loop → prevents build crashes and undefined values*

### Maintenance Scripts
- **`remove-empty-files.sh`** - Automatically removes empty untracked files
  - *Example: Cleans up empty .scss files left behind after refactoring token structures → keeps repository clean and reduces confusion*
- **`remove-obsolete-files.js`** - Removes untracked obsolete/deprecated files
  - *Example: Removes old token files like "legacy-colors.json" that are no longer referenced → prevents accidental usage of outdated tokens*
- **`generate-word-docs.py`** - Converts all markdown documentation to Word (.docx) format for offline reading
  - *Example: Generates printable Word documents from all .md files in documentation/ with professional footers (filename, generation date/time, page X of Y) → enables offline validation and team review*

## 🚀 Usage

### NPM Scripts
```bash
# Run validation scripts (configured in package.json)
npm run check:plural-references
npm run check:token-syntax
npm run docs:generate-word

# Run analysis and debugging scripts manually
node scripts-custom/validate-token-chain-resolution.js
node scripts-custom/analyze-emphasis-structure.js
node scripts-custom/inspect-token-structure.js
node scripts-custom/detect-circular-token-references.js
```

### Direct Execution
```bash
# Make scripts executable
chmod +x scripts-custom/*.sh

# Run validation scripts
python3 scripts-custom/find-plural-references.py
python3 scripts-custom/quick-validate-token-syntax.py
python3 scripts-custom/validate-consumption-hierarchy.py
python3 scripts-custom/validate-l1-l2-redundancy.py
node scripts-custom/validate-token-chain-resolution.js

# Run analysis and inspection scripts
node scripts-custom/analyze-emphasis-structure.js
node scripts-custom/inspect-token-structure.js
node scripts-custom/detect-circular-token-references.js

# Run maintenance scripts
./scripts-custom/remove-empty-files.sh
node scripts-custom/remove-obsolete-files.js
python3 scripts-custom/generate-word-docs.py
```

## 📁 Script Organization Rules

### scripts-custom/ (This Folder)
✅ **Team-reusable design system scripts**
- Validation and analysis tools
- Maintenance and cleanup utilities  
- Token debugging and tracing
- Quality assurance scripts

### ai/scripts/
✅ **AI workflow and context management**
- Personal AI memory backups
- Context automation
- Historical refactoring scripts
- AI-specific tooling

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

2. **Place in ai/scripts/** if the script is:
   - Personal AI workflow automation
   - Context or memory management
   - Specific to AI-driven development

3. **Place in scripts/** if the script is:
   - Build or development tooling
   - CI/CD related
   - Package management

## 📖 Related Documentation

- **Token Guidelines**: `documentation/token-consumption-guidelines.md`
- **Color Tokens**: `documentation/color-tokens.md`
- **Naming Strategy**: `ai/TOKEN_NAMING_STRATEGY.md`
- **Bug Tracking**: `documentation/bugs.md`

## ⚠️ Important Notes

- All scripts should be run from the project root directory
- Python scripts require Python 3.6+
- Node.js scripts require Node.js 14+
- Some scripts modify files - always commit your work before running maintenance scripts
- The plural reference checker is integrated into the development workflow via `npm run check:plural-references`

## 🤝 Contributing

When contributing new scripts:
1. Follow the naming convention (kebab-case)
2. Include proper documentation in script headers
3. Add usage examples to this README
4. Test scripts thoroughly before committing
5. Update package.json if adding npm scripts
