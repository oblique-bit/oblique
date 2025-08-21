# Stable Versions Documentation

**Purpose:** Track stable, working versions of the design system for safe fallback and reference.

## Current Stable Versions

### `ts-main` - Latest Stable
- **Branch:** `ts-main`
- **Status:** Active Development
- **Last Verified:** July 11, 2025
- **Key Features:**
  - **Button theming working correctly** (Confirmed)
  - **Mobile responsive scaling working** (`mult-responsive: 5`) (Confirmed)
  - Updated token architecture with `ob.g.*` naming
  - Clean documentation structure
- **Mobile Scaling:** 1.25x multiplier (5 vs 4) for touch accessibility - **VERIFIED WORKING**
- **Button Components:** All button theming and spacing tokens functioning properly
- **Figma Sync:** Compatible with current Tokens Studio export

### `ts-develop-02.03` - Working Backup
- **Branch:** `ts-develop-02.03`
- **Status:** 🔒 Stable Backup
- **Created:** July 11, 2025 (from commit `6c8c64610`)
- **Purpose:** Preserves working state before ts-main creation
- **Key Features:**
  - Complete documentation changes from July 11th work session
  - All new files and scripts from development
  - Working responsive tokens (older structure)

### `ts-develop-02.02` - Previous Development
- **Branch:** `ts-develop-02.02`
- **Status:** 📦 Archive
- **Purpose:** Original development branch
- **Note:** Contains older token structure

## Version History

| Date | Branch | Commit | Description | Status |
|------|--------|--------|-------------|---------|
| 2025-07-11 | `ts-main` | `07717f440` | Mobile scaling fix to 5 + Button theming working | Current |
| 2025-07-11 | `ts-develop-02.03` | `6c8c64610` | Working backup version | 🔒 Stable |
| 2025-07-11 | `ts-develop-02.02` | `6c8c64610` | Documentation changes before switch | 📦 Archive |

## Usage Guidelines

### When to Use Each Version

**Use `ts-main` for:**
- Active development
- Latest token architecture
- Mobile responsive testing
- Figma Tokens Studio exports

**Use `ts-develop-02.03` for:**
- Safe fallback if ts-main breaks
- Reference to previous working state
- Comparison of changes

**Use `ts-develop-02.02` for:**
- Historical reference only

### Branch Safety Rules

1. **Never force-push to stable versions** without backing up first
2. **Test mobile scaling** in Figma before considering a version stable
3. **Document any breaking changes** when updating stable versions
4. **Create backup branches** before major architectural changes

## Verification Checklist

Before marking a version as stable, verify:

- [ ] **Button theming works correctly** (all variants and states)
- [ ] **Mobile responsive scaling works correctly** (1.25x multiplier)
- [ ] Figma variable sync functions properly
- [ ] Token architecture follows current naming conventions
- [ ] Documentation is up-to-date
- [ ] No circular token references
- [ ] All semantic tokens resolve correctly

## Recovery Procedures

### If ts-main breaks:
1. Switch to `ts-develop-02.03`: `git checkout ts-develop-02.03`
2. Create new branch from stable version: `git checkout -b ts-main-recovery`
3. Apply necessary fixes
4. Test thoroughly before replacing ts-main

### If Figma export fails:
1. Use backup Figma file
2. Check token structure against stable version
3. Re-export from known working branch

---

**Last Updated:** July 11, 2025  
**Maintained by:** Design System Team  
**Related:** [Token Consumption Guidelines](../design-tokens/guidelines-token-consumption.md), [Responsiveness](../design-tokens/responsiveness.md)
