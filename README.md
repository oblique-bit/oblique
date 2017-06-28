# [ObliqueReactive](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/)

Reactive web framework powered by [ObliqueUI](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-ui/) and [Angular](https://github.com/angular/angular).

ObliqueReactive uses [npm](https://www.npmjs.com/), [AngularCLI](https://cli.angular.io/), [Gulp](https://github.com/gulpjs/gulp/), [Sass](http://sass-lang.com/) and [Handlebars](http://handlebarsjs.com/) to fetch dependencies, compile & build assets, compose HTML and serve & watch web content.

> **Starting a new business web project?**
>
> If you are starting a new business web project, please clone directly [ObliqueReactiveSeed](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive-seed/), an ObliqueReactive-enabled project template. 

## Using ObliqueReactive as a dependency

1. Register our npm repository manager (Nexus 3):

	npm config set registry https://nexus3.eap.bit.admin.ch/repository/npm-all/

2. Install `oblique-reactive` as an npm dependency:

	npm install oblique-reactive --save

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

Follow [these instructions](https://confluence.eap.bit.admin.ch/display/JEAP/Projekt+Setup#ProjektSetup-Umgebungsvariablen)

###### GIT Config (.gitconfig)

	git config --global url."https://".insteadOf git://
	git config --global http."https://stash.eap.bit.admin.ch/".proxy ""
	git config --global http.postBuffer 524288000
	git config --global http.proxy <http-proxy-url>

###### <a name="npm-config"></a> NPM config

Follow the instructions described in the [JEAP Project Setup page](https://confluence.eap.bit.admin.ch/display/JEAP/Projekt+Setup#ProjektSetup-InstallationundKonfigurationvonNodeJsundNPM)

And add the TypeScript specific libraries and configs described in the [Configuration for TypeScript page](https://confluence.eap.bit.admin.ch/display/FEDEV/Configuration+for+TypeScript)

> *Note*: ObliqueReactive needs **TypeScript 2** as minimum version.

#### First-time setup

1. Install *globally* required `npm` libraries:

	npm install -g typescript gulp @angular/cli

2. Install *development* and *frontend* dependencies (`npm` will look at [package.json](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse/package.json) and automatically install the necessary dependencies listed there):

	npm install


#### Troubleshooting dependencies

Should you encounter problems with installing dependencies or running AngularCLI / Gulp commands, uninstall all previous dependency versions (global and local). Then, rerun `npm install`.

### Build & Run the showcase

#### Development tasks

	npm start

_This task builds the project, runs the client application by starting a local server and watches for file changes._

#### TODO: Production tasks

	npm start-prod

_Same as `npm start`, except that it will serve optimized resources._

### <a name="managing-dependencies"></a> Managing dependencies

#### npm dependencies

Run the following command to install a new npm dependency:

	npm i <dependency> -S

Before you do so, make sure you're in your project's root folder, where [package.json](https://stash.eap.bit.admin.ch/projects/oui/repos/oblique2-reactive/browse/package.json) is.
After everything is done, you should see your new dependency listed in [package.json](https://stash.eap.bit.admin.ch/projects/oui/repos/oblique2-ui/browse/package.json).

If you need to install a global dependency, such as Gulp, switch the *-S* to a *-g* in your command. This would look something like this:

	npm i <dependency> -g

Installing a global npm dependency makes it accessible from every command line, independent of your console's location. Local dependencies are only accessible inside a project. Most of the time it isn't neccessary for you to install global npm packages.

You can search through npm packages over at [npmjs.com](https://www.npmjs.com/).

#### Adding definition files for a non TypeScript dependency

If you want to use a library that isn't written in TypeScript, like lodash or jQuery, you'll probably need to give TypeScript hints as to what to do with the new expressions.

First, you'll need to search for your soon-to-be-integrated library here:

https://microsoft.github.io/TypeSearch/

Now you can install the definition files with npm, like it should be shown to you on the result page

	npm install --save @types/[libName]
	
The TypeCompiler will automatically look for packages in `@types/` and use them as definition files.

### Checking for updates

	npm install -g npm-check-updates

You can now check for updates and bump `package.json` dependencies accordingly:

	npm-check-updates

### <a name="publish"></a> Publishing ObliqueReactive

> Publishing should be performed with a continuous integration tool and not manually!

Before publishing, execute the following steps:

1. Switch to master branch and merge develop on it.
2. Run `npm run build` to compile sources and rebuild the project distribution.
3. Check project distribution and ensure showcase is running as expected.
4. Commit and push any remaining changes.

Prepare your workspace:

1. Ensure you have an account with publishing privileges on the internal `npm` registry ([BIT Nexus v3](https://nexus3.eap.bit.admin.ch/))
2. Authenticate on the internal npm registry (Nexus v3):

	npm login --registry=https://nexus3.eap.bit.admin.ch/repository/npm-intern/

    > Follow the steps on the terminal as you may be asked for credentials.

#### <a name="publish-patch"></a> Publishing a *patch* release

Build, release (defaults to *patch* version number increment) and finally publish using Gulp:

	gulp publish

    > Follow the steps on the terminal as you may be asked multiple times for credentials.

#### <a name="publish-types"></a> Publishing other release types

Publishing a *prerelease*:

	gulp publish --bump prerelease

Publishing a *minor* release:

	gulp publish --bump minor

Publishing a *major* release:

	gulp publish --bump major

Publishing a *version-specific* release:

	gulp publish --version <version>

> For more release commands or options, see <https://github.com/stevelacy/gulp-bump>.
