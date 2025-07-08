# Known Bugs and Issues

## Figma Theme Resolution Issue

**Issue**: Figma always uses the mobile scaling value for responsive scaling, regardless of the active theme.

**Description**: 
The responsive scaling token (`ob.g.scale.mult-responsive`) is correctly configured in the theme structure:
- Desktop theme: `1` (no scaling)
- Mobile theme: `1.25` (25% scaling increase)

However, Figma's theme resolution mechanism consistently applies the mobile scaling value (`1.25`) even when the desktop theme is active. This results in incorrect scaling being applied to responsive tokens when working in Figma.

**Impact**: 
- Designers see incorrect scaling values in Figma when working with the desktop theme
- May lead to inconsistencies between design and implementation
- Affects all tokens that reference `ob.g.scale.mult-responsive`

**Workaround**: 
None currently available. Designers should be aware of this limitation when working with responsive scaling tokens in Figma.

**Expected Behavior**:
- Desktop theme should use scaling value of `1`
- Mobile theme should use scaling value of `1.25`
- Figma should respect the active theme's scaling configuration

**Files Affected**:
- `/src/lib/themes/global/themes-user/viewport/desktop.json`
- `/src/lib/themes/global/themes-user/viewport/mobile.json`
- Any components using responsive scaling tokens

**Status**: Open - requires investigation into Figma's theme resolution mechanism or Token Studio plugin behavior.
