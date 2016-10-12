# [ObliqueReactive](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/)

Reactive web template powered by ObliqueUI and AngularJS. ObliqueReactive uses [Grunt](http://gruntjs.com/), [npm](https://www.npmjs.com/), [Less](http://lesscss.org/), [Browserify](http://browserify.org/) and [Assemble](http://assemble.io/) to fetch dependencies, compile & build assets and compose the pages.

This template has been inspired by the following guidelines:
<https://docs.google.com/document/d/1XXMvReO8-Awi1EZXAXS4PzDzdNvV6pGcuaF4Q9821Es/mobilebasic?pli=1>

## Using as dependency

You can use oblique-reactive as an npm dependency.

	npm install oblique-reactive --save

Once installed, you need to import the ObliqueModule:

	import {ObliqueModule} from 'oblique-reactive/oblique-reactive';

And add it in your app-module:

```
import {ObliqueModule} from 'oblique-reactive/oblique-reactive';

angular
	.module('__MODULE__', [
		[...]
		ObliqueModule,
		[...]
```

An example of usage can be found in the oblique-reactive-seed project: [ObliqueReactiveSeed](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive-seed/)

## Working on ObliqueReactive

- Clone the repo: `git clone https://stash.eap.bit.admin.ch/scm/oui/oblique-reactive.git`.

## Install

### Prerequisites

* Git: <http://git-scm.com/downloads>

> If you are running Windows, select following options during installation:
> - _Run Git from the Windows Command Prompt_
> - _Checkout Windows-style, commit Unix-style endings_

* NPM via Node.js: <http://nodejs.org/download/>

> NPM, the Node Package Manager, is installed during the Node.js installation process.

### Environment setup

#### GIT configuration

If you are using Git for the first time, configure your user information as well:

	git config --global user.name "<firstname> <lastname>"
	git config --global user.email "<email>"

#### Proxy configuration (if applicable)

##### Environment Variables

> *Note*: proxy URL must start with `http[s]://`!

	HTTP_PROXY <http-proxy-url>
	HTTPS_PROXY <https-proxy-url>
	NO_PROXY follow [these instructions](https://confluence.eap.bit.admin.ch/display/JEAP/Projekt+Setup#ProjektSetup-Umgebungsvariablen)

##### GIT Config (.gitconfig)

	git config --global url."https://".insteadOf git://
	git config --global http."https://stash.eap.bit.admin.ch/".proxy ""
	git config --global http.postBuffer 524288000
	git config --global http.proxy <http-proxy-url>
	
##### <a name="npm-config"></a> NPM config
    
Follow the instructions described in the [JEAP Project Setup page](https://confluence.eap.bit.admin.ch/display/JEAP/Projekt+Setup#ProjektSetup-InstallationundKonfigurationvonNodeJsundNPM)

And add the TypeScript specific libraries and configs described in the [Configuration for TypeScript page](https://confluence.eap.bit.admin.ch/display/FEDEV/Configuration+for+TypeScript)

> *Note*: ObliqueReactive needs **TypeScript 2**, use `npm install typescript@next` to get the beta version

### First-time setup

1. Install *development* and *frontend* dependencies (`npm` will look at [package.json](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse/package.json) and automatically install the necessary dependencies listed there):

		npm install

2. Customize:

> Open [project.json](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse/project.json) and adapt this configuration to fit your project requirements.

### Troubleshooting dependencies

Should you encounter problems with installing dependencies or running Grunt commands, uninstall all previous dependency versions (global and local). Then, rerun `npm install`.

## Build & Run the showcase

ObliqueReactive supports software environments by launching specific [Grunt](http://gruntjs.com/) tasks.
Environment-specific variables can be configured, created or overrided by customizing the [project.json](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse/project.json) file.

The project template has been configured to trigger the following 2 environments:

* **dev**: default *development* environment which provides full debugging support through minimal packaging (resources are not minificated neither concatenated).
* **prod**: custom *production* environment which provides partial debugging support but an optimized & release-ready packaging (resources are minificated and concatenated).

### Development tasks

	grunt

*or*

	grunt default

*or*

	grunt run-dev

_This task loads the `dev` environment configuration, builds the project, runs the client application by starting a local server and watches for file changes._

#### Start the showcase API server

The start the showcase API server, run:

	grunt dummy-server

### Production tasks

	grunt serve-prod

_This task loads the `prod` environment configuration, builds the project for release and runs the client application by starting a local server._

	grunt run-prod

_Same as `serve-prod`, except that it starts watching for file changes._

## Checking for updates

### Build dependencies updates

	npm install -g npm-check-updates

You can now check for updates and bump `package.json` dependencies accordingly:

	npm-check-updates

## Publish on Nexus

First of all, you need to authenticate yourself on the Nexus:

	npm login --registry=http://nexus.vmjeap10a04.bfi.admin.ch:8020/repository/npm-intern/

> *Note*: Currently there is only the admin user. Ask Christian Ulmann or Oliver Santschi if you need a user.

Now you can run the according grunt task:

	grunt publish

> *Note*: This will run the test first, so you have to make sure, that the tests are working
