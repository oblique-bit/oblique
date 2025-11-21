# Contributing to the Oblique monorepo

Thank you for your interest in contributing to Oblique! We welcome contributions of all kinds, whether it’s
fixing bugs, adding features, improving documentation, or helping with tests.

To make the process smooth and enjoyable for everyone, we ask contributors to follow these guidelines:

- [Code of Conduct](#coc)
- [Providing Feedback & Asking Questions](#feedback)
- [Submitting a Pull Request](#pr)
  - [BitBucket](#pr_bitbucket)
  - [GitHub](#pr_github)
- [Commit Message Guidelines](#commit)
  - [General Rules](#general)
  - [Format](#format)
    - [Header](#header_)
      - [Type](#type)
      - [Package](#package)
      - [Scope](#scope)
        - [build](#build)
        - [ci](#ci)
        - [others](#others)
      - [Subject](#subject)
    - [Body](#body)
    - [Footer](#footer)
      - [Ticket number](#ticket_number)
      - [Breaking changes](#breaking_changes)

## <a name="coc"></a> Code of Conduct

This project and everyone participating in it is governed by the [Oblique code of conduct](CODE_OF_CONDUCT.md). By
participating, you are expected to uphold this code.

## <a name="feedback"></a> Providing Feedback & Asking Questions

Issues are for bug reports and feature requests. For general support questions the development team is available on
[email](mailto:oblique@bit.admin.ch).

## <a name="pr"></a> Submitting a Pull Request (PR)

We welcome Pull Requests that follow these guidelines:

- Respect the linting rules; do not bypass them
- Write unit tests for your changes and ensure test coverage does not decrease
- Document all public API methods and properties with JsDoc
- Follow our [Commit Message Guidelines](#commit)
- Maintain a clean history by using [interactive rebase](https://git-scm.com/docs/git-rebase#_interactive_mode)

The Oblique team reserves the right to review and decide on all PRs submitted by the community.

### <a name="pr_bitbucket"></a> BitBucket

BitBucket is the primary repository for the Oblique monorepo. If you have access, prefer opening PRs there.

PRs should target one of the release branches according to the type of changes:

- `release/major_X.0.0` - for breaking changes
- `release/minor_X.Y.0` - for new features
- `release/patch_X.Y.Z` - for other changes

### <a name="pr_github"></a> GitHub

The `master` branch on GitHub is a public mirror of the `master` branch on BitBucket. To avoid branch pollution,
conflicts and confusion, only the `master` branch is available on GitHub, development and release branches exist
only on BitBucket.

If you do not have BitBucket access, you may open a PR against `master` on GitHub. The Oblique team will then:

- Temporarily push the corresponding release branch to GitHub
- Redirect the PR to that release branch
- Merge the PR once approved
- Remove the temporary release branch from GitHub

## <a name="commit"></a> Commit Message Guidelines

_This specification is inspired by and supersedes the [AngularJS Git Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#)._

We have very precise rules over how our git commit messages can be formatted. The goal is to have an easy-to-read
project history which provides 3 main advantages:

- It allows to easily understand what has been done
- It greatly improves the experience of finding when, how and why a change has been made
- It simplifies the generation of the changelogs

### <a name="general"></a> General Rules

A good commit message:

- Uses 1 and only one [Package](#package), if multiples packages are concerned, split the commit
- Uses 1 and only one [Scope](#scope), if a commit spans multiple scopes, split it into several commits. **Exception**: changes that spans most of the library, such as formatting, can be grouped together, in which case the scope should be omitted
- Concerns 1 and only one change, a change includes its tests, documentation and schematics
- Keep all lines below 101 characters

With the help of Huksy, all commits will be validated against these guidelines.

### <a name="format"></a> Format

Each commit message consists of a **header**, a **body**, and a **footer** separated with blank lines.

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The `header` is mandatory and must conform to the [Header](#header_) format.

The `body` is optional but must conform to the [Body](#body) format if present.

The `footer` is optional but must conform to the [Footer](#footer) format if present.

#### <a name="header_"></a> Header

The header is mandatory and follows the following structure:

```
<type>(<package>/<scope>): <subject>
```

For example:

> feat(oblique/alert): add `fatal` type

##### <a name="type"></a> Type

The type is required and must be one of the following:

| Type         | Description                                                          |
| ------------ | -------------------------------------------------------------------- |
| **build**    | Changes that affect the build system or external dependencies        |
| **ci**       | Changes that affect the CI/CD configuration files                    |
| **docs**     | Changes that affect only the documentation                           |
| **feat**     | Changes that creates, improves or removes a feature                  |
| **fix**      | Changes that fixes a bug                                             |
| **refactor** | Changes to a feature that neither adds, removes nor fixes a behavior |
| **test**     | Changes that affect tests or their configuration only                |

##### <a name="package"></a> Package

The package is required and must be one of the following:

| Package                | Description                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| **cli**                | Changes in the CLI library                                                                |
| **design-system**      | Changes in the Design System library                                                      |
| **oblique**            | Changes in the Oblique library, including the changes to the service-navigation component |
| **sandbox**            | Changes in the Sandbox project                                                            |
| **sandbox-ssr**        | Changes in the Sandbox-SSR project                                                        |
| **sds**                | Changes in the Swiss Design System project                                                |
| **service-navigation** | Changes in the Service Navigation Web Component project                                   |
| **toolchain**          | Changes in the Toolchain project                                                          |

Changes outside any package may omit the package name. This is the case for changes in the root folder of the
repository or changes that affect the whole codebase, such as code format.
If the package is omitted, then the scope is mandatory and the separating slash (`/`) is also omitted.

##### <a name="scope"></a> Scope

The scope is required and depends on the type of change, described below.
If no scope fits the change then it can be omitted and the separating slash (`/`) is also omitted.

###### <a name="build"></a> build

The `build` type has a mandatory scope that must be one of the following:

| Scope            | Description                                                              |
| ---------------- | ------------------------------------------------------------------------ |
| **cli**          | Changes in the CLI library                                               |
| **changelog**    | Changes to anything related to the changelog                             |
| **contributing** | Changes to anything related to the contributing guideline                |
| **dependencies** | Changes related to dependencies that are not applicable to another scope |
| **lint**         | Changes to anything related to linting and formatting                    |
| **readme**       | Changes related to the readme                                            |
| **release**      | New releases or changes to anything related to releases                  |
| **scripts**      | Changes to the node scripts that are not applicable to another scope     |

###### <a name="ci"></a> ci

The `ci` type, which stands for Continuous Integration, has a mandatory scope that must be one of the following:

| Scope       | Description                                           |
| ----------- | ----------------------------------------------------- |
| **rhos**    | Changes to the Red Hat Open Shift configuration files |
| **jenkins** | Changes to the Jenkins configuration files            |
| **github**  | for changes to the GitHub configuration files         |

###### <a name="others"></a> others

The `docs`, `feat`, `fix`, `test`, and `refactor` types must use scopes according to the project involved:

- [CLI](projects/cli/CONTRIBUTING.md#scope)
- [Design System](projects/design-system/CONTRIBUTING.md#scope)
- [Oblique](projects/oblique/CONTRIBUTING.md#scope)
- [Sandbox](projects/sandbox/CONTRIBUTING.md#scope)
- [Sandbox-SSR](projects/sandbox-ssr/CONTRIBUTING.md#scope)
- [SDS](projects/sds/CONTRIBUTING.md#scope)
- [Service Navigation](projects/service-navigation-web-component/CONTRIBUTING.md#scope)
- [Toolchain](projects/toolchain/CONTRIBUTING.md#scope)

##### <a name="subject"></a> Subject

The subject is mandatory and contains a **succinct** description of the change:

- describe what the change achieves, not why or how it achieves that
- avoid technical details, don't say `replace MatLegacyModule with MatModule` but `stop using MatLegacyModule`
- use the imperative, present tense, e.g.: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

#### <a name="body"></a> Body

The body is optional and similarly to the subject, use the imperative, present tense, e.g.: "change" not "changed"
nor "changes". Multiple paragraphs and bullet points are allowed.

Explain the motivation for the change, explain _why_ you are making the change.
You can include a comparison of the previous behavior with the new one in order to illustrate the impact of the change.

#### <a name="footer"></a> Footer

The footer includes a reference to the JIRA ticket and any eventual breaking changes. It must adhere to the following structure:

```
OUI-715
BREAKING CHANGE:
* function `funcA` has been removed in favor of `funcB`
* property `prop` has been removed with no replacement
* file `fileName` has been renamed into `myFile`
```

If there is neither a ticket nor a breaking change, the footer may be omitted.

##### <a name="ticket_number"></a> Ticket number

If a ticket is referenced:

- it must be listed first
- only one ticket number is allowed. Subtasks must omit the parent ticket number
- for GitHub issues, use the corresponding JIRA ticket number if available. If no JIRA ticket exists, use the GitHub issue number.

##### <a name="breaking_changes"></a> Breaking changes

If there are any breaking changes, include them immediately after the ticket number:

- the section must starts on a new line containing exactly "BREAKING CHANGE:"
- list multiple breaking changes with bullet points
- each breaking change must include:
  - what isn't available anymore
  - what replaces it. If there's no replacement, then state "without replacement"
  - if the change is automated with a Schematics, then state "solved with Schematics"
