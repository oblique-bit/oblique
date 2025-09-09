# Sandbox

A sandbox application build with Oblique. This application is used by the Oblique development team to check our features
in a real application. Since it covers every feature, it can be used to see Oblique in actions. The Oblique development
team uses it intensively to ensure the usability of our features.

As this application doesn't match our quality guidelines it shouldn't be used as an example to follow. It is also never
deployed.

See [README.md](../../README.md) for information about the other packages.

## Scripts

The scripts in this project are only for internal usage.

- **start**: starts the project without PAMS on port 3001
- **start-pams**: starts the project with PAMS on port 3000
- **lint**: lints the projects with EsLint, StyleLint and Prettier; Automatically run on the CI pipeline
- **format**: same as lint, but with autofix parameter
- **test**: run all tests and collects coverage
- **test-ci**: same as test, but an additional Sonar report is generated; Automatically run on the CI pipeline
- **build**: build the library; Automatically run on the CI pipeline
- **release**: create a new release, i.e. bump version number and updates the changelog

## PAMS

PAMS is the authentication system used by the application linked to [ePortal](https://www.eportal.admin.ch). For the
authentication to be possible, the `pams-proxy-library` project must be started prior to accessing the Sandbox. This
library, which is only available on premise, is necessary for local development.

## License

Copyright (c) The Swiss Confederation, represented by the Federal Office of Information Technology, Systems and Telecommunication FOITT.

Licensed under the [MIT](../../LICENSE) license.
