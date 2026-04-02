# [15.2.0](https://github.com/oblique-bit/oblique/compare/15.1.3...15.2.0) (2026-04-02)

## Bug Fixes

- **linting:** actually deactivate `@angular-eslint/component-class-suffix` ([1a19e5eb](https://github.com/oblique-bit/oblique/commit/1a19e5ebe6d262d2feedec83aa3d666f38bf307b), OUI-4404)

## Features

- **exec:** add `obExecWithLogging` and `obExecWithLoggingOrExit` functions ([d964582c](https://github.com/oblique-bit/oblique/commit/d964582cc27bb6f680e581eb9741d94a3a186959), OUI-4383)
- **linting:** deactivate `default-case` and `@typescript-eslint/consistent-return` ([a02c7b19](https://github.com/oblique-bit/oblique/commit/a02c7b190566e22997b72d80220af0bc9dd63a99), OUI-4404)
- **logger:** add `obCreateLogger` and `obCreateSchematicsLogger` factory functions ([eabecb5f](https://github.com/oblique-bit/oblique/commit/eabecb5f64f8a14ef716c17b2005b4b92f02a207), OUI-4343)
- **schematics:** log each step ([79d48ea8](https://github.com/oblique-bit/oblique/commit/79d48ea85b15f55da1ef1ffae822273e982c35d0), OUI-4343)

# [15.1.1](https://github.com/oblique-bit/oblique/compare/15.1.0...15.1.1) (2026-03-09)

## Bug Fixes

- **toolchain:** `ng-add` adds `@oblique/toolchain` as a `devDependency` ([8cdc4c5f](https://github.com/oblique-bit/oblique/commit/8cdc4c5f3bd608a16e52563fdcb1ae79e9eccd1f))

# [15.1.0](https://github.com/oblique-bit/oblique/compare/15.0.3...15.1.0) (2026-03-05)

## Features

- **linting:** deactivate `@angular-eslint/component-class-suffix` rule ([89a59cc7](https://github.com/oblique-bit/oblique/commit/89a59cc7c0d5c3a5468c477db9875c317c3bda45))
- **linting:** disable `@typescript-eslint/only-throw-error` for tests ([dea53b4c](https://github.com/oblique-bit/oblique/commit/dea53b4cbde48a9e2fc14affb452e9cd144b54bf))
- **linting:** disable `@typescript-eslint/strict-void-return` for tests ([4a0b0d29](https://github.com/oblique-bit/oblique/commit/4a0b0d2914b6ad879764879685ba4cd4432ccdd6))

# [15.0.0](https://github.com/oblique-bit/oblique/compare/14.2.1...15.0.0) (2026-02-02)

## Features

- **linting:** activate `@typescript-eslint/no-useless-default-assignment` rule ([73cd99a9](https://github.com/oblique-bit/oblique/commit/73cd99a9f8d62cddf0fd6923f4806a5f3cdf2de7))
- **linting:** activate `@typescript-eslint/no-unused-private-class-members` rule ([e60221d5](https://github.com/oblique-bit/oblique/commit/e60221d514427c385488217764940adedf3fb454))
- **linting:** activate `preserve-caught-error` rule ([104a017d](https://github.com/oblique-bit/oblique/commit/104a017dbf5ab85a09e49842c0752071af845253))
- **linting:** activate `@angular-eslint/strict-void-return` rule ([80f62888](https://github.com/oblique-bit/oblique/commit/80f62888382e356b4dc9e083e2750c6376cddb7d))
- **linting:** activate `@angular-eslint/prefer-inject` rule ([65f1f939](https://github.com/oblique-bit/oblique/commit/65f1f9397cc9fb8459a3795ed76abe54e49c4fae))
- **linting:** activate `@angular-eslint/prefer-signal-model` rule ([837cb343](https://github.com/oblique-bit/oblique/commit/837cb3437f33e16b9e4cda14317c91334d67bf75))
- **linting:** disallow unused variables in catch statement ([00666686](https://github.com/oblique-bit/oblique/commit/0066668601151e870578654ec776d7688f53a1f4))

# [14.1.0](https://github.com/oblique-bit/oblique/compare/14.0.2...14.1.0) (2025-11-03)

## Features

- **linting:** update ruleset to match latest eslint version ([2c7217a0](https://github.com/oblique-bit/oblique/commit/2c7217a0fa369904bb65ccb95b81fe2c28fafd6c))
- **linting:** create ESLint shareable config ([b700e326](https://github.com/oblique-bit/oblique/commit/b700e326c95db46ef7df06dabe7bbcc62ea9e828))

# [14.0.0](https://github.com/oblique-bit/oblique/compare/13.3.3...14.0.0) (2025-09-22)

## Features

- **ng-add:** add a `.browserslistrc` file to the project ([f7c5379e](https://github.com/oblique-bit/oblique/commit/f7c5379e5e68e795c01dfd2c138323d5f0f19994))
- **ng-add:** create `ng-add` Schematics to add `@oblique/toolchain` to a project ([9a5382a6](https://github.com/oblique-bit/oblique/commit/9a5382a6a7b9d2c15f99802d5bbf598081317c8f))

# [13.3.0](https://github.com/oblique-bit/oblique/compare/13.2.3...13.3.0) (2025-06-12)

## Features

- **toolchain:** create new toolchain project ([05ba8489](https://github.com/oblique-bit/oblique/commit/05ba8489dbcec466521212f6ae16ae18777b9c20))
