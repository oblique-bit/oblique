# [ObliqueReactive](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/)

Reactive web template powered by ObliqueUI and AngularJS. ObliqueReactive uses [Grunt](http://gruntjs.com/), [Bower](http://bower.io/), [Less](http://lesscss.org/) and [Assemble](http://assemble.io/) to fetch dependencies, compile & build assets and compose the pages.

This template has been inspired by the following guidelines:
<https://docs.google.com/document/d/1XXMvReO8-Awi1EZXAXS4PzDzdNvV6pGcuaF4Q9821Es/mobilebasic?pli=1>

## Quick start

- [Download the latest release](https://stash.eap.bit.admin.ch/plugins/servlet/archive/projects/OUI/repos/oblique-reactive).
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

> *Note*: this proxy configuration only applies to local environments (VM environments are currently not supported).

##### Windows Environment Variables

> *Note*: proxy URL must start with `http[s]://`!

	HTTP_PROXY <http-proxy-url>
	HTTPS_PROXY <https-proxy-url>
	NO_PROXY follow [these instructions](https://confluence.eap.bit.admin.ch/display/JEAP/Projekt+Setup#ProjektSetup-Umgebungsvariablen)

##### GIT Config (.gitconfig)

	git config --global url."https://".insteadOf git://
	git config --global http."https://stash.eap.bit.admin.ch/".proxy ""
	git config --global http.postBuffer 524288000
	git config --global http.proxy <http-proxy-url>

##### Bower Config (Windows only)

> *Important: users experiencing proxy errors*
>
> Since version 1.3.8, Bower requires that your `.gitconfig` file is located under the `%USERPROFILE%` directory.
>
> If your `HOME` environment variable is **not** pointing to your `%USERPROFILE%` directory, then you will need to create a symbolic link inside `%USERPROFILE%` pointing to your `.gitconfig` on `%HOME%`.

Open an **elevated** command prompt and run the following command:

	mklink %USERPROFILE%\.gitconfig %HOME%\.gitconfig

### First-time setup

1. Install required `npm` libraries:

		npm install -g grunt-cli bower

2. Install *development* dependencies (`npm` will look at [package.json](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse/package.json) and automatically install the necessary build dependencies listed there):

		npm install

3. Install *frontend* dependencies (`bower` will look at [bower.json](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse/bower.json) and automatically install the necessary frontend dependencies listed there):

		bower install

4. Customize:

> Open [project.json](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse/project.json) and adapt this configuration to fit your project requirements.

### Troubleshooting dependencies

Should you encounter problems with installing dependencies or running Grunt commands, uninstall all previous dependency versions (global and local). Then, rerun `npm install`.

## Build & Run

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

#### [Optional] Start the *dummy* API server

Should your backend API not be ready to consume, you can test the client application by starting a local *dummy* API server:

	grunt dummy-server

> Note that you should remove this local server as soon as your backend is ready to consume!

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

### Frontend (Bower) dependencies updates

	bower list
