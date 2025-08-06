# Design Tokens Glossary

This glossary defines key terminology used throughout the Oblique design token documentation and codebase.

## Token Hierarchy

### s0 (Static Tokens)
Base-level tokens that define the foundational values in the design system. These tokens are stored in `s0-static.json` files and represent the most primitive design decisions (colors, spacing, typography scales). Static tokens do not change across themes or contexts.

**File Location:** `src/lib/themes/semantic/color/s0-static.json`  
**Example:** `ob.s0.color.blue.500`

### s1 (Semantic Level 1 - Lightness)
First semantic layer that handles lightness variations across themes. S1 tokens reference s0 static tokens and provide the foundation for light/dark theme switching.

**File Structure:** `src/lib/themes/semantic/color/s1-lightness/`  
**Example:** `ob.s1.color.surface.primary`  
**Formerly:** l1 tokens (legacy naming)

### s2 (Semantic Level 2 - Inversity)
Second semantic layer that manages inversity relationships. S2 tokens define how colors behave when inverted or contrasted, ensuring proper accessibility and visual hierarchy.

**File Structure:** `src/lib/themes/semantic/color/s2-inversity/`  
**Example:** `ob.s2.color.text.primary`  
**Formerly:** l2 tokens (legacy naming)

### s3 (Semantic Level 3 - Emphasis)
Third semantic layer that controls emphasis and interaction states. S3 tokens define visual priority levels and interactive feedback (hover, focus, disabled states).

**File Structure:** `src/lib/themes/semantic/color/s3-emphasis/`  
**Example:** `ob.s3.color.button.primary`  
**Formerly:** l3 tokens (legacy naming)

## Tokens Studio Terminology

### Token Sets
Organizational units in Tokens Studio that correspond to folder structures in the design system. Each Token Set represents a specific theme variation or semantic layer.

**Examples:**
- `s1-lightness-light` (Token Set for light theme)
- `s2-inversity-normal` (Token Set for standard inversity)
- `s3-emphasis-high` (Token Set for high emphasis states)

### Variable Modes
Figma's native theming system that allows switching between different token values. Each Token Set can have multiple modes representing different theme states.

**Tokens Studio Equivalent:** In Tokens Studio, this functionality is achieved through Token Sets organization and folder structure. While Figma uses Variable Modes within collections, Tokens Studio uses separate Token Sets to represent different theme variations (e.g., `s1-lightness-light` vs `s1-lightness-dark` as separate Token Sets).

**Common Modes:**
- Light/Dark (lightness dimension)
- Normal/Inverse (inversity dimension)
- Low/Medium/High (emphasis dimension)

## Design System Architecture

### Global Tokens
Special tokens that bypass the standard s1/s2/s3 hierarchy rules. Global tokens are used for exceptional cases where the semantic hierarchy doesn't apply.

**Documentation:** `documentation/design-tokens/global-tokens.md`  
**Use Cases:** Brand colors, accessibility overrides, system-level constants

### Compound Units
Multi-word token names that represent complex design concepts. Compound units follow specific naming rules to maintain consistency.

**Rules:**
- Maximum two words
- Hyphenated format in documentation
- Camel case in token names
- Descriptive but concise

**Examples:** `border-radius`, `line-height`, `font-weight`

### Semantic Hierarchy
The structured approach to organizing design tokens from primitive to component-specific values. The hierarchy ensures consistency and maintainability.

**Levels:**
1. **Primitives (s0)** - Raw values
2. **Semantics (s1-s3)** - Contextual meanings
3. **Components** - Component-specific tokens
4. **Global** - System-level exceptions

### Design System Consumers
The primary users of the Oblique design system who implement design tokens and components in their projects.

**Types:**
- **Figma Users** - Designers using Oblique tokens and components in Figma for creating mockups, prototypes, and design specifications
- **Developers** - Frontend and backend developers implementing Oblique design tokens, components, and patterns in their applications

**Consumption Methods:** Token references, component libraries, style imports, design system documentation

### Component Consumption Rules
Guidelines that govern how components should consume tokens from the semantic hierarchy. These rules ensure proper abstraction and maintainability.

**Key Principle:** Components should primarily consume s2 and s3 tokens, avoiding direct reference to s0 or s1 when possible.

## Theming Dimensions

### Lightness (s1)
The primary theming dimension that controls light and dark appearances. Lightness affects background colors, surface treatments, and overall visual tone.

**Values:** Light, Dark  
**Token Pattern:** `s1-lightness-{variant}`

### Inversity (s2)
The secondary theming dimension that manages color relationships and contrast ratios. Inversity ensures proper text-background combinations and accessibility.

**Values:** Normal, Inverse  
**Token Pattern:** `s2-inversity-{variant}`

### Emphasis (s3)
The tertiary theming dimension that controls visual priority and interaction feedback. Emphasis manages how prominently elements appear and behave.

**Values:** Low, Medium, High  
**Token Pattern:** `s3-emphasis-{variant}`

### User Preference
System-level theme application based on user settings or operating system preferences. User preferences automatically apply themes without manual intervention, typically respecting OS-level dark/light mode settings.

**Examples:** OS dark mode triggers design system dark theme, accessibility preferences for high contrast, reduced motion settings

### Scoped Themes
Theme application that is limited to specific components or page sections rather than global system-wide theming. Scoped themes allow localized theme overrides while maintaining the broader theme context.

**Use Cases:** Dark header on light page, inverted sections for visual emphasis, component-specific theme variants

### Theme Switching
The process of manually changing between different theme variations at runtime. Theme switching involves updating active Token Sets and Variable Modes to reflect user-selected preferences.

**Implementation:** Figma Variable Mode selection, Tokens Studio Token Set activation, runtime CSS custom property updates

## Development Terms

### Style Dictionary Integration
The process of connecting design tokens with build tools and development workflows. Style Dictionary transforms tokens into platform-specific formats.

**Configuration:** `tracked-tokens-config.json`  
**Monitoring:** Custom scripts detect hardcoded token usage

### Token Resolution
How the system follows references through the s0→s1→s2→s3 hierarchy. The resolution process ensures that token references are properly traced from component level down to primitive values.

**Process:** Component tokens reference s3 tokens → s3 tokens reference s2 tokens → s2 tokens reference s1 tokens → s1 tokens reference s0 tokens → s0 tokens contain final values

### Reference Chain
The path a token follows from component to primitive. Reference chains show the complete dependency trail and ensure proper abstraction levels are maintained.

**Example Chain:** `button.primary` → `s3.interactive.primary` → `s2.brand.primary` → `s1.blue.600` → `s0.blue.600`

### Token Inheritance
How tokens inherit values from parent tokens in the hierarchy. Inheritance allows child tokens to automatically receive updates when parent values change, maintaining consistency across the system.

**Inheritance Flow:** s0 (parent) → s1 → s2 → s3 → Component tokens (children)

### Build-time Resolution
When token references are resolved during compilation. Build-time resolution transforms token references into final CSS values, ensuring runtime performance and eliminating dependency tracking overhead.

**Tools:** Style Dictionary, custom build scripts, `$themes.json` processing

### Token Chain Resolution
**Deprecated:** Use "Token Resolution" instead. The process by which token references are resolved through the semantic hierarchy.

### s1-s2 Redundancy
A validation concern where s1 and s2 tokens contain duplicate or nearly identical values. High redundancy (99.2% in this system) indicates potential optimization opportunities.

**Validation Script:** `validate-l1-l2-redundancy.py` (legacy), now `validate-s1-s2-redundancy.py`

### $themes.json
The compiled output file from Tokens Studio that contains all token definitions in a format consumable by the design system build process.

**Location:** Root of project  
**Purpose:** Bridge between Tokens Studio and build system

## Status and Interaction States

### Reserved Status Tokens
Specific semantic tokens designed for government web applications with enhanced clarity.

**Values:**
- `info` - Informational content
- `resolved` - Completed or successful states  
- `critical` - Error or dangerous states
- `attention` - Warning or caution states

### Interaction Emphasis
Visual priority levels for interactive elements that prevent color competition and maintain clear visual hierarchy.

**Strategy:** Use emphasis-low for interactive elements within status-colored containers (like Infoboxes) to prevent oversaturation and maintain focus on status communication.

## Legacy Terms

### l1/l2/l3 Tokens
**Deprecated:** Former naming convention for semantic token levels, replaced by s1/s2/s3 in July 2025.

**Migration:**
- l1 → s1 (lightness)
- l2 → s2 (inversity)  
- l3 → s3 (emphasis)

### static.json
**Deprecated:** Former filename for static tokens, renamed to `s0-static.json` for consistency with semantic level naming.

---

*Last Updated: August 4, 2025*  
*Version: 1.0 (Initial Release)*
