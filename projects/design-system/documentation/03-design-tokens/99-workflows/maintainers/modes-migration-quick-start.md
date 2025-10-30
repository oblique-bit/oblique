# Modes Migration Quick Start Guide

**Goal:** Migrate existing multiplier system to new proportional modes architecture

## Step 1: Audit Existing Multiplier Usage

- Find all tokens using `{ob.g.scale.mult_responsive}`
- Document current desktop/mobile output values

## Step 2: Create New Folder Structure

Create numbered folders for processing order:
```
src/lib/themes/
├── global/
│   └── 02-multipliers/
│       └── viewport/
│           ├── desktop.json    # { "multiplier": 1.0 }
│           └── mobile.json     # { "multiplier": 1.25 }
└── semantic/
    ├── 01-static/
    │   └── dimension/static.json      # Non-mode values
    └── 03-dynamic/
        └── dimension/static.json      # Mode-aware values
```

## Step 3: Migrate Base Values

**Formula:** New base value = Current base value × 4

Example:
- Current: `12px` base × 4 (desktop) = 48px output
- New: `48px` base × 1.0 (desktop) = 48px output ✅

## Step 4: Update Token References

Replace old references:
- `{ob.s.sizing.*}` → `{ob.s.static.dimension.*}` or `{ob.s.dynamic.dimension.*}`
- `{ob.g.scale.mult_responsive}` → `{ob.g.02-multipliers.viewport.*}`
- Remove `{ob.g.scale.mult_static}` (no longer needed)

## Step 5: Test & Validate

1. **Build tokens** - Ensure no broken references
2. **Compare outputs** - Desktop/mobile values should match original
3. **Test components** - Verify responsive behavior unchanged

## Quick Reference

**Old System:**
- Desktop: base × 4px
- Mobile: base × 5px

**New System:**
- Desktop: (base × 4) × 1.0
- Mobile: (base × 4) × 1.25

**Result:** Same output, cleaner system ✅
