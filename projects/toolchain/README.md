# Toolchain

The Oblique Toolchain is a technical utility package that provides tools for maintaining and configuring Oblique-based projects.

This package is the `@oblique/toolchain` library distributed on NPM.

See [README.md](../../README.md) for information about the other packages in the Oblique workspace.

## Documentation

The official Oblique documentation is available here: [https://oblique.bit.admin.ch/](https://oblique.bit.admin.ch/)

It contains guidelines on how to use Oblique libraries, code examples, accessibility standards, and development practices.

## Scripts

- **build**: builds the toolchain package; automatically run on the CI pipeline
- **lint**: lints the project with EsLint and Prettier; Automatically run on the CI pipeline
- **format**: same as lint, but with autofix parameter
- **test**: executes all tests and collects code coverage
- **test-ci**: same as test, but also generates SonarQube reports for CI
- **release**: create a new release, i.e. bump version number and updates the changelog

## Contribute to Oblique Toolchain

If you'd like to contribute, please follow our [contributing guidelines](../../CONTRIBUTING.md).

## How to test locally

1. Install the tarball of the oblique-toolchain into a test-project
2. Run npm i oblique-toolchain-13.2.2.tgz

```bash
npm run build -w @oblique/toolchain && npx @angular-devkit/schematics-cli ./dist/toolchain/:ng-add
```

## License

Copyright (c) The Swiss Confederation,
represented by the Federal Office of Information Technology, Systems and Telecommunication (FOITT).

Licensed under the [MIT](../../LICENSE) license.
