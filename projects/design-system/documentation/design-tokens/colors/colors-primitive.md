# Primitive Colors

**About this document:** This document defines the primitive color foundation within the Oblique Design System based on the actual token structure in `src/lib/themes/primitive/color.json`.

**Scope:** Base primitive color tokens that serve as the foundation for all semantic color layers.

---

## Primitive Color Architecture

Primitive colors are the foundational color values that remain constant across all themes and implementations. They serve as the base layer for semantic color compilation and maintain consistent color definitions throughout the design system.

**Brand Foundation:** Primitive colors primarily come from brand requirements (swiss.github.io) to ensure federal consistency. The Oblique team may expand or adapt the palette for specific usability and accessibility reasons within federal applications, balancing these requirements with brand consistency.

### Primitive Token Structure
```
ob.p.color.category.scale
```

**Examples:**
- `ob.p.color.red.500` (spectrum colors with numbered scales)
- `ob.p.color.basic.white` (basic colors with named values)

### File Organization
```
src/lib/themes/primitive/color.json
```

The primitive color system is organized within a single comprehensive file containing all base color categories.

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

## Color Categories

The primitive color system contains the following categories:

### Spectrum Colors (with 50-900 scale)

**Standard colors (from swiss.github.io for brand consistency):**
- **red**: Red color scale
- **cobalt**: Blue-grey color scale
- **orange**: Orange color scale
- **yellow**: Yellow color scale
- **green**: Green color scale
- **teal**: Teal color scale
- **indigo**: Indigo color scale
- **purple**: Purple color scale
- **pink**: Pink color scale
- **blue**: Blue color scale

**Custom colors (created by Oblique Team):**
- **steelblue**: Steel blue color scale

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
