# Custom Scripts for Design System Maintenance

This folder contains reusable scripts for design system validation, analysis, and maintenance that are useful for the entire team.

## 🔗 **FASTEST: Token Reference Analysis**

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

**Don't know which scripts to run?** Let AI recommend the right scripts for your work:

```bash
# 🎯 SUPER SIMPLE - Just describe what you're doing:
npm run recommend:plan "I want to add new color tokens"
npm run recommend:done "I just renamed some files"

# 🔍 AUTO-DETECT what changed:
npm run recommend:auto

# 💬 INTERACTIVE questions (easiest):
npm run recommend
```

**See [EASY-RECOMMENDATIONS.md](./EASY-RECOMMENDATIONS.md) for more examples!**

---

## 🎯 Purpose

These scripts help maintain the quality and consistency of the Oblique Design System by providing automated validation and analysis tools.

## 📋 Script Categories

### Validation Scripts
- **`detect-plural-references.py`** - Validates singular naming conventions across tokens, files, and documentation
  - *Example: Finds "colors.primary.blues" instead of "color.primary.blue" → prevents inconsistent naming that breaks token lookups*
- **`validate-token-syntax.py`** - Quick validation of token reference syntax and common issues
  - *Example: Catches broken references like "{color.primary.undefined}" or missing closing braces → prevents build failures and visual bugs*
- **`validate-consumption-hierarchy.py`** - Validates proper token consumption patterns (primitive → semantic → component)
  - *Example: Ensures buttons don't reference primitive colors directly, but use semantic tokens instead → maintains design flexibility and consistency*
- **`validate-documentation-references.sh`** - Validates token references in documentation files after naming convention changes
  - *Example: Ensures all documentation uses new s1/s2/s3 naming instead of old l1/l2/l3 patterns → prevents confusion and outdated examples*
- **`validate-token-chain-resolution.js`** - Deep validation of token reference chains and circular references
- **`validate-l1-l2-redundancy.py`** - Analyzes redundancy between L1 and L2 token levels
  - *Example: Confirms L2 tokens are 99.2% redundant with L1 → enables build script optimization to reduce CSS variables*

### Analysis & Inspection Scripts
- **`analyze-emphasis-structure.js`** - Analyzes emphasis token structure and relationships
  - *Example: Shows how emphasis.high relates to emphasis.medium and identifies missing emphasis levels → ensures complete design coverage*
- **`analyze-token-structure.js`** - Inspects and displays token structure for debugging
  - *Example: Displays the full token tree when debugging why a button color isn't applying correctly → speeds up troubleshooting*
- **`detect-circular-token-references.js`** - Detects circular token references in the system
  - *Example: Finds spacing.large → spacing.xl → spacing.large infinite loop → prevents build crashes and undefined values*

### Maintenance Scripts
- **`cleanup-empty-files.sh`** - Automatically removes empty untracked files
  - *Example: Cleans up empty .scss files left behind after refactoring token structures → keeps repository clean and reduces confusion*
- **`cleanup-obsolete-files.js`** - Removes untracked obsolete/deprecated files
  - *Example: Removes old token files like "legacy-colors.json" that are no longer referenced → prevents accidental usage of outdated tokens*
- **`auto-cleanup-empty-files.sh`** - Automated empty file detection and cleanup with logging
  - *Example: Runs periodically to prevent empty file accumulation → saves developer time and maintains clean workspace*
- **`prevent-empty-files.py`** - Real-time empty file monitoring and prevention system
  - *Example: Monitors filesystem for empty file creation and auto-removes them → prevents the empty file problem entirely*
- **`analyze-script-redundancy.py`** - Analyzes script overlap and consolidation opportunities
  - *Example: Identifies validation scripts that could be unified → reduces maintenance overhead and code duplication*

### Documentation Generation
- **`generate-word-docs.py`** - Converts all markdown documentation to Word (.docx) format for offline reading
  - *Example: Generates printable Word documents from all .md files in documentation/ with professional footers (filename, generation date/time, page X of Y) → enables offline validation and team review*

## 🛡️ Empty File Prevention System

**Problem Solved**: Automatically prevents accumulation of empty files that waste development time.

### Multi-Layer Protection:
1. **Pre-commit Hook** - Blocks commits containing empty files
2. **GitHub Actions** - Prevents empty files in pull requests  
3. **LaunchAgent** - Auto-cleanup every 5 minutes (macOS)
4. **Manual Tools** - On-demand cleanup and monitoring

### Quick Setup:
```bash
# Install complete prevention system
./scripts-custom/setup-empty-file-prevention.sh

# Manual cleanup when needed
npm run clean:empty-files

# Start continuous monitoring during development
npm run monitor:empty-files
```

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
node scripts-custom/analyze-token-structure.js
node scripts-custom/detect-circular-token-references.js
```

### Direct Execution
```bash
# Make scripts executable
chmod +x scripts-custom/*.sh

# Run validation scripts
python3 scripts-custom/detect-plural-references.py
python3 scripts-custom/validate-token-syntax.py
python3 scripts-custom/validate-consumption-hierarchy.py
python3 scripts-custom/validate-l1-l2-redundancy.py
node scripts-custom/validate-token-chain-resolution.js

# Run analysis and inspection scripts
node scripts-custom/analyze-emphasis-structure.js
node scripts-custom/analyze-token-structure.js
node scripts-custom/detect-circular-token-references.js

# Run maintenance scripts
./scripts-custom/cleanup-empty-files.sh
node scripts-custom/cleanup-obsolete-files.js
python3 scripts-custom/generate-word-docs.py
```

## 📁 Script Organization Rules

### scripts-custom/ (This Folder)
✅ **Team-reusable design system scripts**
- Validation and analysis tools
- Maintenance and cleanup utilities  
- Token debugging and tracing
- Quality assurance scripts

### Private Scripts Directory
✅ **Private automation and internal workflow** (Mirrors this directory)
- Personal AI memory backups
- Context automation
- Historical refactoring scripts
- Browser automation and scraping
- Competitive analysis tools
- Internal process automation

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

2. **Place in private scripts directory** if the script is:
   - Personal AI workflow automation
   - Context or memory management
   - Specific to AI-driven development
   - Browser automation or scraping
   - Competitive analysis automation
   - Internal process automation

3. **Place in scripts/** if the script is:
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
