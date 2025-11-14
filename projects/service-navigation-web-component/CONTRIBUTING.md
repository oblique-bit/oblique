S# Contributing to Service Navigation Web Component

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for details about how to contribute.

## <a name="commit"></a> Commit Message Guidelines

`docs`, `feat`, `fix`, `test`, and `refactor` commits affecting the Service Navigation Web Component package
must use the **service-navigation** package and one of the following scopes:

### <a name="scope"></a> Scope

| Scope             | Description                             |
| ----------------- | --------------------------------------- |
| **web-component** | For changes to the web component itself |
| **sample**        | For changes in `index.html`             |

## <a name="scripts"></a> Scripts

| Script          | Description                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------- |
| **start**       | Starts the project on port 3003                                                                 |
| **lint**        | Lints the projects with EsLint, StyleLint and Prettier; Automatically run on the CI pipeline    |
| **format**      | Same as lint, but tries to fix the code with EsLInt/Prettier/StyleLint                          |
| **test**        | Runs all tests and collects coverage                                                            |
| **test-ci**     | Same as test, but an additional Sonar report is generated; Automatically run on the CI pipeline |
| **build**       | Builds the library; Automatically run on the CI pipeline                                        |
| **release**     | Creates a new release, i.e. bump version number and updates the changelog                       |
| **npm-publish** | Publishes the package on NPM; automatically run on the CI pipeline                              |
