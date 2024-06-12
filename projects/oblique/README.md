# Oblique

An Angular front-end framework tailored for your swiss branded business web application.

Oblique provides a standardized corporate design look and feel as well as a collection of ready-to-use Angular components. Oblique, through its fully customizable master layout, takes care of the application's structure, letting you focus on the content.

This package is the `@oblique/oblique` library distributed on NPM.

See [README.md](../../README.md) for information about the other packages.

## Documentation

The official Oblique documentation is located here: <https://oblique.bit.admin.ch/>

You will find information about how to use Oblique, code samples, FAQ and many more.

## Scripts

- **lint**: lints the projects with EsLint, StyleLint and Prettier; Automatically run on the CI pipeline
- **format**: same as lint, but with autofix parameter
- **test**: run all tests and collects coverage
- **test-ci**: same as test, but an additional Sonar report is generated; Automatically run on the CI pipeline
- **test-debugging**: same as test, but with extra debugging options
- **build**: build the library; Automatically run on the CI pipeline
- **release**: create a new release, i.e. bump version number and updates the changelog
- **update-icons**: create icon sets and icons as CSS files, should be called whenever there is a change to any icon SVG

## Usage

### Embedding Oblique into your project

1. Update your project to the Angular version supported by the Oblique version you want to install. Have a look at the Angular update guide for more instructions: <https://update.angular.io>
2. Add Oblique to your project: `ng add @oblique/oblique`. This interactive command will:
   - add oblique and its dependencies
   - refactor your application to integrate Oblique
   - optionally replace jasmine with jest
   - optionally configure Sonar
   - optionally configure Jenkins & Cloud Foundry
   - optionally replace `tslint` with `eslint` and `prettier`
   - optionally add a git hook to auto format files before push

### Checking for updates

- Bump dependencies through Angular cli first: `ng update`
- Then update oblique: `ng update @oblique/oblique`
- Finally, update the dependencies without build-in schematics: `npm update`
- New major versions can be discovered through `npm outdated`

## Contribute to Oblique

If you'd like to contribute, please follow our [contributing guidelines](../../CONTRIBUTING.md).

## License

Copyright (c) The Swiss Confederation, represented by the Federal Office of Information Technology, Systems and Telecommunication FOITT.

Licensed under the [MIT](../../LICENSE) license.
