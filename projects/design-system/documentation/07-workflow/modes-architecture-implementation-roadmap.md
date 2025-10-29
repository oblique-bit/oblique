# Modes Architecture Implementation Roadmap

**Date:** September 11, 2025  
**Status:** Conceptual Model Validated - Implementation & Testing Required  
**Context:** Multiplier-based architecture model identified as conceptually correct approach, pending practical implementation and validation

## **Warning:** Implementation Status Note

**Conceptual Validation:** **Success:** Complete  
**Practical Implementation:** **Process:** Required  
**Architecture Testing:** **Process:** Required

This document presents a **conceptually validated multiplier-based modes architecture** that addresses token explosion prevention and clean designer UX requirements. 

**CRITICAL: Multiplier system migration** - All tokens consuming `mult_responsive` need base value adjustment (multiply by 4) before switching to new proportional multipliers (1.0/1.25). 

The three-tier structure (static/, dynamic/, dynamic/multipliers/) provides the theoretical foundation needed for scalable modes implementation.

**Next Phase:** Transform this conceptual model into practical Tokens Studio implementation with complete testing across all defined component use cases.

## **Goal:** Strategic Objectives

**Primary Goal:** Establish complete modes architecture foundation with Phase 1 MVP implementation:
- **Big picture architecture** - Complete future vision with 11-dimensional modes system
- **Strategic roadmap** - Phased implementation strategy for systematic expansion  
- **Architecture foundation** - Extensible framework for all future mode types
- **Phase 1 MVP modes** - Essential foundation modes for immediate implementation

## **Note:** Core Design Requirements

### **CRITICAL: Mode Resolution at Semantic Level**
- **No calc() in component tokens** - All modes must be fully resolved before reaching component layer
- **Clean designer UX** - Component designers choose between static (`{ob.s.static.dimension.element.md}`) or dynamic (`{ob.s.dynamic.dimension.element.md}`) tokens, but don't need to understand specific mode calculations
- **Automatic resolution** - Semantic tokens auto-resolve to correct values based on active modes
- **Mode abstraction** - Component layer remains mode-agnostic, complexity handled at semantic level

### **CRITICAL: Token Explosion Prevention**
- **Mathematical scaling only** - Never repeat tokens when values can be multiplied
- **Token economy principle** - One base token + multipliers (NOT separate tokens per mode)
- **Implementation pattern** - Base values in main collections, multipliers in separate mode files
- **Example**: `dimension/static.json` (base values) + `dimension/sm.json` (0.8 multiplier) instead of separate sm/md/lg dimension tokens
- **Benefit**: Prevents exponential token growth while maintaining precise mathematical control

### **Designer Experience Goals**
- Component designers work with clean semantic references
- No need to understand mode calculations or multipliers
- Select desired semantic token → system handles mode resolution automatically
- Focus on design intent, not technical mode implementatione modes system architecture with phased implementation strategy

### **CRITICAL: Design System Maintainer Requirements**
- **Predictable semantic structure** - Design system maintainers must have usable, clear, predictable locations for semantic values when assigning to components in Figma
- **Token type organization** - All token types (sizing, typography, spacing, etc.) divided between `semantic/static/` and `semantic/dynamic/` based on designer decisions
- **Multiplier isolation** - Multipliers are isolated for heavy maintenance purposes only, defined as single multiplier values in individual JSON files
- **Token Studio resolution order** - Multipliers positioned in middle of vertical file structure to accommodate Tokens Studio's top-down calculation and resolution system
- **Clear maintenance boundaries** - Static values never change with modes, dynamic values are pre-calculated (base × active multiplier), multipliers are pure mathematical scaling factors

### **CRITICAL: File Numbering Convention for Processing Order**
- **Numbered folder structure** - Folders use two-digit prefixes (01-static/, 02-multipliers/, 03-dynamic/) to ensure Token Studio processes files in correct dependency order
- **Semantic file names** - Individual mode files within folders use clean names (sm.json, md.json, lg.json) since only one mode can be active at a time
- **Alphabetical sorting alignment** - File system alphabetical sorting must match logical token dependency flow for consistent behavior
- **Cross-platform compatibility** - Numbering convention works consistently across Token Studio, file systems, and Git repositories
- **Processing sequence enforcement** - Two-tier system: numbered folders for processing order + semantic file names for designer usability

### **CRITICAL: Mode File Structure Requirements**
- **Separate JSON files per mode** - Each mode (sm, md, lg, desktop, mobile, etc.) must be defined in its own individual JSON file
- **Mode isolation principle** - No mode-specific tokens within shared files to maintain clean separation of concerns
- **Token Studio compatibility** - Individual mode files enable proper theme switching and mode resolution
- **Maintenance boundaries** - Separate files allow independent mode updates without affecting other modes

## Current State Analysis

### **Success:** **Already Working Modes**
- **Lightness modes**: `light/dark` themes fully implemented and functional
- **Interaction-emphasis modes**: `low/standard/high` emphasis system operational  
- **Viewport modes**: Responsive multiplier system (`mult_responsive: 4px desktop, 5px mobile`)

### **Process:** **Partial Implementation Status**
- **Component size modes**: Mixed implementation patterns
  - `icon_holder`: **Success:** Full size-mode file structure (sm/md/lg + static.json)
  - `tag`: **Warning:** Size-aware tokens within single file (needs migration)
  - Other components: **Analysis:** Assessment needed

### **Requirements:** **Current Token Architecture Foundation**
```
**Success:** Working Foundation:
semantic/
├── dimension/static.json           # W3C DTCG compliant
├── spacing/desktop.json     # Responsive multipliers  
├── spacing/mobile.json      # Responsive multipliers
├── color/s1-lightness/      # Light/dark themes
├── color/s2-emphasis/       # Emphasis modes
└── color/s3-semantic/       # Compiled semantic layer

global/themes-user/
├── lightness/              # Light/dark switching
└── viewport/               # Responsive system (4px/5px)
```

### **Warning:** **Identified Gaps for MVP**
- Missing: Unified `semantic/modes/` architecture
- Missing: `component-size` theme configuration 
- Missing: Basic `viewport` mode simplification (desktop/mobile only)
- Inconsistent: Component size implementation patterns

## **Architecture:** Phased Architecture Structure

### **Phase 1: MVP Foundation** 
```
src/lib/themes/
├── global/                            (GLOBAL CONFIGURATION - ob.g.*)
│   └── 02-multipliers/                (PURE MULTIPLIER STORAGE - CALCULATION INPUTS)
│       ├── dimension/                 (component-size scaling)
│       │   ├── sm.json                ({ "multiplier": 0.8 })
│       │   ├── md.json                ({ "multiplier": 1.0 })
│       └── lg.json                ({ "multiplier": 1.2 })
│       ├── typography-context/        ✅ **IMPLEMENTED** (interface/prose contexts)
│       │   ├── interface.json         ({ "multiplier": 1.0 })
│       │   └── prose.json             ({ "multiplier": 1.125 })
│       ├── spacing/                   (component-size scaling)
│       │   ├── sm.json                ({ "multiplier": 0.8 })
│       │   ├── md.json                ({ "multiplier": 1.0 })
│       │   └── lg.json                ({ "multiplier": 1.2 })
│       └── viewport/                  (viewport scaling)
│           ├── desktop.json           ({ "multiplier": 1.0 })
│           └── mobile.json            ({ "multiplier": 1.25 })
└── semantic/
    ├── 01-static/                     (NON-MODE VALUES - ob.s.static.*)
    │   ├── dimension/static.json             (values that never change with modes)
    │   ├── typography-context.json   ✅ **IMPLEMENTED** (static font families, weights, etc.)
    │   └── [other categories].json   (all static semantic tokens)
    └── 03-dynamic/                    (MODE-AWARE VALUES - CALCULATION RESULTS - ob.s.dynamic.*)
        ├── dimension/static.json             (resolved values: base × active multiplier)
        ├── typography-context.json   ✅ **IMPLEMENTED** (resolved values: interface/prose contexts)
        ├── spacing.json               (resolved spacing values: base × viewport × component-size multipliers)
        └── [other categories].json   (all mode-aware semantic tokens)
```

### ### Note: Phase 2: Advanced System Modes**
```
src/lib/themes/
├── global/                            (GLOBAL CONFIGURATION - ob.g.*)
│   └── multipliers/                   (PURE MULTIPLIER STORAGE - CALCULATION INPUTS)
│       ├── dimension/                 (component-size scaling)
│       │   ├── sm.json                ({ "multiplier": 0.8 })
│       │   ├── md.json                ({ "multiplier": 1.0 })
│       │   └── lg.json                ({ "multiplier": 1.2 })
│       ├── typography/                (component-size scaling)
│       │   ├── sm.json                ({ "multiplier": 0.875 })
│       │   ├── md.json                ({ "multiplier": 1.0 })
│       │   └── lg.json                ({ "multiplier": 1.125 })
│       ├── spacing/                   (component-size scaling)
│       │   ├── sm.json                ({ "multiplier": 0.8 })
│       │   ├── md.json                ({ "multiplier": 1.0 })
│       │   └── lg.json                ({ "multiplier": 1.2 })
│       ├── viewport/                  (viewport scaling)
│       │   ├── desktop.json           ({ "multiplier": 1.0 })
│       │   └── mobile.json            ({ "multiplier": 1.25 })
│       └── density/                   (Phase 2 advanced modes)
│           ├── compact.json           ({ "multiplier": 0.8 })
│           ├── comfortable.json       ({ "multiplier": 1.0 })
│           └── spacious.json          ({ "multiplier": 1.2 })
└── semantic/
    ├── static/                        (NON-MODE VALUES - ob.s.static.*)
    │   ├── dimension/static.json             (values that never change with modes)
    │   ├── typography.json            (static font families, weights, etc.)
    │   └── [other categories].json   (all static semantic tokens)
    └── dynamic/                       (MODE-AWARE VALUES - CALCULATION RESULTS - ob.s.dynamic.*)
        ├── dimension/static.json             (resolved values: base × active multiplier)
        ├── typography.json            (resolved values: base × active multiplier)
        ├── spacing.json               (resolved spacing values: base × viewport × component-size multipliers)
        └── [other categories].json   (all mode-aware semantic tokens)
```

### ### Quick Start: Phase 3: User Preference & Accessibility Modes**
```
src/lib/themes/
├── global/                            (GLOBAL CONFIGURATION - ob.g.*)
│   └── multipliers/                   (PURE MULTIPLIER STORAGE - CALCULATION INPUTS)
│       ├── dimension/                 (component-size scaling)
│       │   ├── sm.json                ({ "multiplier": 0.8 })
│       │   ├── md.json                ({ "multiplier": 1.0 })
│       │   └── lg.json                ({ "multiplier": 1.2 })
│       ├── typography/                (component-size scaling)
│       │   ├── sm.json                ({ "multiplier": 0.875 })
│       │   ├── md.json                ({ "multiplier": 1.0 })
│       │   └── lg.json                ({ "multiplier": 1.125 })
│       ├── spacing/                   (component-size scaling)
│       │   ├── sm.json                ({ "multiplier": 0.8 })
│       │   ├── md.json                ({ "multiplier": 1.0 })
│       │   └── lg.json                ({ "multiplier": 1.2 })
│       ├── viewport/                  (viewport scaling)
│       │   ├── desktop.json           ({ "multiplier": 1.0 })
│       │   └── mobile.json            ({ "multiplier": 1.25 })
│       ├── density/                   (Phase 2 advanced modes)
│       │   ├── compact.json           ({ "multiplier": 0.8 })
│       │   ├── comfortable.json       ({ "multiplier": 1.0 })
│       │   └── spacious.json          ({ "multiplier": 1.2 })
│       ├── contrast/                  (Phase 3 accessibility modes)
│       │   ├── standard.json          ({ "multiplier": 1.0 })
│       │   └── high.json              ({ "multiplier": 1.1 })
│       ├── motion/                    (Phase 3 accessibility modes)
│       │   ├── enabled.json           ({ "multiplier": 1.0 })
│       │   ├── reduced.json           ({ "multiplier": 0.5 })
│       │   └── disabled.json          ({ "multiplier": 0.0 })
│       └── user-preferences/          (Phase 3 user-controlled modes)
│           ├── font-scale/
│           │   ├── A-.json            ({ "multiplier": 0.875 })
│           │   ├── A.json             ({ "multiplier": 1.0 })
│           │   └── A+.json            ({ "multiplier": 1.125 })
│           └── [other user modes]/
└── semantic/
    ├── static/                        (NON-MODE VALUES - ob.s.static.*)
    │   ├── dimension/static.json             (values that never change with modes)
    │   ├── typography.json            (static font families, weights, etc.)
    │   └── [other categories].json   (all static semantic tokens)
    └── dynamic/                       (MODE-AWARE VALUES - CALCULATION RESULTS - ob.s.dynamic.*)
        ├── dimension/static.json             (resolved values: base × active multiplier)
        ├── typography.json            (resolved values: base × active multiplier)
        ├── spacing.json               (resolved spacing values: base × viewport × component-size multipliers)
        └── [other categories].json   (all mode-aware semantic tokens)
```

##  Strategic Objectives

**Primary Goal:** Establish complete modes architecture foundation with Phase 1 MVP implementation:
- **Big picture architecture** - Complete future vision with 11-dimensional modes system
- **Strategic roadmap** - Phased implementation strategy for systematic expansion  
- **Architecture foundation** - Extensible framework for all future mode types
- **Phase 1 MVP modes** - Essential foundation modes for immediate implementation

## **Architecture:** Complete Future Architecture Vision

### Requirements: Full Modes Architecture Roadmap** *(All structures prepared, selective implementation)*

### **Phase 1: MVP Foundation Modes** ✅ *(Implementation Status)*
- **Lightness modes** - `light/dark` ✅ **DONE** (existing theme lightness switching)
- **Interaction-emphasis modes** - `low/high` ✅ **DONE** (existing component interaction states - 2 modes only!)  
- **Component Size modes** - `sm/md/lg` ✅ **DONE** (component dimension coordination complete)
- **Typography-context modes** - `interface/prose` ✅ **DONE** (moved from Phase 3 - early implementation)
- **Viewport modes (basic)** - `desktop/mobile` ⏳ **PLANNED** (simplified device distinction for MVP)

### **Phase 2: Advanced System Modes** *(Architecture Ready, Implementation Status)*
- **Density modes** - `compact/comfortable/spacious` 📋 **RESEARCHED** (see density research reports)
- **Typography-scale modes** - `A–/A/A+` 🆕 **PLANNED** (user font size preferences, separate from typography-context)
- **Viewport modes (full coverage)** - All device types + landscape/portrait + touch interaction patterns ⏳ **PLANNED**
- **Contrast modes** - `standard/high` ⏳ **PLANNED** (A11y color contrast enhancement)

### **Phase 3: User Preference & Accessibility Modes** *(Future Implementation)*
- **Motion modes** - `enabled/disabled/reduced` ⏳ **PLANNED** (animation accessibility controls)
- **Colorblind modes** - `standard/deuteranopia/protanopia/tritanopia/achromatopsia` ⏳ **PLANNED** (colorblind-friendly palettes)
- **Motion Preference modes** - User-controlled animation settings with system integration
- **Contrast Preference modes** - User-controlled contrast with system high-contrast support

### **Complete Multi-Dimensional Architecture**
```
Full Future System (All 11 Mode Types): 
lightness × interaction-emphasis × viewport × component-size × density × contrast × motion × typography × user-font-scale × user-motion-pref × user-contrast-pref × dyslexia-support
= 11-dimensional mode combinations
```

## **Quick Start:** MVP Implementation Scope

### **MVP Goal:** Prove modes architecture with essential foundation + targeted testing

### **MVP Modes Selection** *(Updated Implementation Status)*
- ✅ **Lightness modes**: `light/dark` (existing theme lightness switching) 
- ✅ **Interaction-emphasis modes**: `low/high` (existing component interaction states - 2 modes!)
- ✅ **Component Size modes**: `sm/md/lg` (completed component dimension coordination) 
- ✅ **Typography-context modes**: `interface/prose` (early implementation from Phase 3)
- **🆕 Viewport modes**: `desktop/mobile` (basic 2-breakpoint system for MVP)

**Current MVP Architecture**: `lightness × interaction-emphasis × component-size × typography-context × viewport` (5D system)

*Note: Density modes moved to Phase 2 - focus on size mode migration completion first*

### **MVP Component Testing Suite** *(Strategic Component Selection)*

#### ### Test: Test Case 1: Simple Component** - `icon_holder`
- **Purpose**: Baseline size mode behavior validation
- **Modes tested**: All size modes (sm/md/lg) 
- **Complexity**: Low (single dimension changes)

#### ### Test: Test Case 2: Interactive Component** - `button` 
- **Purpose**: Interactive states + size mode coordination
- **Modes tested**: All size modes + interaction-emphasis modes + lightness modes
- **Complexity**: Medium (multiple mode interactions)

#### ### Test: Test Case 3: Content Component** - `tag`
- **Purpose**: Text content + size mode relationships  
- **Modes tested**: All size modes + interaction-emphasis modes + basic viewport modes
- **Complexity**: Medium (content-responsive sizing + viewport coordination)

#### ### Test: Test Case 4: Status Component** - `infobox`
- **Purpose**: Semantic color modes + worst-case status scenarios
- **Modes tested**: All interaction-emphasis modes + lightness modes (all status colors)
- **Complexity**: High (color mode combinations + status semantics)

#### ### Test: Test Case 5: Composite Component** - `input text field`
- **Purpose**: Babuschka doll complexity (input + tag + remove button inside)
- **Modes tested**: All Phase 1 modes combined (lightness × interaction-emphasis × component-size × viewport)
- **Complexity**: High (nested component mode inheritance + worst-case scenario)

### **MVP Token Foundation** *(Complete Architecture, Selective Population)*

```
semantic/
├── modes/                    # 🆕 COMPLETE ARCHITECTURE PREPARED
│   ├── component-size/       # **Success:** MVP: Full implementation (sm/md/lg)
│   │   ├── sm.json
│   │   ├── md.json  
│   │   └── lg.json
│   ├── density/             # **Process:** STRUCTURE READY: Implementation deferred from MVP
│   │   ├── compact.json     # (architecture prepared, tokens placeholder)
│   │   ├── comfortable.json
│   │   └── spacious.json
│   └── _future-modes/       # **Architecture:** COMPLETE STRUCTURE PREPARED
│       ├── responsive/      # (folder structure + placeholder files)
│       ├── contrast/        
│       ├── motion/         
│       ├── typography/      
│       └── user-preferences/
```

```
global/themes-user/
├── lightness/              # **Success:** MVP: Existing (light/dark)
├── interaction-emphasis/   # **Success:** MVP: Existing (s2-emphasis modes: low/standard/high)
├── viewport/               # **Success:** MVP: Simplified (desktop/mobile only)
├── component-size/         # **Success:** MVP: Full implementation  
│   ├── sm.json
│   ├── md.json
│   └── lg.json
├── density/               # **Process:** STRUCTURE READY: Files created, implementation deferred
└── _future-modes/         # **Architecture:** COMPLETE STRUCTURE: All folders + placeholder files
```
**Implementation Phases:**
- **Phase 1 (MVP)**: 4 essential modes - `lightness × interaction-emphasis × viewport × component-size`
- **Phase 2**: Add advanced system modes - `+ density × contrast × motion + full viewport coverage`  
- **Phase 3**: Add user preference & accessibility modes - `+ typography × user-font-scale × user-motion-pref × user-contrast-pref × dyslexia-support`

*Complete architecture prepared from start, selective activation by phase*

#### **Success:** **Already Implemented - Icon Holder Component**
**Location:** `src/lib/themes/04_component/atom/icon_holder/`
```
├── sm.json    # Small variant
├── md.json    # Medium variant  
├── lg.json    # Large variant
└── static.json # Context-independent
```

**Current Structure:**
```json
{
  "ob": {
    "c": {
      "icon_holder": {
        "size": {
          "standard": { "$value": "{ob.p.size.250}" },
          "mini": { "$value": "{ob.p.size.175}" }
        }
      }
    }
  }
}
```

#### **Success:** **Partially Implemented - Tag Component**
**Location:** `src/lib/themes/04_component/molecule/tag.json`

**Current Pattern - Size-aware tokens within single file:**
```json
{
  "padding": {
    "vertical": {
      "sm": { "$value": "{ob.s.spacing.none}" },
      "md": { "$value": "{ob.s.spacing.xs}" },
      "lg": { "$value": "{ob.s.spacing.lg}" }
    },
    "horizontal": {
      "sm": { "$value": "{ob.s.spacing.md}" },
      "md": { "$value": "{ob.s.spacing.lg}" },
      "lg": { "$value": "{ob.s.spacing.2xl}" }
    }
  }
}
```

### Current Token Architecture

#### **Existing Semantic Structure:**
```
semantic/
├── dimension/static.json        # **Success:** W3C DTCG compliant dimension tokens
├── spacing/
│   ├── desktop.json     # **Success:** Responsive spacing with multipliers
│   └── mobile.json      # **Success:** Responsive spacing with multipliers
├── color/
│   ├── s1-lightness/    # **Success:** Theme mode implementation
│   ├── s2-emphasis/     # **Success:** Emphasis mode implementation
│   └── s3-semantic/     # **Success:** Compiled semantic layer
└── [other categories]
```

#### **Global Theme System:**
```
global/themes-user/
├── lightness/           # **Success:** Light/dark theme switching
│   ├── dark.json
│   └── light.json
└── viewport/           # **Success:** Responsive multiplier system
    ├── desktop.json    # mult_responsive: 4
    ├── mobile.json     # mult_responsive: 5
    └── static.json
```

## Modes Architecture Implementation Strategy

### Phase 1: Establish Universal Modes Architecture Foundation

#### **Create semantic/modes/ Architecture Framework**
```
semantic/
├── modes/               # 🆕 NEW: Universal modes system architecture
│   ├── component-size/  # 🆕 Component dimension modes
│   │   ├── sm.json     # Small size mode tokens
│   │   ├── md.json     # Medium size mode tokens (baseline)
│   │   └── lg.json     # Large size mode tokens
│   ├── density/        # 🆕 Spacing density modes
│   │   ├── compact.json    # Tighter spacing multipliers
│   │   ├── comfortable.json # Standard spacing (baseline)
│   │   └── spacious.json   # Looser spacing multipliers
│   ├── _future-modes/  # 🆕 Reserved space for modes requiring research
│   │   ├── responsive/ # Phase 2: Viewport-based scaling (framework enabled, implementation deferred)
│   │   ├── contrast/   # Phase 2: A11y high contrast modes (research required)
│   │   ├── motion/     # Phase 2: Animation preferences (enabled/disabled/reduced)
│   │   ├── typography/ # Phase 2: Font scaling, reading modes (research required)
│   │   └── user-preferences/ # Phase 3: User-controlled A11y modes (font scaling, motion, contrast, dyslexia support)
│   └── README.md       # 🆕 Modes architecture system documentation
```

**Key Modes Architecture Principles:**
- **Scalable**: Easy to add new mode categories
- **Consistent**: All modes follow the same token structure patterns
- **Semantic**: Mode tokens reference primitive/03_semantic tokens, not hardcoded values
- **Extensible**: Architecture supports future A11y, UX, and brand mode requirements

### Phase 2: Semantic Mode Token Definitions

#### **Component Size Modes (semantic/modes/04_component-size/)**

**sm.json** - Small component dimensions:
```json
{
  "ob": {
    "s": {
      "modes": {
        "component-size": {
          "button": {
            "height": { "$type": "dimension", "$value": "{ob.s.size.element.sm}" },
            "min-height": { "$type": "dimension", "$value": "{ob.s.size.element.sm}" }
          },
          "input": {
            "height": { "$type": "dimension", "$value": "{ob.s.size.element.sm}" }
          },
          "tag": {
            "padding-vertical": { "$type": "spacing", "$value": "{ob.s.spacing.none}" },
            "padding-horizontal": { "$type": "spacing", "$value": "{ob.s.spacing.md}" }
          }
        }
      }
    }
  }
}
```

**md.json** - Medium component dimensions (baseline):
```json
{
  "ob": {
    "s": {
      "modes": {
        "component-size": {
          "button": {
            "height": { "$type": "dimension", "$value": "{ob.s.size.element.md}" },
            "min-height": { "$type": "dimension", "$value": "{ob.s.size.element.md}" }
          },
          "input": {
            "height": { "$type": "dimension", "$value": "{ob.s.size.element.md}" }
          },
          "tag": {
            "padding-vertical": { "$type": "spacing", "$value": "{ob.s.spacing.xs}" },
            "padding-horizontal": { "$type": "spacing", "$value": "{ob.s.spacing.lg}" }
          }
        }
      }
    }
  }
}
```

#### **Density Modes (semantic/modes/density/)**

**comfortable.json** - Standard density (baseline):
```json
{
  "ob": {
    "s": {
      "modes": {
        "density": {
          "layout": {
            "stack-gap": { "$type": "spacing", "$value": "{ob.s.spacing.lg}" },
            "card-padding": { "$type": "spacing", "$value": "{ob.s.spacing.xl}" },
            "section-margin": { "$type": "spacing", "$value": "{ob.s.spacing.2xl}" }
          }
        }
      }
    }
  }
}
```

**compact.json** - Tighter density:
```json
{
  "ob": {
    "s": {
      "modes": {
        "density": {
          "layout": {
            "stack-gap": { "$type": "spacing", "$value": "{ob.s.spacing.md}" },
            "card-padding": { "$type": "spacing", "$value": "{ob.s.spacing.lg}" },
            "section-margin": { "$type": "spacing", "$value": "{ob.s.spacing.xl}" }
          }
        }
      }
    }
  }
}
```

### Phase 3: Universal Modes Architecture Theme Integration

#### **Add to global/themes-user/ - complete Modes Support**
```
global/themes-user/
├── lightness/          # **Success:** Existing: Light/dark theme modes
├── viewport/           # **Success:** Existing: Responsive scaling modes
├── component-size/     # 🆕 NEW: Size modes configuration (design system controlled)
│   ├── sm.json        # References semantic/modes/04_component-size/sm.json
│   ├── md.json        # References semantic/modes/04_component-size/md.json (default)
│   └── lg.json        # References semantic/modes/04_component-size/lg.json
├── density/           # 🆕 NEW: Density modes configuration (product designer controlled)
│   ├── compact.json   # References semantic/modes/density/compact.json
│   ├── comfortable.json # References semantic/modes/density/comfortable.json (default)
│   └── spacious.json  # References semantic/modes/density/spacious.json
└── _future-modes/     # 🆕 RESERVED: Modes architecture ready for expansion (Phase 2+)
    ├── responsive/    # Phase 2: Viewport-based scaling modes (framework ready, research needed)
    ├── contrast/      # Phase 2: A11y high contrast modes (research required)
    ├── motion/        # Phase 2: Animation preference modes (enabled/disabled/reduced)  
    ├── typography/    # Phase 2: Typography scaling modes (research required)
    └── user-preferences/ # Phase 3: User-controlled A11y modes (font scaling, motion prefs, contrast, dyslexia support)
```

**Multi-Dimensional Modes Architecture:**
- **Phase 1**: `lightness × viewport × component-size × density` (4D) - Full implementation
- **Phase 2**: `+ responsive × contrast × motion × typography` (8D) - Framework enabled, research required
- **Phase 3**: `+ user-preferences` (9D+) - User-controlled A11y modes (font scaling, motion, contrast, dyslexia support)
- **Future**: Additional modes as requirements emerge (nD)

### Phase 4: Component Migration

#### **Strategy A: Keep Current Icon Holder Pattern** **Success:** Recommended
**Rationale:** Already working, follows semantic boundaries

Current icon_holder structure → Continue using separate files
- `sm.json`, `md.json`, `lg.json` reference semantic modes
- Maintains component isolation
- Allows component-specific size boundaries

#### **Strategy B: Migrate Tag to Semantic References**
**Before (current):**
```json
{
  "padding": {
    "vertical": {
      "sm": { "$value": "{ob.s.spacing.none}" },
      "md": { "$value": "{ob.s.spacing.xs}" },
      "lg": { "$value": "{ob.s.spacing.lg}" }
    }
  }
}
```

**After (semantic reference):**
```json
{
  "padding": {
    "vertical": {
      "sm": { "$value": "{ob.s.modes.component-size.tag.padding-vertical}" },
      "md": { "$value": "{ob.s.modes.component-size.tag.padding-vertical}" },
      "lg": { "$value": "{ob.s.modes.component-size.tag.padding-vertical}" }
    }
  }
}
```

## Implementation Recommendations

### **Success:** **Preserve What Works**
- **Keep icon_holder file-based structure** - Already follows semantic boundaries
- **Keep responsive multiplier system** - `mult_responsive` in viewport themes works well
- **Keep existing 03_03_semantic/dimension/static.json** - W3C DTCG compliant and properly structured

### **Process:** **Migrate Gradually**

#### **Pre-Migration: System Cleanup** **Warning:**
1. **Create dedicated migration branch** - Work on `feature/size-modes-migration` to isolate changes from current development
2. **Create new Figma file for migration branch** - Duplicate current design system file and associate with the migration branch for design-dev sync
3. **Repair all broken token references** - Fix any invalid `{ob.*}` token references before introducing new semantic modes
4. **Validate existing token chains** - Ensure current semantic tokens properly resolve to primitive values
5. **Test current build process** - Confirm all existing components compile successfully
6. ### Warning: CRITICAL: Multiplier system audit** - Identify all tokens consuming `mult_responsive` (4px/5px grid-based) that need recalculation for new proportional system (1.0/1.25)

#### **Priority 1: Create Universal Modes Architecture Foundation**
1. Create `semantic/static/`, `semantic/dynamic/`, and `semantic/dynamic/multipliers/` folder structure
2. Define component-size modes multipliers (sm/md/lg) 
3. Define density modes multipliers (compact/comfortable/spacious)
4. Define viewport multipliers (desktop/mobile) to replace `{ob.s.space._base}` pattern
5. Reserve `_future-modes/` structure for planned architecture expansions

#### **Migration Tasks** *(Simplified Implementation)*
- **sizing.json** → Split content between `01-static/dimension/static.json` (non-mode values) and `03-dynamic/dimension/static.json` (mode-aware values)
- **spacing/desktop.json** → Move to `03-dynamic/spacing.json` with new proportional multipliers
- **spacing/mobile.json** → Move to `03-dynamic/spacing.json` with new proportional multipliers
- ### Success: Multiplier Migration Strategy:**
  - `mult_static` → **Eliminate** (becomes baseline 1.0, no multiplication needed)
  - `mult_responsive` → **Replace** with proportional system after base value adjustment
  - **Token Value Adjustment**: Multiply existing base values by 4 to maintain output
  - **New Multipliers**: Desktop 1.0, Mobile 1.25 (proportional scaling)
- **Update all references:**
  - From `{ob.s.sizing.*}` to `{ob.s.static.dimension.*}` or `{ob.s.dynamic.dimension.*}` as appropriate
  - From `{ob.s.spacing.*}` to `{ob.s.dynamic.spacing.*}` (since existing spacing is viewport-responsive)
  - From `{ob.g.scale.mult_responsive}` to `{ob.g.02-multipliers.viewport.*}` **WITH adjusted base values**
  - Remove `{ob.g.scale.mult_static}` references (no longer needed with 1.0 baseline)
  - Remove dependency on `{ob.s.space._base}` multipliers - replace with new multiplier system

#### **Priority 2: Component Integration with Modes Architecture**
1. Tag component → Reference semantic modes architecture
2. Add component boundaries (sm/md/lg limits per component)
3. Validate grid alignment with multiplier system

#### **Priority 3: Establish Multi-Dimensional Modes Architecture System**
1. Add component-size and density modes configuration (controlled by design system consumers/product designers)
2. Test multi-dimensional modes combinations (lightness × viewport × component-size × density)
3. Document modes interaction patterns and architecture extensibility
4. Validate scalability for future modes additions requiring research (responsive, contrast, motion, typography)

**Note**: Density modes are design system configurations set by product designers, not user preferences.

### **Warning:** **Key Considerations**

#### ### Success: Multiplier System Migration Strategy**
**Current System (Grid-Based Absolute)**:
- `mult_responsive`: Desktop = 4px, Mobile = 5px
- `mult_static`: 1 (effectively no multiplication)
- Tokens multiply by absolute pixel values

**New System (Proportional Relative)**:
- `02-multipliers/viewport`: Desktop = 1.0, Mobile = 1.25  
- Static multiplier eliminated (becomes baseline 1.0)
- Tokens multiply by proportional scaling factors

### Success: Straightforward Migration Process**:
1. **Token Value Conversion**: Multiply all existing base values by 4 (the current desktop multiplier)
2. **Multiplier Replacement**: Replace old grid multipliers with new proportional ones
3. **Static Multiplier Elimination**: Remove `mult_static` since 1.0 baseline needs no multiplication
4. **Result**: Same output values, cleaner proportional system

**Conversion Formula**:
```
Step 1: new-base-value = current-base-value × 4
Step 2: Desktop output = new-base-value × 1.0 = target value
Step 3: Mobile output = new-base-value × 1.25 = target responsive value
```

**Example**:
```
Current: 12px base × 4 (desktop) = 48px | × 5 (mobile) = 60px
New: 48px base × 1.0 (desktop) = 48px | × 1.25 (mobile) = 60px
**Success:** Identical output, proportional system
```

#### **Grid Alignment Validation**
- Ensure `mult_responsive` (4px desktop, 5px mobile) preserves 4px grid
- Test all mode combinations maintain proper alignment
- Validate that semantic mode tokens respect base grid

#### **Component Boundaries**
Based on competitive analysis findings, most design systems (75%) use independent component sizing:
```json
// Components define their supported size ranges
{
  "button": { "modes": ["sm", "md", "lg"] },       // Supports all modes
  "navigation": { "modes": ["md"] },               // Fixed medium only  
  "card": { "modes": ["md", "lg"] }               // Medium and large only
}
```
**Note**: This pattern is rare in industry - only 2/8 analyzed systems use component size coordination.

#### **Modes Architecture Theme Resolution Order - Extensible Framework**
Phase 1: `lightness × viewport × component-size × density` (4D - Full Implementation)  
Phase 2: `+ responsive × contrast × motion × typography` (8D - Framework enabled, research required)
Phase 3: `+ user-preferences` (9D+ - User-controlled A11y modes requiring wide research)
Future: Additional modes as requirements emerge (nD)

**Validation needed:** Test that "last wins" theme resolution scales with multi-dimensional modes architecture combinations.

## Implementation Checklist

### Phase 1: Universal Modes Architecture Foundation
- [ ] Create `semantic/modes/` folder structure with extensible modes architecture design
- [ ] Define component-size modes tokens (sm/md/lg) 
- [ ] Define density modes tokens (compact/comfortable/spacious)
- [ ] Reserve `_future-modes/` architecture for Phase 2 modes (responsive, contrast, motion, typography)
- [ ] Document modes architecture system in README.md with Phase 1/2 roadmap

### Phase 2: Multi-Dimensional Modes Theme Integration
- [ ] Add global theme files for size and density modes (Phase 1 implementation)
- [ ] Update `$themes.json` to support multi-dimensional modes architecture system
- [ ] Test modes configuration with existing lightness/viewport modes
- [ ] Validate theme resolution scales with nD modes combinations
- [ ] **Enable framework** for Phase 2 modes (responsive, contrast, motion, typography) without full implementation

### Phase 3: Component Migration & Modes Architecture Validation
- [ ] Migrate tag component to semantic modes architecture references
- [ ] Validate icon_holder compatibility with new modes architecture
- [ ] Test grid alignment across all current modes combinations
- [ ] Document component integration patterns for future modes

### Phase 4: Modes Architecture Validation & Future-Proofing
- [ ] Verify multiplier system maintains 4px grid alignment
- [ ] Test all current modes combinations function correctly
- [ ] Validate component boundaries prevent breaking points
- [ ] Document extensible patterns for future modes architecture categories  
- [ ] **Phase 2 Planning**: Research responsive modes, A11y high contrast, animation preferences, and typography scaling
- [ ] **Phase 3 Planning**: Research user preference modes (font scaling A+/A/A–, motion preferences, contrast settings, dyslexia-friendly typography)
- [ ] **Long-term Planning**: Define implementation roadmap for user-controlled accessibility modes

## Expected Benefits

### **For Designers**
- complete mode system for component size coordination *(Note: Based on research, only 25% of design systems implement size coordination)*
- **Extensible architecture** supporting future mode categories (contrast, motion, typography)
- Component size mode options (sm/md/lg) at the design system level

### **For Developers** 
- **Universal modes architecture** that scales beyond size and density
- Clear modes system patterns following W3C DTCG standards
- **Future-proof architecture foundation** for accessibility and UX modes requirements

### **For System**
- **Scalable tokens architecture** aligned with W3C DTCG standards
- Maintains existing responsive multiplier benefits  
- Preserves 4px grid alignment system
- **Extensible modes architecture foundation** ready for planned mode categories (contrast, motion, typography)
- **Multi-dimensional modes theme system** supporting complex product requirements

## **Goal:** MVP Success Criteria

### **Architecture Validation**
- [ ] Complete modes architecture structure prepared for all future phases
- [ ] 4D mode system working: `lightness × interaction-emphasis × viewport × component-size`
- [ ] Token resolution validates across all MVP mode combinations
- [ ] Theme switching works seamlessly between all MVP modes

### **Component Validation** 
- [ ] All 5 test components render correctly in all MVP mode combinations
- [ ] `infobox` shows all status colors work across lightness + interaction-emphasis modes
- [ ] `input text field` babuschka complexity handles nested component modes correctly
- [ ] Size mode coordination works across `icon_holder`, `button`, `tag` relationships

### **Technical Validation**
- [ ] Simplified viewport (desktop/mobile) maintains 4px grid alignment
- [ ] Build system processes all mode combinations without errors
- [ ] No broken token references across any MVP mode combination
- [ ] Documentation clearly shows MVP scope vs future architecture vision

## **Process:** Post-MVP Expansion Path

**Phase 2**: Add density modes to existing 4D system → 5D system  
**Phase 3**: Enable responsive, contrast, motion, typography → 9D system  
**Phase 4**: User preference modes → 12D system (complete)

*Complete architecture prepared from MVP, selective activation by phase*
