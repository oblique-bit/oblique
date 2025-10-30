# Density Mode Implementation Plan

**Separate component-size from density modes using different multipliers**

**Status:** Planning phase  
**Strategy:** Use separate global multipliers for existing token groups

---

## **Current Problem**

Both component-size (`element.*`) and density groups (`spacing.*`, `container.*`, `layout.*`) use the same multiplier: `{ob.g.multiplier.dimension.md}`

**Result:** Cannot independently control component size vs layout density

## **Solution**

Create separate multipliers for component-size vs density groups:

**New Global Multipliers:**
```json
{
  "ob": {
    "g": {
      "multiplier": {
        "dimension": {
          "component_size": {
            "sm": 0.8, "md": 1.0, "lg": 1.25
          },
          "density": {
            "compact": 0.75, "standard": 1.0, "spacious": 1.5
          }
        }
      }
    }
  }
}
```

**Updated Token Usage:**
```json
// Component sizing - uses component_size multiplier
"element": {
  "md": { "px": "{ob.p.dimension.px.8} * {ob.g.multiplier.dimension.component_size.md}" }
}

// Layout density - uses density multiplier  
"spacing": {
  "md": { "px": "{ob.p.dimension.px.24} * {ob.g.multiplier.dimension.density.standard}" }
}
```

## **Mode Mapping**

| Group | Uses Multiplier | Purpose |
|---|---|---|
| `element.*` | `dimension.component_size` | Component internals (4-12px) |
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

**Result:** Independent control of component-size vs density without changing token structure.