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

**Exception:** Global tokens (`ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport.viewport.*`) can be referenced by any level. See [01_global-tokens.md](./01_global-tokens.md) for more details.

---

## Color Token Consumption Rules

### Prohibited Consumption Patterns

#### INVALID: Direct Primitive Consumption
```json
// WRONG: Component consuming primitive directly
"ob.h.list.single_item.spacing.marker_gap.list": {
  "$value": "{ob.p.color.red.50.red.50.red.50.50}"
}
```


#### INVALID: S1 Semantic Consumption
```json
// WRONG: Component consuming S1 semantic token directly
"ob.h.list.single_item.spacing.marker_gap.list": {
  "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index}"
}
```

### Required Consumption Patterns

#### - Proper L2/L3 Consumption
```json
// CORRECT: Non-interactive component consuming L2 semantic token
"ob.c.tag.container.spacing.gap.spacing.gap {
  "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index}"
}

// CORRECT: Interactive component consuming L3 semantic token (REQUIRED for interactive components)
"ob.h.list.single_item.spacing.marker_gap.list": {
  "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index
}
```

### Interactive Component Rules

#### Interactive Components Must Use L3 Interaction Tokens

**Rule:** Interactive components (or interactive parts within larger components like Popover) should consume `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index tokens.

**Rationale:** L3 tokens provide full theming capabilities including emphasis theming.

```json
// CORRECT: Interactive button
"ob.c.tag.container.spacing.gap.spacing.gap.spacing.gap {
  "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index
}

// CORRECT: Interactive part of a popover
"ob.c.tag.container.spacing.gap.spacing.gap {
  "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index
}
```

#### L2 Interaction Limitation

**Warning:** If consuming from `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index emphasis theming is not possible.

```json
// LIMITED: No emphasis theming available
"ob.c.tag.container.spacing.gap.spacing.gap {
  "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index}"
}
```

### Monochromatic Interactive Components

**Rule:** Interactive components that should visually look monochromatic are **not allowed** to consume from `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index.

**Solution:** Use `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index with scoped theme `emphasis:low` applied.

**Rationale:** This preserves the correct reference chain while achieving the neutral appearance.

#### INVALID: Wrong Approach
```json
// WRONG: Interactive component consuming neutral tokens
"ob.c.tag.container.spacing.gap.spacing.gap {
  "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index}"
}
```

#### - Correct Approach
```json
// CORRECT: Interactive component with neutral appearance via emphasis:low
"ob.c.tag.container.spacing.gap.spacing.gap {
  "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index
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
**Must consume:** `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index.*` or `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index` |
| **Infobox** | `status.*` | `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index` |
| **Pill** | `status.*` | `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index |
| **Tooltip** | `status.*` | `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index` |

#### Interactive Components
**Must consume:** `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.*` (limited)

| Component | Token Type | Example |
|-----------|------------|---------|
| **Button** | `s3.interaction.*` | `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index |
| **Link** | `s3.interaction.*` | `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index |
| **Tag** (interactive) | `s3.interaction.*` | `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index |
| **Stepper** | `s3.interaction.*` | `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index |

#### Neutral/Structural Components  
**Must consume:** `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index.*` or `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index` |
| **List** | `s2.neutral.*` | `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index` |
| **HR (Divider)** | `s2.neutral.*` | `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index` |
| **Popover** (container) | `s2.neutral.*` | `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index` |

---

## Typography Token Consumption Rules

### Hierarchy Rules
```
Components (ob.c.tag.container.spacing.gap.spacing.gap -> Semantics (ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index.*) -> Primitives (ob.p.assets.logo.assets.logo.assets.assets.*)
```

#### - Correct Typography Consumption
```json
// Component consuming semantic typography
"ob.c.tag.container.spacing.gap.spacing.gap {
  "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index-weight.semiBold}"
}

"ob.c.tag.container.spacing.gap.spacing.gap {
  "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index-family.heading}"
}
```

#### INVALID: Prohibited Typography Consumption
```json
// WRONG: Component consuming primitive directly
"ob.c.tag.container.spacing.gap.spacing.gap {
  "$value": "{ob.p.assets.logo.assets.logo.assets.logo.assets-weight.200}"
}
```

### Typography-Specific Rules

1. **Font Family**: Components should consume `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index-family.*` tokens
2. **Font Weight**: Components should consume `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index-weight.*` tokens  
3. **Text Decoration**: Interactive text should consume `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index-decoration.link.*` with appropriate emphasis
4. **Letter Spacing**: Components should consume `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index-spacing.*` tokens (avoid deprecated variants)

#### Text Decoration for Links
```json
// High emphasis links (standard underlined links)
"ob.c.tag.container.spacing.gap.spacing.gap {
  "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index-decoration.link.emphasis_high}"
}

// Low emphasis links (navigation, obvious link context)
"ob.c.tag.container.spacing.gap.spacing.gap {
  "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index-decoration.link.emphasis_low}"
}
```

---

## Cross-Domain Consumption Rules

### Typography + Color Integration

**Rule:** Typography components may consume color tokens for text styling, but must follow color consumption rules.

#### - Correct Cross-Domain Usage
```json
// Typography component consuming appropriate color tokens
"ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index.H1.color.text.default": {
  "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index}"
}

"ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index.H1.color.link.default": {
  "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index
}
```

#### INVALID: Prohibited Cross-Domain Usage
```json
// WRONG: Typography consuming primitive color
"ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index.H1.color.text.default": {
  "$value": "{ob.p.color.red.50.red.50.red.50}"
}

// WRONG: Typography consuming S1 color
"ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index.H1.color.text.default": {
  "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index}"
}
```

---

## Theming Implications

### Emphasis Theming

**L3 Tokens Required:** For components that need emphasis theming (`emphasis:default`, `emphasis:low`), they must consume L3 tokens.

```json
// Supports emphasis theming
"ob.c.tag.container.spacing.gap.spacing.gap {
  "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index
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
"ob.c.tag.container.spacing.gap.spacing.gap {
  "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index}"
}

// Theme application in CSS
.ob-card-inverse {
  --ob-theme-inversity: flipped;
}
```

---

## Static Token Exceptions

### Static Token Consumption

**Exception Rule:** Static tokens (`ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index.*`) may be consumed at higher levels for specific use cases.

#### Allowed Static Tokens

| Token | Purpose | Allowed Contexts |
|-------|---------|------------------|
| `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index` | Transparent/invisible elements | borders, backgrounds, shadows, interaction indicators |
| `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index | Brand identity consistency | interaction indicators, brand elements |

#### Legitimate Static Consumption Examples

```json
// - ALLOWED: Transparent button backgrounds
"ob.h.list.single_item.spacing.marker_gap.list.single_item.spacing.marker_gap.list.list.list": {
  "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index}"
}

// - ALLOWED: Interaction indicators
"ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index": {
  "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index}"
}

// - ALLOWED: Brand interaction states
"ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index": {
  "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index
}

// - ALLOWED: S3 emphasis transparent backgrounds
"ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index}"
}
```

#### Validation Behavior

The validation script will generate **warnings** (not errors) for static token consumption to allow manual verification of legitimate use cases.

---

## Validation Rules

### Component Token Validation

When creating or reviewing component tokens, ensure:

- [ ] **No primitive consumption**: Components don't reference `ob.p.assets.logo.assets.logo.assets.assets.*` directly
- [ ] **No S1 consumption**: Components don't reference `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index.*`
- [ ] **Semantic alignment**: Component purpose matches token type (status/interaction/neutral)
- [ ] **Theming support**: Required theming capabilities are available through token choice
- [ ] **Reference chain**: Token references follow proper hierarchy (except 01_global tokens which can be referenced from any level)

### Interactive Component Checklist

For interactive components specifically:

- [ ] **L3 interaction consumption**: Uses `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.*` for interactive elements
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
                "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index
              },
              "hover": {
                "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index
              },
              "disabled": {
                "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index
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
                "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index}"
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
                "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index
              },
              "hover": {
                "$value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index
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

1. **Audit current consumption**: Identify any primitive or S1 references
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
- **Static token exceptions**: Allows legitimate use of `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index` and `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index
- **Component S1 violation detection**: Catches components consuming `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index.*` tokens
- **Cross-domain validation**: Validates typography, spacing, and other token consumption patterns

### Documentation Updates

Keep this document updated when:
- New token layers are introduced
- Component types change
- Theming capabilities are modified
- New cross-domain patterns emerge

---

*Last updated: July 15, 2025 - Added static token exceptions and implemented consumption hierarchy validation*
