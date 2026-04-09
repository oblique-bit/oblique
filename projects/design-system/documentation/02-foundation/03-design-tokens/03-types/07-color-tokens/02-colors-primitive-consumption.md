# Primitive Color Consumption

**Purpose:** Validate which primitive colors are available for application-specific semantic extensions.

---

## Primitive Color Status

| Color Scale | Semantic Usage | Used In | Aura Protection | Status | Available Shades |
|------------|----------------|---------|----------------|--------|------------------|
| **Basic** | Neutral (Light) | ob.s3.neutral.* | None - lacks color attributes | ✅ Available | All (white, transparent, etc.) |
| **Red** | Status Critical (Reserved) | ob.s3.status.critical.* | Multiple shades used | ❌ Reserved | None |
| **Cobalt** | Neutral (Dark) | ob.s3.neutral.* | All shades (50-900) | ❌ Reserved | None |
| **Orange** | Status Attention (Reserved) | ob.s3.status.attention.* | Multiple shades used | ❌ Reserved | None |
| **Yellow** | Status Attention (Reserved) | ob.s3.status.attention.* | Multiple shades used | ❌ Reserved | None |
| **Green** | Status Resolved (Reserved) | ob.s3.status.resolved.* | Multiple shades used | ❌ Reserved | None |
| **Steelblue** | Interaction | ob.s3.interaction.* | Shades 100-800 | ❌ Reserved | None |
| **Teal** | Status Confirmed (Flexible) | ob.s3.status.confirmed.* | Shades 50, 100, 200, 600, 700, 800, 900 | ⚠️ Limited | Unused shades available |
| **Indigo** | Status Progress (Flexible) | ob.s3.status.progress.* | Shades 50, 100, 200, 600, 700, 800, 900 | ⚠️ Limited | Unused shades available |
| **Purple** | Status Waiting + Focus Ring (Reserved) | ob.s3.status.waiting.*, ob.s3.interaction.focus_ring.* | Shades 50, 100, 200, 400, 500, 600, 700, 800, 900 | ❌ Reserved | Very limited availability |
| **Pink** | None | - | None | ✅ Available | All shades (50-900) |
| **Blue** | Brand, Status Info (Reserved) | ob.s3.brand.*, ob.s3.status.info.* | All shades (50-900) | ❌ Reserved | None |

## Available for Application-Specific Semantic Roles

**Use Cases:**
- **Ticketing Systems**: Additional priority levels, custom workflow states
- **Project Management**: Application-specific status categories beyond core 4 reserved statuses  
- **Content Management**: Custom content states, review processes
- **Domain-Specific Applications**: Industry-specific semantic meanings

**Available Color Scales**

| Color | Token Path | Hex Value | Semantic Use Cases | Notes |
|-------|------------|-----------|-------------------|-------|
| **Basic** (All values) | | | | **Fully available - lack color attributes** |
| Basic-white | `ob.p.color.basic.white` | #ffffff | Backgrounds, overlays | No color conflict risk |
| Basic-transparent | `ob.p.color.basic.transparent` | transparent | Overlays, spacers | No color conflict risk |
| **Pink** (All shades) | | | | **Fully available for new semantic roles** |
| Pink-50 | `ob.p.color.pink.50` | #fdf2f8 | Custom status backgrounds | |
| Teal-20 | `ob.p.color.teal.20` | #ccfbf1 | Light accents |
| Teal-30 | `ob.p.color.teal.30` | #99f6e4 | Decorative elements |
| Teal-40 | `ob.p.color.teal.40` | #5eead4 | Medium accents |
| Teal-50 | `ob.p.color.teal.50` | #2dd4bf | Balanced base |
| Teal-60 | `ob.p.color.teal.60` | #14b8a6 | **Recommended base** |
| Teal-70 | `ob.p.color.teal.70` | #0f766e | Dark accents |
| Teal-80 | `ob.p.color.teal.80` | #115e59 | High contrast |
| Teal-90 | `ob.p.color.teal.90` | #134e4a | Darkest accent |
| Pink-10 | `ob.p.color.pink.10` | #fdf2f8 | Subtle backgrounds |
| Pink-20 | `ob.p.color.pink.20` | #fce7f3 | Light accents |
| Pink-30 | `ob.p.color.pink.30` | #fbcfe8 | Decorative elements |
| Pink-40 | `ob.p.color.pink.40` | #f9a8d4 | Medium accents |
| Pink-50 | `ob.p.color.pink.50` | #f472b6 | Balanced base |
| Pink-60 | `ob.p.color.pink.60` | #ec4899 | **Recommended base** |
| Pink-70 | `ob.p.color.pink.70` | #db2777 | Dark accents |
| Pink-80 | `ob.p.color.pink.80` | #be185d | High contrast |
| Pink-90 | `ob.p.color.pink.90` | #9d174d | High contrast status indicators | |
| **Teal** (Limited) | | | | **Some shades reserved for "confirmed" status** |
| Teal-300 | `ob.p.color.teal.300` | #5eead4 | Available for custom semantics | Not used by system |
| Teal-400 | `ob.p.color.teal.400` | #2dd4bf | Available for custom semantics | Not used by system |
| Teal-500 | `ob.p.color.teal.500` | #14b8a6 | Available for custom semantics | Not used by system |
| **Indigo** (Limited) | | | | **Some shades reserved for "progress" status** |
| Indigo-300 | `ob.p.color.indigo.300` | #a5b4fc | Available for custom semantics | Not used by system |
| Indigo-400 | `ob.p.color.indigo.400` | #818cf8 | Available for custom semantics | Not used by system |
| Indigo-500 | `ob.p.color.indigo.500` | #6366f1 | Available for custom semantics | Not used by system |
| **Purple** (Not Recommended) | | | | **Reserved for waiting status + focus rings** |
| Purple-300 | `ob.p.color.purple.300` | #c4b5fd | ⚠️ Within focus ring aura | Close to accessibility colors |

**Guidelines**: 
- **Basic**: Fully available - lack hue/saturation attributes that create semantic conflicts (white, transparent, etc.)
- **Pink**: Fully available for new application-specific semantic roles (all shades 50-900)
- **Teal/Indigo**: Limited availability - only unused shades (300, 400, 500 recommended)
- **Purple**: Not recommended - heavily used for accessibility (focus rings) and status meaning
- **Purpose**: Create meaningful semantic extensions, not decorative usage
- **Requirement**: New colors must have clear semantic meaning in application context
- **Restriction**: Never conflict with core status meanings (info, resolved, critical, attention) or accessibility features

**Color Attribute Theory**: Colors with strong hue and saturation create visual associations with semantic meanings. Basic colors (white, transparent) lack these attributes and therefore don't risk semantic confusion.

**Color Shade Explanation:**
- Each color has 9 shades: 50 (lightest), 100, 200, 300, 400, 500, 600, 700, 800, 900 (darkest)
- System uses specific shades for semantic meanings (e.g., teal-50, teal-100, teal-600 for "confirmed")
- Unused shades (like teal-300, teal-400, teal-500) are available for application-specific semantics

**⚠️ Known Issue - Purple Color Conflict:**
**Issue**: Status.waiting currently reuses purple-400/500 which are reserved for accessibility focus rings
**Impact**: Creates governance conflict between accessibility (focus) and status (waiting) semantics
**Status**: Documented for future resolution - do not change yet
**Implication**: Purple scale should be considered fully reserved until this conflict is resolved

## Extending the Semantic System

**Proper Usage Examples:**

**Ticketing System Extensions:**
```css
/* Application-specific semantic roles using available colors */
.status-escalated { color: ob.p.color.pink.600; }
.priority-urgent { background: ob.p.color.purple.100; }
.tier-premium { border-color: ob.p.color.indigo.200; }
```

**Content Management Extensions:**
```css
/* Editorial workflow states */
.content-draft { background: ob.p.color.teal.100; }
.content-review { background: ob.p.color.indigo.100; }
.content-archived { background: ob.p.color.purple.100; }
```

**Project Management Extensions:**
```css
/* Custom project states beyond core 4 statuses */
.milestone-reached { color: ob.p.color.pink.700; }
.phase-blocked { background: ob.p.color.purple.50; }
.sprint-active { border-color: ob.p.color.teal.300; }
```

**Key Principles:**
1. **Semantic Meaning Required**: Each color usage must communicate specific application logic
2. **Consistent Within Application**: Maintain color-meaning relationships across the app
3. **Avoid Core Status Conflicts**: Don't create meanings similar to reserved statuses
4. **Document Application Semantics**: Maintain clear documentation of custom color meanings

---

## Related Documentation

- [Primitive Colors](colors-primitive.md) - Foundation color values and Stage classification
- [Color Overview](colors-overview.md) - Decorative vs semantic usage guidelines
- [Semantic Color Architecture](colors-03_semantic.md) - Technical implementation details

---

*Last updated: October 29, 2025 - Initial creation with current primitive consumption status*