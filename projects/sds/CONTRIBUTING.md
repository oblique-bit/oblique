# Contributing to Swiss Design System (SDS)

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for details about how to contribute.

## <a name="commit"></a> Commit Message Guidelines

`docs`, `feat`, `fix`, `test`, and `refactor` commits affecting the Toolchain package must use the
**sds** package and one of the following scopes:

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
| **material**           | For changes to the material documentation           |
| **banner**             | For changes to the banner documentation             |
| **cms**                | For changes to the ASDF documentation               |
| **code-examples**      | For changes to the code-examples                    |
| **feedback**           | For changes to the feedback feature                 |
| **schematics**         | For changes to the SDS schematics                   |
| **side-navigation**    | For changes to the side-navigation component        |
| **styles**             | For changes to the SDS styles                       |
| **tabbed-page**        | For changes to the tabbed-page component            |
| **text-page**          | For changes to the text-page component              |
| **component-page**     | For changes to the component-page component         |
| **invalid-page**       | For changes to the invalid-page component           |

## <a name="scripts"></a> Scripts

| Script               | Description                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| **start**            | Starts the project on port 4200                                                                 |
| **lint**             | Lints the projects with EsLint, StyleLint and Prettier; Automatically run on the CI pipeline    |
| **format**           | Same as lint, but tries to fix the code with EsLInt/Prettier/StyleLint                          |
| **test**             | Runs all tests and collects coverage                                                            |
| **test-ci**          | Same as test, but an additional Sonar report is generated; Automatically run on the CI pipeline |
| **build**            | Builds the library; Automatically run on the CI pipeline                                        |
| **add-code-example** | A schematics that can automatically add a new code example                                      |
| **add-preview**      | A schematics that can automatically add a preview to an existing code example                   |
| **schematics-build** | Builds the Schematics                                                                           |
| **release**          | Creates a new release, i.e. bump version number and updates the changelog                       |
