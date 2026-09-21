# Sandbox E2E

Playwright-based end-to-end tests for the [sandbox](../sandbox/README.md). They
run the real sandbox application in a browser and guard it against regressions
when Oblique code is refactored.

## Getting started

From the monorepo root:

```shell
npm run install:browsers -w @oblique/sandbox-e2e
npm run test -w @oblique/sandbox-e2e
```

The test command starts the sandbox with `ng serve` and runs the Playwright
suite against it. The first run needs the browser installed.

Useful variants:

- `npm run test:headed -w @oblique/sandbox-e2e`: watch the tests run in a visible browser.
- `npm run test:debug -w @oblique/sandbox-e2e`: step through a single test with the Playwright inspector.

Reports land in `projects/sandbox-e2e/artifacts/playwright/` (HTML, JUnit, and
traces on failure). The path is relative to this package, so opening the report
only resolves from here. The easiest way is the script:

```shell
npm run display:report -w @oblique/sandbox-e2e
```

## CI status

The e2e suite is currently **disabled in CI**. The Jenkins pipeline runs on a
Debian 11 based `bit/node:24` container, which Playwright does not support, so
the browser cannot be installed there. The `test-ci` script is a no-op
placeholder until a supported browser image is available (for example a RHOS
pipeline with Chromium baked in). Run the suite locally with `npm run test`.

## Guidelines

Read [docs/e2e-testing.md](docs/e2e-testing.md) before writing or changing tests.
It covers who owns the tests and the conventions to follow.
