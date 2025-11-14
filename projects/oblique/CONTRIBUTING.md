# Contributing to Oblique

## <a name="commit"></a> Commit Message Guidelines

`docs`, `feat`, `fix`, `test`, and `refactor` commits affecting the Service Navigation Web Component package
must use the **service-navigation** package and one of the following scopes:

### <a name="scope"></a> Scope

| Scope                       | Description                                                               |
| --------------------------- | ------------------------------------------------------------------------- |
| **alert**                   | For changes to the alert feature                                          |
| **accessibility-statement** | For changes to the accessibility-statement feature                        |
| **authentication**          | For changes to the authentication feature                                 |
| **autocomplete**            | For changes to the autocomplete feature                                   |
| **button**                  | For changes to the button feature                                         |
| **breadcrumb**              | For changes to the breadcrumb feature                                     |
| **breakpoints**             | For changes to the breakpoints feature                                    |
| **collapse**                | For changes to the collapse feature                                       |
| **column-layout**           | For changes to the column-layout feature                                  |
| **document-meta**           | For changes to the document-meta feature                                  |
| **error-messages**          | For changes to the error-messages feature                                 |
| **external-link**           | For changes to the external-link feature                                  |
| **file-upload**             | For changes to the file-upload feature                                    |
| **focus-invalid**           | For changes to the focus-invalid feature                                  |
| **focus-with-outline**      | For changes to the focus-with-outline feature                             |
| **global-events**           | For changes to the global-events feature                                  |
| **http-interceptor**        | For changes to the http-interceptor feature                               |
| **input-clear**             | For changes to the input-clear feature                                    |
| **icon**                    | For changes to the icon feature                                           |
| **language**                | For changes to the language feature                                       |
| **master-layout**           | For changes to the master-layout feature                                  |
| **nav-tree**                | For changes to the nav-tree feature                                       |
| **nested-form**             | For changes to the nested-form feature                                    |
| **notification**            | For changes to the notification feature                                   |
| **number-format**           | For changes to the number-format feature                                  |
| **off-canvas**              | For changes to the off-canvas feature                                     |
| **paginator**               | For changes to the paginator feature                                      |
| **popover**                 | For changes to the popover feature                                        |
| **router**                  | For changes to the router feature                                         |
| **rxjs-operators**          | For changes to the rxjs-operators feature                                 |
| **schema-validation**       | For changes to the schema-validation feature                              |
| **scrolling**               | For changes to the scrolling feature                                      |
| **selectable**              | For changes to the selectable feature                                     |
| **service-navigation**      | For changes to the service-navigation feature                             |
| **spinner**                 | For changes to the spinner feature                                        |
| **translate-params**        | For changes to the translate-params feature                               |
| **unknown-route**           | For changes to the unknown-route feature                                  |
| **unsaved-changes**         | For changes to the unsaved-changes feature                                |
| **styles**                  | For changes to the global styles                                          |
| **material**                | For changes to Material Design styling                                    |
| **schematics**              | for changes to the schematics that are not directly linked to a feature   |
| **translation**             | for changes to the translations that are not directly linked to a feature |
| **utilities**               | for changes to `utilities.ts`                                             |

## <a name="scripts"></a> Scripts

| Script             | Description                                                                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **lint**           | Lints the projects with EsLint, StyleLint and Prettier; Automatically run on the CI pipeline                                                             |
| **format**         | Same as lint, but tries to fix the code with EsLInt/Prettier/StyleLint                                                                                   |
| **test**           | Runs all tests and collects coverage                                                                                                                     |
| **test-ci**        | Same as test, but an additional Sonar report is generated; Automatically run on the CI pipeline                                                          |
| **test-debugging** | Same as test, but with extra debugging options                                                                                                           |
| **build**          | Builds the library; Automatically run on the CI pipeline                                                                                                 |
| **schematics**     | Builds the Schematics                                                                                                                                    |
| **update-icons**   | Creates icon sets and icons as CSS files, should be called whenever there is a change to any icon SVG                                                    |
| **tarball**        | Creates a tarball with a fresh build. If one or more paths to other projects can be passed as parameter, the tarball will be installed in those projects |
| **npm-publish**    | Publishes the package on NPM; automatically run on the CI pipeline                                                                                       |
