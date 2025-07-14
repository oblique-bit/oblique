# Token Consumption Guidelines

This document defines rules for token consumption across all token types in the Oblique Design System. Following these guidelines ensures proper token architecture, theming capabilities, and semantic consistency.

---

## Core Principles

### Token Hierarchy
Most tokens follow a strict hierarchical reference chain:

```
Components (L3) → Semantics (L2) → Primitives (L1)
```

**Exception:** Global tokens (`ob.g.*`) can be referenced by any level. See [global-tokens.md](./global-tokens.md) for more details.

**Fundamental Rules:**
1. **Components must never consume primitives directly**
2. **Components must never consume L1 semantic tokens (ob.s1.color.*)**
3. **Each layer should only reference the layer immediately below it**
4. **Maintain semantic meaning through the reference chain**

---

## Color Token Consumption Rules

### Prohibited Consumption Patterns

#### ❌ Direct Primitive Consumption
```json
// WRONG: Component consuming primitive directly
"ob.c.button.color.bg.primary": {
  "$value": "{ob.p.color.steelblue.500}"
}
```

#### ❌ L1 Semantic Consumption
```json
// WRONG: Component consuming L1 semantic token
"ob.c.button.color.bg.primary": {
  "$value": "{ob.s1.color.steelblue.500}"
}
```

### Required Consumption Patterns

#### ✅ Proper L2/L3 Consumption
```json
// CORRECT: Non-interactive component consuming L2 semantic token
"ob.c.card.color.bg.surface": {
  "$value": "{ob.s2.color.neutral.bg.contrast-highest.inversity-normal}"
}

// CORRECT: Interactive component consuming L3 semantic token (REQUIRED for interactive components)
"ob.c.button.color.bg.primary": {
  "$value": "{ob.s3.color.interaction.emphasis-high.bg-base.contrast-high.inversity-normal}"
}
```

### Interactive Component Rules

#### Interactive Components Must Use L3 Interaction Tokens

**Rule:** Interactive components (or interactive parts within larger components like Popover) should consume `ob.s3.color.interaction` tokens.

**Rationale:** L3 tokens provide full theming capabilities including emphasis theming.

```json
// CORRECT: Interactive button
"ob.c.button.color.fg.primary.enabled": {
  "$value": "{ob.s3.color.interaction.emphasis-high.fg-base.contrast-high.inversity-normal}"
}

// CORRECT: Interactive part of a popover
"ob.c.popover.color.fg.action-link": {
  "$value": "{ob.s3.color.interaction.emphasis-high.fg-base.contrast-medium.inversity-normal}"
}
```

#### L2 Interaction Limitation

**Warning:** If consuming from `ob.s2.color.interaction`, emphasis theming is not possible.

```json
// LIMITED: No emphasis theming available
"ob.c.some-component.color.fg.action": {
  "$value": "{ob.s2.color.interaction.fg-base.contrast-high.inversity-normal}"
}
```

### Monochromatic Interactive Components

**Rule:** Interactive components that should visually look monochromatic are **not allowed** to consume from `ob.s2.color.neutral`.

**Solution:** Use `ob.s3.color.interaction` with scoped theme `emphasis:low` applied.

**Rationale:** This preserves the correct reference chain while achieving the neutral appearance.

#### ❌ Wrong Approach
```json
// WRONG: Interactive component consuming neutral tokens
"ob.c.header-nav.color.fg.link": {
  "$value": "{ob.s2.color.neutral.fg.contrast-high.inversity-normal}"
}
```

#### ✅ Correct Approach
```json
// CORRECT: Interactive component with neutral appearance via emphasis:low
"ob.c.header-nav.color.fg.link": {
  "$value": "{ob.s3.color.interaction.emphasis-low.fg-base.contrast-high.inversity-normal}"
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
**Must consume:** `ob.s2.color.status.*` or `ob.s3.color.status.*`

| Component | Token Type | Example |
|-----------|------------|---------|
| **Badge** | `status.*` | `ob.s2.color.status.info.fg.contrast-highest.inversity-flipped` |
| **Infobox** | `status.*` | `ob.s2.color.status.critical.fg.contrast-high.inversity-normal` |
| **Pill** | `status.*` | `ob.s3.color.status.resolved.fg.contrast-medium.inversity-normal` |
| **Tooltip** | `status.*` | `ob.s2.color.status.info.bg.contrast-high.inversity-normal` |

#### Interactive Components
**Must consume:** `ob.s3.color.interaction.*` (preferred) or `ob.s2.color.interaction.*` (limited)

| Component | Token Type | Example |
|-----------|------------|---------|
| **Button** | `s3.interaction.*` | `ob.s3.color.interaction.emphasis-high.fg-base.contrast-high.inversity-normal` |
| **Link** | `s3.interaction.*` | `ob.s3.color.interaction.emphasis-high.fg-hover.contrast-high.inversity-normal` |
| **Tag** (interactive) | `s3.interaction.*` | `ob.s3.color.interaction.emphasis-low.bg-base.contrast-medium.inversity-normal` |
| **Stepper** | `s3.interaction.*` | `ob.s3.color.interaction.emphasis-high.fg-focus.contrast-high.inversity-normal` |

#### Neutral/Structural Components  
**Must consume:** `ob.s2.color.neutral.*` or `ob.s3.color.neutral.*`

| Component | Token Type | Example |
|-----------|------------|---------|
| **Typography** | `s2.neutral.*` | `ob.s2.color.neutral.fg.contrast-highest.inversity-normal` |
| **List** | `s2.neutral.*` | `ob.s2.color.neutral.fg.contrast-medium.inversity-normal` |
| **HR (Divider)** | `s2.neutral.*` | `ob.s2.color.neutral.border.contrast-medium.inversity-normal` |
| **Popover** (container) | `s2.neutral.*` | `ob.s2.color.neutral.bg.contrast-highest.inversity-normal` |

---

## Typography Token Consumption Rules

### Hierarchy Rules
```
Components (ob.c.*) → Semantics (ob.s.*) → Primitives (ob.p.*)
```

#### ✅ Correct Typography Consumption
```json
// Component consuming semantic typography
"ob.c.button.typography.font-weight": {
  "$value": "{ob.s.font-weight.semiBold}"
}

"ob.c.heading.typography.font-family": {
  "$value": "{ob.s.font-family.heading}"
}
```

#### ❌ Prohibited Typography Consumption
```json
// WRONG: Component consuming primitive directly
"ob.c.button.typography.font-weight": {
  "$value": "{ob.p.font-weight.200}"
}
```

### Typography-Specific Rules

1. **Font Family**: Components should consume `ob.s.font-family.*` tokens
2. **Font Weight**: Components should consume `ob.s.font-weight.*` tokens  
3. **Text Decoration**: Interactive text should consume `ob.s.text-decoration.link.*` with appropriate emphasis
4. **Letter Spacing**: Components should consume `ob.s.letter-spacing.*` tokens (avoid deprecated variants)

#### Text Decoration for Links
```json
// High emphasis links (standard underlined links)
"ob.c.content-link.text-decoration": {
  "$value": "{ob.s.text-decoration.link.emphasis-high}"
}

// Low emphasis links (navigation, obvious link context)
"ob.c.nav-link.text-decoration": {
  "$value": "{ob.s.text-decoration.link.emphasis-low}"
}
```

---

## Cross-Domain Consumption Rules

### Typography + Color Integration

**Rule:** Typography components may consume color tokens for text styling, but must follow color consumption rules.

#### ✅ Correct Cross-Domain Usage
```json
// Typography component consuming appropriate color tokens
"ob.s.typography.color.text.default": {
  "$value": "{ob.s2.color.neutral.fg.contrast-highest.inversity-normal}"
}

"ob.s.typography.color.link.default": {
  "$value": "{ob.s3.color.interaction.emphasis-high.fg-base.contrast-high.inversity-normal}"
}
```

#### ❌ Prohibited Cross-Domain Usage
```json
// WRONG: Typography consuming primitive color
"ob.s.typography.color.text.default": {
  "$value": "{ob.p.color.cobalt.900}"
}

// WRONG: Typography consuming L1 color
"ob.s.typography.color.text.default": {
  "$value": "{ob.s1.color.cobalt.900}"
}
```

---

## Theming Implications

### Emphasis Theming

**L3 Tokens Required:** For components that need emphasis theming (`emphasis:default`, `emphasis:low`), they must consume L3 tokens.

```json
// Supports emphasis theming
"ob.c.button.color.fg.primary": {
  "$value": "{ob.s3.color.interaction.emphasis-high.fg-base.contrast-high.inversity-normal}"
}

// Theme application in CSS
.ob-button {
  --ob-theme-emphasis: default; /* or low */
}
```

### Inversity Theming

**All L2/L3 Tokens:** Support inversity theming (`inversity-normal`, `inversity-flipped`).

```json
// Supports inversity theming
"ob.c.card.color.bg": {
  "$value": "{ob.s2.color.neutral.bg.contrast-highest.inversity-normal}"
}

// Theme application in CSS
.ob-card-inverse {
  --ob-theme-inversity: flipped;
}
```

---

## Validation Rules

### Component Token Validation

When creating or reviewing component tokens, ensure:

- [ ] **No primitive consumption**: Components don't reference `ob.p.*` directly
- [ ] **No L1 consumption**: Components don't reference `ob.s1.color.*`
- [ ] **Semantic alignment**: Component purpose matches token type (status/interaction/neutral)
- [ ] **Theming support**: Required theming capabilities are available through token choice
- [ ] **Reference chain**: Token references follow proper hierarchy (except global tokens which can be referenced from any level)

### Interactive Component Checklist

For interactive components specifically:

- [ ] **L3 interaction consumption**: Uses `ob.s3.color.interaction.*` for full theming
- [ ] **Emphasis theming**: Can apply `emphasis:low` for monochromatic appearance
- [ ] **No neutral consumption**: Avoids `ob.s2.color.neutral.*` for interactive elements
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
                "$value": "{ob.s3.color.interaction.emphasis-high.fg-base.contrast-high.inversity-normal}"
              },
              "hover": {
                "$value": "{ob.s3.color.interaction.emphasis-high.fg-hover.contrast-high.inversity-normal}"
              },
              "disabled": {
                "$value": "{ob.s3.color.interaction.emphasis-high.fg-disabled.contrast-low.inversity-normal}"
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
                "$value": "{ob.s2.color.status.info.fg.contrast-highest.inversity-flipped}"
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
                "$value": "{ob.s3.color.interaction.emphasis-low.fg-base.contrast-high.inversity-normal}"
              },
              "hover": {
                "$value": "{ob.s3.color.interaction.emphasis-low.fg-hover.contrast-high.inversity-normal}"
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

# TODO: Add token consumption validation script
npm run check:token-consumption
# OR directly: python3 scripts-custom/validate-token-consumption.py
```

### Documentation Updates

Keep this document updated when:
- New token layers are introduced
- Component types change
- Theming capabilities are modified
- New cross-domain patterns emerge

---

*Last updated: July 11, 2025 - Initial creation of token consumption guidelines*
