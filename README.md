# [ObliqueReactive](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/)

Reactive web framework powered by [ObliqueUI](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-ui/) and [Angular](https://github.com/angular/angular).

ObliqueReactive uses [npm](https://www.npmjs.com/), [AngularCLI](https://cli.angular.io/), [Gulp](https://github.com/gulpjs/gulp/), [Sass](http://sass-lang.com/) and [Handlebars](http://handlebarsjs.com/) to fetch dependencies, compile & build assets, compose HTML and serve & watch web content.

> **Starting a new business web project?**
>
> If you are starting a new business web project, please clone directly [ObliqueReactiveSeed](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive-seed/), an ObliqueReactive-enabled project template. 

## Using ObliqueReactive as a dependency

1. Register our npm repository manager:

	`npm config set registry https://repo.bit.admin.ch/repository/npm-group/`

2. Install `oblique-reactive` as an npm dependency:

	`npm install oblique-reactive --save`

3. Import `ObliqueModule` in your root `NgModule`:

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

## Working on ObliqueReactive (Oblique *core* developers only)

- Clone the repo: `git clone https://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive.git`.

### Install

#### Prerequisites

* Git: <http://git-scm.com/downloads>

> If you are running Windows, select following options during installation:
> - _Run Git from the Windows Command Prompt_
> - _Checkout Windows-style, commit Unix-style endings_

* NPM via Node.js: <http://nodejs.org/download/>

> NPM, the Node Package Manager, is installed during the Node.js installation process.

#### Environment setup

##### GIT configuration

If you are using Git for the first time, configure your user information as well:

	git config --global user.name "<firstname> <lastname>"
	git config --global user.email "<email>"

##### Proxy configuration (if applicable)

###### Environment Variables

> *Note*: proxy URL must start with `http[s]://`!

	HTTP_PROXY <http-proxy-url>
	HTTPS_PROXY <http-or-https-proxy-url>
	NO_PROXY localhost,127.0.0.1,admin.ch

> *Note*: `HTTP_PROXY` & `HTTPS_PROXY` values for the BIT proxy are identical (i.e. there is no dedicated HTTPS proxy)

###### GIT Config (.gitconfig)

	git config --global url."https://".insteadOf git://
	git config --global http."https://stash.eap.bit.admin.ch/".proxy ""
	git config --global http.proxy <http-proxy-url>

#### First-time setup

Install *project* dependencies (`npm` will look at [package.json](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse/package.json) and automatically install the necessary dependencies listed there):

		npm install

#### Troubleshooting dependencies

Should you encounter problems with installing dependencies or running AngularCLI / Gulp commands, uninstall all previous dependency versions (global and local). Then, rerun `npm install`.

### Build & Run the showcase

#### Development tasks

	npm start

_This task builds the project, runs the client application by starting a local server and watches for file changes._

> If task fails with privilege reasons, consider installing these `npm` libraries *globally*:

	npm install -g typescript gulp @angular/cli

#### TODO: Production tasks

	npm start-prod

_Same as `npm start`, except that it will serve optimized resources._

### <a name="managing-dependencies"></a> Managing dependencies

#### npm dependencies

Run the following command to install a new npm dependency:

	npm i <dependency> -S

Before you do so, make sure you're in your project's root folder, where [package.json](https://stash.eap.bit.admin.ch/projects/oui/repos/oblique2-reactive/browse/package.json) is.
After everything is done, you should see your new dependency listed in [package.json](https://stash.eap.bit.admin.ch/projects/oui/repos/oblique2-reactive/browse/package.json).

If you need to install a global dependency, such as Gulp, switch the *-S* to a *-g* in your command. This would look something like this:

	npm i <dependency> -g

Installing a global npm dependency makes it accessible from every command line, independent of your console's location. Local dependencies are only accessible inside a project. Most of the time it isn't neccessary for you to install global npm packages.

You can search through npm packages over at [npmjs.com](https://www.npmjs.com/).

#### Checking for updates

	npm install -g npm-check-updates

You can now check for updates and bump `package.json` dependencies accordingly:

	npm-check-updates

## <a name="release"></a> Releasing ObliqueReactive

> TODO: Releasing & publishing should be performed with a continuous integration tool and not manually!

Before releasing, execute the following steps:

1. Switch to develop branch, if not already on it.
2. Create a new package version 

	npm version patch|minor|major
	
	> This will automatically run "npm run ci-build" (lint, test, build), then bump the version in the package.json and create a updated version of the CHANGELOG.md.
	
	1. `patch` is for bugfix only.
	1. `minor` is for new features or features improvements without `BREAKING CHANGE`
	1. `major` indicates at least 1 `BREAKING CHANGE`
	
3. Review the changes in the CHANGELOG.md
1. Commit the changes (`CHANGELOG.md`, `package.json`, `package-lock.json`)

	`npm run release`

	> This will commit & push the changes to the master and upload the npm package to Nexus repoisotory.

## <a name="npm-link"></a> Debug oblique-reactive in a different project
If you need to debug or test oblique-reactive in a 

1. Prepare oblique-reactive

	`npm link dist`

2. Connect your project to oblique-reactive 
	`npm link`
	
	`npm link oblique-reactive`

	> This will create a symlink in your projects node_modules/oblique-reactive pointing to oblique-reactive/dist folder.

3. Re-build on oblique-reactive changes

	`npm run dev-watch`

	> This will re-build on every change in the oblique-reactive project.

4. When finished with your work, you can switch back to the npm registry version of oblique-reactive.

	`npm unlink oblique-reactive`
	
	`npm install`
