# Primitive Color Consumption

**Purpose:** Document which primitive color families the semantic layer already claims, and where to go for an application-specific color need.

---

## Primitive Color Status

Every primitive color family is claimed by the semantic layer. There is currently no unclaimed family available for a new fixed meaning.

| Color Scale | Claimed By | Semantic Path |
|---|---|---|
| **Basic** (white, transparent, federal_red) | Neutral, Brand | `ob.s.color.neutral.*`, `ob.s.color.brand.*` |
| **Cobalt** | Neutral, Free | `ob.s.color.neutral.*`, `ob.s.color.free.cobalt.*` |
| **Red** | Status Critical, Status Fatal | `ob.s.color.status.critical.*`, `ob.s.color.status.fatal.*` |
| **Orange** | Status Attention | `ob.s.color.status.attention.*` |
| **Green** | Status Resolved | `ob.s.color.status.resolved.*` |
| **Blue** | Status Info | `ob.s.color.status.info.*` |
| **Steelblue** | Interaction | `ob.s.color.interaction.*` |
| **Purple** | Interaction Focus Ring | `ob.s.color.interaction.focus_ring.*` |
| **Yellow** | Free | `ob.s.color.free.yellow.*` |
| **Teal** | Free | `ob.s.color.free.teal.*` |
| **Indigo** | Free, Interaction (visited) | `ob.s.color.free.indigo.*`, `ob.s.color.interaction.visited.fg.*` |
| **Pink** | Free | `ob.s.color.free.pink.*` |
| **Cobalt Alpha / White Alpha** | Transparency primitives | consumed directly where genuine transparency is needed |

## Need an application-specific color? Use `ob.s.color.free.*`

Since no primitive family is unclaimed, an application (or an extension of the design system) that needs a color with **no predefined semantic role** — for categorical distinction in tags, badges, or contextual accents — consumes the existing free tier instead of picking a primitive directly:

```
ob.s.color.free.{cobalt|yellow|teal|indigo|pink}.{bg|fg}.{contrast_low|contrast_medium|contrast_high|contrast_highest}.{inversity_normal|inversity_flipped}
```

**Guidelines:**
- **Never consume a primitive color directly** in a component or application — always go through the semantic layer, the same rule that applies to every other color family (see [Token Reference Pattern](../../02-token-tiers/04-component.md#token-reference-pattern)).
- `free` colors carry **no fixed meaning** — don't substitute them for status or interaction colors, and don't treat one `free` color as "the" color for a given concept across the whole system; each consuming context assigns its own meaning.
- If the 5 free colors don't cover a genuine new need, that's a decision for the token architecture, not something to work around by reaching into `ob.p.color.*` directly.

### Example: application-specific accent

```json
{
  "ob.c.{component}.color.bg.default": {
    "$value": "{ob.s.color.free.indigo.bg.contrast_medium.inversity_normal}",
    "$description": "Application-defined accent color — indigo has no fixed system meaning."
  }
}
```

---

## Related Documentation

- [Colors Overview](00-overview.md) - Decorative vs semantic usage guidelines
- [Semantic Colors](03-semantic.md) - Technical implementation details
- [Free Colors](08-semantic-free.md) - The `free` tier in full
