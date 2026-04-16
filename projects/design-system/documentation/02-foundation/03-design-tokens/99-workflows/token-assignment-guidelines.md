# Token Assignment Guidelines

**⚠️ OUTDATED DOCUMENT - MARKED FOR REVISION ⚠️**

**Status:** Outdated - Content requires review and updates  
**Last Updated:** [Date unknown]  
**Action Required:** Review against current token architecture

---

**Tokenization Process - Part 2: Assigning Tokens**

This document defines rules for token assignment (consumption) across all token types in the Oblique Design System. Following these guidelines ensures proper token architecture, theming capabilities, and semantic consistency.

**Related**: See [Tokenization Process](../tokenization-process.md) for Part 1: Creating Tokens

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

**Exception:** Global tokens (`ob.g.*`) can be referenced by any level. See [Global Tokens](../../03-types/01-global-tokens.md) for more details.

---

## Color Token Consumption Rules

### Prohibited Consumption Patterns

#### INVALID: Direct Primitive Consumption
```json
// WRONG: Component consuming primitive directly
"ob.h.button.color.bg.primary.inversity_normal.enabled": {
  "$value": "{ob.p.color.red.500}"
}
```


#### INVALID: S1 Semantic Consumption
```json
// WRONG: Component consuming S1 semantic token directly
"ob.h.button.color.bg.primary.inversity_normal.enabled": {
  "$value": "{ob.s1.color.neutral.bg.contrast_high.inversity_normal}"
}
```

### Required Consumption Patterns

#### - Proper L2/L3 Consumption
```json
// CORRECT: Non-interactive component consuming L2 semantic token
"ob.c.badge.color.bg.info.enabled": {
  "$value": "{ob.s2.color.status.bg.info.inversity_normal}"
}

// CORRECT: Interactive component consuming L3 semantic token (REQUIRED for interactive components)
"ob.h.button.color.bg.primary.inversity_normal.enabled": {
  "$value": "{ob.s.color.interaction.standard_states.bg.enabled.inversity_normal}"
}
```

### Interactive Component Rules

#### Interactive Components Must Use L3 Interaction Tokens

**Rule:** Interactive components (or interactive parts within larger components like Popover) should consume `ob.s.color.interaction.*` tokens.

**Rationale:** L3 tokens provide full theming capabilities including emphasis theming.

```json
// CORRECT: Interactive button
"ob.h.button.color.bg.primary.inversity_normal.enabled": {
  "$value": "{ob.s.color.interaction.standard_states.bg.enabled.inversity_normal}"
}

// CORRECT: Interactive part of a popover
"ob.c.popover.trigger.color.bg.enabled": {
  "$value": "{ob.s.color.interaction.standard_states.bg.enabled.inversity_normal}"
}
```

#### L2 Interaction Limitation

**Warning:** If consuming from `ob.s2.color.interaction.*`, emphasis theming is not possible.

```json
// LIMITED: No emphasis theming available
"ob.c.popover.trigger.color.bg.enabled": {
  "$value": "{ob.s2.color.interaction.state.bg.enabled.inversity_normal}"
}
```

### Monochromatic Interactive Components

**Rule:** Interactive components that should visually look monochromatic are **not allowed** to consume from `ob.s2.color.neutral.*`.

**Solution:** Use `ob.s.color.interaction.*` tokens with scoped theme `emphasis:low` applied.

**Rationale:** This preserves the correct reference chain while achieving the neutral appearance.

#### INVALID: Wrong Approach
```json
// WRONG: Interactive component consuming neutral tokens
"ob.h.header-nav.color.fg.link.enabled": {
  "$value": "{ob.s2.color.neutral.fg.contrast_high.inversity_normal}"
}
```

#### - Correct Approach
```json
// CORRECT: Interactive component with neutral appearance via emphasis:low
"ob.h.header-nav.color.fg.link.enabled": {
  "$value": "{ob.s.color.interaction.standard_states.fg.enabled.inversity_normal}"
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
**Must consume:** `ob.s.color.status.*` or `ob.s2.color.status.*`

| Component | Token Type | Example |
|-----------|------------|---------|
| **Alert** | `status.*` | `ob.s.color.status.bg.error.inversity_normal` |
| **Infobox** | `status.*` | `ob.s.color.status.bg.info.inversity_normal` |
| **Pill** | `status.*` | `ob.s.color.status.fg.success.inversity_normal` |
| **Tooltip** | `status.*` | `ob.s.color.status.bg.info.inversity_normal` |

#### Interactive Components
**Must consume:** `ob.s.color.interaction.standard_states.*` (preferred) or `ob.s2.color.interaction.*` (limited)

| Component | Token Type | Example |
|-----------|------------|---------|
| **Button** | `s3.interaction.*` | `ob.s.color.interaction.standard_states.bg.enabled.inversity_normal` |
| **Link** | `s3.interaction.*` | `ob.s.color.interaction.standard_states.fg.enabled.inversity_normal` |
| **Tag** (interactive) | `s3.interaction.*` | `ob.s.color.interaction.standard_states.bg.enabled.inversity_normal` |
| **Stepper** | `s3.interaction.*` | `ob.s.color.interaction.standard_states.bg.enabled.inversity_normal` |

#### Neutral/Structural Components  
**Must consume:** `ob.s.color.neutral.*` or `ob.s2.color.neutral.*`

| Component | Token Type | Example |
|-----------|------------|---------|
| **List** | `s2.neutral.*` | `ob.s.color.neutral.fg.contrast_high.inversity_normal` |
| **HR (Divider)** | `s2.neutral.*` | `ob.s.color.neutral.border.contrast_low.inversity_normal` |
| **Popover** (container) | `s2.neutral.*` | `ob.s.color.neutral.bg.contrast_lowest.inversity_normal` |

---

## Typography Token Consumption Rules

### Hierarchy Rules
```
Components (ob.c.*) -> Semantics (ob.s.dynamic.*) -> Primitives (ob.p.typography.*)
```

#### - Correct Typography Consumption
```json
// Component consuming semantic typography
"ob.c.button.typography.font_weight": {
  "$value": "{ob.s.dynamic.font_weight.semi_bold}"
}

"ob.c.button.typography.font_family": {
  "$value": "{ob.s.dynamic.font_family.heading}"
}
```

#### INVALID: Prohibited Typography Consumption
```json
// WRONG: Component consuming primitive directly
"ob.c.button.typography.font_weight": {
  "$value": "{ob.p.typography.font_weight.200}"
}
```

### Typography-Specific Rules

1. **Font Family**: Components should consume `ob.s.dynamic.font_family.*` tokens
2. **Font Weight**: Components should consume `ob.s.dynamic.font_weight.*` tokens  
3. **Text Decoration**: Interactive text should consume `ob.s.dynamic.text_decoration.link.*` with appropriate emphasis
4. **Letter Spacing**: Components should consume `ob.s.dynamic.letter_spacing_px.*` tokens (avoid deprecated variants)

#### Text Decoration for Links
```json
// High emphasis links (standard underlined links)
"ob.c.link.typography.text_decoration": {
  "$value": "{ob.s.dynamic.text_decoration.link.emphasis_high}"
}

// Low emphasis links (navigation, obvious link context)
"ob.c.nav-link.typography.text_decoration": {
  "$value": "{ob.s.dynamic.text_decoration.link.emphasis_low}"
}
```

---

## Cross-Domain Consumption Rules

### Typography + Color Integration

**Rule:** Typography components may consume color tokens for text styling, but must follow color consumption rules.

#### - Correct Cross-Domain Usage
```json
// Typography component consuming appropriate color tokens
"ob.c.heading.h1.color.text.default": {
  "$value": "{ob.s.color.neutral.fg.contrast_highest.inversity_normal}"
}

"ob.c.heading.h1.color.link.default": {
  "$value": "{ob.s.color.interaction.standard_states.fg.enabled.inversity_normal}"
}
```

#### INVALID: Prohibited Cross-Domain Usage
```json
// WRONG: Typography consuming primitive color
"ob.c.heading.h1.color.text.default": {
  "$value": "{ob.p.color.red.500}"
}

// WRONG: Typography consuming S1 color
"ob.c.heading.h1.color.text.default": {
  "$value": "{ob.s1.color.neutral.fg.contrast_high.inversity_normal}"
}
```

---

## Theming Implications

### Emphasis Theming

**L3 Tokens Required:** For components that need emphasis theming (`emphasis:default`, `emphasis:low`), they must consume L3 tokens.

```json
// Supports emphasis theming
"ob.h.button.color.bg.primary.inversity_normal.enabled": {
  "$value": "{ob.s.color.interaction.standard_states.bg.enabled.inversity_normal}"
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
"ob.c.card.color.bg.default": {
  "$value": "{ob.s.color.neutral.bg.contrast_lowest.inversity_normal}"
}

// Theme application in CSS
.ob-card-inverse {
  --ob-theme-inversity: flipped;
}
```

---

## Static Token Exceptions

### Static Token Consumption

**Exception Rule:** Static tokens (`ob.s.color.neutral.no_color`, `ob.s.color.brand.*`) may be consumed at higher levels for specific use cases.

#### Allowed Static Tokens

| Token | Purpose | Allowed Contexts |
|-------|---------|------------------|
| `ob.s.color.neutral.no_color` | Transparent/invisible elements | borders, backgrounds, shadows, interaction indicators |
| `ob.s.color.brand.bg.primary.inversity_normal` | Brand identity consistency | interaction indicators, brand elements |

#### Legitimate Static Consumption Examples

```json
// - ALLOWED: Transparent button backgrounds
"ob.h.button.color.bg.ghost.inversity_normal.enabled": {
  "$value": "{ob.s.color.neutral.no_color}"
}

// - ALLOWED: Interaction indicators
"ob.s.color.interaction.standard_states.border.focus.inversity_normal": {
  "$value": "{ob.s.color.brand.bg.primary.inversity_normal}"
}

// - ALLOWED: Brand interaction states
"ob.s.color.interaction.emphasis_high.bg_accent.contrast_high.inversity_normal": {
  "$value": "{ob.s.color.brand.bg.primary.inversity_normal}"
}

// - ALLOWED: S3 emphasis transparent backgrounds
"ob.s.color.interaction.standard_states.bg.enabled.inversity_normal": {
  "$value": "{ob.s.color.neutral.no_color}"
}
```

#### Validation Behavior

The validation script will generate **warnings** (not errors) for static token consumption to allow manual verification of legitimate use cases.

---

## Validation Rules

### Component Token Validation

When creating or reviewing component tokens, ensure:

- [ ] **No primitive consumption**: Components don't reference `ob.p.*` directly
- [ ] **No S1 consumption**: Components don't reference `ob.s1.*`
- [ ] **Semantic alignment**: Component purpose matches token type (status/interaction/neutral)
- [ ] **Theming support**: Required theming capabilities are available through token choice
- [ ] **Reference chain**: Token references follow proper hierarchy (except 01_global tokens which can be referenced from any level)

### Interactive Component Checklist

For interactive components specifically:

- [ ] **L3 interaction consumption**: Uses `ob.s.color.interaction.standard_states.*` for interactive elements
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
                "$value": "{ob.s.color.interaction.standard_states.fg.enabled.inversity_normal}"
              },
              "hover": {
                "$value": "{ob.s.color.interaction.standard_states.fg.hover.inversity_normal}"
              },
              "disabled": {
                "$value": "{ob.s.color.interaction.standard_states.fg.disabled.inversity_normal}"
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
                "$value": "{ob.s.color.status.fg.info.inversity_normal}"
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
                "$value": "{ob.s.color.interaction.standard_states.fg.enabled.inversity_normal}"
              },
              "hover": {
                "$value": "{ob.s.color.interaction.standard_states.fg.hover.inversity_normal}"
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
- **Static token exceptions**: Allows legitimate use of `ob.s.color.neutral.no_color` and `ob.s.color.brand.bg.primary.inversity_normal`
- **Component S1 violation detection**: Catches components consuming `ob.s1.*` tokens
- **Cross-domain validation**: Validates typography, spacing, and other token consumption patterns

### Documentation Updates

Keep this document updated when:
- New token layers are introduced
- Component types change
- Theming capabilities are modified
- New cross-domain patterns emerge

---

*Last updated: July 15, 2025 - Added static token exceptions and implemented consumption hierarchy validation*
