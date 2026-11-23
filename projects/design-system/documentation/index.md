# Oblique Next Design System

**Oblique 16**

## What is the Oblique Next Design System?

This repository hosts the groundwork for the Oblique Next Design System. It is meant for exploration and information only, not for production. To design products, please use the latest Oblique library.

Oblique Next Design System is the upcoming design system for applications of the Swiss Confederation, owned and operated by BIT / Oblique. It is built on design tokens: named values for design decisions such as color, typography, spacing and motion. Defined once and shared by Figma and code, they form a single source of truth instead of scattered, hand-typed numbers.

This removes ambiguity and a whole class of inconsistency errors. Design tokens are also a prerequisite for working with AI: rather than guessing at colors, spacing or type sizes, AI tools work with the exact values we have defined.

In Figma, the design tokens are set up as variables. Modes let the same layout adapt to different contexts, for example light and dark mode or different viewport sizes.

Oblique Next Design System is in active development, while the current Oblique library remains in use. Step by step, the design system will be integrated and will eventually replace the current library.

### Background

Oblique's CSS variables have grown over time, expanding to meet each project's needs. This makes it harder to keep an overview as the system keeps growing, and to build further on top of it. In addition, they did not match the Figma variables, so design and code could drift apart.

There are also growing demands from several sides:

- **End users:** expect an adaptable, accessible UI, with modes such as light/dark, high contrast, and reduced motion, conforming to WCAG 2.1 AA
- **Product designers:** expect a more reliable, consistent, and well-documented library of pre-made design decisions
- **System designers:** expect a clear source of truth and a standardized design-to-code workflow
- **Developers:** expect a predictable structure and clear rationale behind values, to build without guesswork
- **Management:** expects faster delivery, less time tied up in support, and consistent quality
- **Design tooling:** expects support for variables and modes, following Figma's own shift toward them

### Benefits of Design Tokens

Design tokens answer these demands directly.

- A scalable design tokens structure, enriched with context, forming a shared language and bridge between designers, developers, design tools (Figma), and AI tools
- DTCG-compliant tokens, compatible with Tokens Studio (the industry-standard token management platform) and exportable to Figma and CSS
- Shortens the design-to-code path and speeds up contribution and further development
- Replaces hardcoded values with semantically named tokens, lowering the risk of human error
- Accumulates development cost savings across all federal applications over time
- Lowers the barrier for product designers to contribute directly to the Design System
- Modes make accessibility needs easier to meet, for example high contrast or reduced motion

### What this Design System release contains
- Design tokens as JSON files for color, typography, dimension, and more
- Modes: lightness (light/dark), emphasis, UI scale, typography context, density, viewport, motion
- Figma library with token-based variables, styles and variable modes
- Token-based CSS

### What this Design System release does not contain yet
- No components, in the token JSON or in the Figma library. It currently holds variables and text/effect styles only; components will be added in 2027.

### Release artifacts
- **Markdown documentation** — the token documentation, in git: link pending
- **Token JSON** — the token source files, in git: link pending
- **CSS** — built by the system developer from the released tokens: link pending
- **Figma library** — the new token-based library (variables and styles, no components): link pending

### How this relates to Oblique

"Oblique" without qualification usually means the existing Oblique component library, maintained separately from this Design System project and continuing unchanged in this release. The Oblique Next Design System provides the token foundation that future components, Oblique's own or otherwise, can build on.

---

## Core Concepts

- [Principles](01-introduction/00-principles.md) — relationship between the Design System's code and Figma design assets
- [Architecture](01-introduction/01-architecture.md) — token structure and layer system
- [Naming](01-introduction/02-naming.md) — naming conventions

## Token types

Sorted along two axes. **Tiers** define where a token sits in the reference chain. **Categories** define what kind of value it holds and cut across every tier. For what the `$type` field means and how it maps to Figma/CSS, see the [Types Overview](02-token-tiers/00-overview.md).

### Tiers
- [Global Tokens](02-token-tiers/01-global.md) — `ob.g.*`
- [Primitive Tokens](02-token-tiers/02-primitive.md) — `ob.p.*`
- [Semantic Tokens](02-token-tiers/03-semantic.md) — S1/S2/`ob.s.*`
- [Component Tokens](02-token-tiers/04-component.md) — `ob.c.*` and `ob.h.*`

### Categories
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

