# Design Tokens Glossary

This glossary defines key terminology used throughout the Oblique design token documentation and codebase.

## Token Hierarchy

### p (Primitive Level)
Base-level tokens that define the foundational values in the design system. These tokens are stored in primitive files and represent the most primitive design decisions (colors, spacing, typography scales). Primitive tokens do not change across themes or contexts.

**File Location:** `src/lib/themes/primitive/color.json`  
**Example:** `ob.p.color.blue.500`

### s1 (Semantic Level 1 - Lightness)
First semantic level that handles lightness variations across themes. S1 tokens reference primitive tokens and provide the foundation for light/dark theme switching.

**File Structure:** `src/lib/themes/semantic/color/s1-lightness/`  
**Example:** `ob.s1.color.neutral.bg.contrast_highest.inversity_normal`  
**Formerly:** l1 tokens (legacy naming)

### s2 (Semantic Level 2 - Emphasis)
Second semantic level that manages emphasis variations. S2 tokens define high and low emphasis levels for interaction states, referencing S1 tokens directly.

**File Structure:** `src/lib/themes/semantic/color/s2-emphasis/`  
**Example:** `ob.s2.color.interaction.state.fg.enabled.inversity_normal`  
**Formerly:** l2 tokens (legacy naming)

### s3 (Semantic Level 3 - Semantic Compilation)
Third semantic level that provides a clean, comprehensive compilation of all semantic colors. S3 serves as the primary reference point for component tokens, containing the complete semantic color collection with direct references to S1.

**File Structure:** `src/lib/themes/semantic/color/s3-semantic/`  
**Example:** `ob.s3.color.interaction.state.fg.enabled.inversity_normal`  
**Formerly:** l3 tokens (legacy naming)

## Tokens Studio Terminology

### Token Sets
Organizational units in Tokens Studio that correspond to folder structures in the design system. Each Token Set represents a specific theme variation or semantic layer.

**Examples:**
- `s1-lightness-light` (Token Set for light theme)
- `s1-lightness-dark` (Token Set for dark theme)
- `s2-emphasis_high` (Token Set for high emphasis states)
- `s2-emphasis_low` (Token Set for low emphasis states)
- `s3-semantic` (Token Set for complete semantic compilation)

### Variable Modes
Figma's native theming system that allows switching between different token values. Each Token Set can have multiple modes representing different theme states.

**Tokens Studio Equivalent:** In Tokens Studio, this functionality is achieved through Token Sets organization and folder structure. While Figma uses Variable Modes within collections, Tokens Studio uses separate Token Sets to represent different theme variations (e.g., `s1-lightness-light` vs `s1-lightness-dark` as separate Token Sets).

**Common Modes:**
- Light/Dark (lightness dimension)
- Desktop/Mobile (responsiveness dimension)
- High/Low (emphasis dimension)

### Mode Types

The design system distinguishes between different types of modes based on who controls the mode selection:

#### User Preference Modes (User Modes)
Modes that are controlled by user settings or system preferences, automatically applied based on external factors:

- **Lightness Mode** (`light`/`dark`) - Controlled by OS dark mode preference or user toggle
- **Responsiveness Mode** (`desktop`/`mobile`) - Controlled by viewport size and device type

**Characteristics:**
- Automatically switch based on user environment
- Users typically control through OS settings or app preferences
- Examples: `prefers-color-scheme: dark`, viewport media queries

#### Design System Controlled Modes (System Modes)
Modes that are set by designers and developers during design and implementation, not by end users:

- **Emphasis Mode** (`high`/`low`) - Set by designers based on context and hierarchy needs
- **Component Variants** - Chosen during design process for specific use cases

**Characteristics:**
- Set at design time, not runtime
- Controlled by design system implementers
- Examples: Using high-emphasis buttons for primary actions, low-emphasis for secondary actions

## Design System Architecture

### Layers vs Levels
**Important Distinction:** In the Oblique Design System, "layers" are reserved for Figma layer terminology to avoid confusion with the design system's token architecture.

- **Levels** (`s1`, `s2`, `s3`, `c`, `g`, `p`) - Token architecture hierarchy levels
  - **Semantic Levels** (`s1`, `s2`, `s3`) - Lightness, emphasis, compilation
  - **Component Level** (`c`) - Component-specific tokens
  - **Global Level** (`g`) - System-wide settings
  - **Primitive Level** (`p`) - Base values
- **Layers** - Reserved for Figma layer structure and visual hierarchy

### Inversity Variants
Theme variants that handle the inversity dimension in tokens, controlling normal and flipped visual treatments.

**Values:** `inversity_normal`, `inversity_flipped`  
**Usage:** Essential for components that need to adapt to different background contexts (e.g., footer inversions)

### Design System Namespace
The `ob` prefix that identifies all tokens as belonging to the Oblique Design System, distinguishing them from other token systems or external dependencies.

**Format:** `ob.{level}.{category}.{...}`  
**Example:** `ob.s3.color.neutral.fg.contrast_high.inversity_normal`

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
1. **Primitives (p)** - Raw values
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

**Key Principle:** Components should primarily consume s2 and s3 tokens, avoiding direct reference to primitive or s1 when possible.

## Theming Dimensions

### Lightness (s1)
The primary theming dimension that controls light and dark appearances. Lightness affects background colors, surface treatments, and overall visual tone.

**Values:** Light, Dark  
**Token Pattern:** `s1-lightness-{variant}`

### Emphasis (s2)
The secondary theming dimension that manages emphasis variations for interaction states. Emphasis provides high and low visual priority semantic levels for different contexts.

**Values:** High, Low  
**Token Pattern:** `s2-emphasis-{variant}`

### Semantic Compilation (s3)
The tertiary theming dimension that provides complete semantic color compilation for component consumption. This semantic level contains all semantic colors resolved for direct component usage.

**Values:** Semantic compilation  
**Token Pattern:** `s3-semantic`

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
How the system follows references through the p→s1→s2→s3 hierarchy. The resolution process ensures that token references are properly traced from component semantic level down to primitive values.

### Symmetry
**Critical Rule:** When expanding or reducing tokens in the theming system, all changes must preserve symmetry across theming counterparts. If a token structure is added/removed in one theme file, the exact same structure must be added/removed in ALL corresponding theme files.

**Example:** Adding `contrast_highest` to `s1-lightness/light.json` requires adding the same structure to `s1-lightness/dark.json`, `s2-emphasis/high.json`, and `s2-emphasis/low.json`.

### Theming Counterparts
The set of theme files that must maintain structural symmetry with each other. Changes to one counterpart file requires identical changes to all other counterpart files to maintain system consistency.

**Counterpart Pairs:**
- `s1-lightness/light.json` ↔ `s1-lightness/dark.json`
- `s2-emphasis/high.json` ↔ `s2-emphasis/low.json`

**Rule:** Token architecture must remain identical across all counterparts, only primitive value references may differ.

**Process:** Component tokens reference s3 tokens -> s3 tokens reference s1 tokens -> s1 tokens reference primitive tokens -> primitive tokens contain final values. Note: S2 also references s1 directly.

### Reference Chain
The path a token follows from component to primitive. In the current system, both S3 and S2 reference S1 directly, simplifying the dependency chain.

**Current Reference Pattern:** 
- Components → `ob.s3.color.*` → `ob.s1.color.*` → `ob.p.color.*`
- S2 Emphasis → `ob.s2.color.*` → `ob.s1.color.*` → `ob.p.color.*`

**Example Chain:** `interaction.state.fg.enabled` → `ob.s3.color.interaction.state.fg.enabled.inversity_normal` → `ob.s1.color.interaction.fg_base.contrast_low.inversity_normal` → `ob.p.color.steelblue.600`

### Token Inheritance
How tokens inherit values from parent tokens. The current architecture uses direct references to S1 layer, bypassing intermediate layers for simpler maintenance.

**Current Flow:** p (primitives) → s1 (lightness) → s2 (emphasis) & s3 (semantic compilation) → Component tokens

### Build-time Resolution
When token references are resolved during compilation. Build-time resolution transforms token references into final CSS values, ensuring runtime performance and eliminating dependency tracking overhead.

**Tools:** Style Dictionary, custom build scripts, `$themes.json` processing

### Token Chain Resolution
**Deprecated:** Use "Token Resolution" instead. The process by which token references are resolved through the semantic hierarchy.

### s1-s2 Redundancy
A validation concern where s1 and s2 tokens contain duplicate or nearly identical values. High redundancy (99.2% in this system) indicates potential optimization opportunities.

**Validation Script:** Use `node scripts-custom/validate-semantic-mirroring.js` to analyze S1↔S2 structural relationships.

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

**Strategy:** Use emphasis_low for interactive elements within status-colored containers (like Infoboxes) to prevent oversaturation and maintain focus on status communication.

## Legacy Terms

### l1/l2/l3 Tokens
**Deprecated:** Former naming convention for semantic token levels, replaced by s1/s2/s3 in July 2025.

**Migration:**
- l1 -> s1 (lightness)
- l2 -> s2 (emphasis)  
- l3 -> s3 (emphasis)

### static.json
Files containing static token definitions that don't vary across themes or contexts. Found in various theme levels (global, semantic, component) for tokens that remain constant.

---

*Last Updated: August 4, 2025*  
*Version: 1.0 (Initial Release)*
