# Design System

> ⚠️ **Not Published Yet**  
> The source code is already public to support transparency and collaboration.  
> The library will be published to npm once the first stable version is ready.

Tailored for Swiss branded business web application, the Oblique Design System provides a unified foundation
for building applications within the Oblique ecosystem. It enforces the federal corporate design, ensuring
visual and behavioral consistency, accessibility, and compliance across all federal web applications.

A strict 1:1 correspondence between code and Figma components is maintained: each Figma token translates directly
into a CSS variable. This ensures that designers and developers work with a shared source of truth — the same design
decisions, the same components, and the same behavior across all products. This guarantees a consistent look and
feel across all federal projects.

While the system follows the Federal Web Guidelines published by the Federal Chancellery, certain
[deviations](https://oblique.bit.admin.ch/introductions/deviations-from-wgl) are necessary. The guidelines were
primarily created for websites, whereas the Design System is tailored to the specific needs of web applications.

This library is intended for projects that do not use Angular. For Angular projects, consider using
`@oblique/ng-design-system` instead.

See [README.md](../../README.md) for information about the other packages and projects in the Oblique ecosystem.

## Documentation

The official Oblique documentation, including the Design System, is located here: <https://oblique.bit.admin.ch/>

It includes information about the entire ecosystem, usage instructions, code samples, FAQs, and more.

## Getting Started

### New Projects

The recommended way to install `@oblique/design-system` is through Oblique's CLI.

```shell
npx @oblique/cli@latest new <projectName>
```

This command creates a new project with all necessary dependencies and configurations.

### Existing Projects

Add the Design System to a project with:

```shell
npm install @oblique/design-system --save
```

Embed `oblique-core.css` into the project to complete the setup.

## Content

This package includes:

- Web Components that match our Figma library
- Global styling rules
- CSS variables automatically generated from our Figma design tokens

### Design Tokens

All visual properties — including colors, typography, spacing, radii, and more — are defined as design tokens
in Figma, which serves as the single source of truth. These tokens are automatically exported and converted
into CSS variables during the build and release process, ensuring perfect synchronization between Figma, tokens,
and code while maintaining compliance with corporate design and federal web standards.

Design tokens enable automated updates across the design system, eliminating the need for developers to manually
transfer values from visual design to code, and ensuring consistent, seamless synchronization throughout the system.

#### Token hierarchy

Figma defines three levels of tokens:

- Primitive tokens — hold raw values (e.g., hex color codes, numeric values)
- Semantic tokens — reference primitive tokens and are intended for project use
- Component tokens — reference semantic tokens and are used internally by Oblique components

#### Modes

Tokens can vary across multiple modes:

- Lightness
  - `light`: default mode with a light background and dark text
  - `dark`: alternative mode with a dark background and light text
- Viewport
  - `desktop`: default mode for large viewports
  - `mobile`: alternative mode for smaller viewports
- Size
  - `medium`: default mode for standard applications
  - `small`: smaller components, suited for data-heavy interfaces
  - `large`: larger components, optimized for accessibility
- Typography context
  - `interface`: compact headings, suited for web applications
  - `prose`: larger headings, suited for websites
- Emphasis
  - `high`: default mode for primary actions and critical elements
  - `low`: less prominent mode for secondary or background elements
- Density
  - `standard`: default mode for general-purpose applications
  - `compact`: smaller margins, suited for dense data views
  - `spacious`: larger margins, suited for focus-intensive interfaces

#### Usage and availability

- Primitive tokens are for internal use only — no CSS variables are generated for them
- Semantic tokens are exposed as CSS variables and should be used by projects to build their own components
- Component tokens are used internally by Oblique components and are not exposed globally
- HTML tokens are a subset of Component tokens that are exposed as CSS variables. They are used to style HTML
  elements such as headings or paragraph

All modes are already embedded in the oblique stylesheet

- Default modes are always available
- Lightness and viewport modes are applied automatically using media queries.
- Other modes must be activated by applying the corresponding CSS class:

| Mode                      | Class                          |
| ------------------------- | ------------------------------ |
| size: small               | `.ob-size-small`               |
| size: large               | `.ob-size-large`               |
| typography-context: prose | `.ob-typography-context-prose` |
| density: compact          | `.ob-density-compact`          |
| density: spacious         | `.ob-density-spacious`         |

Each semantic and html token has a corresponding CSS variable with the same name in Oblique stylesheet. Since
component-level CSS variables reference semantic tokens, updating a semantic token automatically updates all
components that use it.

## Tips & Best Practices

- Install the Design System through the CLI
- Use Oblique CSS variables in applications for guaranteed consistency and compliance
- Avoid overriding Oblique CSS variables
- Create component CSS variables that reference Oblique's CSS variables

## Contributing

Contributions from federal teams and the open-source community are welcome.
Please refer to our [contributing guidelines](../../CONTRIBUTING.md) while contributing to the Oblique ecosystem.

## License

Copyright (c) The Swiss Confederation, represented by the Federal Office of Information Technology, Systems and Telecommunication (FOITT).

Licensed under the [MIT](../../LICENSE) license.
