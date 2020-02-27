# [5.0.0-RC.2](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/compare/5.0.0-RC.1...5.0.0-RC.2) (2020-02-27)

## Bug Fixes
* **toolchain:** ensure no `map` file points to a file named `oblique-oblique.*` ([afd8f46](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/afd8f464a44e35c9a4c5dc8f58982d2b5500615f))
* **toolchain:** install `ts-morph-tools` for migration, remove typo in `package.json` ([da97fe2](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/da97fe2aad44fa4224380ca93e3786117fec45e1))
* **toolchain:** replace `#or` with `#ob` ([926e239](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/926e239ed962db1e4bcde90b3d352b6f83eae88f))
* **toolchain:** add preconditions to schematics ([1555a989](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/afd8f464a44e35c9a4c5dc8f58982d2b5500615f))
* **toolchain:** clean up imports after schematics ([c26b136c8](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/c26b136c8dd267f652cfcee829aa6e0e0473d2c7))


# [5.0.0-RC.1](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/compare/5.0.0-beta.1...5.0.0-RC.1) (2020-02-26)

## Bug Fixes
* **theme:** `mockThemeService` correctly implements `ThemeService` ([c6409f0](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/c6409f0e7ce26307c1a181d4ddb5bfcb0a1f1496))
* **toolchain:** remove `MockFormElementComponent` component ([54673af](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/54673afea7469b32b86295d2335add3c1e8faf7e))
* **toolchain:** schematics refer to next oblique version ([abc2626](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/abc2626fe6ecd2bdd69c84bebd034fcb6d6acf66))
* **toolchain:** schematics remove empty list ([7a74313](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/7a74313e725dc789775c5ddd948058a89ddc9df8))
* **toolchain:** schematics styles order ([207cae3](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/207cae31cb6634e51539c12ec50a9811a4c95b83))

## Code Refactoring
* **http-interceptor:** rename files and classes of `ObliqueHttpModule` ([78b852e](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/78b852e14a9126f2c528ef13b1ddc230a664a151))
* **input-clear:** rename `text-control-clear` to `input-clear` ([dda514e](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/dda514ec338da939c432e41ad6a4f97ad33dac51))
* add prefix to each class and selector ([ebd81d6](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/ebd81d6990e4659c4d6b387dfc90465a8b794028))

## Features
* **collapse:** transform `toggle` into `collapse` ([b932369](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/b93236987ee85addbafc6de9ac245eaf0c138e90))
* **master-layout:** accessibility improvement ([8d45976](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/8d459762c8fdecc31e9ac6eec7567dea5e4d9bcb))
* **toolchain:** add schematics according renaming ([ca9d4e1](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/ca9d4e10c275bd5f635384ae90495a37d34ffb29))
* **toolchain:** add schematics according translation key changes ([14ac897](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/14ac897b311f8c3e47b064c407ceeb800ae011d4))
* **toolchain:** add schematics for prefix change ([fb38604](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/fb38604ecd4588c1e4bc1df7530b68fac8734d26))

## BREAKING CHANGES
* **collapse:** `toggle` feature has been removed in favor of `collapse`
* **collapse:** `toggle` css now needs `oblique-compat` to be use without its the component
* **http-interceptor:** `ObliqueHttpInterceptor` has been renamed to `HttpApiInterceptor`
* **http-interceptor:** `ObliqueHttpInterceptorConfig` has been renamed to `HttpApiInterceptorConfig`
* **http-interceptor:** `ObliqueHttpInterceptorEvents` has been renamed to `HttpApiInterceptorEvents`
* **http-interceptor:** `ObliqueHttpInterceptorModule` has been renamed to `HttpApiInterceptorModule`
* **http-interceptor:** `ObliqueRequest` has been renamed to `HttpApiRequest`
* **input-clear:** `orTextControlClear` has been renamed to `orInputClear`
* all selectors prefixes changed from `or` to `ob`
* all classes has been prefixed with `Ob`
* all enums has been prefixed with `ObE`
* all interfaces has been prefixed with `ObI`


# [5.0.0-beta.1](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/compare/5.0.0-alpha.4...5.0.0-beta.1) (2020-02-18)

## Bug Fixes
* **master-layout:** adapt header medium and collapsed height ([9d684d8](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/9d684d8297b77dd6a3ad9b7001ca86e519256ecf))
* **nav-tree:** children are collapsible ([89f8994](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/89f89943d78679d9a0617a90f9e54e8e94661f26))
* **theme:** ensure custom styles overrides those of material design ([84daa2d](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/84daa2dcf7ec663d12f1b4aad8e8d0719da996c0))
* **toolchain:** export `MockTranslateService` explicitly ([3eef55e](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/3eef55ed0f081dea645aea3bb8d5ad26250bfeaa))

## Features
* **master-layout:** add cancelable default padding ([e47012c](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/e47012cfe1221b0dce395ff75312c801444d3b5c))
* **toolchain:** add schematics for `DatePicker` ([9962f0c](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/9962f0c67858ad24b51e758f7312b71ff1ab9ad4))
* **nav-tree:** remove content projection ([94c16ad](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/94c16ad31cf5737a06e8db9adb5a51e75a2c6b8a))
* **column-layout:** add `wider` option to widen side panels ([9eec269](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/9eec269ec3dd4d2f6d616c70bf913bd65209e0fe))
* **column-layout:** add cancelable default padding ([b6166de](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/b6166de6c69826ced16e66697d84b895505e4d7d))
* **master-layout:** remove `default-layout` class ([0e5a60f](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/0e5a60f29ac99db5c6a157e9547e560fe6eb2ac0))
* **selectable:** add feature ([307991c](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/307991c01456ebe2026277352918d58bcfad8a50))
* **sticky:** add cancelable default padding ([10aa9e2](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/10aa9e2739903bfa23b71f80029e12806361a9e8))
* **telemetry:** send data only when necessary ([5630c7e](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/5630c7e53c7e1673f01efa61d448e9e6465dca5b))
* **theme:** force stepper's `displayDefaultIndicatorType` to `false` ([4c5474e](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/4c5474ec41680f17e3ca276c0807bf20a7eebc9e))
* **theme:** `setTheme` now supports custom theme ([6e9a08b](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/6e9a08b9798e4c0c30f67179e1e8a9acb48accb7))
* **theme:** add `Roboto` font option ([cf80919](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/cf809191e8831c0673c8edaaf31b3377b2663763))
* **theme:** rework `card` feature ([a4df9af](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/a4df9afc04e9233221afb7d2890949cfe007bcb1))
* **theme:** rework `chips` feature ([6bcf5ba](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/6bcf5babf91dc0976f044fdc088efc48aab10e13))
* **theme:** rework `dialog` feature ([0586457](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/05864570c627370b9ca9339f3592ab3e45e894a2))
* **theme:** rework `stepper` feature ([297635f](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/297635f1f6e5e8f0dcd50ad0c9997abdb3836a05))
* **theme:** rework `table` feature ([193dd67](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/193dd67986dab183f1a59154d4ed7f575f0df4fa))
* **theme:** rework `tabs` feature ([9663362](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/96633621cae49480789b83502c369f323ab78d7e))
* **theme:** rework `tooltip` feature ([d9eeb40](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/d9eeb4025fcc5750bbf33eab1861a505e5ed5c33))
* **theme:** rework color palette ([9a40f23](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/9a40f23a5776681c7f192db31a63a27b13913256))
* **theme:** rework font management ([94df5f1](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/94df5f1e8159659ec44c04b210399b9bafcbe3ad))
* **theme:** rework spacers and add `$spacing-lg` ([146f2d0](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/146f2d0eca9d25542c930be6d90d77f28f39612f))
* **theme:** rework typography ([d91195a](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/d91195aab552b3e489187cd5e9c18b315d298e3a))
* **theme:** show deprecation notice only once per element ([0d2661e](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/0d2661e0d3fabff2120056ddd85a917622ba363e))
* **theme:** show warning in console when Frutiger cannot be loaded ([2751f2d](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/2751f2dc96cb8330b3cd9435effa654f2b14f865))
* **theme:** theme isn't set automatically anymore ([2f80199](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/2f801992b6a7d2cb6a97aaa28de00a855580f36d))

## BREAKING CHANGES
* **master-layout:** `default-layout` class has been dropped in favor of oblique's default padding
* **theme:** `FRUTIGER` injection token has been removed in favor of `Oblique_FONT` (solved with schematics)
* **theme:** `setFrutiger` method has been removed in favor of `setFont` (solved with schematics)
* **theme:** `setDefaultTheme` has been renamed into `setDefaultFont`
* **theme:** `OBLIQUE_THEME` injection token has been removed (solved with schematics)
* **theme:** theme link in `head` is only added if `setTheme` has been called
* **theme:** there no default theme anymore, one must be defined in `angular.json`. Under `projects > <projectName> > architect > build > options > styles` either `"projects/oblique/src/styles/scss/oblique-material.scss"` or `"projects/oblique/src/styles/scss/oblique-bootstrap.scss"` has to be added. (solved with schematics)
* **theme:** `_nav-tabs.scss` has been renamed into `_tabs.scss` (solved with schematics)
* **theme:** tabs look and feel has been adapted, use `oblique-compat` to keep the old style
* **theme:** stepper look and feel has been adapted, use `oblique-compat` to keep the old style
* **theme:** tables are not CI/CD conform anymore, the `cicd` class is needed to achieve the previous CI/CD style
* **theme:** `$gray-lighter` has been renamed into `$gray-extra-light` (solved with schematics)
* **theme:** `$gray-lighter-2` has been renamed into `$gray-lighter` (solved with schematics)
* **theme:** `$brand-extralight` has been renamed into `$brand-extra-light` (solved with schematics)
* **theme:** `$gray-dark`, `$brand-dark`, `$brand-light`, `$brand-extra-light`, `$brand-warning-dark`, `$brand-error` and `$brand-error-dark` have been slightly changed
* **theme:** `$brand-secondary` has been removed without replacement (still available under the name `$secondary` for bootstrap theme)
* **theme:** anchors are always `underlined` for accessibility reasons
* **theme:** `Roboto` is now the alternate font instead of `Arial`
* **theme:** all spacers and structural heights have been slightly adapted
* **theme:** `$spacing-md` has been removed in favor of either `$spacing-default` or `$spacing-sm`


# [5.0.0-alpha.4](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/compare/5.0.0-alpha.3...5.0.0-alpha.4) (2020-02-07)

## Bug Fixes
* **theme:** fix cover layout background image path ([ffed67d](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/ffed67d53f3e0424859144ba737e2af3281db4ee))
* **toolchain:** add schematics build ([401b194](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/401b194c9fc90d8510aa00c7bcebebcd79df4dd1))


# [5.0.0-alpha.3](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/compare/5.0.0-alpha.2...5.0.0-alpha.3) (2020-02-06)

## Bug Fixes
* **master-layout:** do not refresh the navigation if there is none ([82090e2](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/82090e21ff1b28174c4c6e39585a9a3ee329e618))
* **toolchain:** export `ObliqueTestingModule` in `public_api` ([99e64d0](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/99e64d0c8772b5b3566b9515f9e5e043c4d8775f))

## Features
* **chore(toolchain)** set up schematics ([1deb5cc](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/1deb5cc27f123a5379f648bb00b4d326b21fc58a))
* **notification:** remove obsolete `KeyWithParams` interface ([6ea60ed](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/6ea60ed6aaac0090f9b8060b3ac10ff4a4fa3efd))

## BREAKING CHANGES
* **notification:** `KeyWithParams` interface has been dropped in favor of `INotification`


# [5.0.0-alpha.2](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=5.0.0-alpha12) (2020-01-24)

## Bug Fixes
* **error-messages:** emit an error as soon as possible ([0ce1924](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/0ce19241eec72b93ad0918f20d0b7c3ad1a2eb1a))
* **master-layout:** add available languages to `TranslateService` ([66316d5](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/66316d52d4f273fa49e13e2d042840303f3b381b))
* **master-layout:** ensure consistent header height ([32766d7](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/32766d7200cd13ca409c6e1df7bf79a4ca4cae8e))
* **multi-translate-loader:** aot needs exported function ([1db4b4e](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/1db4b4ebf9ba405faee2fb3ec6b1ef7d37dd4882))
* **multiselect:** apply given `idPrefix` to toggle button ([31f2e4a](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/31f2e4a881a51da404706fa16119b4ec7f1258fb))
* **multiselect:** remove `input` decorator on `disabled` property ([dc87d7b](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/dc87d7bb4fb0bcc77440ae235edd6dc5887e41ff))
* **notification:** cancel timeout when notification closes ([78f449b](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/78f449b821a2b721beaada260d1a52e5b4098d92))
* **search-box:** remove padding when collapsed ([8302da5](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/8302da59295e6404524c471cd8ee5ca9eaa1e786))
* **sticky:** apply initial values and keep `sticky` class ([7bf7ba9](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/7bf7ba9246402c237621f51ed2c56fe220cc5caa))
* **theme:** change `btn-link` color to `brand-primary` ([f7f4d6b](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/f7f4d6b288b8966deb4348b24b06f133e2cda902))
* **theme:** move `form-actions` class into core ([36561cc](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/36561cc7967a8b891ac47199790ef2ce1cc19066))
* **toolchain:** ensure correct file order in `oblique-compat` ([3659e6e](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/3659e6e73c20e62dff45d26c1fc96d570bbdf4d2))
* **toolchain:** ensure all components have external, non encapsulated, styles ([d448243](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/d448243ee8a17b61825d4a22e435bea47f30084e))
* **toolchain:** include nested folders in `oblique-components` ([a6e47d6](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/a6e47d6719fe5afb77c2fcfe677d578043a5fe83))
* **translate-params:** return non string parameters unchanged ([23bff42](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/23bff4261bc82ab367145643eb09f44cb5e029be))
* **unknown-route:** do not alter `default-layout` ([a39f869](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/a39f8699487806b49fea6b7fc7d84687ad7514d8))

## chore
* **toolchain:** update to angular9.0.0-rc10 and refactor accordingly ([b81a4df](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/b81a4dfb503842ea90201cfc8d77e68ff5b58428))

## Code Refactoring
* **datepicker:** transform the component into a form element ([6235e97](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/6235e970964072042125cb472b684785d2b5c911))
* **sticky:** move sticky-related CSS into `sticky` component ([724fbe5](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/724fbe571779c53cbbd3cbd4fecb2af26db46db6))

## Features
* **datepicker:** add size option ([7b35257](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/7b3525778e2266149b553ca422f0866f6b1acd63))
* **datepicker:** improve error rendering ([ae0301c](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/ae0301c1f148e8128db5af6c1bb052732ebd927e))
* **datepicker:** improve outlined and selected day rendering ([5cd24c7](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/5cd24c73ab0e3fdb3ee6e9d94ba7f17fc7aa3ed3))
* **datepicker:** mark as deprecated for `Material` ([18c7dc5](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/18c7dc5c07f574f246b95ac5829ced6cf5a5b9f0))
* **error-messages:** the component supports nested forms ([c07346d](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/c07346d4cd4dc1d5b71c029b6eccbe268557d06e))
* **form-control-state:** the component supports nested forms ([c61e834](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/c61e83496642091adf35c36bfd30380724c1c027))
* **master-layout:** replace `isScrollable` with `scrollMode` ([de25521](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/de25521d4a37680c7ea8130dc1e46ac1cbe38719))
* **master-layout:** shows oblique version number on `or-master-layout` ([77274f4](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/77274f4337fccbad17835b4d1045a1012eab856a))
* **multi-translate-loader:** add custom loader for `TranslateModule` ([89d5078](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/89d507806a71706bfba29f0576fe350f6a39db51))
* **nav-tree:** remove `pathPrefix` input ([33b097c](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/33b097c80301d38b5beb2cb4f87ed46b097b6474))
* **navigable:** mark as deprecated ([de0ecb1](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/de0ecb1b2a135c056176e4c7e4078e2f5e6592a2))
* **navigator:** also depreciate the module ([e9c149c](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/e9c149c0b5e916ef8b74aa0a861dce3f41144631))
* **nested-form:** add feature ([2ea5ccf](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/2ea5ccf178aebc2803040333b3496ccad155c493))
* **notification:** add message params in notification id ([8834e82](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/8834e82b36cdca361b4f849ecf9b3fac50aeaf41))
* **pop-up:** add `PopUpService` ([ad16987](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/ad1698760fbba82334be83532615fe5d885b4796))
* **theme:** add `hover-visible` class ([aeb2480](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/aeb2480a42d00d2090436a817380d89c6ce95509))
* **theme:** add `oblique-compat.scss` ([5a0aa0c](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/5a0aa0c0415eba7a56ec1f2a106971c7a48fe919))
* **toolchain:** remove `test_helpers` ([15416d2](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/15416d2e40f84ed489449104bbe9bebf1ef03fbc))
* **unknown-route:** add feature ([e65f90a](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/e65f90acad86f528b2df6309e370f0eb2efd6284))
* **utilities:** add configurable multi translation loader ([daf8dbb](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/daf8dbb485cf174b805e30349c2aa699cca02ed7))
* **utilities:** add `WINDOW` InjectionToken for SSR compatibility ([a34eb41](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/a34eb41730dfb38aae0bfc761a79d3ccd4ef4e95))

## BREAKING CHANGES
* **sticky:** Sticky layouts built without the component need the `oblique-components.css` file
* **multiselect:** id of `or-multiselect` component has been changed to `<idPrefix>-container` instead of `<idPrefix>`
* **multiselect:** id of multiselect toggle has been changed to `<idPrefix>` instead of `<idPrefix>-toggle`
* **multiselect:** `id` property has been removed in favor of `idPrefix`
* **multiselect:** `_0` is removed from `idPrefix`
* **toolchain:** localize is now a peer dependency: `ng add @angular/localize`
* **datepicker:** content projection has been removed, the aspect is now immutable
* **datepicker:** some `ngbDatePicker` properties are not accessible anymore, see API for more info
* **datepicker:** some `ngbDatePicker` properties can be set through the `options` input, see API for more info
* **datepicker:** some `ngbDatePicker` properties can be set through inputs, see API for more info
* **datepicker:** default navigation has been set to `select` instead of `arrows`
* **datepicker:** `forRoot` method has been removed with no replacement. It is not useful anymore
* **nav-tree:** `pathPrefix` input has been removed with no replacement. It was without effect anyway
* **toolchain:** `test_helpers` directory have been removed in favor of `ObliqueTestingModule`


# [5.0.0-alpha.1](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=5.0.0-alpha.1) (2019-12-23)

## Bug Fixes
* **error-messages:** emit an error as soon as possible ([0ce1924](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/0ce1924))
* **master-layout:** add available languages to `TranslateService` ([66316d5](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/66316d5))
* **multiselect:** remove `input` decorator on `disabled` property ([dc87d7b](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/dc87d7b))
* **notification:** cancel timeout when notification closed ([78f449b](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/78f449b))
* **theme:** change `btn-link` color to `brand-primary` ([f7f4d6b](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/f7f4d6b))
* **theme:** move `form-actions` class into core ([36561cc](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/36561cc))
* **toolchain:** ensure all components have external, non encapsulated styles ([d448243](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/d448243))
* **toolchain:** include nested folders in `oblique-components` ([a6e47d6](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/a6e47d6))
* **translate-params:** return non string parameters unchanged ([23bff42](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/23bff42))

## Code Refactoring
* **datepicker:** transform the component into a form element ([6235e97](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/6235e97))

## Features
* **datepicker:** add size option ([7b35257](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/7b35257))
* **datepicker:** improve error rendering ([ae0301c](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/ae0301c))
* **datepicker:** improve outlined and selected day rendering ([5cd24c7](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/5cd24c7))
* **datepicker:** mark as deprecated for `Bootstrap` ([18c7dc5](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/18c7dc5))
* **error-messages:** component support nested forms ([c07346d](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/c07346d))
* **form-control-state:** component support nested forms ([c61e834](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/c61e834))
* **master-layout:** replace `isScrollable` with `scrollMode` ([de25521](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/de25521))
* **master-layout:** shows oblique version number ([77274f4](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/77274f4))
* **nav-tree:** remove `pathPrefix` input ([33b097c](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/33b097c))
* **nested-form:** add feature ([2ea5ccf](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/2ea5ccf))
* **notification:** add message params in notification id ([8834e82](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/8834e82))
* add `WINDOW` InjectionToken for SSR compatibility ([a34eb41](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/a34eb41))
* **pop-up:** add `PopUpService` ([ad16987](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/ad16987))
* **theme:** add `oblique-compat.scss` ([5a0aa0c](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/5a0aa0c))
* **toolchain:** remove `test_helpers` ([15416d2](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/15416d2))
* **unknown-route:** add feature ([e65f90a](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/e65f90a))

## BREAKING CHANGES
* **datepicker:** content projection has been removed
* **datepicker:** some `ngbDatePicker` properties are not accessible anymore
* **datepicker:** some `ngbDatePicker` properties can be set through the `options` input
* **datepicker:** some `ngbDatePicker` properties can be set through inputs.
* **datepicker:** navigation has been set to `select` instead of `arrows`
* **datepicker:** `forRoot` method has been removed
* **nav-tree:** `pathPrefix` input has been removed with no replacement. It was without effect anyway
* **toolchain:** `test_helpers` directory have been removed in favor of `ObliqueTestingModule`


# [4.1.1](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=4.1.1) (2019-10-18)

## Bug Fixes
* **packaging:** restore previous Oblique's translation keys ([82d4fa4](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/82d4fa4))


# [4.1.0](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=4.1.0) (2019-10-15)

## Bug Fixes
* **http-interceptor:** pass `sticky` parameter to notification ([88444f2](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/88444f2))
* **multiselect:** throw error with duplicate `id`s ([c1ac9e1](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/c1ac9e1))
* **notification:** use provided `sticky` value even if it's `false` ([df0ce69](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/df0ce69))
* **schema-validation:** let `orSchemaValidate` match reactive forms ([cd954e9](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/cd954e9))
* **theme:** do not use `unset` CSS value (IE11) ([a3a134a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/a3a134a))
* **theme:** fix icon position on datepicker for MD ([0f9d457](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0f9d457))
* **theme:** use relative font size for typography ([2c699f2](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/2c699f2))

## Features
* **error-messages:** add directive to show errors with MD ([f58bbb5](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f58bbb5))
* **http-interceptor:** add helper functions to tweak the interceptor ([2dd5a89](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/2dd5a89))
* **multiselect:** add `count` property ([bd9b7a1](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/bd9b7a1))
* **multiselect:** add `titleProperty` and  `titleFormater` ([29ac09c](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/29ac09c))
* **multiselect:** add selected items list for accessibility ([ebf2ec4](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/ebf2ec4))
* **notification:** can clear all notifications on navigate ([7a80920](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7a80920))
* **notification:** can group similar notifications ([1b7e408](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1b7e408))
* **telemetry:** add telemetry feature ([ed149d2](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/ed149d2))
* **theme:** improve errors and hints rendering for MD ([313952c](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/313952c))
* **theme:** add relative font sizes ([03bd4a5](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/03bd4a5))
* **toolchain:** add support for multiple translation files ([6672112](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/6672112))
* **toolchain:** provide translation files with Oblique and common keys ([7422c16](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7422c16))
* **utilities:** add `MockTranslateService` to `test_helpers` ([2a908a7](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/2a908a7))


# [4.0.3](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=4.0.3) (2019-09-25)

## Bug Fixes
* **column-layout:** do not use `unset` CSS value (IE11) ([beb1b92](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/beb1b92))
* **dropdown:** better align the bubble-tail ([c0d3db3](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/c0d3db3))
* **dropdown:** do not use `unset` CSS value (IE11) ([4741130](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/4741130))
* **filter-box:** allow multiple prefix and suffix ([9fbf6f8](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/9fbf6f8))
* **master-layout:** do not use `unset` or `initial` CSS values (IE11) ([aee60b5](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/aee60b5))
* **master-layout:** fix scroll `padding-bottom` on `.application` ([e82c1eb](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/e82c1eb))
* **search-box:** do not animate left and right padding of hit list ([d00f359](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d00f359))
* **search-box:** do not use `unset` CSS value (IE11) ([bac090f](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/bac090f))
* **theme:** `themes$` observable deliver `THEMES` instead of `string` ([b440bff](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b440bff))
* **theme:** add `margin-top` to avoid clipping label with Material ([928df57](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/928df57))
* **theme:** align Material's `prefix` and `suffix` with input text ([8b1035d](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/8b1035d))
* **theme:** do not use `unset` CSS value (IE11) ([5e69d96](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/5e69d96))
* **theme:** fix Bootstrap's `input-groups` dropdown appearance ([909a444](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/909a444))
* **theme:** fix bootstrap's prepend and append icon height ([270d9d3](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/270d9d3))
* **theme:** improve contrast of bootstrap's `list-group` ([eb0b3f7](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/eb0b3f7))
* **theme:** show full hint or error texts only on hover ([aeafaf2](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/aeafaf2))


# [4.0.2](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=4.0.2) (2019-09-17)

## Bug Fixes
* **datepicker:** export as `orDatePicker` ([bea3ab6](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/bea3ab6))
* **dropdown:** fix `z-index` ([46d0d03](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/46d0d03))
* **dropdown:** fix position with material design ([05d7eed](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/05d7eed))
* **error-messages:** export as `orErrorMessages` ([cceec64](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/cceec64))
* **form-control-state:** export as `orFormControlState` ([f4e6353](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f4e6353))
* **master-layout:** fix double scrollbar ([32d16fe](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/32d16fe))
* **master-layout:** fix flickering upon scrolling ([9c80b4b](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/9c80b4b))
* **master-layout:** fix layout with `hasScrollTransition` disabled ([279a1ed](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/279a1ed))
* **master-layout:** footer service monitor footer `hasScrollTransition` property ([1f24a99](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1f24a99))
* **master-layout:** show off-canvas backdrop below layout collapse ([9f0fef3](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/9f0fef3))
* **master-layout:** use initial value of `hasScrollTransition` ([9bc4da7](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/9bc4da7))
* **notification:** do not use `KeyWithParams` interface and deprecate it ([b141570](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b141570))
* **theme:** add `margin-bottom` to alert ([aa8d175](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/aa8d175))
* **theme:** add bootstrap's grid to `oblique-utilities` ([6c97ef6](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/6c97ef6))
* **theme:** add scroll on `pre` element ([0506d5a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0506d5a))
* **theme:** correctly read `FRUTIGER` value ([9864fd5](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/9864fd5))
* **theme:** do not add border and padding to `code` within `pre` ([becfa83](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/becfa83))
* **theme:** add fontawesome 5 font files ([7f00f15](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7f00f15))
* **theme:** add fontawesome SCSS files ([2915181](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/2915181))
* **theme:** remove fontawesome 4 font files ([d6ddd04](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d6ddd04))
* **toggle:** can place toggle before or after ([f609400](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f609400))
* **toolchain:** fix `dist` on Windows ([1fe07f9](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1fe07f9))


# [4.0.1](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=4.0.1) (2019-08-15)

## Bug Fixes
* **master-layout:** use white for heading in `offcanvas-sidebar` only ([daabf9b](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/daabf9b))
* **theme:** integrate FA5 CSS with oblique-core without `@import` ([bfe26de](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/bfe26de))


# [4.0.0](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=4.0.0) (2019-08-14)

## Bug Fixes
* **master-layout:** fix `off-canvas` animation ([4063da7](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/4063da7))
* **master-layout:** reduce `off-canvas` header height if header is collapsed ([6143bc3](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/6143bc3))
* **master-layout:** set `default-layout` to `off-canvas` content ([a330416](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/a330416))
* **master-layout:** use white color for headings within `off-canvas` ([6e20249](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/6e20249))
* **master-layout:** fix accessibility quick links ([0083863](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0083863))
* **master-layout:** no `overflow` on main navigation ([47e9841](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/47e9841))
* **master-layout:** timing issue with `application-scrolling` ([0e42337](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0e42337))
* **master-layout:** close main navigation menu on `Escape` ([b8c61ba](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b8c61ba))
* **master-layout:** close main navigation menu on outside click ([70a4714](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/70a4714))
* **master-layout:** main navigation menu is active when sub-route is active ([601dd2f](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/601dd2f))
* **toggle:** remove leading whitespace in class list ([8df4c32](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/8df4c32))
* **search-box:** fix bootstrap rendering ([c4f924d](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/c4f924d))
* **search-box:** mouse up and down events are not propagated ([076fb5a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/076fb5a))
* **theme:** add `nav-tabs` component ([3e529b9](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/3e529b9))
* **theme:** fix stepper with material ([d5bfc58](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d5bfc58))
* **multiselect:** correctly pass prepend to filter-box ([92143f4](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/92143f4))
* **multiselect:** correctly handle `disable` state ([b434daf](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b434daf))
* **packaging:** `test_helpers` is correctly copied ([33d3c0f](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/33d3c0f))

## Features
* **master-layout:** add `scrolled` event to provide scroll offset ([959e8b1](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/959e8b1))
* **master-layout:** navigation is displayed with multiple columns with full width ([1099780](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1099780))
* **master-layout:** full width main navigation is disabled by default ([c30ad65](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/c30ad65))
* **master-layout:** use lighter grey on submenu item hover ([80d5e56](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/80d5e56))
* **notification:** only `oblique` chanel has `position: fixed` ([8143f54](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/8143f54))
* **notification:** add `id`s on notification's elements ([b68d340](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b68d340))
* **notification:** remove `default` notification ([0a54f3e](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0a54f3e))
* **theme:** add `$brand-info` colors and use them ([c2e02f4](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/c2e02f4))
* **theme:** add `theme` service to take care of themes and fonts ([a76fc20](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/a76fc20))
* **theme:** add all CI/CD colors and use them ([e4a540b](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/e4a540b))
* **theme:** redefine material color palette with oblique colors ([f91087c](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f91087c))
* **theme:** redefine typography ([35a3727](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/35a3727))
* **theme:** replace `OpenSans` with `Frutiger` and `Arial` as fallback ([00c839d](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/00c839d))
* **theme:** style `table` according to CI/CD ([2712f1e](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/2712f1e))
* **theme:** adjust colors ([72d25a0](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/72d25a0))
* **theme:** provide minified css files in the dist ([80e3362](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/80e3362))
* **theme:** separate `oblique-bootstrap` from `oblique-core` ([8dcd1b8](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/8dcd1b8))
* **theme:** extract alert into a standalone css component ([bbab6cc](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/bbab6cc))
* **theme:** remove callout css component ([23be35e](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/23be35e))
* **theme:** add `oblique-utilities` ([82c5a3e](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/82c5a3e))
* **theme:** add `angular material` variant  ([cce3b02](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/cce3b02))
* **theme:** force `outline` input variant for all Oblique modules ([fb28717](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/fb28717))
* **theme:** `OBLIQUE_THEME` can be used to change the main theme ([a76fc208c78](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/a76fc208c78))
* **theme:** `FRUTIGER` can be used to disable `frutiger` font ([a76fc208c78](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/a76fc208c78))
* **multiselect:** add `id`s on multiselect's elements ([0ee04c1](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0ee04c1))
* **toggle:** can be activated by default with `active` input ([e092e6c](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/e092e6c))
* **toggle:** remove `toggle-collapse` class ([462c9c9](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/462c9c9))
* **dropdown:** add `dropdown` component ([7629d5a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7629d5a))
* **column-layout:** vertically center the toggle ([c9e1535](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/c9e1535))
* **filter-box:** add `angular material` variant ([cd7c148](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/cd7c148))

## Code Refactoring
* **package:** rename library to `@oblique/oblique` ([10095d5](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/10095d5))
* **theme:** rename `brand-danger` into `brand-error` ([61b473a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/61b473a))
* **datepicker:** remove `DatepickerModule` form `ObliqueModule` ([a8383e9](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/a8383e9))
* **toggle:** rename `activate` function into `toggle` ([3510496](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/3510496))
* **toggle:** use `@Input` instead of classes for toggle direction ([686f8d7](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/686f8d7))
* **master-layout:** remove `ScrollDetectionDirective` ([3c7af50](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/3c7af50))
* **master-layout:** rename `scrolled` event into `isScrolled` ([b0a975a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b0a975a))
* **master-layout:** separate MasterLayoutService into multiple files ([76a84f1](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/76a84f1))
* **unsaved-changes:** split code into 2 modules ([02df9ae](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/02df9ae))
* **notification:** simplify notification signatures ([6febfbe](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/6febfbe))
* **http-interceptor:** refactor according to notification changes ([c3e214a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/c3e214a))

## BREAKING CHANGES
* **toolchain:** `angular.json ` has to be patched, under `<projectName>.architect.build.options.assets`
	* change `"input": "node_modules/oblique-reactive/styles/images"` into `"node_modules/@oblique/oblique/styles"`
	* change `"output": "/assets/styles/images"` into `"output": "/assets/styles"`
* **package:** Oblique has been renamed `@oblique/oblique` to be consistent with angular naming. It means that all imports have to be updated and that the package is available under its new name
* **unsaved-changes:** all code related to Bootstrap's `tabset` has been moved into a new `UnsavedChangesTabsModule` module which has to be imported separately from `ObliqueModule`.
* **unsaved-changes:** to Monitor changes on Bootstrap's `tabset`, `orUnsavedChangesTabs` directive has to be used instead of `orUnsavedChanges`
* **datepicker:** `DatepickerModule` has to be imported separately from `ObliqueModule`
* **master-layout:** `ScrollEvents.scrolled` has been renamed into `ScrollEvents.isScrolled`
* **master-layout:** `ScrollDetectionDirective` has been removed with no replacement
* **master-layout:** all observables defined in `MasterLayoutService` have been moved into the relevant service and grouped under the `configEvents` observable in their respective service. This observable provides an object with a `name` (specified in parenthesis below) and a boolean `value`:
* **master-layout:** following observables have been replaced by the `configEvents` observable of `MasterLayoutComponentService`
	* `menuCollapsedChanged` (`MasterLayoutEventValues.COLLAPSE`)
	* `applicationFixedChanged` (`MasterLayoutEventValues.FIXED`)
	* `coverLayoutChanged` (`MasterLayoutEventValues.COVER`)
	* `noNavigationChanged` (`MasterLayoutEventValues.MAIN_NAVIGATION`)
	* `offCanvasChanged` (`MasterLayoutEventValues.OFF_CANVAS`)
* **master-layout:**  following observables have been replaced by the `configEvents` observable of `MasterLayoutHeaderService`
	* `headerCustomChanged` (`MasterLayoutEventValues.CUSTOM`)
	* `headerMediumChanged` (`MasterLayoutEventValues.MEDIUM`)
	* `headerAnimateChanged` (`MasterLayoutEventValues.ANIMATE`)
	* `headerStickyChanged` (`MasterLayoutEventValues.STICKY`)
	* `headerScrollTransitionChanged` (`MasterLayoutEventValues.SCROLL_TRANSITION`)
* **master-layout:**  following observables have been replaced by the `configEvents` observable of `MasterLayoutNavigationService`
	* `navigationFullWidthChanged` (`MasterLayoutEventValues.FULL_WIDTH`)
	* `navigationScrollableChanged` (`MasterLayoutEventValues.SCROLLABLE`)
* **master-layout:**  following observables have been replaced by the `configEvents` observable of `MasterLayoutFooterService`
	* `footerCustomChanged` (`MasterLayoutEventValues.CUSTOM`)
	* `footerSmallChanged` (`MasterLayoutEventValues.SMALL`)
	* `footerScrollTransitionChanged` (`MasterLayoutEventValues.SCROLL_TRANSITION`)
* **master-layout:**  all properties defined in `MasterLayoutService` have been moved into the relevant service:
	* `menuCollapsed` has become `layout.isMenuOpened`
	* `applicationFixed` has become `layout.isFixed`
	* `coverLayout` has become `layout.hasCover`
	* `noNavigation` has become `layout.hasMainNavigation`
	* `offCanvas` has become `layout.hasOffCanvas`
	* `customHeader` has become `header.isCustom`
	* `mediumHeader` has become `header.isMedium`
	* `animateHeader` has become `header.isAnimated`
	* `stickyHeader` has become `header.isSticky`
	* `scrollTransitionHeader` has become `header.hasScrollTransition`
	* `navigationFullWidth` has become `navigation.isFullWidth`
	* `navigationScrollable` has become `navigation.isScrollable`
	* `customFooter` has become `footer.isCustom`
	* `smallFooter` has become `footer.isSmall`
	* `scrollTransitionFooter` has become `footer.hasScrollTransition`
* **master-layout:**  several `MasterLayoutConfig` properties have been renamed:
	* `layout.fixed` has become `layout.isFixed`
	* `layout.cover` has become `layout.hasCover`
	* `layout.mainNavigation` has become `layout.hasMainNavigation`
	* `layout.offCanvas` has become `layout.hasOffCanvas`
	* `header.animate` has become `header.isAnuimated`
	* `header.sticky` has become `header.isSticky`
	* `header.medium` has become `header.isMedium`
	* `header.custom` has become `header.isCustom`
	* `header.scrollTransitions` has become `header.hasScrollTransitions`
	* `footer.small` has become `footer.isSmall`
	* `footer.custom` has become `footer.isCustom`
	* `footer.scrollTransitions` has become `footer.hasScrollTransitions`
	* `navigation.fullWidth` has become `navigation.isFullWidth`
	* `navigation.scrollable` has become `navigation.isScrollable`
* **master-layout:**  `scrolledLeft` and `scrolledRight` observables from `MasterLayoutNavigationService` have been grouped into a new `scrolled` observable that provides a positive offset for right scroll and a negative one for left scroll
* **master-layout:** `MasterLayoutConfig.navigation.fullWidth` is set to `false` by default
* **multiselect:** `orId` has been renamed into `idPrefix`
* **http-interceptor:** only notification's `title`, `text` and `type` can be configured
* **notification:**  remove `timeout` `@input`. Use notification's configuration instead
* **notification:**  remove `Notification` class in favor of `INotification` interface
* **notification:**  remove `NotificationEvent` interface in favor of `INotification` interface
* **notification:**  rename `ANIMATION_OUT_DURATION` into `REMOVE_DELAY`
* **notification:**  `default` notification has been removed
* **notification:**  `info`, `success`, `warning`, `error` and `send` functions have new signature
* **notification:**  `broadcast` function is now private, use `send` instead
* **toggle:** `activate` function has been renamed into `toggle`
* **toggle:**  `toggle` class is set automatically by the directive and shouldn't be manually specified
* **toggle:**  `toggle-*-*` direction classes have been removed in favor of values passed to the `orToggle` directive:
	* `down-up` (default)
	* `down-right`
	* `down-left`
	* `up-down`
	* `up-right`
	* `up-left`
	* `right-left`
	* `right-down`
	* `right-up`
	* `left-right`
	* `left-down`
	* `left-up`
* **theme:** `$brand-warning-semilight` has been removed, use `$brand-warning-light` instead
* **theme:** `$brand-danger` SCSS variable has been renamed into `$brand-error`
* **theme:** `callout` have been removed in favor of `alert`
* **theme:**  default material theme does not provide bootstrap's SCSS variables anymore
* **theme:**  following CSS classes have been dropped with no replacement:
	* `smaller`
	* `text-description`
	* `page-header`
	* `inversed`
	* `spacer-*`
	* `scrollable`
	* `has-indent`
	* `nav-pills`
	* `d-fixed-top`
	* `open visible-*`
	* `open hidden-open`
	* `collapsed visible-*`
	* `collapsed hidden-collapsed`
	* `dropcap`
	* `headline`
	* `reveal`
	* `stacks`
	* `tile`
* **theme:** almost all oblique mixins have either been removed or modified
* **theme:** following Oblique CSS components are only available with `bootstrap` theme:
	* `badge`
	* `button`
	* `dropdown`
	* `form-check`
	* `input-group`
	* `table`
* **filter-box:** prefixed content cannot be projected with `.input-group-prepend` anymore. Use `#prepend` instead.
* **filter-box:** suffixed content cannot be projected with `.input-group-append` anymore. Use `#append` instead.

<a name="3.1.1"></a>
# [3.1.1](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=3.1.1) (2019-04-29)

## Bug Fixes
* **master-layout:** close main navigation menu on `Escape` ([b8c61ba](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b8c61ba))
* **master-layout:** close main navigation menu on outside click ([70a4714](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/70a4714))
* **master-layout:** main navigation menu is active when sub-route is active ([601dd2f](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/601dd2f))
* **multiselect:** add `setDisabledState` function ([b434daf](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b434daf))
* **packaging:** `test_helpers` is correctly copied ([33d3c0f](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/33d3c0f))

<a name="3.1.0"></a>
# [3.1.0](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=3.1.0) (2019-03-12)

## Dependencies updates
* **Angular:** 7.2.8
* **ObliqueUI:** 3.0.0
* **ng-bootstrap:** 4.1.0
* **ngx-translate:** 11.0.1
* **ajv:** 6.10.0
* **rxjs:** 6.4.0
* **zone.js:** 0.8.29

### Bug Fixes
* **datepicker:** remove onDocumentClick ([3cd4b47](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/3cd4b47))
* **master-layout:** `offCanvas` can be dynamically toggled on/off ([2b00202](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/2b00202))
* **master-layout:** apply `nav-link` class on child anchors of header control ([74e528a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/74e528a))
* **master-layout:** custom navigation can be scrollable ([375a647](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/375a647))
* **multiselect:** add customizable `id` to underlying input ([0423b82](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0423b82))
* **nav-tree:** pass `translateService` to the default formatter factory ([efa999a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/efa999a))
* **schema-validator:** accepts `properties` property to be empty or not present ([269a897](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/269a897))
* **security:** links to cross-origin destinations are unsafe ([595f0cf](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/595f0cf))
* **spinner:** delay `$state` change to avoid `ExpressionChangedAfterItHasBeenCheckedError` ([f23621e](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f23621e))
* **unsaved-changes:** use correct type for `Subscription` ([4f29c10](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/4f29c10))

### Features
* **error-messages:** use `orTranslateParams` instead of `translate` ([d2434ed](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d2434ed))
* **interceptor:** keep track of running requests ([e234f23](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/e234f23))
* **master-layout:** apply `control-icon` class automatically on `nav-link` elements ([669d94b](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/669d94b))
* **nav-tree:** translate labels ([901d42e](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/901d42e))
* **translate-params:** add `orTranslateParams` pipe ([4c27ed1](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/4c27ed1))


<a name="3.0.0"></a>
# [3.0.0](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=3.0.0) (2018-11-27)

## Dependencies updates
* **Angular:** 7.1.0
* **ObliqueUI:** 3.0.0
* **ng-bootstrap:** 4.0.0
* **ngx-translate:** 11.0.1
* **ajv:** 6.5.5
* **rxjs:** 6.9.3
* **tslib:** 1.9.3

## Bug Fixes
* **changelog:** use correct link to named versions ([207392c](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/207392c))
* **master-layout:** add a normal space on the right of the locale selection ([0186d2a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0186d2a))
* **master-layout:** apply `home` link on footer logo ([34afa1d](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/34afa1d))
* **master-layout:** improve contrast of locale buttons ([ee459f3](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/ee459f3))
* **off-canvas:** increase the size of the close button ([d39949c](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d39949c))
* **off-canvas:** do not set `default-layout` on off-canvas content ([7d90998](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7d90998))
* **master-layout:** ensure user chosen language is supported ([0e0cbd4](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0e0cbd4))
* **master-layout:** can dynamically update custom footer ([359c8ff](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/359c8ff))
* **master-layout:** close main navigation when sub-navigation is active on mobile mode ([11cac0e](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/11cac0e))
* **master-layout:** do not highlight `#content` and `#navigation` when focused ([2aa4540](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/2aa4540))
* **master-layout:** improve aspect of language selection buttons ([1df4f59](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1df4f59))
* **master-layout:** remove navigation jump link when there is no navigation ([0d6ea68](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0d6ea68))
* **master-layout:** remove navigation title when there is no navigation ([2372d92](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/2372d92))
* **master-layout:** use same language for both the default and current language ([1710405](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1710405))
* **nav-tree:** filtering treats regex terminals as string instead of throwing an error ([e415570](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/e415570))
* **master-layout:** `.navbar` inherits `background-color` from parent ([19d7a02](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/19d7a02))
* **master-layout:** jumplinks use angular route fragments ([d1f4b61](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d1f4b61))
* **master-layout:** transform `NodeList` into `array` (IE compatibility) ([5fd0b9a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/5fd0b9a))

## Features
* **master-layout:** remove `[orOffCanvas]` content projection from `MasterLayoutComponent` ([a50e91e](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/a50e91e))
* **master-layout:** add `[orFooter]` and `[orHeader]` content projection to use a completely custom content ([aca2775](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/aca2775))
* **master-layout:** add controls for offCanvas, custom header and footer and scroll transitions for header and footer ([0dde5ab](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0dde5ab))
* **master-layout:** add support for ids on navigation items ([014c916](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/014c916))
* **master-layout:** add support for `Enter` key for menu toggle ([4d0937d](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/4d0937d))
* **master-layout:** can now totally disable Oblique language management ([593cb77](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/593cb77))
* **master-layout:** can specify an id per locale ([885f5d6](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/885f5d6))
* **master-layout:** dropdown navigation can be toggled with `Enter` key ([b279e72](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b279e72))
* **master-layout:** dynamically add oblique classes on header controls ([b587df6](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b587df6))
* **master-layout:** move `ScrollingConfig.transitions.header` to `MasterLayoutConfig.header.scrollTransitions` ([08269d7](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/08269d7))
* **master-layout:** navigation can be scrollable ([81887ea](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/81887ea))
* **master-layout:** remove `[orFooterInfoSMCollapse]` ([80b12f6](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/80b12f6))
* **master-layout:** remove `[orFooterLinks]` content projection from `MasterLayoutComponent` ([1b3a45f](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1b3a45f))
* **master-layout:** remove `[orHeaderControls]` content projection from `MasterLayoutComponent` ([65f65eb](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/65f65eb))
* **master-layout:** remove `ORFooterLink` from `MasterLayoutConfig` ([be6dfd9](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/be6dfd9))
* **master-layout:** remove deprecated master layout code ([81fc6ff](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/81fc6ff))
* **master-layout:** use browser language as default and remove locale related warnings ([ffa5c3b](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/ffa5c3b))
* **master-layout:** use named templates for header controls and footer links ([6994b3f](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/6994b3f))
* **master-layout:** wrap `defaultLocale` and `locales` within `locale` ([9ea5ff2](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/9ea5ff2))

## Code Refactoring
* change `EventEmitter` to `rxjs.Subject` where applicable ([e3d57e3](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/e3d57e3))
* use the cli to build the distribution ([f703b61](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f703b61))


## BREAKING CHANGES
* **architecture**: `Subject` replace `EventEmitter`  
	* public event API from `MasterLayoutService` is renamed from `*Emitter` to `*Changed`
	* all subjects are encapsulated and only an observable is provided on the public API.
	* `emit` is no longer accessible, use dedicated function instead.
* **http-interceptor**: `ObliqueHttpInterceptorConfig` has been renamed to `ObliqueHttpInterceptorEvents` 
* **scrolling**: `ScrollingConfig` has been renamed to `ScrollingEvents` 
* **master-layout:** scroll duration  is accessible through `MasterLayoutConfig.scrollToTopDuration` instead of `ScrollingConfig.scrollDuration`
* **master-layout:** the content of the main off-canvas cannot be projected with `[orOffCanvas]` anymore. Use `[orOffCanvasTitle]` and `[orOffCanvasContent]` instead.
* **master-layout:** `defaultLocale` property has been renamed to `default` and is accessible through `MasterLayoutConfig.locale` instead of `MasterLayoutConfig`
* **master-layout:** `locales` property is accessible through `MasterLayoutConfig.locale` instead of `MasterLayoutConfig`
* **master-layout:** the whole header controls list cannot be projected with `[orHeaderControls]` anymore. Use `#orHeaderControl` instead
* **master-layout:** header and footer scroll transitions are accessible through `MasterLayoutConfig` instead of `ScrollingConfig`
* **master-layout:** following deprecated directives and services have been removed in favor of `MasterLayoutComponent`
	* `MasterLayoutApplicationDirective`
	* `MasterLayoutApplicationService`
	* `MasterLayoutFooterDirective`
	* `MasterLayoutFooterService`
	* `MasterLayoutHeaderDirective`
	* `MasterLayoutHeaderService`
	* `MasterLayoutNavigationDirective`
* **master-layout:** footer info for medium size footer cannot be projected with `[orFooterInfoSMCollapse]` anymore. Use `[orFooterInfo]` for all footer info, Oblique will display only the 1st line with small footer size on non collapsed mode
* **master-layout:** footer links cannot be projected with `[orFooterLinks]` anymore. Use `#orFooterLink` template instead
* **master-layout:** footer links cannot be set as an `ORFooterLink` list in `MasterLayoutConfig` anymore. Use `#orFooterLink` template instead
* **master-layout:** header control templates projected into `MasterLayoutComponent` must have `#orHeaderControl` attribute
* **architecture** The library is now delivered in Angular Package Format (APF). As a side-effect, the bundle name is now `oblique.reactive.umd.js`


<a name="2.1.2"></a>
# [2.1.2](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.1.2) (2018-09-25)

## Dependencies updates
* **Angular:** 6.1.8
* **ng-bootstrap:** 3.2.2
* **ajv:** 6.5.4
* **oblique-ui:** 2.0.2

## Bug Fixes
* **master-layout:** `menuCollapsed` is set to `false` when the menu is opened and to `true` when it is closed ([0dfdd92](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0dfdd92))
* **master-layout:** can provide the whole header controls list as content projection ([515af00](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/515af00))
* **master-layout:** controls are not focusable during header closure ([9c96bea](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/9c96bea))
* **master-layout:** each Oblique webapp has it's own language token ([8331bbe](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/8331bbe))
* **master-layout:** export everything in index.html ([91f4080](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/91f4080))
* **master-layout:** export MasterLayoutComponent as `orMasterLayout` ([f23e3d8](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f23e3d8))
* **master-layout:** header controls are automatically focusable when the layout is not collapsed ([f3413a8](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f3413a8))
* **master-layout:** masterLayoutDirective uses old selector for the menu toggle ([00949d0](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/00949d0))
* **master-layout:** set default `true` value for `menuCollapsed` ([25c0a80](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/25c0a80))
* **nav-tree:** correctly match active links ([425288e](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/425288e))
* **navigable:** correctly exports the directive ([7c9f36c](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7c9f36c))
* **off-canvas:** sidebar is shown on mobile view ([35b2ea3](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/35b2ea3))
* **off-canvas:** toggle is also activated on `enter` key ([7d29701](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7d29701))


<a name="2.1.1"></a>
# [2.1.1](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.1.1) (2018-09-07)

## Dependencies updates
* **Angular:** 6.1.7
* **ng-bootstrap:** 3.2.0
* **rxjs:** 6.3.2

## Bug Fixes
* **column-layout:** remove `console.log` ([8fa7a60](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/8fa7a60))
* **master-layout:** `defaultLocale` can also be specified in the config ([3c517dc](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/3c517dc))
* **master-layout:** footer links can be specified through an input as well ([16c4523](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/16c4523))
* **master-layout:** navigation links can be specified through an input as well ([271de5e](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/271de5e))
* **master-layout:** check validity of default locale before applying it ([26c917e](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/26c917e))
* **master-layout:** only display locale choice if there are multiple ones ([c7090d7](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/c7090d7))

<a name="2.1.0"></a>
# [2.1.0](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.1.0) (2018-08-29)

## Dependencies updates
* **Angular:** 6.1.3
* **ObliqueUI:** 2.0.1
* **Bootstrap:** 4.1.3
* **ng-bootstrap:** 3.0.0
* **ajv:** 6.5.3

## Bug Fixes
* **schema-validation:** do not return a `type` error with empty fields ([7418eb5](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7418eb5))

## Features
* **master-layout:** master layout can be controlled by a component, eliminating the use of `Handlebars` and `Gulp` (see master layout documentation) ([9079064](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/9079064))
* **off-canvas:** add static off-canvas with dedicated toggle ([b557845](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b557845))


<a name="2.0.0"></a>
# [2.0.0](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0) (2018-07-18)

## Dependencies updates
* **Angular:** 6.0.9
* **ObliqueUI:** 2.0.0
* **Bootstrap:** 4.1.2
* **ng-bootstrap:** 2.2.0
* **ngx-translate:** 9.0.2
* **ajv:** 6.5.2
* **rxjs:** 6.2.2
* **zone.js:** 0.8.26

## Features
* **http:** add a custom Http interceptor for Oblique-based projects ([1ab2986](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1ab2986))
* **spinner:** SpinnerComponent now supports channels in order to handle multiple spinners within the same page ([506e263](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/506e263))
* **multiselect:** MultiselectComponent is now exported as `orMultiselect` ([7d6cc9a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7d6cc9a))
* **multiselect:** dropped the input `[settings]`, every property of `MultiselectConfig` is now an input of `MuliselectComponent`. This ensures, that we can change the settings at runtime
* **toolchain:** PhantomJS has been removed in favor of ChromeHeadless (FirefoxHeadless under Windows as per privileges issues) ([0c34dce](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0c34dce))
* **toolchain:** add npm script & Gulp task for npm linking and watching distribution files ([8ed5c89](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/8ed5c89))
* **toolchain** Enable NodeJS 8+ & npm 5+ support.
* **orNavTreeFakeFocus:** add fake focus for `orNavTree` ([ea12cfb](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/ea12cfb))
* **text-control-clear:** add a `TextControlClearDirective` based on ObliqueUI `.text-control-clear` for clearing input controls ([c090f6e](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/c090f6e))
* **footer:** add configuration parameter for enabling small footer variant ([b399e26](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b399e26))
* **footer:** add Footer component for layout customization ([1bcb191](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1bcb191))
* **number-format:** add directive ([9a364c5](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/9a364c5))
* **unsubscribe:** add `Unsubscribable` class to unsubscribe form `Observable` ([d20d4bd](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d20d4bd))
* **column-layout:** dispose content within collapsible/expansible columns using `ColumnLayoutComponent` (or `ColumnPanelDirective` & `ColumnPanelDirective`) ([4348d51](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/4348d51))
* **filterBox:** add `size`, `disabled` and `readonly` attributes ([847d3a7](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/847d3a7))
* **formControlState:** add reactive form sample ([226d0d5](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/226d0d5))
* **schema-validation** add `getValidator` function for reactive forms ([d3ff5f3](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d3ff5f3))
* **schema-validation** add reactive form to the showcase ([1e4afde](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1e4afde))
* **schema-validation** move Draft06 transformation into a decorator ([75a8b8b](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/75a8b8b))
* **schema-validation** `SchemaValidationDirective` now accepts JSON schema draft 06 and partially drafts 04 and 03 as well.
* **toggle:** add `ToggleDirective` for icon toggle ([dc6f8e8](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/dc6f8e8))
* **unsavedChanges:** expose `discardChanges` function ([3e84226](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/3e84226))
* **master-layout:** provide a `noNavigation` parameter for collapsing the application navigation ([7ed28e5](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7ed28e5))
* **master-layout:** add a `MasterLayoutHeaderToggleDirective` for toggling the application header ([299a55b](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/299a55b))
* **master-layout** `MasterLayoutHeaderDirective` & `MasterLayoutHeaderService` added for controlling the application header.
* **master-layout** `MasterLayoutNavigation`, `MasterLayoutNavigationItem`, `MasterLayoutNavigationToggle` & `MasterLayoutNavigation` added for controlling the application navigation.
* **master-layout** `ScrollDetectionDirective` & `ScrollingConfig` added for controlling the application scroll.
* **notification:** can pass parameters to title and message translations ([d781e19](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d781e19))
* **notification:** use Angular animations for transitions (_enter_ & _leave_).
* **notification:** can now be configured using `NotificationConfig` for default notification parameters (`channel`, `sticky`, `timeout`).
* **document-meta** title `suffix` is now translated as well.
* **document-meta** page `title`, `suffix` and `description` are now translated on locale change.
* **filter-box**`FilterBoxComponent` added to building search pattern-like components.
* **form-control** `control-mandatory` CSS class is added if `required` attribute is set on form control.

## Bug Fixes
* **form-control-state:** fix `control-mandatory` class ([33c916d](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/33c916d))
* **toolchain:** ensure `--prod` parameter is properly propagated to `ng test` ([fd42fbc](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/fd42fbc))
* **toolchain:** ensure `prebuild` npm script is executed during `ci-build` ([482a4b6](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/482a4b6))
* **toolchain:** workaround for resolving Karma timeout issues on Windows (cf. https://github.com/karma-runner/karma-chrome-launcher/issues/154, https://github.com/karma-runner/karma/issues/2652) ([5526c37](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/5526c37))
* **datepicker-i18n:** fix german translation for short months labels ([f259a5d](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f259a5d)), closes [#579](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/issues/579)
* **navigable:** events are now successfully registered on new added navigables (which may be created by adding new data models) ([14c7121](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/14c7121))
* **MasterLayoutNavigationMenuDirective:** (MS Edge) access `HTMLElement.style.cssText` instead of `HTMLElement.style` to avoid *Assignment to read-only properties is not allowed in strict mode* runtime errors ([eb689de](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/eb689de))
* **NavTreeFakeFocusDirective:** (MS Edge | IE) use `KeyboardEvent.keyCode` instead of `KeyboardEvent.key` for browser compatibility ([f41daa7](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f41daa7))
* **orMasterLayoutHeaderToggle:** Fix lint error ([f465266](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f465266))
* **notification:** do not show default title if a title is provided ([3e6810a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/3e6810a))
* **notification:** add `alert-default` class to default alerts ([dac70b1](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/dac70b1))
* **schema-validation:** `SchemaValidationModule` now provides `schemaValidationService` ([acbc7f9](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/acbc7f9))
* **AoT:** avoid lambda function on providers ([8a90825](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/8a90825))
* **navigator:** fix routing to module ([74e2778](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/74e2778))
* **observable:** unsubscribe from all observables ([95b4b7a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/95b4b7a))
* **formControlState:**
	- `name` attribute is not mandatory. Either `ngModel`, `ngModelChange` or `formControlName` is ([7abce66](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7abce66))
	- for reactive forms, allow `pristineValidation` and set `control-mandatory` on page initialisation ([19d5f5c](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/19d5f5c))
	- remove `has-error` class on form reset ([d1c605f](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d1c605f))
* **schemaValidation:**
	- never pass null to ajv ([afc7468](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/afc7468), [4353179](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/4353179))
	- prevent multiple compile with same schema ([84c9dac](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/84c9dac))

## Code Refactoring
* **filter-box:** use the new `text-control` ObliqueUI component for clearing filter box control (& refactor other component to use `OrFilterBox`) ([ea3d02e](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/ea3d02e))
* **orNavTree:** use `ngTemplate` instead of recursive component ([b8e9e59](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b8e9e59))
* **orNavTreeFakeFocus:** do not change CSS resources at runtime, reorganize source code and fix some minor issues ([f8882c7](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f8882c7))
* **toolchain:** migrate to Gulp 4 ([788c987](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/788c987))
* **navigator:** rename `orNavigator` into `or-navigator` ([0cb9f47](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0cb9f47))
* **scss:** remove module SCSS resources and cleanup showcase ones ([d2f3383](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d2f3383))

## BREAKING CHANGES
* **navigable:**
	- `NavigableGroupComponent` is now exported as `orNavigableGroup`
	- `NavigableDirective` is now exported as `orNavigable`
* **navigator:** rename `orNavigator` into `or-navigator`
* **scss:** remove any import of ObliqueReactive CSS styles (mainly in your Angular CLI configuration) as they are now bundled with components.
* **Webpack**:
	- ObliqueUI CSS & images folders are now located directly on the root of the dependency module instead of the `dist/` folder. These references should be adapted on your [Angular CLI](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse/.angular-cli.json?at=2.0.0-RC.2) configuration.
	- ObliqueUI JavaScript resources are no more required to run ObliqueReactive-based applications. These references should be removed from the [Angular CLI](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse/.angular-cli.json?at=2.0.0-RC.2) configuration.
* **master-layout**:
	* ObliqueUI master layout has been completely refactored. Refer to ObliqueUI changelog for potential breaking changes.
	* `LayoutManagerService` has been renamed to `MasterLayoutApplicationService`
* **animations:**
	* You need to include an animation strategy module in your app as some ObliqueReactive components are using Angular animations. Simply import `BrowserAnimationsModule` (or alternatively `NoopAnimationsModule` if you prefer to disable animations) in your `app-module.ts`.
* **multiselect:**
	- If you used `[settings]` of `MultiselectComponent` you now have to bind every config value separately.
* **toolchain:** ObliqueReactive has been migrated to Angular 4. This of course breaks all compatibility to any previous release of ObliqueReactive. 


<a name="1.5.0"></a>
# [1.5.0](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.5.0) (2019-03-20)

## Dependencies updates
* **AngularJS:** 1.7.8
* **@uirouter/angularjs:** 1.0.22

##Bug Fixes
* **form-control-state**: add has-error on init only if pristineValidation is explicitly set to true ([1898d04](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1898d04))
* **form-control-state**: correct handling of control-mandatory class ([b601989](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b601989))


<a name="1.4.1"></a>
# [1.4.1](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.4.1) (2018-10-23)

## Refactor
* remove external dependencies
* move workflow to new jenkins

## Dependencies updates
* **@uirouter/angularjs:** 1.0.20
* **angular-dynamic-locale:** 0.1.37
* **angular-translate:** 2.18.1
* **angular-ui-scroll:** 1.7.2
* **lodash:** 4.17.11
* **moment:** 2.22.2
* **oblique-ui:** 1.3.4

## Bug Fixes
* **multiselect**: remove custom `checkboxes`  


<a name="1.4.0"></a>
# [1.4.0](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.4.0) (2018-03-20)

## Dependencies updates
* **AngularJS:** 1.6.9
* **@router/angularjs:** 1.0.15
* **angular-dynamic-locale:** 0.1.35
* **angular-translate:** 2.17.0
* **angular-ui-bootstrap:** 2.5.6
* **angular-ui-scroll:** 1.7.0
* **lodash:** 4.17.5
* **moment:** 2.21.0
* **animate.css:** 3.6.1

## BREAKING CHANGES
* deprecated `angular-ui-router` has been dropped in favor of `@router/angularjs`
	- the project's dependencies have to be updated
	- the project's typings related to router have to be updated
	- `$stateChange*` events are replaced with [Transitions hooks](https://ui-router.github.io/ng1/docs/latest/classes/transition.transitionservice.html)


<a name="1.3.9"></a>
# [1.3.9](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.9) (2017-10-17)

## Bug Fixes
* **schemaValidation:** accept zero for `number` and `integer` inputs ([7a14c14](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/7a14c14))


<a name="1.3.8"></a>
# [1.3.8](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.8) (2017-09-18)

## Bug Fixes
* **number-format:** ensure model value is always of type number (instead of string) ([b90fcf7](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/b90fcf7))


<a name="1.3.7"></a>
# [1.3.7](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.7) (2017-08-15)

## Features
* **number-format:**
	- provide a `NumberFormatConfig` to customize `number-format` default settings ([bea72fe](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/bea72fe))
	- add a `update-model-decimals` scope attribute to defines if decimals formatting should be applied on model value as well ([bea72fe](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/bea72fe))

## Bug Fixes
* **translation:** normalize translations keys ([f9e8c7a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/f9e8c7a))
* **translation:** use `oblique` prefix for `unsavedChanges` validation message ([b9205d4](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/b9205d4))

<a name="1.3.6"></a>
# [1.3.6](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.6) (2017-05-24)

## Bug Fixes
* **datepicker:** providing custom template for the uib-datepicker-popup, this ensures the rebinding of the min- and max-dates ([11767d8](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/11767d8)), closes [#OUI-464](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-464)


<a name="1.3.5"></a>
# [1.3.5](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.5) (2017-05-11)

## Dependencies updates
* **AngularJS:** 1.6.4
* **tv4:** 1.3.0
* **moment:** 2.18.1

## Bug Fixes
* **datepicker:** parse programmatically changed min- and max-dates ([46ab410](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/46ab410)), closes [#OUI-448](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-448)
* **number-format:** ensure that empty values are correctly parsed and that formatter understands 0 decimals ([0d87acb](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/0d87acb)), closes [#OUI-449](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-449) [#OUI-450](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-450)

## Features
* **date-picker:** new `dateChange` binding allows tracking of `ngModel` changes ([ea5de08](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/ea5de08)), closes [#OUI-447](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-447)


<a name="1.3.4"></a>
# [1.3.4](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.4) (2017-04-11)

## Bug Fixes
* **error-messages:** renders error messages at the same time as form-control adds the has-error class ([7d9003a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/7d9003a))
* **datepicker:** triggers min/max validation if the min or max value changes ([123fed5](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/123fed5))
* **number-format:** keeps an invalid viewValue on focus ([d9d19e4](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/d9d19e4))

## Features
* **number-format:** only parses number if its not `NaN` ([8e452b0](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/8e452b0))

## BREAKING CHANGES
* **datepicker:** Now uses the ngModelOption `allowInvalid = true`: Dates that do not pass the min/max validation will still be written to the model ([123fed5](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/123fed5))


<a name="1.3.3"></a>
# [1.3.3](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.3) (2017-03-16)

## Bug Fixes
* **error-messages:** `ORErrorMessagesModule` is now exported

## Features
* **error-messages:** add option `showErrorMessages` on the `DatepickerPopupConfig`, if set to `true` the `date-picker` will show the `error-messages` by itself (default: true) 

Can be globally configured like this:

```
   angular.module('appModule').config((uibDatepickerPopupConfig:DatepickerPopupConfig) => {
        uibDatepickerPopupConfig.showErrorMessages = false;
    });
```

## BREAKING CHANGES
* **error-messages:** `error-message` was renamed to `error-messages`


<a name="1.3.2"></a>
# [1.3.2](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.2) (2017-03-14)

## Dependencies updates
* **ObliqueUI:** 1.3.2
* **AngularJS:** 1.6.2
* **angular-translate:** 2.15.1
* **angular-ui-bootstrap:** 2.5.0

(see [package.json](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse/package.json?at=1.3.1) for the full list of dependencies)

## Bug Fixes
* **datepicker:** `appendToBody` option does not change the style of the popup ([ea189b7](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/ea189b7))
* **form-inline:** ensure custom components are displayed correctly under `.form-inline` ([e9662c4](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e9662c4))
* **ObliqueHttpInterceptor:** do not stop `loadingService` for silent or back-end calls ([c906532](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/c906532))
* **publish:** execute ngAnnotate during `publish` build task ([8b78254](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/8b78254))

## Features
* **error-messages:** implementation of an `error-message-component` for displaying validation errors ([d2796f0](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/d2796f0))
* **date-picker:**
	- the new `error-message-component` is now used to render `date-picker` validation messages ([f70a818](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/f70a818))
	- add placeholder option, which accepts a text or a translation key ([a0d88da](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/a0d88da)), [#OUI-395](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-395))
* **i18n:** locales are now added to the lib and use a `oblique` prefix ([cdb20da](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/cdb20da)), [#OUI-389](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-389), [#OUI-394](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-394)). See breaking changes below as well.
* **SchemaValidation:** use `schema-validator` to determine if an input is mandatory ([26f13ad](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/26f13ad))
* **unsaved-hanges:** unsaved changes within modals are now tracked as well ([7355e69](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/7355e69))
* **modules:** add modules for most components ([a9bd573](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/a9bd573))
	- **ORDatepickerModule**
	- **ORErrorMessageModule**
	- **ORFormControlModule**
	- **ORInfrastructureModule**
	- **ORLoadingModule**
	- **ORMultiselectModule**
	- **ORNavigableModule**
	- **ORNavigatorModule**
	- **ORNotificationModule**
	- **ORSchemaValidationModule**
	- **ORTopControlModule**
	- **ORTypeaheadModule**
	- **ORUnsavedChangesModule**
	- **ORUtilModule**

## BREAKING CHANGES
* **i18n:** ObliqueReactive locales have a new prefix (`i18n.oblique`) and get published:
	- you have to remove the ObliqueReactive specific translation codes from your locales and merge them together with a gulp task. See merge-i18n task in ObliqueReactiveSeed
	- if you use texts that are now published with ObliqueReactive you have to change the prefix from `i18n` to `i18n.oblique` everywhere you use them
* `HttpInterceptor` has been renamed to `ObliqueHttpInterceptor` ([c727ac7](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/c727ac7)). If you use `ObliqueHttpInterceptor`, you will have to update the interceptor config in your `app.module` from `$httpProvider.interceptors.push('ObliqueHttpInterceptor');` to `$httpProvider.interceptors.push('HttpInterceptor');`.


<a name="1.3.1"></a>
# [1.3.1](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.1) (2017-01-24)

## Dependencies updates
* **ObliqueUI:** 1.3.1
* **AngularJS:** 1.6.1
* **angular-ui-bootstrap:** 2.4.0
* **angular-ui-router:** 0.4.2

(see [package.json](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse/package.json?at=1.3.1) for the full list of dependencies)


<a name="1.3.0"></a>
# [1.3.0](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.0) (2016-12-12)

## Dependencies updates
* **ObliqueUI:** 1.3.0
* **AngularJS:** 1.6.0
* **angular-translate:** 2.13.1
* **angular-ui-bootstrap:** 2.3.1
* **angular-ui-router:** 0.3.2
* **lodash:** 4.17.2
* **moment:** 2.17.1

(see [package.json](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse/package.json?at=1.3.0) for the full list of dependencies)

## Features
* **form-control:** rewrite `has-error` directive in order to provide better handling on form controls (validation and mandatory states), see breaking changes as well ([9aac98d](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/9aac98d))
* **unsaved-changes:** integrate `UnsavedChangesDirective` and provide an usage sample ([1b91cf4](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/1b91cf4))
* **top-control:** add a wrapper for the ObliqueUI [TopControl](https://eui.bit.admin.ch/oblique-ui/1.3.0/components.html#components-feedback-top-control) component ([d423315](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/d423315))
* **webpack:** bundle UI with Webpack and separate `showcase` and `src` builds ([526e803](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/526e803))
* **typescript:** rewrite ObliqueReactive into TypeScript ([3db0ca7](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/3db0ca7), [1e702e4](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/1e702e4), [9503d46](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/9503d46))
* **sourcemaps:** sourcemap integration in dev and publish build ([9e2504c](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/9e2504c))
* **css:** ObliqueReactive Less resources are now bundled ([dc84849](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/dc84849))

## Bug Fixes
* **notifications:**
	- ensure notification message key is correctly retrieved for translation ([e028fd4](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e028fd4))
	- removed CSS class `.lead` to match ObliqueUI [notifications](https://eui.bit.admin.ch/oblique-ui/1.3.0-RC.8/components.html#components-dialogs-notifications) specs ([a01b0ef](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/a01b0ef))
* **spinner:**
	- callable from other controllers than `app-controller` ([b9d527d](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/b9d527d))
	- overlay uses the fixed variant ([e343224](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e343224))
* **datepicker:** fix min/max date validation ([9cea457](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/9cea457))
* **multiselect:** add support for schema validation ([506d8ec](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/506d8ec))
* **navigable:** ensure `navigable-activate` and `navigable-highlight` are properly evaluated ([ba992b7](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/ba992b7))
* **navigator:** ensure UP & BACK navigation is performed as expected ([53113d5](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/53113d5))
* **validation:**
	- datepicker + schema-validate ([5e40bca](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/5e40bca), [487126d](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/487126d))
	- ensure `date-picker`, `schema-validation` and `has-error` directives work nicely together, add support for JSON schema v3 & update live examples ([d4ae8dc](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/d4ae8dc))

## Code Refactoring
* **validation:** normalize namings of validation components (directives & events), see breaking changes as well ([817a9a0](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/817a9a0))

## BREAKING CHANGES
* **navigator:** `navigator` implementation is now based on AngularJS component design and needs to be referenced using the element tag (i.e. `&lt;navigator&gt;&lt;/navigator&gt;`) ([927d7e3](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/927d7e3))
* **notifications:** `notifications` implementation is now based on AngularJS component design and needs to be referenced using the element tag (i.e. `&lt;notifications&gt;&lt;/notifications&gt;`) ([ea2044d](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/ea2044d))
* **multiselect:** `multiselect` implementation is now based on AngularJS component design and needs to be referenced using the element tag (i.e. `&lt;multiselect&gt;&lt;/multiselect&gt;`) ([3ea1b53](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/3ea1b53))
* **date-picker:** `date-picker` implementation is now based on AngularJS component design and needs to be referenced using the element tag (i.e. `&lt;date-picker&gt;&lt;/date-picker&gt;`) ([d6e22eb](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/d6e22eb))
* **header-navigation:** partial needs to be updated to support ObliqueUI 1.3.0 (see [primary navigation](https://eui.bit.admin.ch/oblique-ui/1.3.0/components.html#components-navs-navbars-primary))
* **footer:** partial needs to be updated to support ObliqueUI 1.3.0 (see [footer](https://eui.bit.admin.ch/oblique-ui/1.3.0/components.html#components-branding-footer))
* **validation**:
	- `validation-schema` directive has been renamed into `schema-validation`
	- `validationSchemaEvent` event has been renamed into `schemaValidationEvent`
	- `validationBusinessEvent` event has been renamed into `businessValidationEvent`
* **has-error**: `has-error` directive is removed in favor of `form-control` component ([9aac98d](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/9aac98d))
	- `has-error="controlName"` becomes `&lt;form-control name="controlName" /&gt;`
	- `has-error-pristine` becomes `&lt;form-control pristine-validation /&gt;`


<a name="1.2.7"></a>
# [v1.2.7](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=v1.2.7) (2016-05-31)

## Features
* **navigable:**
	- enable item activation on load ([93f46f0](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/93f46f0))
	- enable item highlighting on load ([e57a76a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e57a76a))
* **npm:** remove Bower and use only npm to fetch all dependencies ([094709a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/094709a), [2e01c74](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/2e01c74), [e8f9e2f](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e8f9e2f), [929bf49](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/929bf49))

## Bug Fixes
* **navigable:** ensure `navigable` item gets activated when a child element gets focused ([972e7ad](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/972e7ad), [df64911](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/df64911))
* **ngAnimate:** ensure `ngRepeat` does not show stale items due to ngAnimate transitions ([51cbfdc](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/51cbfdc))
* **typeahead:** provide a workaround for scrollable AngularUI Typeahead suggestions and create a sample state to showcase it. ([cca3282](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/cca3282))


<a name="1.2.2"></a>
# [v1.2.2](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=v1.2.2) (2015-09-11)

## Features
* **delayed-change:** Added delayed-change directive for firing delayed callback when inputs value changes ([f84d177](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/f84d177))
* **locale:** enable i18n localization for 3rd-party directives (including AngularUI datepicker) ([d9e93fc](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/d9e93fc))
* **navigator:** implement a state navigator service & directive and provide sample usage ([e3ef760](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e3ef760))
* **auth:**
	- bind user roles with UI elements ([90cc7b3](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/90cc7b3))
	- finalize client-side authentication and refactor accordingly ([e75752a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e75752a))
	- prepare application for client-side authentication ([43addf0](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/43addf0))

## Bug Fixes
* **locale:** do not determine preferred language as locale keys are inconsistent across browsers ([8e55f4b](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/8e55f4b))
* **notifications:** notification can now be dismissed with the close button ([a24bf28](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/a24bf28))
* **schema-validation:** fix nested properties validation and showcase with a sample usage ([6ff2932](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/6ff2932))


<a name="0.0.3"></a>
# [v0.0.3](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=v0.0.3) (2015-03-18)

## Bug Fixes
* **notifications:** ensure notifications are correctly displayed for API exceptions ([527807e](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/527807e))

## BREAKING CHANGES
* notifications: API-specific methods are now scoped under `$http.api` (i.e. `$http.api.get()`, `$http.api.post()`, etc.)


<a name="0.0.2"></a>
# [v0.0.2](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=v0.0.2) (2015-03-11)

## Features
* **AppController:** enable global control for core UI components (layout, page title & spinner) ([58a25c8](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/58a25c8))
* **head-title:** implement composable block for the head `title` element and use `ng-bind` to avoid curlies (`{{}}`) FoC ([17e6404](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/17e6404))

## Bug Fixes
* **navbar-global:** use `ui-sref` and `ui-sref-active` directives instead of custom state handling ([cdd754d](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/cdd754d))
