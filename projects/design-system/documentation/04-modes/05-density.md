# Density Mode (Compact/Standard/Spacious)

**System-level mode controlling spacing and layout density across containers**

---

## **Overview**

Density mode controls the outer spacing and layout breathing room of containers, letting a product designer match interface density to the user's context. Compact density maximizes screen real estate for data-heavy workflows; spacious density gives focus-intensive tasks room to breathe. Standard density is the balanced default.

Unlike lightness, density is not typically offered as an end-user toggle — a product designer sets it per interface to match product needs. Products may still expose it as an application setting for specific use cases.

## **Implementation**

### **Mode Files**
- **`compact.json`** — reduced spacing, multiplier `0.75`
- **`standard.json`** — base spacing, multiplier `1.0` (default)
- **`spacious.json`** — increased spacing, multiplier `1.5`
- **`static.json`** — density-independent spacing that stays fixed regardless of the active mode

### **Token Architecture**
Located in: `03_semantic/dimension/density/`

**Structure Pattern:**
```json
{
  "ob": {
    "s": {
      "dimension": {
        "dynamic": {
          "density": {
            "md": {
              "px": {
                "$value": "roundTo({ob.p.dimension.px.8} * {ob.g.mode_collection.density.multiplier.dimension.compact}, 2) * 1px"    // compact.json  → 6px
                // "$value": "roundTo({ob.p.dimension.px.8} * {...standard}, 2) * 1px"                                                // standard.json → 8px
                // "$value": "roundTo({ob.p.dimension.px.8} * {...spacious}, 2) * 1px"                                                // spacious.json → 12px
              }
            }
          }
        }
      }
    }
  }
}
```

Each mode multiplies the same primitive base value by its mode multiplier, defined once in `01_global/mode_collection/density.json` as `ob.g.mode_collection.density.multiplier.dimension.{compact|standard|spacious}` (`0.75` / `1` / `1.5`). Some steps also carry a small whole-number corrector so no two modes ever land on the same value and results stay grid-friendly — standard mode is never corrected, it is always the pure base value.

### **Reference Chain**
```
Components → ob.s Dimension (Density) → ob.p Dimension Primitives
                                ↑
                     Mode multiplier applied here
```

### **For Developers**
Apply density by adding a class to a container: `.ob-density-compact` or `.ob-density-spacious`. Standard is the default — no class needed.

## **Scope & Distinction: Density vs Other Modes**

**Density controls:**
- Container-level spacing for data components and organisms — **tables**, **lists**, **forms**
- Outer spacing: section gaps, card gaps, component margins, layout breathing room
- Information efficiency — how much content fits on screen without compromising usability

**Density does not control:**
- Individual component dimensions or internal padding — that's **UI Scale** mode (`sm`/`md`/`lg`)
- Typography density — that's **Typography-Context** mode (`interface`/`prose`)

Density works independently alongside these modes; a compact container can sit inside an `lg` UI Scale context without conflict. See [Modes Interplay](08-interplay.md) for how the modes combine, device-responsive selection, and conflict resolution.

## **Usage Guidelines**

### **Compact**
**Use for:** administrative tools, dashboards, data tables — data-heavy interfaces and power-user workflows.
**Characteristics:** minimal breathing room, maximum information density.

### **Standard (Default)**
**Use for:** most web applications and standard interfaces — general-purpose products.
**Characteristics:** balanced approach between information density and comfort.

### **Spacious**
**Use for:** onboarding flows, marketing sites, accessibility-focused interfaces — focus-intensive tasks.
**Characteristics:** generous breathing room for clarity and ease of interaction.

## **Token Resolution**

Density tokens use a flat T-shirt scale (`xs` through `11xl`) rather than hierarchical categories — the same names apply across all three modes:

| T-Shirt | Compact | Standard | Spacious |
|---------|---------|----------|----------|
| xs | 2px / 0.125rem | 4px / 0.25rem | 8px / 0.5rem |
| sm | 4px / 0.25rem | 6px / 0.375rem | 8px / 0.5rem |
| md | 6px / 0.375rem | 8px / 0.5rem | 12px / 0.75rem |
| lg | 8px / 0.5rem | 10px / 0.625rem | 16px / 1rem |
| xl | 10px / 0.625rem | 12px / 0.75rem | 18px / 1.125rem |
| 2xl | 12px / 0.75rem | 16px / 1rem | 24px / 1.5rem |
| 3xl | 16px / 1rem | 20px / 1.25rem | 32px / 2rem |
| 4xl | 20px / 1.25rem | 24px / 1.5rem | 40px / 2.5rem |
| 5xl | 24px / 1.5rem | 28px / 1.75rem | 44px / 2.75rem |
| 6xl | 24px / 1.5rem | 32px / 2rem | 48px / 3rem |
| 7xl | 32px / 2rem | 36px / 2.25rem | 56px / 3.5rem |
| 8xl | 32px / 2rem | 40px / 2.5rem | 64px / 4rem |
| 9xl | 36px / 2.25rem | 48px / 3rem | 72px / 4.5rem |
| 10xl | 44px / 2.75rem | 56px / 3.5rem | 88px / 5.5rem |
| 11xl | 48px / 3rem | 64px / 4rem | 96px / 6rem |

### **Example Token Paths**
- `ob.s.dimension.dynamic.density.md.px` → `6px` (compact) / `8px` (standard) / `12px` (spacious)
- `ob.s.dimension.static.density.md.px` → `8px` always, regardless of the active density mode — use this family when spacing must stay fixed (e.g. a hairline gap that shouldn't compress or expand)

---

*Density mode gives product designers a single, system-wide lever for layout breathing room, kept independent of component sizing and typography so it can combine freely with UI Scale and Typography-Context.*
