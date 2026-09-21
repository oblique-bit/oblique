# Sandbox E2E Guidelines For Agents

Agent-specific guidance for working in this package. The [README](README.md)
covers how to run the suite; [docs/e2e-testing.md](docs/e2e-testing.md) covers
test ownership and writing conventions.

## Layout

- `e2e/sandbox/` — Playwright specs, one file per feature.
- `playwright.config.ts` — suite configuration: serial execution, chromium only,
  failure artifacts.
- `scripts/` — lint tooling for this package.
- `artifacts/` — gitignored output: reports, traces, screenshots, videos.

## Workflow

1. Iterate on a single spec file from this directory:

   ```shell
   npx playwright test e2e/sandbox/<feature>.spec.ts
   ```

2. Finish with the full suite and lint, both from this directory:

   ```shell
   npm run test && npm run lint
   ```

   The work is done when both pass.

## Gotchas

- The suite runs serially against one sandbox served with `ng serve`; a full
  run takes a couple of minutes. Iterate on a single spec file first.
- The web server reuses a sandbox already listening on port 3001. A sandbox
  started before your changes serves stale code: stop it before running the
  suite. Find the process listening on port 3001 and stop it:

  ```shell
  # Linux/macOS
  kill $(lsof -ti :3001)
  # Windows
  netstat -ano | findstr :3001   # then: taskkill /PID <pid> /F
  ```

- The sandbox is served from the monorepo root, so the suite needs the whole
  repository, not just this package.
- On failure, read `artifacts/playwright/output/<test-name>/error-context.md`:
  the page snapshot at the failure point, the fastest way to diagnose a broken
  assertion.

## Timing-sensitive assertions

Match the tool to the assertion:

- Waiting for a state to change (auto-dismissal, removal): prefer `expect.poll`
  with an explicit timeout over fixed waits. A poll timeout deliberately shorter
  than the default dismissal time turns a regression into a fast failure, and a
  tight poll interval keeps the measured elapsed time close to the true removal
  moment. For example, the sandbox notification sample's default dismissal time
  is 2500ms: set the poll timeout to 2000ms and the poll interval to 100ms.
- Asserting that a state stays true (a sticky notification outliving its
  timeout): `expect.poll` is wrong here, it resolves on the first match and
  never waits. Let the time pass first with `page.waitForTimeout(<timeout plus
remove delay>)`, then assert with a normal matcher.
