# Icon Component Overview

## Component Introduction

The icon component family provides standardized icon sizing and positioning across the Oblique design system. It is the foundational layer for icon management, ensuring consistent sizing inheritance through variable mode tokens.

Three specialized variants handle distinct use cases: interactive components that scale with the design context, structurally stable components that require fixed sizes, and inline text contexts where the icon must match adjacent body text.

## Variants

### icon-component
Scales with the `ui_scale` variable mode set on an ancestor frame.

Use for icons inside interactive components — buttons, list items, inputs, navigation items. The icon inherits size automatically when a product designer sets the `ui_scale` mode on a parent frame.

**Token**: `ob.c.icon.component.size.*` (reacts to `ui_scale` mode)

### icon-static
Fixed size, does not react to any variable mode.

Use when building structurally stable components where size must remain constant regardless of design context — for example header, footer, persistent navigation. Set the `base-size` once during component construction.

**Token**: `ob.c.icon.static.size.*` (no mode reaction)

### inline-text
Matches the surrounding body text size. Scales with the `typography_context` variable mode.

Use exclusively for icons placed inline within body text — for example a small chevron at the end of a paragraph link. Do not use for icons inside interactive components; use `icon-component` for those.

**Token**: `ob.c.icon.inline_text.size.body` (reacts to `typography_context` mode)

## Two-Phase Sizing

Icon sizing follows a deliberate two-phase model:

**Phase 1 — base-size (build time)**  
The system maintainer selects `xs`, `sm`, `md`, or `lg` when constructing the component. This is a one-time, set-and-forget decision. It defines which size tier the icon occupies within the system.

| base-size | px   |
|-----------|------|
| xs        | 16   |
| sm        | 20   |
| md        | 24 (default) |
| lg        | 32   |

**Phase 2 — ui_scale mode (design time)**  
The product designer sets the `ui_scale` mode on a parent frame in Figma. All nested `icon-component` instances scale simultaneously — the icon inherits the mode, no per-icon overrides needed.

This separation means: system maintainers control tier proportion; product designers control contextual scaling.

## When to Use

- An interactive component (button, input, list item) requires an icon — use `icon-component`
- Building a structurally stable component (header, sidebar) — use `icon-static`
- Placing an icon inline within body text — use `inline-text`

## When Not to Use

- Do not place `inline-text` inside interactive components — it does not react to `ui_scale`
- Do not use raw icon assets without a wrapper — the wrapper provides the sizing token binding
- Do not set the `ui_scale` mode on the icon instance itself; set it on the parent frame so all children inherit it

## Accessibility

Icons must always carry a text alternative:
- Decorative icons: `aria-hidden="true"` (the surrounding label provides context)
- Standalone icons with meaning: `aria-label` describing the action or state

## Token Integration

This component uses design tokens for:
- {TOKEN_USAGE_1}
- {TOKEN_USAGE_2}
- {TOKEN_USAGE_3}

## Related Components

- **{RELATED_COMPONENT_1}** - {RELATIONSHIP_DESCRIPTION_1}
- **{RELATED_COMPONENT_2}** - {RELATIONSHIP_DESCRIPTION_2}

---

**Next Steps:**
- [Component Architecture](02-architecture.md) - Design decisions and structure
- [Implementation Guide](03-implementation.md) - Developer implementation details
- [Usage Guidelines](04-guidelines.md) - standard practices and patterns
