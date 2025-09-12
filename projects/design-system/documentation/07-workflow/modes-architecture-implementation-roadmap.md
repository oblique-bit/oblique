# Modes Architecture Implementation Roadmap

**Date:** September 11, 2025  
**Status:** Strategic Planning & Architecture Design  
**Context:** Establishing comprehensive modes system architecture with phased implementation strategy

## Current State Analysis

### ✅ **Already Working Modes**
- **Lightness modes**: `light/dark` themes fully implemented and functional
- **Interaction-emphasis modes**: `low/standard/high` emphasis system operational  
- **Viewport modes**: Responsive multiplier system (`mult_responsive: 4px desktop, 5px mobile`)

### 🔄 **Partial Implementation Status**
- **Component size modes**: Mixed implementation patterns
  - `icon_holder`: ✅ Full size-mode file structure (sm/md/lg + static.json)
  - `tag`: ⚠️ Size-aware tokens within single file (needs migration)
  - Other components: 🔍 Assessment needed

### 📋 **Current Token Architecture Foundation**
```
✅ Working Foundation:
semantic/
├── sizing.json              # W3C DTCG compliant
├── spacing/desktop.json     # Responsive multipliers  
├── spacing/mobile.json      # Responsive multipliers
├── color/s1-lightness/      # Light/dark themes
├── color/s2-emphasis/       # Emphasis modes
└── color/s3-semantic/       # Compiled semantic layer

global/themes-user/
├── lightness/              # Light/dark switching
└── viewport/               # Responsive system (4px/5px)
```

### ⚠️ **Identified Gaps for MVP**
- Missing: Unified `semantic/modes/` architecture
- Missing: `component-size` theme configuration 
- Missing: Basic `viewport` mode simplification (desktop/mobile only)
- Inconsistent: Component size implementation patterns

## 🏗️ Phased Architecture Structure

### **🎯 Phase 1: MVP Foundation** 
```
src/lib/themes/semantic/
├── sizing.json                    
├── spacing/                       
│   ├── desktop.json              
│   └── mobile.json               
└── modes/                        
    ├── component-size/           
    │   ├── sm.json              
    │   ├── md.json              
    │   └── lg.json              
    ├── density/                  
    │   ├── compact.json         
    │   ├── comfortable.json     
    │   └── spacious.json        
    └── sizing/                   
        └── static.json          
```

### **🔮 Phase 2: Advanced System Modes**
```
src/lib/themes/semantic/
├── sizing.json                    
├── spacing/                       
│   ├── desktop.json              
│   └── mobile.json               
└── modes/                        
    ├── component-size/           
    │   ├── sm.json              
    │   ├── md.json              
    │   └── lg.json              
    ├── density/                  
    │   ├── compact.json         
    │   ├── comfortable.json     
    │   └── spacious.json        
    ├── sizing/                   
    │   └── static.json
    ├── responsive/               
    └── contrast/                 
        ├── standard.json
        └── high.json
```

### **🚀 Phase 3: User Preference & Accessibility Modes**
```
src/lib/themes/semantic/
├── sizing.json                    
├── spacing/                       
│   ├── desktop.json              
│   └── mobile.json               
└── modes/                        
    ├── component-size/           
    │   ├── sm.json              
    │   ├── md.json              
    │   └── lg.json              
    ├── density/                  
    │   ├── compact.json         
    │   ├── comfortable.json     
    │   └── spacious.json        
    ├── sizing/                   
    │   └── static.json
    ├── responsive/               
    ├── contrast/                 
    │   ├── standard.json
    │   └── high.json
    ├── motion/                   
    │   ├── enabled.json
    │   ├── reduced.json
    │   └── disabled.json
    ├── typography/               
    │   ├── A-.json
    │   ├── A.json
    │   └── A+.json
    └── user-preferences/         
```

## � Strategic Objectives

**Primary Goal:** Establish comprehensive modes architecture foundation with Phase 1 MVP implementation:
- **Big picture architecture** - Complete future vision with 11-dimensional modes system
- **Strategic roadmap** - Phased implementation strategy for systematic expansion  
- **Architecture foundation** - Extensible framework for all future mode types
- **Phase 1 MVP modes** - Essential foundation modes for immediate implementation

## �🏗️ Complete Future Architecture Vision

**📋 Full Modes Architecture Roadmap** *(All structures prepared, selective implementation)*

### **Phase 1: MVP Foundation Modes** *(Primary Implementation Focus)*
- **Lightness modes** - `light/dark` ✅ (existing theme lightness switching)
- **Interaction-emphasis modes** - `low/standard/high` ✅ (existing component interaction states)  
- **Component Size modes** - `sm/md/lg` 🔄 (WIP migration - component dimension coordination)
- **Viewport modes (basic)** - `desktop/mobile` 🆕 (simplified device distinction for MVP)

### **Phase 2: Advanced System Modes** *(Architecture Ready, Implementation Deferred)*
- **Density modes** - `compact/comfortable/spacious` (layout spacing optimization)
- **Viewport modes (full coverage)** - All device types + landscape/portrait + touch interaction patterns
- **Contrast modes** - `standard/high` (A11y color contrast enhancement)

### **Phase 3: User Preference & Accessibility Modes**
- **Motion modes** - `enabled/disabled/reduced` (animation accessibility controls)
- **Typography modes** - `readable/standard/compact/A+/A/A–/dyslexia-friendly` (font weight, line height, letter spacing for readability + user preference typography scaling + dyslexia support)
- **Colorblind modes** - `standard/deuteranopia/protanopia/tritanopia/achromatopsia` (colorblind-friendly palettes for common color vision deficiencies)
- **Motion Preference modes** - User-controlled animation settings with system integration
- **Contrast Preference modes** - User-controlled contrast with system high-contrast support

### **Complete Multi-Dimensional Architecture**
```
Full Future System (All 11 Mode Types): 
lightness × interaction-emphasis × viewport × component-size × density × contrast × motion × typography × user-font-scale × user-motion-pref × user-contrast-pref × dyslexia-support
= 11-dimensional mode combinations
```

## 🚀 MVP Implementation Scope

**🎯 MVP Goal:** Prove modes architecture with essential foundation + targeted testing

### **MVP Modes Selection** *(Phase 1 Essential Implementation)*
- **✅ Lightness modes**: `light/dark` (existing theme lightness switching) 
- **✅ Interaction-emphasis modes**: `low/standard/high` (existing component interaction states)
- **🔄 Component Size modes**: `sm/md/lg` (WIP migration - component dimension coordination) 
- **🆕 Viewport modes**: `desktop/mobile` (basic 2-breakpoint system for MVP)

**MVP Architecture**: `lightness × interaction-emphasis × component-size × viewport` (4D system)

*Note: Density modes moved to Phase 2 - focus on size mode migration completion first*

### **MVP Component Testing Suite** *(Strategic Component Selection)*

#### **🧪 Test Case 1: Simple Component** - `icon_holder`
- **Purpose**: Baseline size mode behavior validation
- **Modes tested**: All size modes (sm/md/lg) 
- **Complexity**: Low (single dimension changes)

#### **🧪 Test Case 2: Interactive Component** - `button` 
- **Purpose**: Interactive states + size mode coordination
- **Modes tested**: All size modes + interaction-emphasis modes + lightness modes
- **Complexity**: Medium (multiple mode interactions)

#### **🧪 Test Case 3: Content Component** - `tag`
- **Purpose**: Text content + size mode relationships  
- **Modes tested**: All size modes + interaction-emphasis modes + basic viewport modes
- **Complexity**: Medium (content-responsive sizing + viewport coordination)

#### **🧪 Test Case 4: Status Component** - `infobox`
- **Purpose**: Semantic color modes + worst-case status scenarios
- **Modes tested**: All interaction-emphasis modes + lightness modes (all status colors)
- **Complexity**: High (color mode combinations + status semantics)

#### **🧪 Test Case 5: Composite Component** - `input text field`
- **Purpose**: Babuschka doll complexity (input + tag + remove button inside)
- **Modes tested**: All Phase 1 modes combined (lightness × interaction-emphasis × component-size × viewport)
- **Complexity**: Very High (nested component mode inheritance + worst-case scenario)

### **MVP Token Foundation** *(Complete Architecture, Selective Population)*

```
semantic/
├── modes/                    # 🆕 COMPLETE ARCHITECTURE PREPARED
│   ├── component-size/       # ✅ MVP: Full implementation (sm/md/lg)
│   │   ├── sm.json
│   │   ├── md.json  
│   │   └── lg.json
│   ├── density/             # 🔄 STRUCTURE READY: Implementation deferred from MVP
│   │   ├── compact.json     # (architecture prepared, tokens placeholder)
│   │   ├── comfortable.json
│   │   └── spacious.json
│   └── _future-modes/       # 🏗️ COMPLETE STRUCTURE PREPARED
│       ├── responsive/      # (folder structure + placeholder files)
│       ├── contrast/        
│       ├── motion/         
│       ├── typography/      
│       └── user-preferences/
```

```
global/themes-user/
├── lightness/              # ✅ MVP: Existing (light/dark)
├── interaction-emphasis/   # ✅ MVP: Existing (s2-emphasis modes: low/standard/high)
├── viewport/               # ✅ MVP: Simplified (desktop/mobile only)
├── component-size/         # ✅ MVP: Full implementation  
│   ├── sm.json
│   ├── md.json
│   └── lg.json
├── density/               # 🔄 STRUCTURE READY: Files created, implementation deferred
└── _future-modes/         # 🏗️ COMPLETE STRUCTURE: All folders + placeholder files
```
**🎯 Implementation Phases:**
- **Phase 1 (MVP)**: 4 essential modes - `lightness × interaction-emphasis × viewport × component-size`
- **Phase 2**: Add advanced system modes - `+ density × contrast × motion + full viewport coverage`  
- **Phase 3**: Add user preference & accessibility modes - `+ typography × user-font-scale × user-motion-pref × user-contrast-pref × dyslexia-support`

*Complete architecture prepared from start, selective activation by phase*

#### ✅ **Already Implemented - Icon Holder Component**
**Location:** `src/lib/themes/component/atom/icon_holder/`
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

#### ✅ **Partially Implemented - Tag Component**
**Location:** `src/lib/themes/component/molecule/tag.json`

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
├── sizing.json           # ✅ W3C DTCG compliant dimension tokens
├── spacing/
│   ├── desktop.json     # ✅ Responsive spacing with multipliers
│   └── mobile.json      # ✅ Responsive spacing with multipliers
├── color/
│   ├── s1-lightness/    # ✅ Theme mode implementation
│   ├── s2-emphasis/     # ✅ Emphasis mode implementation
│   └── s3-semantic/     # ✅ Compiled semantic layer
└── [other categories]
```

#### **Global Theme System:**
```
global/themes-user/
├── lightness/           # ✅ Light/dark theme switching
│   ├── dark.json
│   └── light.json
└── viewport/           # ✅ Responsive multiplier system
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
- **Semantic**: Mode tokens reference primitive/semantic tokens, not hardcoded values
- **Extensible**: Architecture supports future A11y, UX, and brand mode requirements

### Phase 2: Semantic Mode Token Definitions

#### **Component Size Modes (semantic/modes/component-size/)**

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

#### **Add to global/themes-user/ - Comprehensive Modes Support**
```
global/themes-user/
├── lightness/          # ✅ Existing: Light/dark theme modes
├── viewport/           # ✅ Existing: Responsive scaling modes
├── component-size/     # 🆕 NEW: Size modes configuration (design system controlled)
│   ├── sm.json        # References semantic/modes/component-size/sm.json
│   ├── md.json        # References semantic/modes/component-size/md.json (default)
│   └── lg.json        # References semantic/modes/component-size/lg.json
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

#### **Strategy A: Keep Current Icon Holder Pattern** ✅ Recommended
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

### ✅ **Preserve What Works**
- **Keep icon_holder file-based structure** - Already follows semantic boundaries
- **Keep responsive multiplier system** - `mult_responsive` in viewport themes works well
- **Keep existing semantic/sizing.json** - W3C DTCG compliant and properly structured

### 🔄 **Migrate Gradually**

#### **Pre-Migration: System Cleanup** ⚠️
1. **Create dedicated migration branch** - Work on `feature/size-modes-migration` to isolate changes from current development
2. **Create new Figma file for migration branch** - Duplicate current design system file and associate with the migration branch for design-dev sync
3. **Repair all broken token references** - Fix any invalid `{ob.*}` token references before introducing new semantic modes
4. **Validate existing token chains** - Ensure current semantic tokens properly resolve to primitive values
5. **Test current build process** - Confirm all existing components compile successfully

#### **Priority 1: Create Universal Modes Architecture Foundation**
1. Create `semantic/modes/` folder structure with extensible modes architecture
2. Define component-size modes tokens (sm/md/lg)
3. Define density modes tokens (compact/comfortable/spacious)
4. Reserve `_future-modes/` structure for planned architecture expansions

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

### ⚠️ **Key Considerations**

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
Phase 3: `+ user-preferences` (9D+ - User-controlled A11y modes requiring extensive research)
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
- Comprehensive mode system for component size coordination *(Note: Based on research, only 25% of design systems implement size coordination)*
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

## 🎯 MVP Success Criteria

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

## 🔄 Post-MVP Expansion Path

**Phase 2**: Add density modes to existing 4D system → 5D system  
**Phase 3**: Enable responsive, contrast, motion, typography → 9D system  
**Phase 4**: User preference modes → 12D system (complete)

*Complete architecture prepared from MVP, selective activation by phase*
