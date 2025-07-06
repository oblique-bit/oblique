# Project Context & Chat History

## Design System Work - July 2025

### Global Tokens (ob.g.*)
- Fundamental theme settings and configuration tokens
- Control which themes are active by default in components/variants
- Manage global theme behavior and component variant selection in Figma
- Reference semantic or primitive tokens as needed

### 🎨 Core Concepts

| Term                                 | Definition                                                                                                                                                                                                                                  | Example                            | Code Example                                      |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------- |
| **Theme**                            | A named collection of design tokens defining a visual appearance such as light, dark, or inverse. In Figma, themes are implemented using *variable modes*. Defines the appearance of components based on the active global or scoped theme. | Light and dark appearance variants | `light`, `dark`, `light-inverse`, `dark-inverse`  |
| **Variable Mode** <br>*(Figma only)* | Figma feature that allows variables to hold multiple values per mode. Used to define and apply themes like `light-default` or `dark-inverse`.                                                                                               | Switching a component to dark      | `ob.s.color.text.default` in mode `light-default` |

### 🎨 Theme System Definitions

| Term                      | Definition                                                                                                                       | Example                        | Code Example                                                           |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ---------------------------------------------------------------------- |
| **Theme Types**           | Categories used to organize theme logic. Each type controls a specific dimension of styling.                                     | Lightness, Inversity, Emphasis | `light`, `dark`, `inverse`, `muted`                                    |
| **Lightness**             | Controls the overall light or dark appearance of the UI.                                                                         | Dark mode for night            | `light`, `dark`                                                        |
| **Inversity**             | Determines whether the component renders in normal or inverted contrast. Useful for nested components on high-contrast surfaces. | Component inside dark infobox  | `default`, `inverse`                                                   |
| **Interaction Emphasis**  | Controls the tone and strength of interactive elements like buttons and links.                                                   | Low-emphasis secondary button  | `default`, `muted`                                                     |
| **Legacy Inverse Tokens** | Deprecated tokens that used the `-inverse` suffix. Now replaced with theme-scoped tokens in structured folders.                    | Old token with suffix          | `ob.s.color.neutral.bg.contrast-highest-inverse` → `light-inverse/...` |

### Current Project Structure
- Working with Oblique Design System (`@oblique/design-system`)
- Angular-based framework for Swiss branded business web applications
- Location: `/projects/design-system/`

### Key Information
- **IMPORTANT**: This is a future redesigned version of the Oblique Design System
- **Current Public Version**: https://oblique.bit.admin.ch/ (different from this project)
- **Project Status**: Future redesign with different naming and structure
- **Warning**: This project may contain different naming conventions and architecture than the publicly available version
- Swiss Confederation project (FOITT)
- MIT Licensed
- Focus on corporate design and standardized components

### 🎨 Design System Inspiration & References

**Industry Leading Design Systems:**
- **Atlassian Design System**: https://atlassian.design/
  - Use for: Component architecture, naming conventions, documentation structure
  - Strong focus on accessibility and developer experience
- **Material Design 3**: https://m3.material.io/
  - Use for: Token architecture, theming systems, component patterns
  - Comprehensive design token implementation and theme structure
- **Adobe Spectrum**: https://spectrum.adobe.com/
  - Use for: Design language principles, component documentation, API design, responsive scaling patterns
  - Excellent documentation patterns and component organization
  - **Responsive Scaling**: Uses different scaling for mobile vs desktop with larger touch targets (44px minimum) on mobile devices

**Reference Usage:**
- **Naming Conventions**: Study naming patterns across these systems for consistency
- **Token Structure**: Compare token architectures and hierarchies
- **Documentation**: Learn from their documentation approaches and developer guides
- **Component Patterns**: Reference component APIs and prop structures
- **Theming**: Study theming implementations and variable usage
- **Accessibility**: Follow their accessibility documentation and patterns

### Design System Consistency Requirements
- **Swiss Design System**: Should maintain consistency with https://swiss.github.io/designsystem/?path=/docs/get-started--page where possible
- **Context Differences**: Oblique focuses on web applications while Swiss Design System focuses on websites
- **Deviation Authority**: Oblique can deviate from Swiss Design System when there are serious UX or accessibility issues
- **Example Deviation**: Red buttons are acceptable in Oblique web applications despite Swiss Design System avoiding them
- **Dual Standard Compliance**: Oblique design system needs to align with Swiss Design System guidelines when appropriate
- **Important**: Check Swiss Design System for component patterns, spacing, colors, and interaction guidelines
- **Priority**: Web application usability and accessibility take precedence over strict Swiss Design System compliance

### Design Token Format Compliance
- **W3C Design Tokens Format**: Must conform to https://tr.designtokens.org/format/
- **JSON Structure**: All design tokens must follow the W3C Community Group specification
- **File Format**: Use `.tokens` or `.tokens.json` file extensions
- **Token Properties**: Must include `$type`, `$value`, optional `$description`, `$extensions`, `$deprecated`
- **Validation**: Token names must not start with `$` or contain `{`, `}`, `.` characters

### 🏷️ Token Naming Conventions (Internal Developer Requirements)

**Core Naming Rules:**
1. **Shortened Names**: Token names should be shortened when possible for better usability
2. **Color Format**: Use `rgb(R G B / A)` format - no commas, use slashes for alpha channel
   - ✅ Correct: `rgb(255 0 0 / 0.5)`
   - ❌ Incorrect: `rgb(255, 0, 0, 0.5)` or `rgba(255, 0, 0, 0.5)`
3. **Color Space**: Use `srgb` color space for alpha modifications in design tokens
   - **Use Case**: Creating new or modifying existing color tokens (primarily primitives)
   - **Token Studio Workflow**: When setting color modifiers for opacity in Token Studio:
     - In the "Space" dropdown, choose **`srgb`** (not `lch`, `p3`, or `hsl`)
     - This will result in `rgb` format in CSS output
   - **File Result**: `"space": "srgb"` in the JSON token extensions
   - ✅ Correct: `"space": "srgb"`
   - ❌ Incorrect: `"space": "lch"`, `"space": "p3"`, `"space": "hsl"`
   - **Applied to**: All alpha variants in `colors.json` (cobalt-alpha, white-alpha, indigo-alpha)
4. **Dot-to-Dash Translation**: Dots (`.`) are automatically translated to dashes (`-`) in implementation
   - **Critical**: This means consecutive dashes lose semantic meaning
   - **Problem**: `emphasis-default` becomes ambiguous when translated from `emphasis.default`
   - **Example**: `ob.s.color.interaction.emphasis-default.fg-base.contrast-high-inverse`
   - **Becomes**: `ob-s-color-interaction-emphasis-default-fg-base-contrast-high-inverse`
   - **Issue**: Cannot distinguish between original dashes and translated dots

**Naming Impact:**
- Token structure must account for dot-to-dash translation
- Avoid using dashes in token names where dots will also be translated
- Consider alternative separators or naming patterns to maintain clarity
- Test token name translation to ensure implementation clarity
- **Token Type Placement**: Include token type in naming structure for clarity and organization

### 🎯 Token Types

**W3C DTCG Compliant Types** (Preferred):
- **color**: Color values (hex, rgb, hsl, etc.)
- **dimension**: Measurements with units (px, rem, em, etc.)
- **fontFamily**: Font family names
- **fontWeight**: Font weight values (100-900, normal, bold, etc.)
- **duration**: Time values (ms, s)
- **cubicBezier**: Cubic bezier timing functions
- **number**: Unitless numeric values
- **strokeStyle**: Stroke/border styles (solid, dashed, dotted, etc.)
- **border**: Border composite values
- **transition**: Transition composite values
- **shadow**: Shadow composite values
- **gradient**: Gradient composite values
- **typography**: Typography composite values

**Non-Compliant Types** (Tokens Studio):
- **asset**: Asset references (images, icons, etc.)
- **boolean**: Boolean values (true/false)
- **opacity**: Opacity values (0-1)
- **spacing**: Spacing values (often same as dimension)
- **sizing**: Sizing values (often same as dimension)
- **borderRadius**: Border radius values
- **borderWidth**: Border width values
- **boxShadow**: Box shadow composite values
- **text**: Text/string values
- **other**: Miscellaneous token types

**Token Type Strategy:**
- **Preferred**: Use W3C DTCG compliant types when possible
- **Reality**: Expect non-compliant types from Tokens Studio workflow
- **Migration**: Gradually transition to W3C compliant types where feasible
- **Documentation**: Document any non-compliant types used and reasoning

### 🎯 Token Architecture Rules
**Four-Level Token Structure:**

**Global Tokens (ob.g.*)**
- Fundamental theme settings and configuration tokens
- Control which themes are active by default in components/variants
- Manage global theme behavior and component variant selection in Figma
- Reference semantic or primitive tokens as needed
- **Naming Structure**: `ob.g.{tokentype}.{name}` (tokentype optional, not required)
- **Example**: `ob.g.color.theme-primary`, `ob.g.variant-default`

**Primitive Tokens (ob.p.*)**
- Foundation values with raw, hardcoded definitions
- Examples: `#0066FF`, `4px`, `1.25rem`
- Only level allowed to contain literal values
- **Naming Structure**: `ob.p.{tokentype}.{name}`
- **Example**: `ob.p.color.blue-500`, `ob.p.dimension.space-md`

**Semantic Tokens (ob.s.*)**
- Abstract roles that reference primitives to convey design intent
- Examples: `bg.default`, `text.contrast-high`
- Must reference primitive tokens only
- **Naming Structure**: `ob.s.{tokentype}.{name}`
- **Example**: `ob.s.color.bg-default`, `ob.s.dimension.spacing-base`

**Component Tokens (ob.c.{component}.* / ob.h.{component}.*)**
- Concrete styling that references semantic tokens
- Must reference semantic tokens (or other component tokens in rare cases)
- Never reference primitive tokens directly
- **ob.c.***: Angular components (new architecture)
- **ob.h.***: HTML components (legacy, migration in progress)
- **Naming Structure**: `ob.c.{componentname}.{tokentype}.{name}` / `ob.h.{componentname}.{tokentype}.{name}`
- **Example**: `ob.c.button.color.bg-primary`, `ob.h.card.dimension.padding-default`

**✅ Core Rules:**
- **Rule 1**: No Skipping Levels - Component tokens cannot reference primitives directly
- **Rule 2**: No Hardcoded Values - Only primitive tokens may contain raw values
- **Rule 3**: W3C Compliance - All tokens must follow W3C format specification
- **Rule 4**: Migration Consistency - Both ob.c.* and ob.h.* must follow same architecture rules
- **Rule 5**: Global Control - ob.g.* tokens manage theme activation and component defaults
- **Rule 6**: Naming Convention - Follow internal team requirements for shortened names and color format
- **Rule 7**: Dot Translation - Account for dot-to-dash translation in token naming strategy
- **Rule 8**: Token Types - Prefer W3C DTCG compliant types, expect non-compliant types from Tokens Studio
- **Rule 9**: Token Type Placement - Include token type in naming structure: ob.p.{tokentype}, ob.s.{tokentype}, ob.c.{componentname}.{tokentype}, ob.h.{componentname}.{tokentype}, ob.g.{tokentype} (optional)

### 🏗️ Token Architecture & W3C Compliance

**Token Structure**: `{design-system-id}.{component-type}.{component-name|token-type}.{token-type|property}...`

**Component Tokens**: `ob.{c|h}.{component-name}.{token-type}.{property}.{variant}.{state}`
**Other Tokens**: `ob.{g|p|s}.{token-type}.{property}.{category}...`

#### **Segment 1 - Design System ID:**
- **`ob`**: Oblique Design System identifier
- **Purpose**: Distinguishes Oblique tokens from other design systems
- **Context**: Essential for multi-design-system environments or projects, e.g. where both Oblique and swiss.github.io coexist
- **Swiss DS**: Uses different naming conventions (federal website focus)
- **Oblique DS**: Web application focus with `ob.*` prefix

#### **Segment 2 - Component Type:**
- **`g`**: Globals (global design tokens)
- **`p`**: Primitives (primitive design tokens)
- **`s`**: Semantics (semantic design tokens)
- **`c`**: Components custom Oblique (like Infobox, custom Oblique components)
- **`h`**: Components HTML native (like button, native HTML elements)

#### **Segment 3:**
- **For Component Tokens (ob.c.* / ob.h.*)**: Component Name
  - **Examples**: `button`, `infobox`, `card`, `badge`
- **For Other Tokens (ob.g.* / ob.p.* / ob.s.*)**: Token Type
  - **Examples**: `color`, `spacing`, `typography`, `dimension`

#### **Segment 4:**
- **For Component Tokens (ob.c.* / ob.h.*)**: Token Type (W3C DTCG Compliant)
  - **`color`**: Color properties
    - **`fg`**: Foreground (text, icon colors)
    - **`bg`**: Background colors
    - **`border`**: Border colors
  - **`spacing`**: Spacing properties (padding, margin, gap)
  - **`typography`**: Typography properties (font, size, weight)
  - **`dimension`**: Size properties (width, height, radius)
  - **`shadow`**: Shadow properties
- **For Other Tokens (ob.g.* / ob.p.* / ob.s.*)**: Property/Category
  - **Examples**: `bg-default`, `text-primary`, `theme-lightness`

#### **Complete Token Structure Example (HTML Button):**
```json
// From: html/button/inversity/default.json
"ob.h.button.color.fg.primary.enabled": {
  "$type": "color",
  "$value": "{ob.s.color.interaction.state.fg-inverse.enabled}"
}

// Token Breakdown:
// ob = Design System ID (Oblique)
// h = Component Type (HTML native)
// button = Component Name
// color = Token Type
// fg = Property (foreground)
// primary = Variant
// enabled = State
```

#### **Token Structure Comparison:**
```json
// Component Tokens (ob.c.* / ob.h.*):
"ob.h.button.color.fg.primary.enabled"
//│  │  │      │     │  │       │
//│  │  │      │     │  │       └─ State
//│  │  │      │     │  └─ Variant
//│  │  │      │     └─ Property
//│  │  │      └─ Token Type
//│  │  └─ Component Name
//│  └─ Component Type
//└─ Design System ID

// Other Tokens (ob.g.* / ob.p.* / ob.s.*):
"ob.s.color.interaction.state.fg-inverse.enabled"
//│  │  │     │           │     │         │
//│  │  │     │           │     │         └─ State
//│  │  │     │           │     └─ Property
//│  │  │     │           └─ Category
//│  │  │     └─ Property Group
//│  │  └─ Token Type
//│  └─ Component Type
//└─ Design System ID
```

#### **Button Implementation Example:**
```json
// Complete HTML Button Token Structure:
"ob.h.button.color.fg.primary.enabled"         // Primary button text (inverse)
"ob.h.button.color.bg.primary.enabled"         // Primary button background (solid)
"ob.h.button.color.border.primary.enabled"     // Primary button border (no-color)

"ob.h.button.color.fg.secondary.enabled"       // Secondary button text
"ob.h.button.color.bg.secondary.enabled"       // Secondary button background (transparent)
"ob.h.button.color.border.secondary.enabled"   // Secondary button border (visible)

"ob.h.button.color.fg.tertiary.enabled"        // Tertiary button text
"ob.h.button.color.bg.tertiary.enabled"        // Tertiary button background (transparent)
"ob.h.button.color.border.tertiary.enabled"    // Tertiary button border (no-color)

"ob.h.button.color.fg.close.enabled"           // Close button text
"ob.h.button.color.bg.close.enabled"           // Close button background (always transparent)
"ob.h.button.color.border.close.enabled"       // Close button border (no-color)

// States: enabled, hover, focus, pressed, disabled
```

#### **Token Hierarchy & Reference Rules:**
```
Primitives (ob.p.*) → Semantics (ob.s.*) → Components (ob.c.*/ob.h.*)
                                       ↗
                            Globals (ob.g.*) 
```

**Reference Rules:**
- ✅ **No Level Skipping**: Component tokens must reference semantic tokens, not primitives
- ✅ **No Hardcoded Values**: Semantic/component tokens must reference other tokens
- ✅ **Proper Hierarchy**: Follow four-level token hierarchy strictly

#### **Multi-Design System Coexistence:**
- **Oblique (`ob.*`)**: Web application components and patterns
- **Swiss DS**: Federal website components and patterns (swiss.github.io)
- **Clear Separation**: Both systems can be used in same project or environment with distinct token namespacing
- **Federal Compliance**: Oblique follows Swiss DS guidelines but optimized for web applications

### 🎯 Scoped Themes Consolidation (July 2025)

**Project Status**: ✅ **COMPLETED** - Scoped themes successfully consolidated and streamlined

**Overview:**
The scattered and inconsistently named scoped theme tokens have been consolidated into a centralized, streamlined structure containing only actual theme overrides. Default values are now implicit, significantly improving maintainability and reducing file size.

#### **Before (Scattered + Verbose):**
- Mixed token locations: component files, global directories, various naming patterns
- Inconsistent naming: `default-theme`, `ob.c.*`, mixed approaches
- Verbose declarations: 99% "default" values explicitly declared
- Scoped theme tokens scattered across: `infobox/static.json`, `popover.json`, `interaction-emphasis.json`, `inversity/` files

#### **After (Streamlined Structure):**
```
src/lib/themes/global/scoped-themes/
├── lightness/
│   ├── dark.json      # Only actual inversity overrides
│   └── light.json     # Only actual inversity overrides
└── static.json        # Only interaction-emphasis overrides (+ global tokens)
```

**Key Architectural Improvement:**
- **Overrides Only**: Files contain only actual theme overrides, not default values
- **Implicit Defaults**: Default theme behavior is implicit and handled by the system
- **95% File Size Reduction**: Eliminated verbose default declarations

#### **Key Improvements:**

1. **🏗️ Centralized Organization**
   - All scoped theme tokens moved to `global/scoped-themes/`
   - Single source of truth for component theme overrides

2. **📝 Streamlined Architecture**
   - **Overrides Only**: Only actual theme overrides are declared
   - **Implicit Defaults**: Default theme behavior is implicit
   - **95% Reduction**: Eliminated verbose default declarations

3. **🎨 Clean Override Structure**
   - **inversity overrides** → `lightness/` files (only `infobox.fatal`)
   - **interaction-emphasis overrides** → `static.json` (footer, infobox, popover)
   - **No Default Noise**: All "default" values removed

4. **🧹 Legacy Cleanup**
   - Removed scattered `themes` sections from component files
   - Eliminated verbose default declarations
   - Streamlined to exception-based architecture
   - Removed scattered `themes` sections from component files
   - Deleted obsolete token files and directories
   - Eliminated inconsistent naming patterns

#### **Components Affected:**
- **Inversity Overrides**: Only `infobox.fatal` (uses inverse theme)
- **Interaction-Emphasis Overrides**: Footer, Infobox, Popover (use muted theme)
- **All Other Components**: Use implicit defaults (no declarations needed)

#### **Token Examples:**

**Inversity Override:**
```json
// src/lib/themes/global/scoped-themes/lightness/light.json
"ob.g.infobox.fatal.theme.inversity": {
  "$type": "other",
  "$value": "inverse",
  "$description": "Fatal infobox uses inverse inversity theme override"
}
```

**Interaction-Emphasis Override:**
```json
// src/lib/themes/global/scoped-themes/static.json
"ob.g.infobox.theme.interaction-emphasis": {
  "$type": "other",
  "$value": "{ob.g.color.theme.interaction-emphasis.muted}",
  "$description": "We on purpose lower the interaction emphasis of all buttons inside Infobox"
}
```

#### **Technical Implementation:**
- **Commit**: `refactor(design-system): streamline scoped themes to overrides-only architecture`
- **Files Modified**: 3 files (streamlined content)
- **Directory**: `components-themes` → `scoped-themes` (terminology standardization)
- **Architecture**: Verbose declarations → Overrides-only approach
- **File Size**: 95% reduction through elimination of default declarations
- **Ticket Number**: OUI-3865
- **Date**: July 5, 2025

#### **Benefits Achieved:**
- ✅ **Dramatically Improved Maintainability**: Only exceptions are declared
- ✅ **Cleaner Architecture**: Overrides-only approach eliminates noise
- ✅ **95% File Size Reduction**: Removed verbose default declarations
- ✅ **Better Mental Model**: Only meaningful overrides are visible
- ✅ **Faster Development**: No need to declare obvious defaults
- ✅ **Standardized Terminology**: "Scoped Themes" used consistently

#### **Migration Notes:**
- **Architecture Change**: Moved from explicit defaults to implicit defaults
- **Only Overrides**: System now only declares actual theme overrides
- **No Breaking Changes**: Token values and functionality preserved
- **Implicit Behavior**: Components without overrides use system defaults
- **Override Examples**: Only `infobox.fatal` (inversity) and footer/infobox/popover (interaction-emphasis)
- **Future Scaling**: New overrides can be added without declaring defaults

### 🎯 Token Creation & Maintenance Rules

**Theme Symmetry Requirements:**
- **Mandatory Duplication**: When creating a new token in a theme (e.g. `light`), you MUST duplicate that token in all counterpart themes within the same theme group
- **Theme Group Examples**: 
  - **Lightness Group**: `light` ↔ `dark` (must maintain symmetry)
  - **Inversity Group**: `default` ↔ `inverse` (must maintain symmetry)
  - **Interaction Emphasis Group**: `default` ↔ `muted` (must maintain symmetry)
- **Consistency Rule**: All themes within a group must have the same token structure to ensure proper theme switching
- **Example**: If you create `ob.s.color.bg-accent` in `light` theme, you must also create `ob.s.color.bg-accent` in `dark` theme

**Token Description Requirements:**
- **Global Tokens (ob.g.*)**: Must include description with designer intent and usage context
- **Semantic Tokens (ob.s.*)**: Must include description with design purpose and element context
- **Component Tokens (ob.c.* / ob.h.*)**: Must include description with component element and usage
- **Primitive Tokens (ob.p.*)**: Description optional, but recommended for complex values

**Description Content Guidelines:**
- **Element Context**: Specify which UI element the token applies to (if not clear from name)
- **Designer Intent**: Explain the design purpose and when to use this token
- **Usage Notes**: Include any special instructions for developers or designers
- **Ignore Flags**: Clearly note if developers or designers should ignore the token (rare cases)
- **Migration Notes**: Document any legacy token relationships or migration paths

**Example Token Descriptions:**
```json
{
  "ob.s.color.bg-accent": {
    "$type": "color",
    "$value": "{ob.p.color.blue-500}",
    "$description": "Accent background color for highlighting important UI elements. Used for call-to-action buttons and featured content areas."
  },
  "ob.c.button.color.bg-primary": {
    "$type": "color", 
    "$value": "{ob.s.color.bg-accent}",
    "$description": "Primary button background color. Main action button in forms and dialogs. Designers: use for single primary action per screen."
  }
}
```

**Token Maintenance Workflow:**
1. **Create in Primary Theme**: Start with the main theme (usually `light` or `default`)
2. **Duplicate Across Theme Group**: Create equivalent tokens in all counterpart themes
3. **Add Descriptions**: Write clear, actionable descriptions for all non-primitive tokens
4. **Test Theme Switching**: Verify tokens work correctly when switching between themes
5. **Document Relationships**: Note any dependencies or relationships between tokens
6. **Update Migration Guide**: Document any impact on existing components or workflows

### Accessibility Requirements
- **WCAG 2.1 AA Compliance**: Must meet Web Content Accessibility Guidelines 2.1 at conformance level AA
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators**: Visible focus indicators for all interactive elements
- **Keyboard Navigation**: Full keyboard accessibility for all components
- **Screen Reader Support**: Proper ARIA labels and semantic markup
- **Testing**: Regular accessibility testing and validation required

### Design System Components
- Master layout structure
- Ready-to-use Angular components
- Fully customizable themes
- Located in: `projects/design-system/src/lib/`

### Legacy Components & Migration
- **HTML Components**: Existing components stored in `html/` folder
- **Legacy Prefix**: HTML components use `ob.h.*` token prefix
- **Migration Status**: Migration from HTML to Angular components not yet finished
- **Dual Component System**: Currently maintaining both HTML (`ob.h.*`) and Angular (`ob.c.*`) components
- **Migration Planning**: Gradual transition from HTML to Angular implementation

### Recent Discussions
- Date: July 4-5, 2025
- Topics: Design system architecture, component structure, scoped theme tokens consolidation
- Context7 MCP server integration for documentation access
- Swiss Design System consistency requirements identified
- W3C Design Tokens Format compliance requirement added
- WCAG 2.1 AA accessibility compliance requirement added
- Four-level token architecture rules established (primitive → semantic → global → component)
- Figma and Tokens Studio workflow integration documented
- Legacy HTML components and migration status clarified
- Token editing workflow rules established (component and global tokens in Tokens Studio only)
- Global tokens (ob.g.*) for theme control and component variant management identified
- Theme system definitions added (Lightness, Inversity, Interaction Emphasis)
- **Project Clarification**: This is a future redesigned version, not the current public oblique.bit.admin.ch
- **Token Naming**: Internal developer team requirements documented (shortened names, rgb format, dot-to-dash translation)
- **Commit Guidelines**: Must follow oblique/CONTRIBUTING.md, use OUI-3865 ticket, factual commit messages only
- **Token Types**: W3C DTCG compliant types preferred, non-compliant types from Tokens Studio expected
- **Token Type Placement**: Include token type in naming structure for organization and clarity
- **Responsiveness**: Two-breakpoint system (0-767px mobile, 768px+ desktop), 320px minimum viewport
- **Responsive Scaling**: Mobile elements 1.25x larger than desktop (inspired by Adobe Spectrum's differential scaling approach)
- **Design System References**: Study Atlassian, Material Design 3, and Adobe Spectrum for inspiration
- **Scoped Theme Tokens Consolidation**: Successfully completed consolidation and standardization (July 5, 2025)

### Technical Requirements
- **Token Format**: W3C Design Tokens Community Group specification
- **File Structure**: JSON with specific property naming conventions
- **Validation**: Strict type checking and format validation required
- **Extensions**: Support for vendor-specific extensions using reverse domain notation
- **Naming Conventions**: Shortened names, rgb(R G B / A) color format, dot-to-dash translation awareness
- **Responsiveness**: Two-breakpoint system (0-767px mobile, 768px+ desktop), components must work from 320px width
- **Accessibility**: WCAG 2.1 AA compliance mandatory for all components
- **Color Tokens**: Must include contrast ratio validation and testing
- **Token Architecture**: Four-level structure (primitive → semantic → global → component)
- **Token Types**: W3C DTCG compliant types preferred, non-compliant types from Tokens Studio expected
- **Token Type Placement**: Include token type in naming structure for better organization and clarity
- **Reference Rules**: Strict hierarchy enforcement, no level skipping allowed
- **Theme Control**: Global tokens manage theme activation and component variant defaults
- **Theme Types**: Support for Lightness, Inversity, and Interaction Emphasis dimensions
- **Legacy Migration**: Transition from `-inverse` suffix tokens to theme-scoped structure

### Design-to-Development Workflow
- **Figma Integration**: Extensive use of Figma for design work
- **Tokens Studio**: Primary tool for design token management
- **Export Pipeline**: Variables and variable modes exported from Tokens Studio to Figma
- **Sync Process**: Design tokens synchronized between Tokens Studio → Figma → Development
- **Variable Modes**: Support for theme variations (light/dark, different contexts)
- **Token Management**: Centralized token governance through Tokens Studio

### Token Editing Rules & Workflow
- **Component Tokens (ob.c.* / ob.h.*)**: Token names MUST be edited in Tokens Studio only
  - Required to preserve connection to Figma nodes
  - Critical for maintaining design-development sync
  - Changes in VS Code will break Figma integration
- **Global Tokens (ob.g.*)**: MUST be edited in Tokens Studio only
  - Control theme activation and component variant selection in Figma
  - Critical for maintaining Figma theme synchronization
  - Changes in VS Code will break theme configuration
- **Primitive Tokens (ob.p.*)**: Can be edited in Visual Studio Code
  - Less critical for Figma node connections
  - Direct file editing acceptable
- **Semantic Tokens (ob.s.*)**: Can be edited in Visual Studio Code
  - Less critical for Figma node connections
  - Direct file editing acceptable
- **Migration Tokens**: Both ob.c.* and ob.h.* component tokens follow same editing rules

### MCP Server Configuration
- Context7 MCP server: `@upstash/context7-mcp`
- Figma Dev Mode MCP server available
- Used for accessing design system documentation

### Design Tools Integration
- **Figma**: Primary design tool for component design and prototyping
- **Tokens Studio**: Design token management and organization
- **Figma Variables**: Design tokens exported as Figma variables and variable modes
- **Dev Mode**: Figma Dev Mode MCP server for design-to-code workflows
- **Token Sync**: Automated synchronization between design tokens and Figma variables

#### **Tokens Studio Token Set Display Order**
- **Observation**: Token set display order in Tokens Studio can be inconsistent
- **Issue Pattern**: New JSON files may appear at the bottom instead of logical hierarchy position
- **Example**: New semantic color files (`light-default.json`, `light-inverse.json`, etc.) initially appeared at bottom instead of under the `colors` hierarchy
- **Solution**: Manual reordering in Tokens Studio interface corrects the display order
- **Unknown Factor**: Exact cause of ordering inconsistency unclear - may be related to file creation time, JSON structure, or naming patterns
- **Recommendation**: After adding new token files, check and manually adjust token set order in Tokens Studio to maintain logical hierarchy
- **Impact**: Display order affects usability and navigation but does not impact token functionality or export
- **User Experience**: Manual reordering in Tokens Studio successfully resolved the display order issue, confirming this is a reliable workaround

### Swiss Design System Integration
- Reference URL: https://swiss.github.io/designsystem/?path=/docs/get-started--page
- Use for: Component patterns, design tokens, accessibility guidelines
- Check before: Creating new components, modifying existing ones
- Ensure: Visual consistency with Swiss federal government standards

## Chat History References

### Useful Commands
```bash
# Build design system
npm run build

# Test design system
npm run test

# Lint and format
npm run lint
npm run format
```

### Contribution Guidelines
- **Contributing Guide**: Always reference `oblique/CONTRIBUTING.md` before commits
- **Default Ticket**: Use `OUI-3865` when no specific ticket number provided
- **Commit Style**: Factual, developer-focused messages only
- **Avoid**: Academic, marketing, or impact-focused language in commits

### Important File Locations
- Main design system: `projects/design-system/`
- Themes: `projects/design-system/src/lib/themes/`
- **Scoped Theme Tokens**: `projects/design-system/src/lib/themes/global/components-themes/` (consolidated July 2025)
- Public API: `projects/design-system/src/public-api.ts`
- **HTML Components**: `html/` folder (legacy components with ob.h.* tokens)
- **Angular Components**: `projects/design-system/src/lib/` (new components with ob.c.* tokens)

### Design System References
- **Current Public Version**: https://oblique.bit.admin.ch/ (different from this project)
- **Future Redesign**: This project represents a future version with different naming/structure
- **Swiss Design System**: https://swiss.github.io/designsystem/?path=/docs/get-started--page
- **Design System Inspiration**: Atlassian Design (https://atlassian.design/), Material Design 3 (https://m3.material.io/), Adobe Spectrum (https://spectrum.adobe.com/)
- **W3C Design Tokens Format**: https://tr.designtokens.org/format/
- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Tokens Studio**: https://tokens.studio/ (design token management)
- **Priority**: Always check Swiss Design System for federal compliance, but prioritize web application UX/accessibility when conflicts arise
- **Design System References**: Study Atlassian, Material Design 3, and Adobe Spectrum for naming, structure, and documentation inspiration
- **Token Standard**: Ensure all design tokens conform to W3C specification
- **Accessibility**: All components must meet WCAG 2.1 AA requirements
- **Design Workflow**: Maintain sync between Tokens Studio → Figma → Development

## Notes for Future Sessions
- Always reference this file for context
- Update with new findings and discussions
- Keep track of design decisions and rationale
- **IMPORTANT**: This is a future redesigned version, not the current public oblique.bit.admin.ch
- **NAMING**: Expect different naming conventions and structure from the public version
- **ARCHITECTURE**: This project may use different architectural patterns than the current public version
- **CRITICAL**: Check Swiss Design System consistency before making component changes, but prioritize web application UX/accessibility
- **MANDATORY**: Ensure all design tokens conform to W3C Design Tokens Format specification
- **ACCESSIBILITY**: All components must meet WCAG 2.1 AA accessibility requirements
- **RESPONSIVENESS**: Follow two-breakpoint system (0-767px mobile, 768px+ desktop), ensure 320px minimum viewport support
- **RESPONSIVE SCALING**: Mobile elements 1.25x larger than desktop following Adobe Spectrum's differential scaling principles
- **TOKEN HIERARCHY**: Follow four-level token hierarchy (primitive → semantic → global → component)
- **NAMING CONVENTIONS**: Follow internal team requirements - shortened names, rgb(R G B / A) format, dot-to-dash translation awareness
- **WORKFLOW**: Maintain sync between Tokens Studio, Figma variables, and development
- **EDITING RULES**: 
  - Component tokens (ob.c.* / ob.h.*) MUST be edited in Tokens Studio only
  - Global tokens (ob.g.*) MUST be edited in Tokens Studio only
  - Primitive/semantic tokens (ob.p.* / ob.s.*) can be edited in VS Code
- **COMMITS**: Follow oblique/CONTRIBUTING.md, use OUI-3865 ticket, write factual commit messages
- **MIGRATION**: Consider both HTML (ob.h.*) and Angular (ob.c.*) components during changes
- **SCOPED THEME TOKENS**: ✅ Completed consolidation (July 2025) - all component theme tokens now in `global/components-themes/`
- Document any deviations from Swiss Design System with clear justification (prioritize web application UX/accessibility)
- Use Context7 MCP server to compare with other government design systems
- Use Figma Dev Mode MCP server for design-to-code workflows
- Validate token format compliance using appropriate tools
- Test color contrast ratios for all color combinations
- Ensure keyboard navigation works for all interactive elements
- Enforce token reference rules - no level skipping, no hardcoded values in semantic/component tokens
- Verify token synchronization between Tokens Studio and Figma variables
- Preserve Figma node connections when editing component tokens

---
*Last updated: July 5, 2025*

### 📱 Responsiveness Guidelines

**Viewport Breakpoints:**
- **Mobile**: 0-767px (all mobile devices and small screens)
- **Desktop**: 768px and larger (tablets, laptops, desktops)

**Design Principles:**
- **Simple Concept**: Two-breakpoint system for easier maintenance and consistency
- **Minimum Viewport**: Components must function and provide readable content from 320px width
- **Interaction Design**: All components must work properly across both mobile and desktop interactions
- **Content Readability**: Text and content must remain readable at minimum viewport width
- **Differential Scaling**: 1.25x scaling multiplier for mobile vs desktop, inspired by Adobe Spectrum's responsive scaling approach

**Future Considerations:**
- **Data Collection**: Monitor actual user viewport distributions
- **Gradual Enhancement**: Additional breakpoints may be added as needed based on real usage patterns

**Implementation Requirements:**
- Test all components at 320px minimum width
- Ensure touch-friendly interactions on mobile (0-767px)
- Optimize for mouse/keyboard interactions on desktop (768px+)
- Maintain content hierarchy and readability across all sizes
- Use responsive design tokens for spacing, typography, and layout

### 🎯 Semantic Status Tokens Documentation

**Complete Status System Overview:**

| Status | Meaning | Components | Replaces | References | Change |
|--------|---------|------------|----------|------------|---------|
| **info** | Informational | Infobox, Badge | — | GOV.UK, USWDS | Unchanged |
| **resolved** | Completed/closed | Badge, Pill | Replaces "success" | GitHub, Jira | Renamed (from success) |
| **critical** | Urgent/alert/system failure | Badge, Infobox | Replaces "error" | Material, Atlassian | Renamed (from error) |
| **attention** | Needs review/caution | Infobox, Badge | Replaces "warning" | USWDS, Atlassian | Renamed (from warning) |
| **pending** | Awaiting action | Pill, Badge | — | Jira, GitHub | Added |
| **confirmed** | Verified/approved | Pill, Badge | — | GitHub, Atlassian | Added |
| **progress** | In progress, loading | Pill, Badge | — | Jira, GitHub | Added |
| **scheduled** | Scheduled/future | Pill | — | Jira, GitHub | Added |
| **waiting** | Waiting/queued | Pill | — | Jira, GitHub | Added |
| **fatal** | Flooding, landslides, earthquakes | Infobox | — | https://swiss.github.io/ | Added |
| **closed** | Closed/archived | Pill | — | GitHub | Added |
| **disabled** | Disabled/inactive | Pill | — | Material | Added |

**Key Changes & Evolution:**
- **Renamed Statuses** (Breaking Changes): `success` → `resolved`, `error` → `critical`, `warning` → `attention`
- **New Statuses Added**: `pending`, `confirmed`, `progress`, `scheduled`, `waiting`, `fatal`, `closed`, `disabled`
- **Component Usage**: Infobox (critical messages), Badge (general statuses), Pill (action-oriented statuses)
- **Swiss Design System Compliance**: `fatal` specifically for emergency situations (floods, landslides, earthquakes)
- **Industry References**: Aligned with GOV.UK, USWDS, GitHub, Jira, Material Design, Atlassian Design patterns

**Token Structure:** Each status includes `bg` and `fg` tokens with contrast levels:
- `ob.s.color.status.{status}.bg.contrast-{high|medium|low}[-inverse]`
- `ob.s.color.status.{status}.fg.contrast-{high|medium|low}[-inverse]`

**Color Mapping:**
- `info` → Blue, `resolved` → Green, `critical` → Red (lighter), `attention` → Orange
- `pending` → Yellow, `confirmed` → Teal, `progress` → Indigo, `scheduled` → Pink
- `waiting` → Purple, `fatal` → Red (darker), `closed` → Cobalt, `disabled` → Cobalt

### 🔬 Design System Component Research Framework

**Systematic approach for analyzing and improving design system components through internal evaluation and external benchmarking.**

#### **Phase 1: INTERNAL Research and Evaluation in Our Ecosystem**

| Step | To Do | Questions | URLs |
|------|-------|-----------|------|
| **Current Oblique Code Version Analysis** | Evaluate the current code version by focusing on UX, AX, and visual design, comparing these aspects to industry best practices rather than just assessing the code. Identify technical constraints that may influence future requirements. | How does this element/component in the active code version of Oblique work and look like? | https://oblique.bit.admin.ch/introductions/welcome |
| **Current Oblique Figma Component Analysis** | Analyze the existing Figma component design, comparing it to best practices identified in the benchmarking process. Identify reusable elements and gaps to inform future design decisions. | How does this element/component in the Oblique's Active Figma Library work and look like? Any abandoned Ideas from the Deprecated Figma Libraries or the old Sketch-Files? | https://www.figma.com/files/1347514915276213784/project/174809906 |
| **User and Stakeholder Feedback Analysis** | Collect feedback from stakeholders and identify practical issues and requirements in federal apps to ensure user needs are met. Document historical component issues and extract insights for potential improvements. | Any wishes from PO, UX Lead, DS Maintainer? Analytics? | Fridolin's Confluence link? Feature Requests Jira Board? |

#### **Phase 2: EXTERNAL Benchmarking and Strategic Planning**

| Step | To Do | Questions | URLs |
|------|-------|-----------|------|
| **Bundeskanzlei Design System Evaluation** | Assess what functionality a component provides in the BK design system and determine what to retain or exclude based on benchmarking outcomes. Define compatibility and consistency requirements. | How Federal Chancellery / Bundeskanzlei (BK) did solve it in Web Guidelines: swiss.github.io and Figma 2025? What we must follow for consistency? What does not work in terms of web app context, ux, ax? | https://swiss.github.io/designsystem/?path=/docs/get-started--page<br><br>https://www.figma.com/design/A8coc8DPhiL0YX4nCc0eEL/%F0%9F%87%A8%F0%9F%87%ADDesign-System-Core-Library-20250220?m=auto&t=u5KxrHry612WFhq6-6 |
| **Component Identification and Typology Analysis** | Research how a component is used, named, and classified. Update the name to align with current standards and classify the component by atomic design principles, referencing leading design systems. Define taxonomy-related requirements where applicable. Use the Template. | What is it? Component? Directive? Style? Airplane? Don't skip this. Identify the type and name with the id template | https://confluence.bit.admin.ch/display/OBLIQUE/Component+identification |
| **UX Benchmarking and Requirements** | Identify UX best practices by analyzing how leading design systems define and implement similar components. Establish UX principles and key requirements for usability, consistency, and interaction patterns. | Function, Concept, Interaction in the leading design systems? Google, Adobe, IBM... Patterns and recommendations from Norman Group, Interaction Foundation etc.? | List DS Figma and Guidelines URLs |
| **AX Benchmarking and Requirements** | Define strict accessibility requirements by comparing leading design systems and AX WCAG standards to ensure compliance. This includes contrast ratios, keyboard navigation, and assistive technology support. | What this component must deliver in terms of AX? Be specific! | |
| **Visual Benchmarking and Recommendations** | Compare visual aesthetics by analyzing design patterns, styles, and trends from leading design systems. Extract ideas and opportunities rather than strict requirements, providing inspiration for future iterations. | Visual design, typography, colors, spacings in the leading design systems? | |
| **Figma Benchmarking and Setup** | Establish reference points for structure, variables, anatomy, naming, and configuration by studying best-in-class Figma components from leading design systems. Define setup guidelines to ensure flexibility and scalability. | Figma component structure and right panel configuration? Anatomy / layers structure, naming, variants, tokens, modes, overwrite properties in the leading design systems? | |

#### **Research Workflow Integration**

**Phase Alignment with Token Architecture:**
- **Internal Research** → Informs semantic and component token requirements
- **External Benchmarking** → Validates primitive and global token decisions
- **BK Compliance** → Ensures Swiss Design System consistency
- **Component Classification** → Supports ob.c.* vs ob.h.* migration decisions

**Documentation Requirements:**
- **Research Findings** → Update CONTEXT_NOTES.md with component-specific insights
- **Design Decisions** → Document deviations from Swiss Design System with clear justification
- **Accessibility** → Validate WCAG 2.1 AA compliance for all components
- **Token Impact** → Consider both HTML (ob.h.*) and Angular (ob.c.*) components during changes