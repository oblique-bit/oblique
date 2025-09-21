# Theming System

## Introduction

**About this document:** This document explains the theming architecture of the Oblique Design System, including theme types, token organization, and implementation patterns.

**Scope:** Tokenized Design System only. Pre-Design System releases like Oblique R13 are not affected.

**Theme Strategy:** The system supports theme switching primarily through the S1 lightness layer (light/dark themes), with S2 providing emphasis variations and S3 serving as a complete semantic color compilation for component consumption.

---

## Current Theming Architecture

The semantic system is organized into three distinct layers with specific responsibilities:

### S1: Lightness Semantic Level (User Mode)
- **Purpose:** Handles light/dark user preference mode switching
- **Files:** `light.json` / `dark.json`
- **Function:** Primary user mode switching mechanism for the entire system

### S2: Emphasis Semantic Level (System Mode)
- **Purpose:** Manages high/low emphasis variations for interaction states
- **Files:** `high.json` / `low.json`  
- **Function:** Provides emphasis-based variations that reference S1 directly

### S3: Semantic Compilation
- **Purpose:** Complete collection of all semantic colors for component consumption
- **Files:** `semantic.json`
- **Function:** Clean, complete semantic color compilation that references S1 directly

---

## Important: Inversity in Token Names vs. Architecture

**Clarification:** 
- **Inversity in Token Names:** Exists within individual token names (`inversity_normal`, `inversity_flipped`)

**What this means:**
- Design system designers can **choose** between `inversity_normal` and `inversity_flipped` token variants when tokenizing components
- Each semantic token provides both variants, and the selection is manual during component design

---

## Mode Types in Theming

The theming system works with two distinct types of modes:

### User Modes (User Preference Modes)
Modes controlled by user settings or system preferences that switch automatically:

- **Lightness Mode** (`light`/`dark`) - Responds to OS dark mode preference or user toggle
- **Viewport Mode** (`desktop`/`mobile`) - Switches based on viewport size and device capabilities

**Implementation:** These modes switch automatically at runtime based on external factors like `prefers-color-scheme: dark` or viewport media queries.

### System Modes (Design System Controlled Modes)  
Modes set by designers and developers during design and implementation phases:

- **Emphasis Variations** (`high`/`low`) - Chosen by designers based on context and visual hierarchy needs
- **Token Variants** (`inversity_normal`/`inversity_flipped`) - Selected during component tokenization process

**Implementation:** These are design-time decisions embedded in component definitions, not runtime switches.

---

## Component Size Themes

The design system includes a **component-size** theme group that provides unified sizing modes for components:

### Size Modes
- **`sm`** - Small size mode for compact interfaces
- **`md`** - Medium size mode (default) for standard interfaces  
- **`lg`** - Large size mode for generous, accessibility-focused interfaces

### Implementation
- **Theme Group:** `component-size` in `$themes.json`
- **Location:** `/src/lib/themes/`
- **Current Scope:** Only certain components react to size modes currently
- **Future:** Can be expanded and renamed when more components support size modes

### Usage Context
Size modes enable consistent component scaling across different interface contexts:
- **Small (`sm`)**: Data-heavy interfaces, power user scenarios
- **Medium (`md`)**: General applications, balanced approach
- **Large (`lg`)**: Marketing sites, onboarding flows, accessibility requirements

**For detailed implementation, token examples, and component boundaries, see [Size Concept Documentation](../02-foundation/07-size-concept.md).**

---

## How Theme Switching Works

**Primary Mechanism:** User mode switching occurs at the S1 layer through file selection:
- **Light Theme:** Uses `s1-lightness/light.json` 
- **Dark Theme:** Uses `s1-lightness/dark.json`

**Reference Pattern:**
- Components consume `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index.*` tokens  
- S1 light/dark files provide different primitive references
- Result: User mode switching (light/dark) propagates through entire system

**For Designers:** User mode switching is managed through Token Studio's Token Sets or Figma's variable modes. The S1 semantic level files (light.json/dark.json) contain the actual theme variations.

**For Developers:** Build systems select appropriate S1 files based on user preference detection (e.g., `prefers-color-scheme`), automatically propagating changes through S3 to components.

**Theme Default Selection:** The first theme in a theme collection in Token Studio becomes the default theme in both Figma variables and generated code.

#### S1 Lightness Semantic Level

```
src/lib/themes/03_semantic/color/s1-lightness/
|-- light.json    # Light theme tokens
+-- dark.json     # Dark theme tokens
```

**Purpose:** System-wide light/dark theme switching. Theme switching occurs at this layer through file selection (light.json vs dark.json).

**Token Structure:** Semantic color tokens improved for theme switching:
- `bg_base` - Base background colors for different contexts
- `fg-default` - Default foreground colors
- `contrast_high`, `contrast_medium`, `contrast_low` - Various contrast levels for different semantic contexts

**Token Format:**
```json
{
  "ob": {
    "s": {
      "color": {
        "neutral": {
          "bg": {
            "contrast_highest": {
              "inversity_normal": {
                "value": "{ob.p.color.red.50.red.50.red.50}"
              },
              "inversity_flipped": {
                "value": "{ob.p.color.red.50.red.50.red.50.red.50}"
              }
            }
          }
        },
        "interaction": {
          "emphasis_high": {
            "bg_base": {
              "contrast_high": {
                "inversity_normal": {
                  "value": "{ob.p.color.red.50.red.50.red.50.50}"
                },
                "inversity_flipped": {
                  "value": "{ob.p.color.red.50.red.50.red.50}"
                }
              }
            }
          }
        }
      }
    }
  }
}
```


#### S2 Emphasis Semantic Level

```
src/lib/themes/03_semantic/color/s2-emphasis/
|-- high.json    # High emphasis states
+-- low.json     # Low emphasis states
```

**Purpose:** Provides emphasis variations for different visual contexts. This layer handles the contrast and intensity variations needed for different component states.

**Use Cases:**
- **High Emphasis:** Primary actions, important interactive elements
- **Low Emphasis:** Secondary actions, subtle interactive elements

**Token Structure:** References S1 lightness tokens directly:
```json
{
  "ob": {
    "s": {
      "color": {
        "interaction": {
          "state": {
            "fg": {
              "enabled": {
                "value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index}"
              },
              "hover": {
                "value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index}"
              }
            }
          }
        }
      }
    }
  }
}
```

#### S3 Semantic Compilation

```
src/lib/themes/03_semantic/color/s3-semantic/
+-- semantic.json  # Complete semantic color compilation
```

**Purpose:** Final compilation layer providing all semantic colors for component consumption. This is where all color meanings are resolved into their final contextual values.

**Use Cases:**
- Primary consumption point for components
- Complete semantic color definitions (status colors, interaction colors, etc.)
- Context-aware color resolution

**Token Structure:** Clean semantic compilation referencing S1 directly:
```json
{
  "ob": {
    "s": {
      "color": {
        "status": {
          "success": {
            "fg": {
              "value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index}"
            },
            "bg": {
              "value": "{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index}"
            }
          }
        }
      }
    }
  }
}
```

### Reference Chain Validation

The current reference pattern ensures proper theme inheritance:

**Current Reference Chains:**
1. **Components** → **S3 Semantic** → **S1 Lightness** → **Primitives**
2. **S2 Emphasis** → **S1 Lightness** → **Primitives**

**Key Changes:**
- Both S2 and S3 reference S1 **directly** (no cascading through layers)
- S3 provides complete semantic compilation for component consumption
- S1 handles all theme switching through light.json/dark.json files

**Validation Rules:**
- Components should primarily consume S3 semantic tokens
- S2 and S3 layers reference S1 lightness layer directly  
- S1 layer references primitives for actual color values
- Theme switching occurs at S1 layer file selection

**Exception:** Global tokens (`ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport.viewport.*`) can be referenced from any level in the hierarchy and are exempt from these chain rules. See [01_global-tokens.md](./01_global-tokens.md) for details.

### S1/S2/S3 Architecture Analysis

**Current Architecture:** The design token system uses a simplified S1/S2/S3 structure.

**Layer Distribution:**
- **S1 Lightness:** Theme-switching layer (light.json, dark.json)
- **S2 Emphasis:** Contextual emphasis variations (high.json, low.json)  
- **S3 Semantic:** Complete semantic compilation (semantic.json)

**Architectural Benefits:**

The current S1/S2/S3 architecture provides:

1. **Clear Separation of Concerns**
   - S1: User mode (light/dark user preferences)
   - S2: System mode (high/low emphasis contexts set by designers)
   - S3: Semantic compilation (final component-ready tokens)

2. **Simplified Reference Chain**
   - Direct references: S2→S1, S3→S1
   - No cascading hierarchy complexity
   - Single user mode switching point at S1 level

3. **Maintenance Efficiency**
   - User preference variants managed in dedicated S1 files
   - Designer-controlled emphasis contexts isolated in S2 layer
   - Complete semantic definitions in S3 compilation

**Reference improvement:**
- Components primarily consume S3 semantic tokens
- S1 provides efficient user mode switching without cascading updates
- S2 handles designer-controlled emphasis variations without duplicating base values

**Validation:** Use `node scripts-custom/validate-semantic-mirroring.js` to verify S1↔S2 structural consistency and identify redundant definitions.

### Folder Structure vs. Token References

**Important:** Changing folder structures does not necessarily break token references. Token resolution depends on the token paths and names, not the folder organization.

**What Breaks References:**
- Changing token paths (e.g., `{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index}` -> `{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index}`)
- Renaming tokens (e.g., `primary` -> `accent`)
- Removing tokens that are referenced elsewhere

**What Doesn't Break References:**
- Moving files between folders (as long as token paths remain the same)
- Reorganizing folder structure for better organization
- Renaming folders (token paths are independent of folder names)

**Theme Resolution ("Last Wins"):**

**For Developers:** When multiple JSON files define the same token path, the build process applies a "last wins" strategy. The file loaded last in the build order takes precedence. This allows for a cascading system similar to CSS specificity.

**For Designers:** In Tokens Studio, when multiple Token Sets are enabled and contain tokens with identical names, the Token Set positioned lowest in the list overrides the values from sets higher in the list.

**Example:**
```json
// File A (light.json): ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index = "blue"
// File B (dark.json): ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index = "red"  
// Result: If dark theme is active, token resolves to "red"
```

This behavior enables flexible theme switching and customization without requiring reference updates.
