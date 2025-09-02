# Protected Files Guide
**Version:** 1.0  
**Date:** September 2, 2025  
**Status:** Work in Progress - Not Yet Approved by Product Owner  
**Purpose:** Explain protection mechanisms for critical design system files

This guide explains the mechanisms in place to protect files that should not be modified by individual team members without proper approval.

## Protected Files

The following files are protected and should not be modified directly:

- `package.json` - Managed by project leads
- `ng-package.json` - Angular packaging configuration
- `tsconfig.lib.json` - TypeScript configuration for the library
- `tsconfig.lib.prod.json` - Production TypeScript configuration
- `tsconfig.spec.json` - Test TypeScript configuration

## Protection Mechanisms

### 1. Documentation Structure Rule

The `documentation/` folder must contain **only subdirectories, no files**. Additionally, all markdown files must have **lowercase extensions** (.MD → .md).

**Automated enforcement:**
```bash
# Check documentation structure compliance and normalize case
node scripts-custom/validate-documentation-structure.js

# This script automatically:
# 1. Normalizes .MD files to .md across the entire project  
# 2. Removes files from documentation/ root
# Files should be organized in proper subdirectories:
# - documentation/design-tokens/ - Technical token documentation
# - documentation/workflow/ - Process and workflow guidance  
# - documentation/reports/ - Development reports
```

**Rules:** 
- All `.md` files must be in appropriate subfolders, never in `documentation/` root
- All markdown files must have lowercase `.md` extensions (not `.MD`)

### 2. Pre-commit Hook

A Git pre-commit hook is provided to prevent accidental commits of protected files. To install it:

```bash
# Copy the pre-commit hook to your Git hooks directory
cp pre-commit ../.git/hooks/
chmod +x ../.git/hooks/pre-commit
```

This will prevent commits that modify any of the protected files.

### 2. GitAttributes

The `.gitattributes` file marks protected files with a `lockdown` attribute. While this is mainly for documentation purposes, it can be used by Git GUIs that respect this attribute.

### 3. Manual Check Script

You can manually check for modifications to protected files:

```bash
# Run documentation structure validation
node scripts-custom/validate-documentation-structure.js

# Check git status for protected file modifications
git status --porcelain
```

These scripts will show warnings if any protected files have been modified or if documentation structure violates the organization rules.

## What to Do When You Need Changes to Protected Files

If you need to make changes to any of these protected files:

1. Create a detailed proposal of the changes needed
2. Share the proposal with the team for review
3. Have the designated maintainer make the approved changes
4. Do not attempt to bypass these protections for convenience

## Why Protection is Needed

Protected files and structure rules impact the entire project and all team members:

- **Configuration files** affect everyone's development environment
- **Build configuration changes** can break the CI/CD pipeline  
- **TypeScript configuration changes** can affect type checking across the project
- **Documentation structure** ensures consistency and prevents organizational drift

**Documentation Structure Benefits:**
- Prevents root-level clutter that makes navigation difficult
- Ensures consistent organization across team members
- Makes it easier to find relevant documentation
- Maintains clean workspace structure

Centralizing these changes helps maintain stability and consistency across the project.
