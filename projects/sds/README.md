# Swiss Design System (SDS)

This package is the documentation of Oblique that can be found on [https://oblique.bit.admin.ch](https://oblique.bit.admin.ch).

See [README.md](../../README.md) for information about the other packages.

## Data source

This application mainly displays data that are provided by our Headless CMS. This CMS is only editable by the Oblique
team, but everybody can read from it. This means that, even in development mode, data will be displayed.

## Scripts

The scripts in this project are only for internal usage.

- **start**: starts the project on port 4200
- **lint**: lints the projects with EsLint, StyleLint and Prettier; Automatically run on the CI pipeline
- **format**: same as lint, but with autofix parameter
- **test**: run all tests and collects coverage
- **test-ci**: same as test, but an additional Sonar report is generated; Automatically run on the CI pipeline
- **build**: build the library; Automatically run on the CI pipeline
- **add-code-example**: a schematics that can automatically add a new code example
- **add-preview**: a schematics that can automatically add a preview to an existing code example
- **release**: create a new release, i.e. bump version number and updates the changelog

## License

Copyright (c) The Swiss Confederation, represented by the Federal Office of Information Technology, Systems and Telecommunication FOITT.

Licensed under the [MIT](../../LICENSE) license.
