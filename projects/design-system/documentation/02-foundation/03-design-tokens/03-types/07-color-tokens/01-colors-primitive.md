# Primitive Colors

**About this document:** This document defines the primitive color foundation within the Oblique Design System based on the actual token structure in `src/lib/themes/02_primitive/color.json`.

**Scope:** Base primitive color tokens that serve as the foundation for all semantic color layers.

---

## Primitive Color Architecture

Primitive colors are the foundational color values that remain constant across all themes and implementations. They serve as the base layer for semantic color compilation and maintain consistent color definitions throughout the design system.

**Brand Foundation:** Primitive colors primarily come from brand requirements (swiss.github.io) to ensure federal consistency. The Oblique team may expand or adapt the palette for specific usability and accessibility reasons within federal applications, balancing these requirements with brand consistency.

### Primitive Token Structure
```
ob.p.color.{colorName}.{shade}
```

**Examples:**
- `ob.p.color.red.500` (scale colors with numbered grades)
- `ob.p.color.basic.white` (basic colors with named values)

### File Organization
```
src/lib/themes/02_primitive/color.json
```

The primitive color system is organized within a single complete file containing all base color categories.

---

## Token Resolution Flow

Primitive colors serve as the foundation for all semantic color compilation, feeding into S1 (lightness), S2 (emphasis), S3 (semantic compilation), and ultimately Component layers.

### Implementation Example
```json
{
  "ob": {
    "p": {
      "color": {
        "basic": {
          "bundesrot": {
            "$type": "color",
            "$value": "#ff0000",
            "$description": "The color provided by Federal Chancellery."
          }
        }
      }
    }
  }
}
```

---

## Reserved Primitive Colors

⚠️ **Important**: Many primitive colors are **reserved for semantic purposes** and should not be used decoratively nor for other semantic purposes. Using reserved primitives for decoration or conflicting semantics breaks user expectations and accessibility standards.

**Reserved Primitive Examples (Light/Dark Mode Pairs):**
- **purple.400, purple.500**: Reserved for accessibility focus outlines (purple.500/400 in light mode, purple.400/500 in dark mode) - do not use decoratively nor for other semantic purposes
- **red.100-200, red.700-800**: Reserved for critical/error status (light mode uses red.100-200, dark mode uses red.700-800) - do not use for decoration or other semantics
- **green.100-200, green.600-700**: Reserved for success/resolved status (different shades per theme mode) - do not use for decoration or other semantics  
- **orange.100-200, orange.600-700**: Reserved for warning/attention status (different shades per theme mode) - do not use for decoration or other semantics
- **blue.100-200, blue.600-700**: Reserved for informational status (different shades per theme mode) - do not use for decoration or other semantics
- **steelblue.100-900**: Reserved for interaction colors (links, buttons, hover/focus states) - entire scale semantically consumed
- **cobalt.100-900**: Consumed for low-emphasis neutral and interaction colors - desaturated alternative that maintains semantic meaning while reducing visual prominence

**Color Usage Classification (4 Stages):**

**Stage 1: Reserved (Semantically Consumed)**
- **Status**: 🚫 **Never use decoratively**
- **Examples**: red.100-200/700-800 (critical - light/dark pairs), green.100-200/600-700 (success - light/dark pairs), purple.400/500 (focus - swapped between light/dark modes), orange.100-200/600-700 (warning - light/dark pairs), blue.100-200/600-700 (info - light/dark pairs), steelblue.100-900 (entire interaction scale), cobalt.100-900 (low-emphasis neutral/interaction - consumed but potentially more flexible)
- **Rule**: These exact values are consumed by semantic tokens and cannot be repurposed

**Stage 2: Aura Zone (±2 Shades from Reserved)**
- **Status**: ⚠️ **Avoid if possible, use with extreme caution**
- **Examples**: red.300/400/600/700 (around red.500), green.300/400/600/700 (around green.500)
- **Rule**: Creates visual confusion due to proximity to semantic colors

**Stage 3: Same Scale, Distant Shades**
- **Status**: ⚠️ **Proceed with caution, document usage**
- **Examples**: red.100/200/800/900, green.100/200/800/900
- **Rule**: Still within semantically consumed scale but visually distant enough to distinguish

**Stage 4: Non-Semantic Scales**
- **Status**: ✅ **Preferred for decorative use**
- **Examples**: teal.*, pink.* (entire scales available), cobalt.* (low saturation prevents semantic misinterpretation)
- **Rule**: No semantic consumption conflicts, safe for any decorative purpose
- **Note**: Low-saturation neutral scales would be ideal for decoration due to minimal semantic implications, but cobalt is reserved for low-emphasis semantic purposes (strategic use of desaturation to create emphasis hierarchies while maintaining functional meanings)

**For comprehensive guidance on decorative vs semantic color usage, see [Color System Overview](colors-overview.md#decorative-vs-semantic-color-usage).**

**Usage Recommendations (in order of preference):**

1. **🎯 Stage 4 (Best)**: Use entire non-semantic scales (teal, pink) or low-saturation scales (cobalt - insufficient color saturation to be misinterpreted semantically)
2. **⚠️ Stage 3 (Avoid)**: Use distant shades from semantic scales with documentation
3. **🚨 Stage 2 (Never)**: Aura zones create confusion - avoid unless critical need
4. **🚫 Stage 1 (Never)**: Reserved values break semantic contracts

**Semantic Aura Rule**: 
The ±2 shade rule defines Stage 2 boundaries based on **perceptual proximity** - colors that have low perceptual difference in luminance and chroma to semantically consumed colors. Proximity is determined by both numerical scale position and color theory principles (luminance, saturation, hue similarity). If red.100-200 are semantically consumed for critical status, then perceptually similar shades (red.300-400 in the scale direction) form the aura zone that should be avoided for decorative purposes, as users may perceive them as semantically related due to their low color difference (delta E).

## Color Categories

The primitive color system contains the following categories:

### Scale Colors (with 50-900 scale)

**Standard colors (from swiss.github.io for brand consistency):**
- **red**: Red color scale ⚠️ *red.100-200 (light mode) and red.700-800 (dark mode) reserved for critical/error status*
- **cobalt**: Blue-grey color scale ⚠️ *entire scale consumed for low-emphasis neutral/interaction colors (desaturated alternative to maintain semantics with reduced visual prominence)*  
- **orange**: Orange color scale ⚠️ *orange.500 reserved for attention/warning status*
- **yellow**: Yellow color scale
- **green**: Green color scale ⚠️ *green.500-600 reserved for resolved/success status*
- **teal**: Teal color scale
- **indigo**: Indigo color scale
- **purple**: Purple color scale ⚠️ *purple.400 and purple.500 reserved for accessibility focus outlines (swapped between light/dark modes)*
- **pink**: Pink color scale
- **blue**: Blue color scale ⚠️ *blue.500 reserved for informational status*

**Custom colors (created by Oblique Team):**
- **steelblue**: Steel blue color scale ⚠️ *entire scale reserved for interaction colors (links, buttons, states)*

### Basic Colors
- **basic.white**: Pure white (#ffffff)
- **basic.bundesrot**: Swiss federal red (#ff0000) - "The color provided by Federal Chancellery"
- **basic.transparent**: Fully transparent (rgba(0, 0, 0, 0)) - "Used for invisible backgrounds, clearing colors in interaction states, and smooth color transitions"

### Alpha Variations
- **cobalt_alpha**: Alpha variations of cobalt.900 (50-900 scale with 0.05-0.9 opacity)
- **white_alpha**: Alpha variations of basic.white (50-900 scale with 0.05-0.9 opacity)
- **indigo_alpha.900**: Alpha variation of indigo with 0.2 opacity - "For Spinner"

---

## Usage Guidelines

### Direct Usage
Primitive colors should not be used directly in components. They serve as the foundation for semantic color tokens.

### Semantic Compilation
All primitive colors flow through semantic compilation to ensure proper theme adaptation and consistency.

### Maintenance
Primitive color changes require careful consideration as they impact all semantic color derivatives throughout the system.
