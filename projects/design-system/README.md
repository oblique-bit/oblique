# Design System

> ⚠️ **Not Published Yet**  
> The source code is already public to support transparency and collaboration.  
> The library will be published to npm once the first stable version is ready.

Tailored for your Swiss branded business web application, the Oblique Design System provides a unified foundation for
building applications within the Oblique ecosystem. It enforces the federal corporate design, ensuring visual and
behavioral consistency, accessibility, and compliance across all federal web applications.

A strict 1:1 correspondence between code and Figma components is maintained: each Figma token translates directly into
a CSS variable. This ensures that designers and developers work with a shared source of truth — the same design
decisions, the same components, and the same behavior across all products. This guarantees a consistent look and feel
across all federal projects.

While the system follows the Federal Web Guidelines published by the Federal Chancellery, certain deviations are
necessary. The guidelines were primarily created for websites, whereas the Design System is tailored to the specific
needs of web applications.

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

All visual properties — including colors, typography, spacing, radii, and more — are defined as design tokens in Figma,
which serves as the single source of truth. These tokens are automatically exported and converted into CSS variables
during the build and release process, ensuring perfect synchronization between Figma, tokens, and code while
maintaining compliance with corporate design and federal web standards.

#### Token hierarchy

Figma defines three levels of tokens:

- **Primitive** - for internal use only
- **Semantic** - for internal and project use
- **Component** - for internal use only; used to build Oblique component

Some component tokens are used to style native HTML elements. In Figma, these are regular component tokens. However, because the codebase does not provide a dedicated component for every HTML element, these tokens require special handling in code.

While these HTML-related tokens are technically available to projects, they are considered implementation details and should not be reused.

| Figma Token | Value                                              | CSS variable                         | Defined in                      | Usable by projects |
| ----------- | -------------------------------------------------- | ------------------------------------ | ------------------------------- | ------------------ |
| Primitive   | Raw values (e.g., hex color codes, numeric values) | -                                    | -                               | No                 |
| Semantic    | Reference to a primitive token                     | Raw value                            | Global stylesheet               | Yes                |
| Component   | Reference to a semantic token                      | Reference to a semantic CSS variable | Individual component stylesheet | No                 |
| HTML        | Reference to a semantic token                      | Reference to a semantic CSS variable | Global stylesheet               | No                 |

#### Modes

Modes are a mechanism for conditionally changing the values of a collection of related tokens. A mode represents a
consistent and coherent design variant that reuses the same tokens. Modes are defined directly in Figma and can be
activated by switching them on, immediately adapting the look and feel of the affected components.

At the code level, modes are controlled through CSS classes and media queries. This means projects can gain support
for features such as dark mode in their custom components simply by using the relevant tokens, with no additional
implementation effort.

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
