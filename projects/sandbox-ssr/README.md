# Sandbox

An application with SSR and standalone activated. It is used by the Oblique development team to check our features
in a real application. Since it covers every feature, it can be used to see Oblique in actions. The Oblique development
team uses it intensively to ensure the usability and compatibility of our features.

As `@oblique/oblique` package is not compatible with SSR, this application doesn't use the Master Layout yet. All newly
build components will be documented there to ensure their compatibility with both SSR and standalone components.

See [README.md](../../README.md) for information about the other packages.

## Scripts

- **start**: starts the project, with SSR, on port 3002
- **start-ssr**: starts the project, with SSR, but using dist as source, on port 3004
- **lint**: lints the projects with EsLint, StyleLint and Prettier; Automatically run on the CI pipeline
- **format**: same as lint, but with autofix parameter
- **test**: run all tests and collects coverage
- **test-ci**: same as test, but an additional Sonar report is generated; Automatically run on the CI pipeline
- **build**: build the library; Automatically run on the CI pipeline
- **release**: create a new release, i.e. bump version number and updates the changelog

## License

Copyright (c) The Swiss Confederation, represented by the Federal Office of Information Technology, Systems and Telecommunication FOITT.

Licensed under the [MIT](../../LICENSE) license.
