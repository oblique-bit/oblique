# Contributing to Oblique

Welcome, and thank you for your interest in contributing to Oblique.
As a contributor, here are the guidelines we would like you to follow:

- [Code of Conduct](#coc)
- [Providing Feedback & Asking Questions](#feedback)
- [Submitting a Pull Request](#pr)
- [Commit Message Guidelines](#commit)
  - [General Rules](#general)
  - [Format](#format)
    - [Header](#header)
      - [Type](#type)
      - [Package](#package)
      - [Scope](#scope)
      - [Subject](#subject)
    - [Body](#body)
    - [Footer](#footer)

## <a name="coc"></a> Code of Conduct

This project and everyone participating in it is governed by the [Oblique code of conduct](CODE_OF_CONDUCT.md). By
participating, you are expected to uphold this code.

## <a name="feedback"></a> Providing Feedback & Asking Questions

Issues are for bug reports and feature requests. For general support questions the development team is available on
[email](mailto:oblique@bit.admin.ch).

## <a name="pr"></a> Submitting a Pull Request (PR)

You are welcomed to submit Pull Requests following the following guidelines:

- We have strict linting rules in place, don't try to circumvent them
- Write unit tests for your code, and make sure not to lower the test coverage
- Document all public API methods and properties
- Follow our [Commit Message Guidelines](#commit)
- Make sure to have a clean history, use [interactive rebase](https://git-scm.com/docs/git-rebase#_interactive_mode) when necessary
- Target the `master` branch. We will make sure to redirect your PR to the next release branch

The Oblique team reserves the right not to accept PRs from the community.

## <a name="commit"></a> Commit Message Guidelines

_This specification is inspired by and supersedes the [AngularJS Git Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#)._

We have very precise rules over how our git commit messages can be formatted. The goal is to have an easy-to-read
project history which provides 3 main advantages:

- It allows to easily understand what has been done
- It greatly improves the experience of finding when, how and why a change has been made
- It simplifies the generation of the changelogs

### <a name="general"></a> General Rules

A good commit message:

- uses 1 and only one [Package](#package), if multiples packages are concerned, split the commit.
- uses 1 and only one [Scope](#scope), if a commit spans multiple scopes, split it into several commits. **Exception**: changes that spans most of the library can be grouped together, in which case the scope should be omitted
- concerns 1 and only one change, a change includes its tests, documentation and schematics
- keep all lines below 101 characters

### <a name="format"></a> Format

Each commit message consists of a **header**, a **body**, and a **footer** separated with blank lines.

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The `header` is mandatory and must conform to the [Header](#header) format.

The `body` is optional but must conform to the [Body](#body) format if present.

The `footer` is optional but must conform to the [Footer](#footer) format if present.

#### <a name="header"></a> Header

The header is mandatory and follows the following structure:

```
<type>(<package>/<scope>): <subject>
```

##### <a name="type"></a> Type

The type is mandatory and must be one of the following:

- **feat**: Changes that creates, improves or removes a feature
- **fix**: Changes that fixes a bug
- **refactor**: Changes to a feature that neither adds, removes nor fixes a behavior
- **test**: Changes that affect tests and their configuration only
- **format**: Changes that do not affect the meaning of the code (white-space, formatting, missing semicolons, etc.)
- **chore**: Anything that do not fit in any previous types (e.g. release, dependencies update, ...)

##### <a name="package"></a> Package

The package is mandatory and must be one of the following:

- **design-system**: for change in the Design System library
- **oblique**: for changes in the Oblique library, including the changes to the service-navigation component
- **sandbox**: for changes in the Sandbox project
- **sds**: for changes in the Swiss Design System project
- **service-navigation**: for changes in the service-navigation-web-component project
- **toolchain**: for general changes about the whole repository

##### <a name="scope"></a> Scope

The scope is optional but usually present. If the scope is omitted, then the separating slash (`/`) before it is also
omitted. The list of available scopes depends on the project involved:

- [Design System](projects/design-system/CONTRIBUTING.md)
- [Oblique](projects/oblique/CONTRIBUTING.md)
- [Sandbox](projects/sandbox/CONTRIBUTING.md)
- [SDS](projects/sds/CONTRIBUTING.md)
- [Service Navigation](projects/service-navigation-web-component/CONTRIBUTING.md)

##### <a name="subject"></a> Subject

The subject is mandatory and contains a **succinct** description of the change:

- describe what the change achieves, not why or how it achieves that
- avoid technical details, don't say `replace MatLegacyModule with MatModule` but `stop using MatLegacyModule`
- use the imperative, present tense, e.g.: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

#### <a name="body"></a> Body

The body is optional and just as in the subject, use the imperative, present tense, e.g.: "change" not "changed" nor "changes".

Explain the motivation for the change, explain _why_ you are making the change.
You can include a comparison of the previous behavior with the new one in order to illustrate the impact of the change.

#### <a name="footer"></a> Footer

The footer is optional must follow the following structure if present:

```
OUI-715
BREAKING CHANGE:
* function `funcA` has been removed in favor of `funcB`
* property `prop` has been removed with no replacement
* file `fileName` has been renamed into `myFile`
```

The footer is the place to include a reference to a JIRA issue, if any. There must be only 1 issue, omit parent issue
for sub-tasks. GitHub's issues are always linked to a JIRA issue as well, une only the latter.

Following the issue number is the breaking changes section that must start with the phrase "BREAKING CHANGE:"
followed by a new line. Multiple breaking changes may be broken down with bullet points. Each Breaking changes must
contain migration instructions and a note about Schematics solving it if applicable.
