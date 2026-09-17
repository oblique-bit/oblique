# Oblique Design System

**Oblique 16**

## What is the Oblique Design System?

Oblique 16 introduces the Oblique Design System for the first time, alongside
the existing Oblique library. Today, "Oblique Design System" means design
tokens and modes, defined once as JSON and generated into Figma variables
and CSS.

It is currently maintained separately from the rest of Oblique, and will
integrate with it over time. This first version is for exploring the tokens
and modes.

**What this release contains**
- Design tokens for color, typography, dimension, and more (W3C DTCG compliant)
- Modes: lightness (light/dark), emphasis, UI scale, density, typography
  context, motion, viewport

**What this release does not contain yet**
- No components, in the token JSON or in the Figma library. The Figma
  library currently holds variables and text/effect styles only; components
  are planned for 2027.

**How this relates to Oblique**

"Oblique" without qualification usually means the existing Oblique component
library, maintained separately from this Design System project and
continuing unchanged in this release. The Oblique Design System builds the
token foundation that future components, Oblique's own or otherwise, can be
built on.

---

## Introduction

- [Principles](01-introduction/00-principles.md) — relationship between the Design System's code and Figma design assets
- [Architecture](01-introduction/01-architecture.md) — token structure and layer system
- [Naming](01-introduction/02-naming.md) — naming conventions

## Token types

Sorted along two axes. **Tiers** say where a token sits in the reference
chain. **Categories** say what kind of value it holds, and cut across every
tier. For what the `$type` field means and how it maps to Figma/CSS, see the
[Types Overview](02-token-tiers/00-overview.md).

**Tiers**
- [Global Tokens](02-token-tiers/01-global.md)
- [Primitive Tokens](02-token-tiers/02-primitive.md)
- [Semantic Tokens](02-token-tiers/03-semantic.md) — S1/S2/ob.s
- [Component Tokens](02-token-tiers/04-component.md) — `ob.c.*` and `ob.h.*`

**Categories**
- [Colors](03-token-categories/colors/00-overview.md)
- [Dimension](03-token-categories/00-dimension.md)
- [Typography](03-token-categories/01-typography.md)
- [Motion](03-token-categories/02-motion.md)
- [Border](03-token-categories/03-border.md)
- [Shadow](03-token-categories/04-shadow.md)

## Modes

- [Modes Overview](04-modes/00-overview.md)
- [Lightness](04-modes/01-lightness.md)
- [Emphasis](04-modes/02-emphasis.md)
- [UI Scale](04-modes/03-ui-scale.md)
- [Typography Context](04-modes/04-typography-context.md)
- [Density](04-modes/05-density.md)
- [Viewport](04-modes/06-viewport.md)
- [Motion](04-modes/07-motion.md)
- [Interplay between modes](04-modes/08-interplay.md)

## Reference

- [Glossary](05-reference/00-glossary.md) — key terms: token, variable, mode, mode collection
- [Token Usage Guide](05-reference/01-token-usage-guide.md) — which token do I use
- [System Requirements](05-reference/02-system-requirements.md) — tooling priorities
- [Tokenization Process](05-reference/03-workflows-readme.md) — creating and assigning tokens
- [Token Description Guidelines](05-reference/04-token-description-guidelines.md)
- [Figma Variables — Limitations & Restrictions](05-reference/05-figma-variables-limitations.md)

---

## Validation

```bash
node scripts-custom/figma-doc-builders/validate-all.js
```
