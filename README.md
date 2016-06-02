# [ObliqueReactive](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/)

Reactive web template powered by ObliqueUI and AngularJS. ObliqueReactive uses [Gulp](https://github.com/gulpjs/gulp/), [Bower](http://bower.io/), [Less](http://lesscss.org/) and [Assemble](http://assemble.io/) to fetch dependencies, compile & build assets and compose the pages.

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

##### GIT Config (.gitconfig)

	git config --global url."https://".insteadOf git://
	git config --global http."https://stash.eap.bit.admin.ch/".proxy ""
	git config --global http.postBuffer 524288000
	git config --global http.proxy <http-proxy-url>

##### NPM Config

> *Note*: proxy URL must start with `http[s]://`!

	npm config set proxy <http-proxy-url>
	npm config set https-proxy <https-proxy-url>

> *Warning*: if you receive a `Error: ENOENT, stat 'C:\Users\<user>\AppData\Roaming\npm'` exception, you will have to manually create the `npm` folder under the `Roaming` folder.

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

		npm install -g bower

2. Install *development* & *frontend* dependencies:

		npm prestart

3. Customize:

> Open [project.conf.ts](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse/project.conf.ts) and adapt this configuration to fit your project requirements.

### Troubleshooting dependencies

Should you encounter problems with installing dependencies or running Gulp commands, uninstall all previous dependency versions (global and local). Then, rerun `npm install`.

## Build & Run

ObliqueReactive supports software environments by launching specific [Gulp](https://github.com/gulpjs/gulp/) tasks.

The project template has been configured to trigger the following 2 environments:

* **dev**: default *development* environment which provides full debugging support through minimal packaging (resources are not minificated neither concatenated).
* **prod**: custom *production* environment which provides partial debugging support but an optimized & release-ready packaging (resources are minificated and concatenated).

### Development tasks

	gulp

*or*

	gulp default

*or*

	gulp run-dev

_This task builds the project, runs the client application by starting a local server and watches for file changes._

#### [Optional] Start the *dummy* API server

Should your backend API not be ready to consume, you can test the client application by starting a local *dummy* API server:

	gulp connect-dummy

> Note that you should remove this local server as soon as your backend is ready to consume!

### Production tasks

	gulp run-prod

_Same as `run-dev`, except that it will serve optimized resources._

## <a name="managing-dependencies"></a> Managing dependencies

If you ever need to add your own dependencies, here's how to do it.

### npm (Build) dependencies

To install a new npm dependency, you can simply type

	npm i <dependency> -D

into your command line. But before you do so, make sure you're in your project's root folder, where [package.json](https://stash.eap.bit.admin.ch/projects/oui/repos/oblique2-reactive/browse/package.json) is.
After everything is done, you should see your new dependency in [package.json](https://stash.eap.bit.admin.ch/projects/oui/repos/oblique2-ui/browse/package.json).

If you need to install a global dependency, such as bower, switch the *-D* to a *-g* in your command. This would look something like this:

	npm i <dependency> -g

Installing a global npm dependency makes it accessible from every command line, independent of your console's location. Local dependencies are only accessible inside a project. Most of the time it isn't neccessary for you to install global npm packages.

You can search through npm packages over at [npmjs.com](https://www.npmjs.com/).

### Transpiling (TypeScript) dependencies

If you want to use a framework that adds new syntax to regular JavaScript, you'll probably need to give TypeScript, our JavaScript transpiler, hints as to what to do with the new expressions. This is what *typings* is for.

First, you'll need to search for your soon-to-be-integrated framework in the typings repository. We'll do it directly in the console via:

	typings search <dependency>

Most of the time, this will give you more than one result. So keep the exact name of your desired dependency in mind and type:

	typings i dt~<dependency> -SG

Doing this, typings will download all the needed typing files into your project and reference them in [typings.json](https://stash.eap.bit.admin.ch/projects/oui/repos/oblique2-ui/browse/typings.json) so that the next developer can simply run *typings install* (as we do) and doesn't need to bother. Quite neat, huh?

## Checking for updates

### Build dependencies updates

	npm install -g npm-check-updates

You can now check for updates and bump `package.json` dependencies accordingly:

	npm-check-updates

### Frontend (Bower) dependencies updates

	bower list
