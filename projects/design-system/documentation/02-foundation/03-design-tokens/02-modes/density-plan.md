# Density Mode Implementation Plan

**Separate ui_scale from density modes using different multipliers**

**Status:** Planning phase  
**Strategy:** Use separate global multipliers for existing token groups

---

## **Current Problem**

Both ui_scale (`element.*`) and density groups (`spacing.*`, `container.*`, `layout.*`) use the same multiplier: `{ob.g.multiplier.dimension.md}`

**Result:** Cannot independently control ui_scale vs layout density

## **Solution**

Create separate multipliers for ui_scale vs density groups:

**New Global Multipliers:**
```json
{
  "ob": {
    "g": {
      "multiplier": {
        "dimension": {
          "ui_scale": {
            "sm": 0.8, "md": 1.0, "lg": 1.25
          },
          "density": {
            "compact": 0.8, "standard": 1.0, "spacious": 1.25
          }
        }
      }
    }
  }
}
```

**Updated Token Usage:**
```json
// Component sizing - uses ui_scale multiplier
"element": {
  "md": { "px": "{ob.p.dimension.px.8} * {ob.g.multiplier.dimension.ui_scale.md}" }
}

// Layout density - uses density multiplier  
"spacing": {
  "md": { "px": "{ob.p.dimension.px.24} * {ob.g.multiplier.dimension.density.standard}" }
}
```

## **Mode Mapping**

| Group | Uses Multiplier | Purpose |
|---|---|---|
| `element.*` | `dimension.ui_scale` | Component internals (4-12px) |
| `spacing.*` | `dimension.density` | Content gaps (16-32px) |
| `container.*` | `dimension.density` | Container padding (36-64px) |
| `layout.*` | `dimension.density` | Layout gaps (80-192px) |
| `macro.*` | `dimension.density` | Page spacing (256-320px) |
| `micro.*` | none | Static borders (1-3px) |

## **Implementation**

1. **Create new multipliers** in `/01_global/multipliers/`
2. **Update token references** to use appropriate multipliers
3. **Test mode combinations** in Figma
4. **Validate component behavior**

**Result:** Independent control of ui_scale vs density without changing token structure.