# Carbon Design System Sizing Strategy Research - Key Takeaways

**Research Date:** September 2025  
**Context:** Validation for Oblique density and size concept

## Key Findings

Carbon's v11 migration introduced **"sizing as a mode"** - a contextual approach that validates Oblique's density/size dual system concept.

### Carbon's Core Innovation

**🎯 Contextual Inheritance**
- Components inherit sizing context from parent containers
- Size flows through interface hierarchy automatically
- Eliminates manual size coordination across components

**📏 Component Boundaries**
- Each component defines its supported size range
- Components fallback to nearest boundary when context exceeds limits
- Maintainer governance prevents visual/functional breaking points

**🔄 Layer-Based Architecture**
- Global size context applied at container level
- Individual components respect predetermined boundaries
- Unified theme approach reduces decision fatigue

## Direct Validation of Oblique Concepts

| Oblique Concept | Carbon v11 Implementation |
|----------------|---------------------------|
| Size Context Providers/Consumers | Layer token inheritance |
| Component size boundaries | Component-specific token limits |
| Global size context | Layer-based sizing modes |
| Coordinated combinations | Unified theme approach |

## Oblique's Competitive Advantage

**🚀 Beyond Carbon's Single-Layer Approach:**
- **Dual-system separation**: Outer spacing (density) vs inner component sizing (size)
- **More granular control** while maintaining contextual inheritance benefits
- **Explicit density system** for layout breathing room control

## Implementation Pattern

**Before v11 (scattered):**
```scss
$button-height-small: 32px;
$input-height-small: 32px;
// Manual coordination required
```

**After v11 (contextual):**
```scss
.form-section[data-size="lg"] {
  --size-context: lg;
}
.button { height: var(--component-button-height-var(--size-context)); }
.input { height: var(--component-input-height-var(--size-context)); }
// Automatic coordination
```

## Key Takeaways for Oblique

**✅ Validated Approaches:**
- Contextual inheritance reduces cognitive load
- Component boundaries prevent breaking points
- Unified sizing modes improve consistency
- Token consolidation enhances developer experience

**🎯 Implementation Recommendations:**
- Adopt Carbon's component boundary patterns
- Enhance with Oblique's density + size separation
- Implement graceful fallbacks for unsupported contexts
- Use maintainer governance for component size limits

**💡 Strategic Insight:**
Carbon's success validates that **sizing is a contextual mode**, not individual properties. Oblique's dual-system approach (density + size) provides even more precise control while maintaining these proven benefits.

---
*Detailed technical analysis available in `_private/competitive-analysis/`*
