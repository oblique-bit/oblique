# Token Consumption Guidelines

This document defines rules for token consumption across all token types in the Oblique Design System. Following these guidelines ensures proper token architecture, theming capabilities, and semantic consistency.

---

## Core Principles

### Token Reference Pattern (Post-OUI-4001)
The current token system uses a simplified reference structure:

```
Components -> S3 Semantic Compilation -> S1 Lightness -> Primitive
           -> S2 Emphasis -> S1 Lightness -> Primitive
```

**Key Changes:**
- **S3** provides complete semantic color compilation for component consumption
- **S2 and S3** both reference **S1 directly** (no cascading hierarchy)
- **S1** handles light/dark theme switching through direct primitive references

**Fundamental Rules:**
1. **Components should primarily consume S3 semantic tokens**
2. **Components must never consume primitives directly**
3. **S2 and S3 layers reference S1 directly for simplified maintenance**
4. **S1 layer handles all theme switching (light.json/dark.json files)**

**Exception:** Global tokens (`ob.g.theme_configuration.viewport.mobile.*`) can be referenced by any level. See [global-tokens.md](./global-tokens.md) for more details.

---

## Color Token Consumption Rules

### Prohibited Consumption Patterns

#### INVALID: Direct Primitive Consumption
```json
// WRONG: Component consuming primitive directly
"ob.h.link.color.link.primary": {
  "$value": "{ob.p.color.red.50.500}"
}
```

#### INVALID: L1 Semantic Consumption
```json
// WRONG: Component consuming L1 semantic token
"ob.h.link.color.link.primary": {
  "$value": "{ob.s1.color.neutral.bg.contrast_highest.inversity_normal}"
}
```

### Required Consumption Patterns

#### - Proper L2/L3 Consumption
```json
// CORRECT: Non-interactive component consuming L2 semantic token
"ob.c.tag.container.spacing.gap.surface": {
  "$value": "{ob.s2.color.interaction.state.fg.enabled.inversity_normal.bg.contrast_highest.inversity_normal}"
}

// CORRECT: Interactive component consuming L3 semantic token (REQUIRED for interactive components)
"ob.h.link.color.link.primary": {
  "$value": "{ob.s3.color.brand
}
```

### Interactive Component Rules

#### Interactive Components Must Use L3 Interaction Tokens

**Rule:** Interactive components (or interactive parts within larger components like Popover) should consume `ob.s3.color.brand tokens.

**Rationale:** L3 tokens provide full theming capabilities including emphasis theming.

```json
// CORRECT: Interactive button
"ob.c.tag.container.spacing.gap.fg.primary.enabled": {
  "$value": "{ob.s3.color.brand
}

// CORRECT: Interactive part of a popover
"ob.c.tag.container.spacing.gap.fg.action-link": {
  "$value": "{ob.s3.color.brand
}
```

#### L2 Interaction Limitation

**Warning:** If consuming from `ob.s2.color.interaction.state.fg.enabled.inversity_normal emphasis theming is not possible.

```json
// LIMITED: No emphasis theming available
"ob.c.tag.container.spacing.gap.fg.action": {
  "$value": "{ob.s2.color.interaction.state.fg.enabled.inversity_normal.fg_base.contrast_high.inversity_normal}"
}
```

### Monochromatic Interactive Components

**Rule:** Interactive components that should visually look monochromatic are **not allowed** to consume from `ob.s2.color.interaction.state.fg.enabled.inversity_normal.

**Solution:** Use `ob.s3.color.brand with scoped theme `emphasis:low` applied.

**Rationale:** This preserves the correct reference chain while achieving the neutral appearance.

#### INVALID: Wrong Approach
```json
// WRONG: Interactive component consuming neutral tokens
"ob.c.tag.container.spacing.gap.fg.link": {
  "$value": "{ob.s2.color.interaction.state.fg.enabled.inversity_normal.fg.contrast_high.inversity_normal}"
}
```

#### - Correct Approach
```json
// CORRECT: Interactive component with neutral appearance via emphasis:low
"ob.c.tag.container.spacing.gap.fg.link": {
  "$value": "{ob.s3.color.brand
}
```

**Implementation:** Apply scoped theme `emphasis:low` to the component context:
```scss
.ob-header-nav {
  --ob-theme-emphasis: low;
}
```

### Component Classification by Token Type

#### Status-Based Components
**Must consume:** `ob.s2.color.interaction.state.fg.enabled.inversity_normal.*` or `ob.s3.color.brand.interaction.state.fg.enabled.inversity_normal.info.fg.contrast_highest.inversity_flipped` |
| **Infobox** | `status.*` | `ob.s2.color.interaction.state.fg.enabled.inversity_normal.critical.fg.contrast_high.inversity_normal` |
| **Pill** | `status.*` | `ob.s3.color.brand |
| **Tooltip** | `status.*` | `ob.s2.color.interaction.state.fg.enabled.inversity_normal.info.bg.contrast_high.inversity_normal` |

#### Interactive Components
**Must consume:** `ob.s3.color.brand.state.fg.enabled.inversity_normal.*` (limited)

| Component | Token Type | Example |
|-----------|------------|---------|
| **Button** | `s3.interaction.*` | `ob.s3.color.brand |
| **Link** | `s3.interaction.*` | `ob.s3.color.brand |
| **Tag** (interactive) | `s3.interaction.*` | `ob.s3.color.brand |
| **Stepper** | `s3.interaction.*` | `ob.s3.color.brand |

#### Neutral/Structural Components  
**Must consume:** `ob.s2.color.interaction.state.fg.enabled.inversity_normal.*` or `ob.s3.color.brand.color.interaction.state.fg.enabled.inversity_normal.fg.contrast_highest.inversity_normal` |
| **List** | `s2.neutral.*` | `ob.s2.color.interaction.state.fg.enabled.inversity_normal.fg.contrast_medium.inversity_normal` |
| **HR (Divider)** | `s2.neutral.*` | `ob.s2.color.interaction.state.fg.enabled.inversity_normal.border.contrast_medium.inversity_normal` |
| **Popover** (container) | `s2.neutral.*` | `ob.s2.color.interaction.state.fg.enabled.inversity_normal.bg.contrast_highest.inversity_normal` |

---

## Typography Token Consumption Rules

### Hierarchy Rules
```
Components (ob.c.tag.container.spacing.gap -> Semantics (ob.s.z_index.stepper_mobile.*) -> Primitives (ob.p.assets.logo.*)
```

#### - Correct Typography Consumption
```json
// Component consuming semantic typography
"ob.c.tag.container.spacing.gap.font-weight": {
  "$value": "{ob.s.z_index.stepper_mobile.font-weight.semiBold}"
}

"ob.c.tag.container.spacing.gap.font-family": {
  "$value": "{ob.s.z_index.stepper_mobile.font-family.heading}"
}
```

#### INVALID: Prohibited Typography Consumption
```json
// WRONG: Component consuming primitive directly
"ob.c.tag.container.spacing.gap.font-weight": {
  "$value": "{ob.p.assets.logo.font-weight.200}"
}
```

### Typography-Specific Rules

1. **Font Family**: Components should consume `ob.s.z_index.stepper_mobile.font-family.*` tokens
2. **Font Weight**: Components should consume `ob.s.z_index.stepper_mobile.font-weight.*` tokens  
3. **Text Decoration**: Interactive text should consume `ob.s.z_index.stepper_mobile.text-decoration.link.*` with appropriate emphasis
4. **Letter Spacing**: Components should consume `ob.s.z_index.stepper_mobile.letter-spacing.*` tokens (avoid deprecated variants)

#### Text Decoration for Links
```json
// High emphasis links (standard underlined links)
"ob.c.tag.container.spacing.gap-decoration": {
  "$value": "{ob.s.z_index.stepper_mobile.text-decoration.link.emphasis_high}"
}

// Low emphasis links (navigation, obvious link context)
"ob.c.tag.container.spacing.gap {
  "$value": "{ob.s.z_index.stepper_mobile.text-decoration.link.emphasis_low}"
}
```

---

## Cross-Domain Consumption Rules

### Typography + Color Integration

**Rule:** Typography components may consume color tokens for text styling, but must follow color consumption rules.

#### - Correct Cross-Domain Usage
```json
// Typography component consuming appropriate color tokens
"ob.s.typography.content.heading.default.H1.color.text.default": {
  "$value": "{ob.s2.color.interaction.state.fg.enabled.inversity_normal.fg.contrast_highest.inversity_normal}"
}

"ob.s.typography.content.heading.default.H1.color.link.default": {
  "$value": "{ob.s3.color.brand
}
```

#### INVALID: Prohibited Cross-Domain Usage
```json
// WRONG: Typography consuming primitive color
"ob.s.typography.content.heading.default.H1.color.text.default": {
  "$value": "{ob.p.color.red.50}"
}

// WRONG: Typography consuming L1 color
"ob.s.typography.content.heading.default.H1.color.text.default": {
  "$value": "{ob.s1.color.neutral.bg.contrast_highest.inversity_normal}"
}
```

---

## Theming Implications

### Emphasis Theming

**L3 Tokens Required:** For components that need emphasis theming (`emphasis:default`, `emphasis:low`), they must consume L3 tokens.

```json
// Supports emphasis theming
"ob.c.tag.container.spacing.gap.fg.primary": {
  "$value": "{ob.s3.color.brand
}

// Theme application in CSS
.ob-button {
  --ob-theme-emphasis: default; /* or low */
}
```

### Inversity Theming

**All L2/L3 Tokens:** Support inversity theming (`inversity_normal`, `inversity_flipped`).

```json
// Supports inversity theming
"ob.c.tag.container.spacing.gap": {
  "$value": "{ob.s2.color.interaction.state.fg.enabled.inversity_normal.bg.contrast_highest.inversity_normal}"
}

// Theme application in CSS
.ob-card-inverse {
  --ob-theme-inversity: flipped;
}
```

---

## Static Token Exceptions

### Static Token Consumption

**Exception Rule:** Static tokens (`ob.s2.color.interaction.state.fg.enabled.inversity_normal.*`) may be consumed at higher levels for specific use cases.

#### Allowed Static Tokens

| Token | Purpose | Allowed Contexts |
|-------|---------|------------------|
| `ob.s2.color.interaction.state.fg.enabled.inversity_normal.no_color` | Transparent/invisible elements | borders, backgrounds, shadows, interaction indicators |
| `ob.s2.color.interaction.state.fg.enabled.inversity_normal | Brand identity consistency | interaction indicators, brand elements |

#### Legitimate Static Consumption Examples

```json
// - ALLOWED: Transparent button backgrounds
"ob.h.link.color.link": {
  "$value": "{ob.s2.color.interaction.state.fg.enabled.inversity_normal.no_color}"
}

// - ALLOWED: Interaction indicators
"ob.s2.color.interaction.state.fg.enabled.inversity_normal.indicator.unselected": {
  "$value": "{ob.s2.color.interaction.state.fg.enabled.inversity_normal.no_color}"
}

// - ALLOWED: Brand interaction states
"ob.s2.color.interaction.state.fg.enabled.inversity_normal.indicator.selected": {
  "$value": "{ob.s2.color.interaction.state.fg.enabled.inversity_normal
}

// - ALLOWED: S3 emphasis transparent backgrounds
"ob.s3.color.brand.color.interaction.state.fg.enabled.inversity_normal.no_color}"
}
```

#### Validation Behavior

The validation script will generate **warnings** (not errors) for static token consumption to allow manual verification of legitimate use cases.

---

## Validation Rules

### Component Token Validation

When creating or reviewing component tokens, ensure:

- [ ] **No primitive consumption**: Components don't reference `ob.p.assets.logo.*` directly
- [ ] **No L1 consumption**: Components don't reference `ob.s1.color.neutral.bg.contrast_highest.inversity_normal.*`
- [ ] **Semantic alignment**: Component purpose matches token type (status/interaction/neutral)
- [ ] **Theming support**: Required theming capabilities are available through token choice
- [ ] **Reference chain**: Token references follow proper hierarchy (except global tokens which can be referenced from any level)

### Interactive Component Checklist

For interactive components specifically:

- [ ] **L3 interaction consumption**: Uses `ob.s3.color.brand.state.fg.enabled.inversity_normal.*` for interactive elements
- [ ] **State coverage**: All interaction states (hover, focus, active, disabled) are defined

---

## Examples by Component Type

### Interactive Button
```json
{
  "ob": {
    "c": {
      "button": {
        "color": {
          "fg": {
            "primary": {
              "enabled": {
                "$value": "{ob.s3.color.brand
              },
              "hover": {
                "$value": "{ob.s3.color.brand
              },
              "disabled": {
                "$value": "{ob.s3.color.brand
              }
            }
          }
        }
      }
    }
  }
}
```

### Status Badge
```json
{
  "ob": {
    "c": {
      "badge": {
        "color": {
          "fg": {
            "info": {
              "enabled": {
                "$value": "{ob.s2.color.interaction.state.fg.enabled.inversity_normal.info.fg.contrast_highest.inversity_flipped}"
              }
            }
          }
        }
      }
    }
  }
}
```

### Monochromatic Navigation Link
```json
{
  "ob": {
    "c": {
      "header-nav": {
        "color": {
          "fg": {
            "link": {
              "enabled": {
                "$value": "{ob.s3.color.brand
              },
              "hover": {
                "$value": "{ob.s3.color.brand
              }
            }
          }
        }
      }
    }
  }
}
```

---

## Implementation Guidelines

### 1. New Component Creation

When creating a new component:

1. **Identify component type**: Status-based, interactive, or neutral
2. **Choose appropriate token layer**: L2 or L3 based on theming needs
3. **Select semantic category**: status, interaction, or neutral
4. **Define all necessary states**: enabled, hover, focus, active, disabled
5. **Test theming**: Verify emphasis and inversity theming work as expected

### 2. Existing Component Migration

When migrating existing components:

1. **Audit current consumption**: Identify any primitive or L1 references
2. **Map to semantic tokens**: Choose appropriate S2/S3 semantic tokens
3. **Preserve visual appearance**: Ensure migration doesn't break existing designs
4. **Test theme switching**: Verify all theme combinations work correctly
5. **Update documentation**: Reflect new token usage patterns

### 3. Theme Application

Apply themes through CSS custom properties:

```scss
// Component with emphasis theming
.ob-header {
  --ob-theme-emphasis: low;
  
  .ob-button {
    // Inherits emphasis:low, making buttons monochromatic
  }
}

// Component with inversity theming
.ob-modal {
  --ob-theme-inversity: flipped;
  
  // All nested components inherit flipped theme
}
```

---

## Maintenance

### Regular Validation

Run validation checks:

```bash
# Check for plural references and token compliance
npm run check:plural-references

# Validate token consumption hierarchy (p/s1/s2/s3)
npm run check:token-consumption
# OR directly: node scripts-custom/validate-consumption-hierarchy.js
```

The consumption hierarchy validator includes:
- **p/s1/s2/s3 semantic color validation**: Ensures proper hierarchical token consumption
- **Static token exceptions**: Allows legitimate use of `ob.s2.color.interaction.state.fg.enabled.inversity_normal.no_color` and `ob.s2.color.interaction.state.fg.enabled.inversity_normal
- **Component L1 violation detection**: Catches components consuming `ob.s1.color.neutral.bg.contrast_highest.inversity_normal.*` tokens
- **Cross-domain validation**: Validates typography, spacing, and other token consumption patterns

### Documentation Updates

Keep this document updated when:
- New token layers are introduced
- Component types change
- Theming capabilities are modified
- New cross-domain patterns emerge

---

*Last updated: July 15, 2025 - Added static token exceptions and implemented consumption hierarchy validation*
