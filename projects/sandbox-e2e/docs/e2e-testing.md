# E2E testing the sandbox

The sandbox is the playground where Oblique features are demonstrated. E2E tests
guard it against regressions when code gets refactored or moved around. They run
against the real application in a browser, so they catch what unit tests cannot:
broken wiring, missing elements, and interactions that only fail at runtime.

## Who owns the tests

Each maintainer is responsible for the E2E tests of the features they work on.
Adding or adjusting e2e tests is a deliberate choice that lands as its own
change, scoped to this package. When a change in another package, such as the
library, touches functionality demonstrated by a sandbox sample, run the e2e
suite to check the work.

## Running the tests

See the [README](../README.md) for how to run the suite, the useful variants,
and where the reports land.

## Writing a test

A test navigates to a sandbox sample, drives its controls, and asserts on the
result. Keep tests focused on user-visible behavior:

- Name the spec file after the feature, e.g. `notification.spec.ts`.
- Name each test as a sentence describing the behavior it verifies, e.g.
  "sends and displays a notification with the entered message".
- Navigate to the sample route, e.g. `/en/samples/notification`.
- Interact through roles and labels (`getByRole`, `getByLabel`) rather than CSS
  selectors, so tests survive markup changes.
- Assert on what the user sees: a notification appearing, a panel opening, a
  value changing. Do not assert on internal component state.
- Give each test a distinct message or value so failures are easy to tell apart.

### Adding a test for a new feature

1. Create `e2e/sandbox/<feature>.spec.ts`.
2. Cover the feature's main user flows: the happy path plus the options that
   change behavior.
3. Run the single file while you work:

   ```shell
   npx playwright test e2e/sandbox/<feature>.spec.ts
   ```

4. Run the full suite before opening the change.

## Running headless in a build container

The suite is designed to run headless inside a container during the build
process, before deployment. Playwright ships its own headless Chromium, so the
tests need no display server. The exact container wiring lives with the OpenShift
build and is out of scope for this package; the requirement is that the suite
runs with `CI=true` and no interactive session.
