# Protected Files Guide

This guide explains the mechanisms in place to protect files that should not be modified by individual team members without proper approval.

## Protected Files

The following files are protected and should not be modified directly:

- `package.json` - Managed by project leads
- `ng-package.json` - Angular packaging configuration
- `tsconfig.lib.json` - TypeScript configuration for the library
- `tsconfig.lib.prod.json` - Production TypeScript configuration
- `tsconfig.spec.json` - Test TypeScript configuration

## Protection Mechanisms

### 1. Pre-commit Hook

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
# Run the check script directly
./scripts-custom/validate-protected-files.sh
```

This will show warnings if any protected files have been modified.

## What to Do When You Need Changes to Protected Files

If you need to make changes to any of these protected files:

1. Create a detailed proposal of the changes needed
2. Share the proposal with the team for review
3. Have the designated maintainer make the approved changes
4. Do not attempt to bypass these protections for convenience

## Why Protection is Needed

Protected files impact the entire project and all team members:

- Dependency changes affect everyone's development environment
- Build configuration changes can break the CI/CD pipeline
- TypeScript configuration changes can affect type checking across the project

Centralizing these changes helps maintain stability and consistency across the project.
