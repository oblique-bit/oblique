# [ObliqueReactive](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/)

Read the developer docs: <https://oblique.bit.admin.ch/>

ObliqueReactive uses [npm](https://www.npmjs.com/), [AngularCLI](https://cli.angular.io/) and [Sass](http://sass-lang.com/) to fetch dependencies, compile & build assets, compose HTML and serve & watch web content.

If you are starting a new business web project, please clone directly [ObliqueReactiveSeed](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive-seed/), an ObliqueReactive-enabled project template. 

## Using ObliqueReactive as a dependency

1. Register our npm repository manager:

	`npm config set registry https://repo.bit.admin.ch/repository/npm-group/`

2. Install `oblique-reactive` as an npm dependency:

	`npm install oblique-reactive --save`

3. Import `ObliqueModule` in your root `NgModule`. Note that you should only import modules that you use and not the whole collection:

```
	import {ObliqueModule} from 'oblique-reactive';
	
	@NgModule({
	    declarations: [...],
	    imports: [
	        ...,
	        ObliqueModule.forRoot(),
	        ...
	    ],
	    ...,
	})
	export class AppModule {}
```

4. You can now import & use any ObliqueReactive components within you app.

An usage example can be found in [ObliqueReactiveSeed](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive-seed/)

## Working on ObliqueReactive (Oblique core developers only)

### Prerequisites
- GIT
- nodejs & npm
- AngularCli installed globally: `npm i -g @angular/cli`
- ncu installed globally: `npm install -g npm-check-updates`

### Setup the the environment
- Clone the repo: `git clone https://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive.git`.
- Install project dependencies: `npm i`
- start the showcase: `npm start`

### Commit message format
We have very precise rules over how our git commit messages can be formatted. This leads to more readable messages that are easy to follow when looking 
through the project history. But also, we use the git commit messages to generate the Oblique change log.
For better readability, there should be 1 commit per change and any line of the commit message cannot be longer 100 characters! 
Each commit message consists of a **header**, a **body** and a **footer**. The header has a special format that includes a **type**, a **scope** and a 
**subject**:

	<type>(<scope>): <subject>
	
	<body>
	
	<footer>

This rule only concern commit on the Oblique library. Changes to the showcase must not be mixed with those of the library and have not to follow any specific
 format.
#### Header
The header is mandatory and lowercase only. The scope of the header is optional. There no space between **type** and **scope**. 

##### Type
The type is mandatory and must be one of the following:
* **build**: Changes that affect the build system or external dependencies (example scopes: gulp, npm)
* **docs**: Documentation only changes
* **feat**: A new feature or an improvement of an existing feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **test**: Adding missing tests or correcting existing tests
* **chore**: Anything that do not fit in previous types (e.g. release, dependencies update)

###### Scope
The scope is optional and should be the name of the Oblique feature affected:
* **column-layout**
* **datepicker**
* **document-meta**
* **error-messages**
* **filter-box**
* **form-control-state**
* **http-interceptor**
* **master-layout**
* **multiselect**
* **nav-tree**
* **navigable**
* **navigator**
* **notification**
* **number-format**
* **off-canvas**
* **schema-validation**
* **scrolling**
* **spinner**
* **text-control-clear**
* **toggle**
* **unsaved-changes**
* **unsubscribe**

##### Subject
The subject is mandatory and contains a succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize the first letter
* no dot (.) at the end

#### Body
The body is optional.
Just as in the subject, use the imperative, present tense: "change" not "changed" nor "changes". The body should include the motivation for the change and contrast this with previous behavior.

#### Footer
The footer is optional and should contain a reference to a JIRA issue if any, e.g.: `OUI-715`.

It should also contain any information about Breaking Changes.

Breaking Changes have to start with the word BREAKING CHANGE: with a newline. The rest of the commit message is then used for this.

	OUI-715
	BREAKING CHANGE:
	Function `funcA` have been removed. Use `funcB` instead 

### Checking for updates
- Bump dependencies through Angular cli first: `ng update`
- Then update the dependencies without build-in schematics: `ncu` 

## Releasing ObliqueReactive

Before releasing, execute the following steps:

1. Switch to develop branch, if not already on it.
2. Create a new package version 
```
npm version patch|minor|major
```

* `patch` is for bugfix only.
* `minor` is for new features or features improvements without `BREAKING CHANGE`
* `major` indicates at least 1 `BREAKING CHANGE`

> This will automatically lint, test and build the library, bump the version in the package.json and create a updated version of the CHANGELOG.md.

3. Review the changes in the `CHANGELOG.md`
1. Commit the changes (`CHANGELOG.md`, `package.json`, `package-lock.json`)
```
`npm run release`
```
> This will commit & push the changes to the master and Jenkins will then upload the npm package to the Nexus repository.
