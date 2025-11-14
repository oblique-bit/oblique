# Contributing to Sandbox-SSR

## <a name="commit"></a> Commit Message Guidelines

`docs`, `feat`, `fix`, `test`, and `refactor` commits affecting the Sandbox-SSR package must use the
**sandbox-ssr** package and one of the following scopes:

### <a name="scope"></a> Scope

| Scope   | Description                           |
| ------- | ------------------------------------- |
| **app** | For changes to the application itself |

## <a name="scripts"></a> Scripts

| Script        | Description                                                                                     |
| ------------- | ----------------------------------------------------------------------------------------------- |
| **start**     | Starts the project, with SSR, on port 3002                                                      |
| **start-ssr** | Starts the project, with SSR, but using dist as source, on port 3004                            |
| **lint**      | Lints the projects with EsLint, StyleLint and Prettier; Automatically run on the CI pipeline    |
| **format**    | Same as lint, but tries to fix the code with EsLInt/Prettier/StyleLint                          |
| **test**      | Runs all tests and collects coverage                                                            |
| **test-ci**   | Same as test, but an additional Sonar report is generated; Automatically run on the CI pipeline |
| **build**     | Builds the library; Automatically run on the CI pipeline                                        |
| **release**   | Creates a new release, i.e. bump version number and updates the changelog                       |
