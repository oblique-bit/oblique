# Design System

An Angular front-end framework tailored for your swiss branded business web application.

Oblique provides a standardized corporate design look and feel as well as a collection of ready-to-use Angular components. Oblique, through its fully customizable master layout, takes care of the application's structure, letting you focus on the content.

This package is the `@oblique/design-system` library distributed on NPM.

See [README.md](../../README.md) for information about the other packages.

## Documentation

The official Oblique documentation is located here: <https://oblique.bit.admin.ch/>

You will find information about how to use Oblique, code samples, FAQ and many more.

## Scripts

- **lint**: lints the projects with EsLint, StyleLint and Prettier; Automatically run on the CI pipeline
- **format**: same as lint, but with autofix parameter
- **test**: run all tests and collects coverage
- **test-ci**: same as test, but an additional Sonar report is generated; Automatically run on the CI pipeline
- **build**: build the library; Automatically run on the CI pipeline
- **release**: create a new release, i.e. bump version number and updates the changelog
- **check:plural-references**: validates singular naming conventions across all token names, file names, and documentation (scripts-custom/)
- **check:token-syntax**: quick validation of token reference syntax and common issues (scripts-custom/)

## Custom Scripts

The `scripts-custom/` folder contains reusable design system maintenance and validation scripts useful for the entire team:

- **Validation**: `find-plural-references.py`, `quick-validate-token-syntax.py`, `validate-consumption-hierarchy.py`
- **Analysis**: `analyze-emphasis-structure.js`, `inspect-token-structure.js`, `detect-circular-token-references.js`  
- **Maintenance**: `remove-obsolete-files.js`, `remove-empty-files.sh`

See [scripts-custom/README.md](./scripts-custom/README.md) for detailed documentation and usage instructions.

## Design System Documentation

- **[Token Consumption Guidelines](./documentation/token-consumption-guidelines.md)** - Comprehensive rules for consuming tokens across all types
- **[Color Tokens](./documentation/color-tokens.md)** - Complete color token system documentation  
- **[Theming](./documentation/theming.md)** - Theme architecture and implementation
- **[Design Token Naming](./documentation/design-token-naming.md)** - Naming conventions and strategy
- **[Bugs & Issues](./documentation/bugs.md)** - Known issues and their solutions

## Usage

Install Oblique's Design System with

`npm install @oblique/design-system`

## Contribute to Oblique

If you'd like to contribute, please follow our [contributing guidelines](../../CONTRIBUTING.md).

## License

Copyright (c) The Swiss Confederation, represented by the Federal Office of Information Technology, Systems and Telecommunication FOITT.

Licensed under the [MIT](../../LICENSE) license.
