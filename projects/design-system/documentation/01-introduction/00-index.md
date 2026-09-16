# Oblique Design System - Introduction

**Oblique 16** | *Start here before Foundation and Design Tokens*

---

## What is the Oblique Design System?

The Oblique Design System is the design token system for Oblique 16: tokens and modes, defined once as JSON and generated into Figma variables and CSS. It defines the shared visual language (color, typography, dimension, motion), consumed from both Figma and code.

It is currently maintained separately from the rest of Oblique, and will integrate with it over time. This first version is for exploring the tokens and modes.

## What this release contains

- Design tokens for color, typography, dimension, and more (W3C DTCG compliant)
- Modes: lightness (light/dark), emphasis, UI scale, density, typography context, motion, viewport

## What this release does not contain yet

- No components, in the token JSON or in the Figma library. The Figma library currently holds variables and text/effect styles only; components are planned for 2027.

## How this relates to Oblique

"Oblique" without qualification usually means the existing Oblique component library, maintained separately from this Design System project and continuing unchanged in this release. The Oblique Design System is a new, parallel effort: it builds the token foundation that future components, Oblique's own or otherwise, can be built on.

---

## Where to go next

| Page | What it covers |
|---|---|
| [Glossary](./01-glossary.md) | Key terms: token, variable, mode, mode collection |
| [Design Tokens](../02-foundation/02-design-tokens/00-index.md) | The token system itself: tiers, categories, naming, modes |
| [Principles](../02-foundation/01-principles.md) | Relationship between the Design System's code and Figma design assets |
| [States](../02-foundation/03-states.md) | Structural overview of state categories used across components |
