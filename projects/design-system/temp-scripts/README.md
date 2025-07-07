# Temporary Scripts and Utility Files

This folder contains temporary scripts and utility files that were created during the design system development and refactoring process. These files are not part of the main codebase and are excluded from version control.

## File Categories

### Token Processing Scripts
- `add-inversity-themes.js` - Adds inversity theme support to existing tokens
- `add_default_suffix.py` - Python script to add default suffix to token names
- `clean-inverse-tokens.js` - Cleans up inverse token references
- `generate-semantic-pairs.js` - Generates semantic token pairs
- `implement-universal-inversity.js` - Implements universal inversity support
- `update_references.py` - Updates token references across files
- `validate-semantic-inversity.js` - Validates semantic inversity implementation

### Component Creation Scripts
- `create-button-inversity.js` - Creates inversity support for button components
- `create-component-inversity.js` - General component inversity creation

### Shell Scripts
- `analyze-current-state.sh` - Analyzes current token state
- `cleanup-wrong-inversity.sh` - Cleans up incorrect inversity implementations
- `final-inversity-cleanup.sh` - Final cleanup of inversity tokens
- `implement-universal-inversity.sh` - Shell script for universal inversity implementation
- `setup-universal-inversity-backup.sh` - Creates backup before inversity changes

### Data Files
- `token-transformation-map.json` - Maps token transformations
- `reponsivness.md` - Misspelled/duplicate responsiveness documentation (Confluence format)

## Purpose

These files were created during the major refactoring of the design system's theming and semantic color token architecture. They helped automate the process of:

1. Refactoring semantic color tokens to follow strict naming patterns
2. Creating symmetric inverse token files
3. Cleaning up token references and removing inconsistencies
4. Validating the final implementation

## Note

These files are kept for reference but should not be included in the main codebase. They are automatically excluded from version control via `.gitignore`.
