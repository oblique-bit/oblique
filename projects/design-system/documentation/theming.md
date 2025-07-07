# Theming System

## Introduction

**About this document:** This document explains the theming architecture of the Oblique Design System, including theme types, token organization, and implementation patterns.

**Scope:** Tokenized Design System only. Pre-Design System releases like Oblique R13 are not affected.

**Theme Strategy:** The system supports multiple theme dimensions that can be combined: Lightness (light/dark), Inversity (default/inverse), and Interaction Emphasis (default/muted).

---

## Core Concepts

### Theme Types

The design system organizes themes into distinct categories, each controlling a specific dimension of styling:

| Theme Type | Description | Values | Use Case |
|------------|-------------|---------|----------|
| **Lightness** | Controls overall light or dark appearance | `light`, `dark` | System-wide theme switching (dark mode) |
| **Inversity** | Determines normal vs inverted contrast | `default`, `inverse` | Components on contrasting backgrounds |
| **Interaction Emphasis** | Controls tone of interactive elements | `default`, `muted` | Button hierarchy and interaction strength |

### Theme Architecture

```
src/lib/themes/
├── semantics/colors/
│   ├── lightness/
│   │   ├── light.json      # Light theme semantic colors
│   │   └── dark.json       # Dark theme semantic colors
│   ├── inversity/
│   │   ├── default.json    # Default contrast semantic colors
│   │   └── inverse.json    # Inverse contrast semantic colors
│   └── interaction-emphasis/
│       ├── default.json    # Default interaction colors
│       └── muted.json      # Muted interaction colors
└── global/scoped-themes/
    ├── lightness/
    │   ├── light.json      # Component theme overrides for light
    │   └── dark.json       # Component theme overrides for dark
    └── static.json         # Global theme configuration
```

---

## Token Structure

### Semantic Color Tokens

All semantic color tokens follow a consistent pattern:

#### Naming Convention
- **Token Names:** Clean names without theme suffixes
  - ✅ `contrast-high`, `contrast-medium`, `contrast-low`
  - ❌ `contrast-high-default`, `contrast-medium-inverse`

#### Reference Pattern
- **Default Theme:** References `-default` tokens
  - `"contrast-high": { "$value": "{ob.s.color.neutral.bg.contrast-high-default}" }`
- **Inverse Theme:** References `-inverse` tokens
  - `"contrast-high": { "$value": "{ob.s.color.neutral.bg.contrast-high-inverse}" }`

### Token Categories

#### Neutral Colors
```json
"neutral": {
  "bg": {
    "contrast-highest": "Default background color",
    "contrast-high": "Darker surface color", 
    "contrast-medium": "Medium surface color",
    "contrast-low": "Subtle surface color",
    "contrast-lowest": "Very subtle background for disabled states"
  },
  "fg": {
    "contrast-highest": "Primary text color",
    "contrast-high": "Secondary text color",
    "contrast-medium": "Tertiary text color", 
    "contrast-low": "Subtle text color",
    "contrast-lowest": "Disabled text color"
  },
  "border": {
    "subtle": "Subtle border color",
    "default": "Default border color", 
    "strong": "Strong border color"
  }
}
```

#### Status Colors
```json
"status": {
  "info": { "bg": {...}, "fg": {...} },
  "resolved": { "bg": {...}, "fg": {...} },
  "fatal": { "bg": {...}, "fg": {...} },
  "attention": { "bg": {...}, "fg": {...} },
  "pending": { "bg": {...}, "fg": {...} },
  "confirmed": { "bg": {...}, "fg": {...} },
  "progress": { "bg": {...}, "fg": {...} },
  "critical": { "bg": {...}, "fg": {...} },
  "closed": { "bg": {...}, "fg": {...} },
  "disabled": { "bg": {...}, "fg": {...} }
}
```

#### Interaction Colors
```json
"interaction": {
  "emphasis-default": {
    "bg-base": { "contrast-high", "contrast-medium", "contrast-low" },
    "fg-base": { "contrast-high", "contrast-medium", "contrast-low" },
    "fg-visited": { "contrast-high", "contrast-medium", "contrast-low" },
    "fg-disabled": { "contrast-low" },
    "bg-disabled": { "solid", "opacity" }
  },
  "emphasis-muted": {
    "bg-base": {...},
    "fg-base": {...},
    "fg-visited": {...}
  }
}
```

---

## Implementation

### File Organization

#### Semantic Colors (src/lib/themes/semantics/colors/)
- **lightness/**: Theme files for light/dark variants
- **inversity/**: Theme files for default/inverse contrast
- **interaction-emphasis/**: Theme files for interaction emphasis

#### Scoped Themes (src/lib/themes/global/scoped-themes/)
- **Overrides Only:** Contains only actual theme overrides, not default values
- **Centralized:** Single source of truth for component theme customizations
- **Implicit Defaults:** Default behavior is handled by the system

### Theme Application

#### CSS Custom Properties
Themes are applied through CSS custom properties that map to semantic tokens:

```css
:root {
  --ob-color-bg-default: var(--ob-s-color-neutral-bg-contrast-highest);
  --ob-color-text-default: var(--ob-s-color-neutral-fg-contrast-highest);
}

[data-theme="dark"] {
  --ob-color-bg-default: var(--ob-s-color-neutral-bg-contrast-highest);
  --ob-color-text-default: var(--ob-s-color-neutral-fg-contrast-highest);
}
```

#### Component Usage
Components reference semantic tokens through the design system:

```scss
.button {
  background-color: var(--ob-s-color-interaction-emphasis-default-bg-base-contrast-high);
  color: var(--ob-s-color-interaction-emphasis-default-fg-base-contrast-high);
  
  &:hover {
    background-color: var(--ob-s-color-interaction-emphasis-default-bg-base-contrast-medium);
  }
}
```

---

## Best Practices

### Token References
1. **Semantic Layer:** Always reference semantic tokens, never primitives
2. **Clean Naming:** Use clean token names without theme suffixes
3. **Consistent Pattern:** Follow established reference patterns for theme variants

### Theme Design
1. **Contrast Preservation:** Ensure sufficient contrast across all theme combinations
2. **Semantic Consistency:** Maintain semantic meaning across theme variants
3. **Accessibility:** Test all theme combinations for WCAG compliance

### File Management
1. **Overrides Only:** Scoped theme files should contain only actual overrides
2. **Centralized:** Keep all theme overrides in the global/scoped-themes directory
3. **Documentation:** Document any custom theme behavior or special cases

---

## Migration Guide

### From Legacy Tokens
When migrating from legacy `-inverse` suffix tokens:

1. **Remove Suffixes:** Clean up token names by removing `-default` and `-inverse` suffixes
2. **Update References:** Change token references to point to appropriate theme variants
3. **File Structure:** Move tokens to appropriate theme files (lightness/, inversity/, etc.)

### Token Validation
Ensure all tokens follow the correct patterns:

```bash
# Check for broken references
grep -r "\.p\." src/lib/themes/semantics/  # Should only appear in interaction.border.focus

# Validate naming consistency  
grep -r "\-default\":" src/lib/themes/semantics/  # Should not appear in token names

# Verify theme structure
ls src/lib/themes/semantics/colors/inversity/  # Should contain default.json and inverse.json
```

---

## Future Considerations

### Planned Enhancements
- **Additional Theme Types:** Potential support for brand variants or seasonal themes
- **Component Themes:** Enhanced component-specific theming capabilities
- **Dynamic Theming:** Runtime theme switching and customization

### Design System Integration
- **Figma Sync:** Automated synchronization with Figma variable modes
- **Token Studio:** Continued integration with Token Studio workflow
- **Build Tools:** Enhanced build-time theme optimization and validation
