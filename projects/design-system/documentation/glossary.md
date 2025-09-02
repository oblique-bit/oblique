# Oblique Design System Glossary
**Version:** 2.0  
**Date:** September 2, 2025  
**Status:** Work in Progress - Not Yet Approved by Product Owner  
**Purpose:** Complete terminology reference for Oblique Design System

---

This glossary defines key terminology used throughout the Oblique Design System documentation, including design tokens, workflows, personas, and system architecture.

## System Architecture & Principles

### Code Assets (Implementation)
Production-ready components, utilities, and design tokens intended for implementation in federal applications. Code assets target frontend developers, full-stack developers, and technical teams to create functional user interfaces that citizens interact with.

**Contains:** Working components, utility functions, design token systems  
**Primary Users:** Technical teams implementing federal applications  
**Output:** Production user interfaces for end users  

### Design Files (Figma - Design Process)
Figma-based component libraries, design tokens (variables), templates, and guidelines used for designing federal applications. Design files target UX/UI designers, product designers, and design teams to create design specifications and prototypes.

**Contains:** Figma component libraries, design variables, templates, guidelines  
**Primary Users:** Design teams creating federal application interfaces  
**Output:** Design specifications and prototypes for development implementation  

### 100% Token Consistency Commitment
The fundamental principle ensuring identical design tokens between code and Figma environments. This commitment maintains same token names, values, structure, and synchronized updates across both platforms.

**Benefits:** Workflow efficiency, visual consistency, identical user experience, simplified maintenance, shared vocabulary between teams  
**Implementation:** Synchronized token systems, identical naming conventions, coordinated update processes  

### Code-Figma Alignment
The core philosophy of the Oblique Design System establishing Code Priority for implementation accuracy while maintaining design-code synchronization. Code leads technical capabilities while design informs visual specifications.

**Approach:** Code defines interaction behavior, Figma represents design intent, design tokens bridge both platforms  
**Process:** Implementation-driven component creation with design fidelity validation  

### Design System Maintainers
Internal Oblique Design System team members responsible for creating, maintaining, and evolving the core system. Maintainers include designers and developers who manage component libraries, design tokens, and system architecture.

**Types:** DS/Oblique Designers (Figma specialists), DS/Oblique Developers (code implementation specialists)  
**Responsibilities:** System development, token architecture, component maintenance, quality assurance  
**Workflows:** Located in `documentation/07-workflow/maintainers/`  

### Design System Consumers
External teams and individuals who use the Oblique Design System to build federal applications. Consumers include product designers, developers, business analysts, and project teams who implement design system components and patterns.

**Types:** Product/Project Designers, Product/Project Developers, Business Requirements stakeholders  
**Responsibilities:** System implementation, component usage, feedback provision, compliance maintenance  
**Workflows:** Located in `documentation/07-workflow/consumers/`  

### Federal Applications
Government web applications and digital services built using the Oblique Design System. Federal applications serve citizens and government employees with official government services, processes, and information.

**Characteristics:** WCAG 2.1 AA compliance, Swiss federal branding, security requirements, multi-language support  
**End Users:** Federal employees (power users, occasional users), Citizens (varying frequency and complexity)  

## Design System Personas

The Oblique Design System defines specific personas representing different user types and their relationships with the system. These personas guide design decisions and workflow organization.

**Key Persona Categories:**
- **DS/Oblique Maintainers:** Designers and developers who create and maintain the core system
- **Product/Project Teams:** External teams who consume the design system (designers, developers, business stakeholders)  
- **End Users:** Citizens and federal employees who use applications built with the design system

**Detailed Documentation:** See `documentation/02-foundation/02-personas.md` for complete persona definitions, characteristics, pain points, and success metrics.  

## Token Hierarchy

The Oblique Design System uses a structured token hierarchy from primitive values to component-specific implementations:

**Levels:**
- **p (Primitive)** - Base values (colors, spacing, typography scales)
- **s1 (Semantic L1)** - Lightness variations (light/dark themes)
- **s2 (Semantic L2)** - Emphasis variations (high/low emphasis)  
- **s3 (Semantic L3)** - Complete semantic compilation for component consumption
- **c (Component)** - Component-specific tokens
- **g (Global)** - System-wide exceptions

**Detailed Documentation:** See `documentation/03-design-tokens/architecture.md` for complete token hierarchy explanation, file structure, and usage guidelines.

## Tokens Studio Terminology

Design token management terminology specific to Tokens Studio integration and Figma Variable Modes.

**Key Concepts:**
- **Token Sets** - Organizational units corresponding to theme variations
- **Variable Modes** - Figma's native theming system  
- **Mode Types** - User preference vs. system-controlled modes

**Detailed Documentation:** See `documentation/07-workflow/maintainers/design-tokens/01-tokens-studio-context.md` for complete Tokens Studio workflow and terminology.

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
**Example:** `ob.s3.color.brand`

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

The design system uses three main theming dimensions to organize token variations:

**Primary Dimensions:**
- **Lightness (s1)** - Light and dark theme variations
- **Emphasis (s2)** - High and low emphasis levels for interaction states  
- **Semantic Compilation (s3)** - Complete semantic color compilation for component consumption

**Additional Theming Concepts:**
- **User Preference** - OS-controlled themes (dark mode, accessibility)
- **Scoped Themes** - Component-specific theme overrides
- **Theme Switching** - Runtime theme changes via Token Sets and Variable Modes

**Detailed Documentation:** See `documentation/03-design-tokens/theming.md` for complete theming implementation and usage guidelines.

## Design System Architecture

Core organizational concepts and structural principles of the Oblique Design System.

**Key Concepts:**
- **Layers vs Levels** - Token hierarchy terminology (levels) vs. Figma layer structure
- **Inversity Variants** - Normal and flipped visual treatments for different contexts
- **Design System Namespace** - The `ob` prefix identifying Oblique tokens
- **Global Tokens** - Special tokens bypassing standard hierarchy rules
- **Compound Units** - Multi-word token naming conventions
- **Workflow Organization** - Maintainer vs. consumer documentation separation

**Detailed Documentation:** See `documentation/03-design-tokens/architecture.md` for complete system structure and principles.

## Development Terms

Technical terminology related to token implementation, validation, and build processes.

**Key Concepts:**
- **Style Dictionary Integration** - Token-to-platform transformation
- **Token Resolution** - Reference chain from component to primitive tokens
- **Symmetry** - Maintaining structural consistency across theme counterparts
- **Build-time Resolution** - Token compilation and CSS generation
- **$themes.json** - Compiled token output from Tokens Studio

**Detailed Documentation:** See `documentation/03-design-tokens/` for implementation details and `scripts-custom/README.md` for development tooling.

**Implementation Guidelines:**
- Code leads complex interactions and accessibility
- Design informs visual specifications and brand expression  
- Design tokens bridge platform differences
- Documentation covers gaps where platforms differ

### Figma Limitations
Acknowledged constraints of Figma platform compared to code implementation capabilities. Understanding these limitations guides design-code alignment strategies.

**Current Limitations:** Missing CSS properties (container-queries, advanced grid), interaction constraints, responsive limitations, accessibility gaps, performance aspects  
**Response Strategy:** Mimic code logic where possible, document differences, provide implementation guidance

### Platform-Specific Roles
Defined responsibilities and ownership areas for Code Platform and Figma Platform within the design system.

**Code Platform (Primary Reference):** User experience behavior, accessibility implementation, performance optimization, technical constraints  
**Figma Platform (Design Reference):** Visual design intent, brand expression, design system documentation, design coherence

## Accessibility & Compliance

### WCAG 2.1 AA Compliance
Web Content Accessibility Guidelines Level AA conformance required for all federal applications using the Oblique Design System. Ensures accessibility for users with diverse abilities.

**Requirements:** Color contrast ratios, keyboard navigation, screen reader support, focus management  
**Implementation:** Component-level accessibility features, automated testing, manual validation procedures  
**Responsibility:** Design system maintains compliant components, consumers implement correctly  

### Federal Design Requirements
Swiss federal government standards for digital services, including accessibility laws, branding guidelines, and user experience expectations.

**Components:** Swiss federal branding alignment, multi-language support, security requirements  
**Reference:** Brand guidelines, accessibility standards, content guidelines documentation  

### Accessibility Testing
Systematic validation of component and application accessibility compliance through automated tools and manual procedures.

**Methods:** Automated testing tools, manual testing procedures, user testing with disabilities  
**Coverage:** Component level testing, integration testing, end-to-end user journey validation  

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
- Components → `ob.s3.color.brand.bg.contrast_highest.inversity_normal.color.neutral.bg.contrast_highest.inversity_normal.*` → `ob.p.color.red.50.*`
- S2 Emphasis → `ob.s2.color.interaction.state.fg.enabled.inversity_normal → `ob.s1.color.neutral.bg.contrast_highest.inversity_normal.*` → `ob.p.color.red.50.*`

**Example Chain:** `interaction.state.fg.enabled` → `ob.s3.color.brand → `ob.s1.color.neutral.bg.contrast_highest.inversity_normal.contrast_low.inversity_normal` → `ob.p.color.red.50.600`

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

### Protected Files
Critical design system files that should not be modified by individual team members without proper approval. Protection mechanisms prevent accidental changes to core system files.

**Protected Files:** `package.json`, `ng-package.json`, core configuration files  
**Protection Methods:** Pre-commit hooks, access controls, validation scripts  
**Setup:** `documentation/07-workflow/maintainers/04-protected-files.md`  

### Language Style Validation
Automated system for ensuring documentation follows established writing standards and terminology guidelines. Validates forbidden words, emoji usage, and document structure.

**Implementation:** `validate-language-style.js`, `auto-validate-docs.js`  
**Coverage:** High severity violations, medium priority warnings, emoji restrictions  
**Integration:** Pre-commit validation, batch processing, recent file monitoring  

### Documentation Status Tracking
Standardized status field system across all documentation indicating approval workflow state and document maturity level.

**Standard Format:** "Work in Progress - Not Yet Approved by Product Owner"  
**Status Types:** Work in Progress, Approved by Product Owner, Foundation Document  
**Benefits:** Clear approval state, workflow management, professional consistency  

### Bug Tracking Workflow
Systematic process for identifying, documenting, and resolving design system issues, particularly related to Figma integration and token resolution.

**Categories:** Token resolution issues, Figma variable problems, component behavior inconsistencies  
**Documentation:** `documentation/07-workflow/maintainers/01-bugs.md`  
**Process:** Issue identification, investigation, resolution tracking  

### Design Token Architecture
The structured hierarchy organizing design tokens from primitive values through semantic layers to component-specific implementations.

**Current Architecture:** Primitive (p) → Semantic L1-L3 (s1-s3) → Component tokens  
**Migration:** Legacy l1/l2/l3 system replaced by s1/s2/s3 in July 2025  
**Purpose:** Maintainable token system, theme support, component abstraction  

## Legacy and Migration Terms

### Script Recommendations
Automated guidance system helping maintainers choose appropriate scripts for design system development tasks.

**Usage:** `npm run recommend:plan "task description"`  
**Coverage:** Token validation, file management, build processes, quality assurance  
**Documentation:** `documentation/07-workflow/maintainers/03-easy-recommendations.md`  

### Stable Versions
Tracked, verified versions of the design system suitable for production use and safe fallback references.

**Purpose:** Safe rollback points, production deployment references, compatibility tracking  
**Management:** Version verification, branch tracking, stability validation  
**Documentation:** `documentation/07-workflow/maintainers/06-stable-versions.md`

---

*Last Updated: September 2, 2025*  
*Version: 2.0 (Expanded System Coverage)*
