# Tokens Studio Context Notes
**Version:** 1.0  
**Date:** September 2, 2025  
**Status:** Work in Progress - Not Yet Approved by Product Owner  
**Purpose:** Document Tokens Studio workflow and token management processes

## **Target Audience**
**Primary:** DS/Oblique Developers  
**Secondary:** DS/Oblique Designers  
**Prerequisites:** Basic understanding of design tokens and Token Studio  
**Related Personas:** [Design System Personas](../../02-foundation/02-personas.md#12-dsobl)

## Design System Token Management

**Tool Used:** Tokens Studio (not TypeScript)
- All design tokens are managed through Tokens Studio
- Token resolution and validation happens within Tokens Studio environment
- The `$themes.json` file contains the compiled token definitions from Tokens Studio

## Token Resolution

### Valid Tokens (Confirmed in Tokens Studio)
These tokens exist in `$themes.json` and resolve properly in Tokens Studio:
- `{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index}` (VALID)
- `{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index-color}` (VALID)

### Reference Checking
- The JavaScript validation scripts provide complete token reference checking
- Use `node scripts-custom/validate-all-components.js` to verify component token references
- Token validation should always be verified against the current token structure, not outdated references

## Important Notes
- Tokens Studio manages the complete token architecture
- `$themes.json` is the source of truth for available tokens
- Reference resolution is handled by Tokens Studio's token engine
- Any "broken reference" reports should be cross-checked with Tokens Studio availability

## Current Architecture
- **S1 Semantic Level:** Lightness variables (light/dark theme handling)
- **S2 Semantic Level:** Emphasis variables (high/low emphasis variations)  
- **S3 Semantic Level:** Semantic compilation (complete semantic color collection)
- **Static Tokens:** Brand colors and utilities (managed in Tokens Studio)

---
*Last Updated: 2025-07-11*
*Context: Oblique Design System Token Refactoring*
