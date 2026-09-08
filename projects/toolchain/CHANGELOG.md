# [16.0.0-rc.1](https://github.com/oblique-bit/oblique/compare/15.4.4...16.0.0-rc.1) (2026-09-08)

## Features

- **exec:** switch to `spawnSync` in order to avoid command execution vulnerability ([5ffe0805](https://github.com/oblique-bit/oblique/commit/5ffe08058f4e87b441571aa84d3877854968c7f1), OUI-4594)
- **exec:** add spawn command utility ([0c26c1c7](https://github.com/oblique-bit/oblique/commit/0c26c1c764cdb002b81dff222c87e0ee62108de3), OUI-4594)
- **linting:** activate new eslint rules ([aa927a3d](https://github.com/oblique-bit/oblique/commit/aa927a3d2d16788d08af7594e4ce6fac1a2c3810), OUI-4516)
- **linting:** export plugin configuration as well as EsLint config ([f8c942ba](https://github.com/oblique-bit/oblique/commit/f8c942ba07f14369fe71645f88e29d1f82fb9eed), OUI-4058)
- **linting:** deactivate `@angular-eslint/inject-at-top` ([05969e6c](https://github.com/oblique-bit/oblique/commit/05969e6ca9197f9dfc292cfddc07cff4f592f8ff), OUI-4516)
- **linting:** deactivate `@angular-eslint/prefer-service-decorator` ([05969e6c](https://github.com/oblique-bit/oblique/commit/05969e6ca9197f9dfc292cfddc07cff4f592f8ff), OUI-4516)
- **schematics:** add `use-unknown-in-catch-variables` rule to linting schematic ([4080310f](https://github.com/oblique-bit/oblique/commit/4080310f78ba99624e15ee5c63704c4296801fd0), OUI-4542)
- **schematics:** add locales option to `add-oblique` schematic and call i18n schematic ([c4f8b27f](https://github.com/oblique-bit/oblique/commit/c4f8b27fb77631da341410c4ba6dd499034b85fd))
- **schematics:** add `i18n` schematic to configure locales ([c606bec4](https://github.com/oblique-bit/oblique/commit/c606bec4f8473bb0540e9bec319aa06565342e75), OUI-4527)
- **schematics:** add `proxy.conf.json` creation to `ng-add` schematic ([d8f1df89](https://github.com/oblique-bit/oblique/commit/d8f1df890705acbf0a1583abd43b323b8f1c3753), OUI-4525)
- **schematics:** add `.npmrc` creation to `ng-add` schematic ([5efead04](https://github.com/oblique-bit/oblique/commit/5efead045fc235ecaa3d513fedd4d5ae4c3ed5d2), OUI-4525)
- **schematics:** `add-oblique` only write files that have changed ([a0cc9f6a](https://github.com/oblique-bit/oblique/commit/a0cc9f6a16006938f7a795c100fbb78211dfc776), OUI-4159)
- **schematics:** `add-oblique` use modern favicon definition ([e8888010](https://github.com/oblique-bit/oblique/commit/e8888010efcbbc01357fe55f371b084c8fb917c9), OUI-4159)
- **schematics:** create `linting` schematics ([cfd721f5](https://github.com/oblique-bit/oblique/commit/cfd721f572d8d46b79891ce0b474e2fa14445a2e), OUI-4058)
- **schematics:** add `add-oblique` schematic ([32055e28](https://github.com/oblique-bit/oblique/commit/32055e28d98fd417c9a766bb16418b745aa783dd), OUI-4488)
- **toolchain:** distribute as ESM ([934d28b9](https://github.com/oblique-bit/oblique/commit/934d28b92e2f4f1ed8fd6c775c6acfdfe68a3f35), OUI-4500)

## BREAKING CHANGES

- **exec:** Changes signatures of the `obExecWithLogging` and `obExecWithLogging` methods
- **linting:** rule `@angular-eslint/computed-must-return` is now active
- **linting:** rule `@angular-eslint/no-implicit-take-until-destroyed` is now active
- **linting:** The EsLint configuration is now a named export, meaning it must now be imported with
  `import {eslintConfigOblique} from "@oblique/toolchain/eslint-config"` instead of
  `import eslintConfigOblique from "@oblique/toolchain/eslint-config"`
- **toolchain:** `@oblique/toolchain` no longer supports CommonJs, use `import` instead of `require()`

# [16.0.0-alpha.4](https://github.com/oblique-bit/oblique/compare/15.4.2...16.0.0-alpha.4) (2026-07-15)

## Bug Fixes

- **toolchain:** define Angular ESLint rules ([62ee6372](https://github.com/oblique-bit/oblique/commit/62ee6372861c11013d2199c28a0c8e79bc680f1b), OUI-4516)

## Features

- **linting:** activate new eslint rules ([c052896b](https://github.com/oblique-bit/oblique/commit/c052896b3fab8e9d0d95b5f2642704d229278de6), OUI-4516)
- **linting:** export plugin configuration as well as EsLint config ([c53307fa](https://github.com/oblique-bit/oblique/commit/c53307fa1ed3f10567415ff4a4b79c00af046ec3), OUI-4058)
- **schematics:** `add-oblique` only write files that have changed ([8c0859ab](https://github.com/oblique-bit/oblique/commit/8c0859ab7c477125daf53cb5edbe81afdbf2e8b4), OUI-4159)
- **schematics:** `add-oblique` use modern favicon definition ([c010b92b](https://github.com/oblique-bit/oblique/commit/c010b92ba8f21004ef9e40611055cee0b2e326ed), OUI-4159)
- **schematics:** create `linting` schematics ([5af1ce0d](https://github.com/oblique-bit/oblique/commit/5af1ce0d87aad96e1abcbc0676df449973506b03), OUI-4058)
- **schematics:** add add-oblique schematic ([1e081363](https://github.com/oblique-bit/oblique/commit/1e081363268c69fda4a03a4fefdec05f7ed91247), OUI-4488)
- **toolchain:** distribute as ESM ([d7d881a3](https://github.com/oblique-bit/oblique/commit/d7d881a3761d6ef13a088a3e18efa151af8ab4c1), OUI-4500)

## BREAKING CHANGES

- **linting:** rule `@angular-eslint/computed-must-return` is now active
- **linting:** rule `@angular-eslint/no-implicit-take-until-destroyed` is now active
- **linting:** The EsLint configuration is now a named export, meaning it must now be imported with
  `import {eslintConfigOblique} from "@oblique/toolchain/eslint-config"` instead of
  import eslintConfigOblique from "@oblique/toolchain/eslint-config"
- **toolchain:** `@oblique/toolchain` no longer supports CommonJs, use `import` instead of `require()`

# [16.0.0-alpha.3](https://github.com/oblique-bit/oblique/compare/16.0.0-alpha.2...16.0.0-alpha.3) (2026-06-22)

## Features

- **schematics:** add add-oblique schematic ([3c88dd8a](https://github.com/oblique-bit/oblique/commit/3c88dd8a0e4c7e039eb7b95ac9536a82467789fb), OUI-4488)
- **toolchain:** distribute as ESM ([8e1ad4de](https://github.com/oblique-bit/oblique/commit/8e1ad4de61e4df380b7a584d18457b0ff0d6bcef), OUI-4500)

## BREAKING CHANGES

- **toolchain:** `@oblique/toolchain` no longer supports CommonJs, use `import` instead of `require()`

# [15.4.4](https://github.com/oblique-bit/oblique/compare/15.4.3...15.4.4) (2026-08-18)

## Dependencies

- **@angular/core:** update dependencies to solve CVE-2026-52725, CVE-2026-50557, CVE-2026-54267 ([00152443c](https://github.com/oblique-bit/oblique/commit/00152443c37a4d04d9db50bc3b7485c7d2387c2c), OUI-4623, [GitHub-10](https://github.com/oblique-bit/oblique/issues/10))

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
