# Contributing to Sandbox

## <a name="commit"></a> Commit Message Guidelines

`docs`, `feat`, `fix`, `test`, and `refactor` commits affecting the Sandbox package must use the
**sandbox** package and one of the following scopes:

### <a name="scope"></a> Scope

| Scope                  | Description                                         |
| ---------------------- | --------------------------------------------------- |
| **alert**              | For changes to the alert documentation              |
| **authentication**     | For changes to the authentication documentation     |
| **autocomplete**       | For changes to the autocomplete documentation       |
| **button**             | For changes to the button documentation             |
| **breadcrumb**         | For changes to the breadcrumb documentation         |
| **breakpoints**        | For changes to the breakpoints documentation        |
| **collapse**           | For changes to the collapse documentation           |
| **column-layout**      | For changes to the column-layout documentation      |
| **document-meta**      | For changes to the document-meta documentation      |
| **error-messages**     | For changes to the error-messages documentation     |
| **external-link**      | For changes to the external-link documentation      |
| **file-upload**        | For changes to the file-upload documentation        |
| **focus-invalid**      | For changes to the focus-invalid documentation      |
| **focus-with-outline** | For changes to the focus-with-outline documentation |
| **global-events**      | For changes to the global-events documentation      |
| **http-interceptor**   | For changes to the http-interceptor documentation   |
| **input-clear**        | For changes to the input-clear documentation        |
| **icon**               | For changes to the icon documentation               |
| **language**           | For changes to the language documentation           |
| **master-layout**      | For changes to the master-layout documentation      |
| **nav-tree**           | For changes to the nav-tree documentation           |
| **nested-form**        | For changes to the nested-form documentation        |
| **notification**       | For changes to the notification documentation       |
| **number-format**      | For changes to the number-format documentation      |
| **off-canvas**         | For changes to the off-canvas documentation         |
| **paginator**          | For changes to the paginator documentation          |
| **popover**            | For changes to the popover documentation            |
| **rxjs-operators**     | For changes to the rxjs-operators documentation     |
| **schema-validation**  | For changes to the schema-validation documentation  |
| **scrolling**          | For changes to the scrolling documentation          |
| **selectable**         | For changes to the selectable documentation         |
| **service-navigation** | For changes to the service-navigation documentation |
| **spinner**            | For changes to the spinner documentation            |
| **translate-params**   | For changes to the translate-params documentation   |
| **unknown-route**      | For changes to the unknown-route documentation      |
| **unsaved-changes**    | For changes to the unsaved-changes documentation    |
| **styles**             | For changes to the Oblique style documentation      |
| **app**                | For changes to the application itself               |
| **material**           | For changes to any of the Material pages            |

## <a name="scripts"></a> Scripts

| Script         | Description                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------------- |
| **start**      | Starts the project, without PAMS, on port 3001                                                  |
| **start-pams** | Starts the project, with PAMS, on port 3000                                                     |
| **lint**       | Lints the projects with EsLint, StyleLint and Prettier; Automatically run on the CI pipeline    |
| **format**     | Same as lint, but tries to fix the code with EsLInt/Prettier/StyleLint                          |
| **test**       | Runs all tests and collects coverage                                                            |
| **test-ci**    | Same as test, but an additional Sonar report is generated; Automatically run on the CI pipeline |
| **build**      | Builds the library; Automatically run on the CI pipeline                                        |
| **release**    | Creates a new release, i.e. bump version number and updates the changelog                       |
