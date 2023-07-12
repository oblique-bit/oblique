# Contributing to Oblique

Welcome, and thank you for your interest in contributing to Oblique.

## Code of conduct

This project and everyone participating in it is governed by the [Oblique code of conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Providing Feedback & asking questions

Your comments, feedbacks and questions are welcome.
The development team is available by [email](mailto:Oblique@bit.admin.ch).

## Get started

This repo contains 4 district Angular projects:

- **oblique**: this is the Oblique library that will be distributed on NPM.
- **sds**: this is the Oblique documentation that will be deployed on http://oblique.bit.admin.ch. Use it to see Oblique in action.
- **sandbox**: this is a sandbox application used by the Oblique's development team. This application is never deployed and doesn't match the usual quality requirements.
- **stylesBuilder**: this is an internal project used by Oblique to generate global CSS files. Never use it.

### Prerequisites

- GIT
- nodejs & npm
- AngularCli installed globally: `npm i -g @angular/cli`

### Setup the environment

- Clone the repo: `git clone https://github.com/oblique-bit/oblique.git`.
- Install project dependencies: `npm ci`

### Useful commands

#### Start projects

- start Sandbox: `npm start -w projects/sandbox`
- start SDS: `npm start -w projects/sds`
- start all projects: `npm start -ws`

#### Test projects

- test Oblique `npm test -w projects/oblique`
- test Sandbox: `npm test -w projects/sandbox`
- test SDS: `npm test -w projects/sds`
- test all projects: `npm test -ws`

#### Lint projects

- lint all projects: `npm run lint`
- format (lint with auto fix) all projects: `npm run format`

#### Miscellaneous commands

- compile the schematics: `npm run schematics -w projects/oblique`
- update icons (should be executed when there is a change in the `projects/oblique/icons` folder): `npm run update-icons -w projects/oblique`
- update error messages (should be executed when there is a change in one of the translation keys starting with `i18n.validation`): `npm run update-error-messages -w projects/oblique`

## Commit messages

We have very precise rules over how our git commit messages can be formatted. This leads to more readable messages that are easy to follow when looking
through the project history. The git commit messages will also be used to generate Oblique's change log.

For better readability, please follow the following rules:

- 1 commit per change, fixes have to be squashed together.
- A change includes its tests, mocks, documentation and schematics.
- 1 commit concerns 1 scope (see below), if a commit spans multiple scopes, split it into several commits. **Exception**: changes that spans most of the library can be grouped together. In that case, there is no scope
- no line of the commit message can be longer than 100 characters.
- changes to one package should NEVER come with another package.

### Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special format that includes a **type**, a **scope** and a
**subject**:

    <type>(<scope>): <subject>

    <body>

    <footer>

#### Header

The header is mandatory and lowercase only. The scope of the header is optional. There no space between **type** and **scope**.

##### Type

The type is mandatory and must be one of the following:

- **feat**: Changes that creates, improves or removes a feature
- **fix**: Changes that fixes a bug
- **refactor**: Changes to a feature that neither adds, removes nor fixes a behavior
- **test**: Changes that affect tests and their configuration only
- **format**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **chore**: Anything that do not fit in any previous types (e.g. release, dependencies update, ...)

##### Scope

The scope is optional.

###### Scope prefixes

If specified, the scope must be prefixed by the package name, separated with a slash (**/**). The **toolchain** scope is an exception to this rule.

- **oblique**
- **sandbox**
- **sds**

###### Base scopes

If specified, the scope must be one of:

- **alert**
- **authentication**
- **autocomplete**
- **button**
- **breadcrumb**
- **collapse**
- **column-layout**
- **document-meta**
- **error-messages**
- **external-link**
- **file-upload**
- **global-events**
- **http-interceptor**
- **input-clear**
- **icon**
- **language**
- **master-layout**
- **multi-translate-loader**
- **nav-tree**
- **nested-form**
- **notification**
- **number-format**
- **off-canvas**
- **paginator**
- **popover**
- **pop-up**
- **schema-validation**
- **scrolling**
- **selectable**
- **service-navigation**
- **spinner**
- **sticky**
- **translate-params**
- **unknown-route**
- **unsaved-changes**
- **material** for material design

###### Oblique scopes

The Oblique project may use those additional scopes:

- **schematics** for the schematics not directly linked to a feature
- **styles** for the global CSS
- **translation** for the translations not directly linked to a feature
- **utilities** for utilities.ts

###### Sandbox scopes

The sandbox project may use those additional scopes:

- **styles** for styles documentation pages

###### SDS scopes

The SDS project may use those additional scopes:

- **cms**
- **component-pages**
- **documentation-pages**
- **side-navigation**

###### Additional scopes

The following scopes must omit the prefix

- **toolchain** for the configuration, build, releases...

##### Subject

The subject is mandatory and contains a **succinct** description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

#### Body

The body is optional.
Just as in the subject, use the imperative, present tense: "change" not "changed" nor "changes". The body should include the motivation for the change and contrast this with previous behavior.

#### Footer

The footer is optional and should contain a reference to an issue if any, e.g.: `OUI-715`.

If you want reference multiple issue numbers (like sub-tasks), you can do it with the following pattern: `<parent-task number> / <sub-task number>`, e.g.: `OUI-42 / OUI-21`.

It should also contain any information about Breaking Changes.

Breaking Changes have to start with the words `BREAKING CHANGE:` followed by a newline. The rest of the commit message is then used for this. Multiple breaking changes can be displayed with bullet points

    OUI-715
    BREAKING CHANGE:
    * function `funcA` has been removed in favor of `funcB`
    * property `prop` has been removed with no replacement
    * file `fileName` has been renamed into `myFile`
