# Component Tokens

**Purpose:** Define component token patterns and consumption guidelines

**Scope:** Component-specific token creation, naming patterns, hierarchical relationships, and standard practices.

---

## What Are Component Tokens?

Component tokens are the top level of the token hierarchy, providing component-specific styling definitions that reference `03_semantic` tokens. They describe **component-specific styling patterns**, not visual appearance.

**Component Token Purpose:**
- Define component-specific styling patterns
- Establish variant systems within components
- Provide component-level abstraction over `03_semantic` tokens
- Enable component-specific theming and customization
- Act as a shield to protect developers from changes when refactoring happens only on config, primitive, or `03_semantic` token level

**Current state:** No custom Oblique components (`ob.c.*`) ship token definitions in this release yet — components were pulled while they weren't ready. The tier and its conventions below are still the intended model; entries will be added here as components are built.

## Component Token Levels

The Oblique Design System uses **two distinct component token levels**:

### **`ob.c.*` — Custom Oblique Components**

Custom components built specifically for the Oblique Design System with unique styling patterns and behaviors. No component currently ships tokens at this level (see above).

```
ob.c.{component}.{category}.{property}.{variant}
│   │  │           │          │          │
│   │  │           │          │          └─ Component variant
│   │  │           │          └─ Visual property
│   │  │           └─ Token category
│   │  └─ Custom component identifier
│   └─ Custom component level
└─ Oblique namespace
```

### **`ob.h.*` — HTML Components and Elements**

Native HTML elements and components that require consistent styling across the design system. Currently shipping: `link`, `typography` (heading/body styles).

```
ob.h.{element}.{category}.{property}.{variant}
│   │  │         │          │          │
│   │  │         │          │          └─ Element variant
│   │  │         │          └─ Visual property
│   │  │         └─ Token category
│   │  └─ HTML element identifier
│   └─ HTML component level
└─ Oblique namespace
```

**Real example** (from `05_html/link/link.json`):
```json
{
  "ob.h.link.color.default": { "$value": "{ob.s.color.interaction.contrast_levels.fg.medium.inversity_normal}" },
  "ob.h.link.color.hover": { "$value": "{ob.s.color.interaction.contrast_levels.fg.low.inversity_normal}" },
  "ob.h.link.color.active": { "$value": "{ob.s.color.interaction.contrast_levels.fg.high.inversity_normal}" }
}
```

---

## Hierarchical Position

```
Component Tokens (ob.c.* / ob.h.*) → Semantic Tokens (ob.s.*) → S2 (ob.s2.*) → S1 (ob.s1.*) → Primitives (ob.p.*)
Note: Global tokens (ob.g.*) can be consumed by any level
```

## Naming Conventions

- **Custom components (`ob.c.*`)**: lowercase with underscores, e.g. `ob.c.{component}.*`
- **HTML elements (`ob.h.*`)**: standard HTML element names, e.g. `ob.h.link.*`, `ob.h.typography.*`
- Use singular form: `button` not `buttons`
- Variant names use `03_semantic` purpose (`primary`, `secondary`, `destructive`), not visual descriptions (`red`, `large`, `bold`)
- Property names use standard terms: `bg`, `fg`, `border`; group related properties under `color.*`, `spacing.*`, `typography.*`
- **Never use `default` as a variant name** — it overwrites the actual distinctive name and hides the specific variant. Use the real semantic name (e.g. `md`, `primary`) and mark the default in the token's `$description` instead.

## Token Reference Pattern

Component tokens consume the compiled semantic layer (`ob.s.*`) only — never S1, S2, or primitives directly.

```json
// DO: reference ob.s.* (compiled semantic tokens)
{
  "ob.h.link.color.hover": { "$value": "{ob.s.color.interaction.contrast_levels.fg.low.inversity_normal}" }
}

// DON'T: reference S1 or S2 directly
{
  "ob.h.link.color.hover": { "$value": "{ob.s2.color.interaction.contrast_levels.fg.low.inversity_normal}" }
}

// DON'T: reference primitives directly
{
  "ob.h.link.color.hover": { "$value": "{ob.p.color.cobalt.500}" }
}
```

**Validation checklist for a new component token:**
- [ ] No primitive consumption (`ob.p.*` referenced directly)
- [ ] No S1/S2 consumption (`ob.s1.*` / `ob.s2.*` referenced directly)
- [ ] Consistent naming, following the conventions above
- [ ] Works with emphasis and inversity theming (see below)
- [ ] `$description` documents the token's purpose and default status

## Interaction Colors: `contrast_levels`, `emphasis_none`, `visited`, `focus_ring`

When a component token needs an interaction color, it consumes one of four real segments in the semantic interaction color family — not a raw state name:

- **`contrast_levels`** — a visual-weight scale (`low` / `medium` / `high`) for `fg`, `bg`, and `border`, e.g. `ob.s.color.interaction.contrast_levels.fg.medium.inversity_normal`. This is what most interactive elements reference for their default/hover/active colors, as in the link example above.
- **`emphasis_none`** — a separate S1-tier interaction category (a peer of `emphasis_high` / `emphasis_low`) for elements that need hover/active feedback but must not follow the emphasis mode — cards, table rows, menu items, tags.
- **`visited`** — the visited-link color, kept as its own segment rather than a `contrast_levels` step.
- **`focus_ring`** — the focus-indicator color, kept as its own segment rather than a `contrast_levels` step.

None of the four is a synonym for another, and none is named after an interaction state (`enabled`/`hover`/`focus`/`active`/`disabled`) the way older drafts of this page did — check the real token files under `03_semantic/color/` before writing a new reference rather than assuming a state name maps directly to a path segment.

## Theming Support

Component tokens support theming through `03_semantic` token selection, without the component itself branching on mode:

```scss
// High emphasis (default) — component references emphasis_high semantic tokens
.ob-component {
  // ...
}

// Low emphasis context — the same component reference now resolves
// to emphasis_low semantic tokens, no component-level change needed
[data-emphasis="low"] .ob-component {
  // ...
}
```

## Inversity: Component-Level Contrast Inversion

`inversity_normal` / `inversity_flipped` provide component-level contrast inversion, similar to Material's `onSurface` pattern. Inversity is a designer's decision at the component level (does this component need to stand out against its surroundings?), not a user preference like light/dark switching.

```json
{
  "ob.c.{component}.color.bg.surface.inversity_normal": { "$value": "{ob.s.color.neutral.bg.contrast_lowest.inversity_normal}" },
  "ob.c.{component}.color.bg.surface.inversity_flipped": { "$value": "{ob.s.color.neutral.bg.contrast_lowest.inversity_flipped}" }
}
```

**Double inversion:** when a component that is inherently flipped by nature sits inside a container that is itself flipped, the nested component uses `inversity_normal` to cancel the double inversion and stay readable. Which components are "inherently flipped" is a per-component decision to be documented here once that component ships — not asserted in advance.

## When to Create a Component Token

**Create one when:**
- The component has styling patterns that differ from `03_semantic` defaults
- The component needs variant management (primary/secondary/tertiary)
- The component needs component-specific theming overrides
- The pattern will be reused across multiple instances

**Don't, when:**
- Direct `03_semantic` token consumption is sufficient
- No component-specific pattern exists
- It's a one-off implementation

## Migration and Maintenance

When migrating a component onto this token tier:

1. Audit the component's existing color/spacing/typography usage
2. Map each usage to the right `03_semantic` reference (see above)
3. Preserve visual consistency across the migration
4. Verify emphasis and inversity theming still resolve correctly
5. Document the new tokens' purpose in their `$description`

**Validation:** `node scripts-custom/figma-doc-builders/validate-all.js` runs the repo's cross-page token health check.

---

## Related Documentation

- [Architecture](../../02-architecture.md) — overall token hierarchy and patterns
- [Token Usage Guide](../../05-token-usage-guide.md) — which token to use, and how to consume it
- [Colors](../02-categories/01-color-tokens/00-colors-overview.md) — semantic color architecture, including `contrast_levels` and `emphasis_none`
