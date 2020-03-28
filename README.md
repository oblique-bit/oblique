# Oblique
An Angular front-end framework Tailored for your swiss branded business web application, Oblique provides a standardized corporate design look and feel as well as a collection of ready-to-use Angular components. Oblique, through its fully customizable master layout, takes care of the application's structure, letting you focus on the content.

## About
Read the developer docs: <https://oblique.bit.admin.ch/>

Oblique uses [npm](https://www.npmjs.com/), [AngularCLI](https://cli.angular.io/) and [Sass](http://sass-lang.com/) to fetch dependencies, compile & build assets, compose HTML and serve & watch web content.

## Embedding Oblique into your project

1. Update your project to Angular 9: <https://update.angular.io/#8.0:9.0>

1. Install `oblique` and its peer dependencies:

    ```
        npm install @oblique/oblique
        npm install @ngx-translate/core
        ng add @angular/localize
    ```

1. Install `jest` and its dependencies (optional)
    ```
        npm i @angular-builders/jest
        npm i @types/jest
        npm i jest
        npm i ts-jest
        npm i jest-sonar-reporter
        npm i jest-transform-stub
        npm i jest-serializer-vue
        npm i jest-preset-angular
    ```

1. Configure `Sonar` for jest in `package.json` (optional)
    ```
   "jestSonar": {
      "reportPath": "./coverage/sonarQube",
      "reportFile": "sqr.xml",
      "indent": 4,
      "sonar56x": true
    },
    ```

1. Map Oblique's resources and load CSS in `angular.json`:
    ```
    "architect": {
        "build": {
            "builder": "@angular-devkit/build-angular:browser",
            "options": {
                ...
                "assets": [
                    ...,
                    {
                        "glob": "**/*",
                        "input": "node_modules/@oblique/oblique/styles",
                        "output": "assets/styles"
                    }
                ],
                "styles": [
                    "node_modules/@oblique/oblique/styles/css/oblique-core.css",
                    "node_modules/@oblique/oblique/styles/css/oblique-material.css",
                    "src/styles.scss"
                ],
                ...
            },
        },
        ...
    },
    ```

1. Configure jest (optional)
    ```
    "architect": {
        ...
        "test": {
             "builder": "@angular-builders/jest:run",
             "options": {
                 "configPath": "../tests/jest.config.js",
                 "watch": true,
                 "verbose": true
             },
             "configurations": {
                 "production": {
                     "configPath": "../tests/jest.config.js",
                     "watch": false,
                     "verbose": false
                 }
             }
        },
        ...
    },
    ...
    ```

1. Configure Oblique in `app.module.ts`

    ```
    ...
    @NgModule({
        imports: [
            BrowserModule,
            BrowserAnimationsModule,
            AppRoutingModule,
            ObMasterLayoutModule,
            // import others Oblique Module as necessary
            TranslateModule.forRoot(multiTranslateLoader()),
            HttpClientModule
        ],
        ...
        providers: [
          {provide: HTTP_INTERCEPTORS, useClass: ObHttpApiInterceptor, multi: true}
        ],
        ...
    })
    ```

1. Define the main navigation in `app.component.ts`

    ```
    navigation: ObINavigationLink[] = [];
    ```

1. Embed the master layout in `app.component.html`

    ```
    <ob-master-layout [navigation]="navigation">
      <ng-container obHeaderTitle>{{'i18n.application.title' | translate}}</ng-container>
      <ng-template #obHeaderControl>
         ...
      </ng-template>
      <ng-container obFooterInfo>
         ...
      </ng-container>
    </ob-master-layout>
    ```

## Checking for updates
- Bump dependencies through Angular cli first: `ng update`
- Then update oblique: `ng update @oblique/oblique` 
- Finally update the dependencies without build-in schematics: `npm update`
- New major versions can be discovered through `npm outdated` 

## Contribute to Oblique

### Prerequisites
- GIT
- nodejs & npm
- AngularCli installed globally: `npm i -g @angular/cli`

### Setup the the environment
- Clone the repo: `git clone https://github.com/oblique-bit/oblique.git`.
- Install project dependencies: `npm ci`
- start the showcase: `npm start`


### Commit message 
We have very precise rules over how our git commit messages can be formatted. This leads to more readable messages that are easy to follow when looking 
through the project history. The git commit messages will also be used to generate Oblique's change log.

For better readability, please follow the following rules:
 * 1 commit per change, fixes have to be squashed together. 
 * A change includes its tests, mocks, documentation and schematics. 
 * 1 commit concerns 1 scope (see below), if a commit spans multiple scopes, split it into several commits. **Exception**: changes that spans most of the library can be grouped together. In that case, there is no scope
 * no line of the commit message can be longer than 100 characters.
 * changes to the showcase should NEVER come with another type (see below) as __showcase__. All showcase changes of an issue should be squashed together

#### Format 
Each commit message consists of a **header**, a **body** and a **footer**. The header has a special format that includes a **type**, a **scope** and a 
**subject**:

	<type>(<scope>): <subject>
	
	<body>
	
	<footer>

##### Header
The header is mandatory and lowercase only. The scope of the header is optional. There no space between **type** and **scope**. 

###### Type
The type is mandatory and must be one of the following:
* **feat**: Changes that creates, improves or removes a feature
* **fix**: Changes that fixes a bug
* **refactor**: Changes to a feature that neither adds, removes nor fixes a behavior 
* **test**: Changes that affect tests and their configuration only
* **docs**: Changes that affect the documentation only
* **showcase**: Changes that affect the showcase only
* **format**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **chore**: Anything that do not fit in any previous types (e.g. release, dependencies update, ...)


###### Scope
The scope is optional and should be the name of the Oblique feature affected:
* **collapse**
* **column-layout**
* **datepicker**
* **document-meta**
* **error-messages**
* **filter-box**
* **form-control-state**
* **http-interceptor**
* **master-layout**
* **multi-translate-loader**
* **multiselect**
* **nav-tree**
* **navigable**
* **nested-form**
* **navigator**
* **notification**
* **number-format**
* **off-canvas**
* **pop-up**
* **schema-validation**
* **scrolling**
* **search-box**
* **selectable**
* **spinner**
* **sticky**
* **input-clear**
* **theme** (for either the theme service or global css)
* **toggle**
* **translate-params**
* **unknown-route**
* **unsaved-changes**
* **unsubscribe**
* **utilities** (for utilities.ts)
* **toolchain** (for configuration, build, releases, schematics,...)

###### Subject
The subject is mandatory and contains a **succinct** description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize the first letter
* no dot (.) at the end

##### Body
The body is optional.
Just as in the subject, use the imperative, present tense: "change" not "changed" nor "changes". The body should include the motivation for the change and contrast this with previous behavior.

##### Footer
The footer is optional and should contain a reference to a JIRA issue if any, e.g.: `OUI-715`.

It should also contain any information about Breaking Changes.

Breaking Changes have to start with the words `BREAKING CHANGE:` followed by a newline. The rest of the commit message is then used for this. Multiple breaking changes can be displayed with bullet points

    OUI-715
    BREAKING CHANGE:
    * function `funcA` has been removed in favor of `funcB`
    * property `prop` has been removed with no replacement
    * file `fileName` has been renamed into `myFile`

