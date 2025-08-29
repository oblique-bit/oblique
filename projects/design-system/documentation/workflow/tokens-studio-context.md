# Tokens Studio Context Notes

## Design System Token Management

**Tool Used:** Tokens Studio (not TypeScript)
- All design tokens are managed through Tokens Studio
- Token resolution and validation happens within Tokens Studio environment
- The `$themes.json` file contains the compiled token definitions from Tokens Studio

## Token Resolution

### Valid Tokens (Confirmed in Tokens Studio)
These tokens exist in `$themes.json` and resolve properly in Tokens Studio:
- `{ob.s1.color.interaction.border.focus}` ✅
- `{ob.s.color.brand}` -  
- `{ob.s.color.neutral.no-color}` ✅

### Reference Checking
- The JavaScript validation scripts provide comprehensive token reference checking
- Use `node scripts-custom/validate-all-components.js` to verify component token references
- Token validation should always be verified against the current token structure, not outdated references

## Important Notes
- Tokens Studio manages the complete token architecture
- `$themes.json` is the source of truth for available tokens
- Reference resolution is handled by Tokens Studio's token engine
- Any "broken reference" reports should be cross-checked with Tokens Studio availability

## Current Architecture
- **L1 Layer:** Inversity tokens (normal/flipped)
- **L2 Layer:** Emphasis tokens (high/low) with inversity suffixes  
- **L3 Layer:** Component tokens referencing L2 with `.inversity-normal` by default
- **Static Tokens:** Brand colors and utilities (managed in Tokens Studio)

---
*Last Updated: 2025-07-11*
*Context: Oblique Design System Token Refactoring*
