# Oblique

An Angular front-end framework tailored for Swiss-branded business web applications.

Oblique provides a standardized corporate design look and feel, along with a collection of ready-to-use Angular
components. Through its fully customizable master layout, Oblique manages the overall application structure,
allowing focus on the content.

@oblique/oblique is the original library that includes all tools, components, and utilities needed for frontend
development. Over time, it became too large and difficult to maintain, so its features are now being redistributed
into smaller, purpose-driven libraries.

All features in this library continue to be actively maintained and developed unless they are explicitly marked as
legacy.

See [README.md](../../README.md) for information about the other packages and projects in the Oblique ecosystem.

## Documentation

The official Oblique documentation, including this library, is located here: <https://oblique.bit.admin.ch/>

It includes information about the entire ecosystem, usage instructions, code samples, FAQs, and more.

## Getting Started

### New Projects

The recommended way to install `@oblique/oblique` is through Oblique's CLI.

```shell
npx @oblique/cli@latest new <projectName>
```

This command creates a new project with all necessary dependencies and configurations.

### Existing Projects

Add @oblique/oblique to a project with:

```shell
ng add @oblique/oblique@latest
```

It may be necessary to replace `latest` with the major version compatible with the current Angular version. Refer
to [Oblique life cycle](https://oblique.bit.admin.ch/introductions/life-cycle) for details.

This command triggers Oblique's Schematics, which will install all necessary dependencies and guide the configuration
of the framework.

## Content

This package includes:

- Angular UI components
- Guards, pipes, directives services and helper utilities
- icons
- Global styling rules
- Schematics for creating or updating projects
- Testing utilities
- Linting utilities

## Tips & Best Practices

- Install the Oblique library through the CLI
- Keep the application up to date by using the CLI regularly
- Minimize deviations from Oblique’s standards — each deviation increases the effort required for updates
- Migrate to replacement libraries as soon as Oblique provides a migration path to continue benefiting from the latest improvements

## Contributing

Contributions from federal teams and the open-source community are welcome.
Please refer to our [contributing guidelines](../../CONTRIBUTING.md) while contributing to the Oblique ecosystem.

## License

Copyright (c) The Swiss Confederation, represented by the Federal Office of Information Technology, Systems and Telecommunication (FOITT).

Licensed under the [MIT](../../LICENSE) license.
