# [12.2.2](https://github.com/oblique-bit/oblique/compare/12.2.1...12.2.2) (2025-01-10)

## Bug Fixes

- **side-navigation:** make sure a navigation occurs when the version is changed ([cad5ced8](https://github.com/oblique-bit/oblique/commit/cad5ced83ae3cc438c4597308e6d0f2c6f9ba871))

# [12.2.1](https://github.com/oblique-bit/oblique/compare/12.2.0...12.2.1) (2024-12-20)

## Bug Fixes

- **icon:** remove icon color example ([27db13c5](https://github.com/oblique-bit/oblique/commit/27db13c57395782633e89f9dff2ff2ce03385d01))
- **text-page:** scroll to fragment if present ([d9f81ce4](https://github.com/oblique-bit/oblique/commit/d9f81ce4e8596573c293a81ec26bb8340b0bb6f0))
- **text-page:** preserve fragments when navigating ([97a9e045](https://github.com/oblique-bit/oblique/commit/97a9e045ec0038b867b43a75a5fba3cabbf9dd97))

# [12.1.0](https://github.com/oblique-bit/oblique/compare/12.0.4...12.1.0) (2024-12-09)

## Bug Fixes

- **material:** add missing label to chips autocomplete example ([c78d591f](https://github.com/oblique-bit/oblique/commit/c78d591f192909c568a361f5b471c4090580ae1b))

## Features

- **banner:** get banner presence and content from directus ([d351e4f5](https://github.com/oblique-bit/oblique/commit/d351e4f582f9c71067936ba37fce4b6f5dd2b605))
- **banner:** avoid conflict with global `banner` class ([5443bce9](https://github.com/oblique-bit/oblique/commit/5443bce967aad481c76c2c1ef9eb0605225717e2))
- **component-page:** add newsletter ([ef7056e8](https://github.com/oblique-bit/oblique/commit/ef7056e804c011bb3459fa3768440b77ada4cdb9))
- **component-page:** add new component-page component ([bc6df8e0](https://github.com/oblique-bit/oblique/commit/bc6df8e03282b03f426ea7d8551facdc9c50c46f))
- **focus-with-outline:** add focus with outline example ([39550a95](https://github.com/oblique-bit/oblique/commit/39550a959bcb19d9b7c6c50123a426c109af870b))

# [12.0.4](https://github.com/oblique-bit/oblique/compare/12.0.3...12.0.4) (2024-11-29)

## Features

- **material:** add stretchTabs example for tabs ([d1a68625](https://github.com/oblique-bit/oblique/commit/d1a6862590932aded61d6574109925225992251a))

# [12.0.1](https://github.com/oblique-bit/oblique/compare/12.0.0...12.0.1) (2024-11-01)

## Bug Fixes

- **tabbed-page:** don't navigate to welcome page when clicking on component links ([22b84a83](https://github.com/oblique-bit/oblique/commit/22b84a834a08db3fd365892f8758478a93841a48))
- **text-page:** don't reload whole page for internal links ([f3cf8219](https://github.com/oblique-bit/oblique/commit/f3cf8219d4fd3d42fd8c72d47f51859c28bfb326))

# [12.0.0](https://github.com/oblique-bit/oblique/compare/11.3.4...12.0.0) (2024-10-08)

## Bug Fixes

- **cms:** add `base_url` tp the `Version` interface ([0b44b493](https://github.com/oblique-bit/oblique/commit/0b44b493aa3c51071533d88bd69f2d09951b2594))
- **code-examples:** fix error date example not showing an error ([3581e36a](https://github.com/oblique-bit/oblique/commit/3581e36ad0666af4544920cfa9dae2f6e413bee5))
- **paginator:** use `ObPaginatorModule` instead of `ObPaginatorDirective` ([57523ffb](https://github.com/oblique-bit/oblique/commit/57523ffb6d277fe865679d63a6cc06a769233ba0))
- **sds:** replace wrapping `span` with `main` ([dd5f8068](https://github.com/oblique-bit/oblique/commit/dd5f8068e0250163c8ffeca3af7e3f702b2622fa))
- **sds:** use higher contrast colors for accessibility ([0a077f25](https://github.com/oblique-bit/oblique/commit/0a077f25fb8a2ca59f5b40cefae5bb9709a47c1c))
- **side-navigation:** redirect to the correct page when the version changes ([377f0804](https://github.com/oblique-bit/oblique/commit/377f080425c106efccf6939e9cbaa87bdae2e954))
- **side-navigation:** make sure the selected version match the one in the URL ([af7e3636](https://github.com/oblique-bit/oblique/commit/af7e363693b8b43e483d06ad394a1b9c2a411bf2))
- **tabbed-page:** prevent interception of external links ([cff91ba7](https://github.com/oblique-bit/oblique/commit/cff91ba73c55d2aaa4a16d7819da54023338c7a5))
- **tabbed-page:** made routing handle reloads ([ef9ad9f3](https://github.com/oblique-bit/oblique/commit/ef9ad9f32a7a5fe01263c60c4170552e94a1fe7c))

## Features

- **banner:** hide the banner ([e207b41b](https://github.com/oblique-bit/oblique/commit/e207b41bca85961b1440819b836491195fc19a45))
- **banner:** make banner presence depend on a setting ([d4d2870e](https://github.com/oblique-bit/oblique/commit/d4d2870ed3eb5f658dba8773abf45b755a97cff4))
- **banner:** make banner responsive ([3da2fbce](https://github.com/oblique-bit/oblique/commit/3da2fbcedfb2cc6e5faec0ab09b3e884f0cb236f))
- **cms:** add a version service to store the version data ([360603f3](https://github.com/oblique-bit/oblique/commit/360603f37b7be34211344843577d04a1781dbe28))
- **code-examples:** remove datepicker code example page ([a8ceac85](https://github.com/oblique-bit/oblique/commit/a8ceac85bc94e83b676a9fce9f662538ffc69c6c))
- **code-examples:** move datepicker example to form examples ([d14bb14f](https://github.com/oblique-bit/oblique/commit/d14bb14fde71eb428d3b6d78fdca29848c4f1699))
- **code-examples:** improve error handling in form examples ([ad3faea0](https://github.com/oblique-bit/oblique/commit/ad3faea0d1e4663c01dc5b03b8410d18cf8ca318))
- **code-examples:** add datepickers to form examples ([6cd0e677](https://github.com/oblique-bit/oblique/commit/6cd0e6771d27cfcb67b5d7a782bb89d1a1cb4987))
- **code-examples:** add checkboxes & radiobuttons to form examples ([47b20802](https://github.com/oblique-bit/oblique/commit/47b208023a29db8e1d3404d8bae7648b27eb07b2))
- **feedback:** move trigger to the bottom on mobile view ([26f20cd8](https://github.com/oblique-bit/oblique/commit/26f20cd844f686e210902be64abefcfbc7014c8e))
- **master-layout:** add documentation for version 12 ([a4fbb986](https://github.com/oblique-bit/oblique/commit/a4fbb986696ff73ea4cda2a604e3ccd95a584ab6))
- **material:** add unit tests for material table ([98faf39f](https://github.com/oblique-bit/oblique/commit/98faf39f0e1fea4c88d0b90c70659b89e504665a))
- **material:** add selectable table code example ([8728c0a7](https://github.com/oblique-bit/oblique/commit/8728c0a7d67da2777db8abb7d7ccb03f7f25629c))
- **popover:** remove event example from version 11 ([2e878665](https://github.com/oblique-bit/oblique/commit/2e878665d904411d8f9b69f48b219e64ac940402))
- **popover:** add documentation for version 12 ([b8538680](https://github.com/oblique-bit/oblique/commit/b8538680c92be6ec24787903000f74b945c8907b))
- **popover:** add popover visibility change event example ([8062056a](https://github.com/oblique-bit/oblique/commit/8062056a8ee0cd77980b39ad70dabb3c477a03ad))
- **popover:** add example to demonstrate popover with large content ([f3fbe217](https://github.com/oblique-bit/oblique/commit/f3fbe21757e56466cc1bebec2d1fae3392e5ab3f))
- **sds:** add wildcard route ([1db70c0b](https://github.com/oblique-bit/oblique/commit/1db70c0b3b128e2571477775a0fb0e65891b7cdb))
- **side-navigation:** store version info into the version service ([40ca7448](https://github.com/oblique-bit/oblique/commit/40ca7448950b4c642c2c04f9670cb737f8d4feff))
- **side-navigation:** on mobile move side-navigation into an hamburger menu ([bc71e8a8](https://github.com/oblique-bit/oblique/commit/bc71e8a854c3cab3510f0376261a4863c7f386f0))
- **tabbed-page:** update the base url according to the current version in the API tab ([0fa648c6](https://github.com/oblique-bit/oblique/commit/0fa648c6909170a6b2ad1b6c1b929404a8e8d809))
- **tabbed-page:** redirect to welcome page if loading page fails ([1975cc73](https://github.com/oblique-bit/oblique/commit/1975cc730b5adb321cd9feda0df67b2755c5980f))
- **tabbed-page:** use `router.navigate()` when clicking on a link inside the deprecation notice ([19873511](https://github.com/oblique-bit/oblique/commit/19873511c221179a4c8d2802ace261acb788ab6c))
- **tabbed-page:** add deprecation notice to SDS ([32e0bc8c](https://github.com/oblique-bit/oblique/commit/32e0bc8c30904ebb35e3b11ef7659d86d4197a81))
- **text-page:** redirect to welcome page if loading page fails ([7af44d04](https://github.com/oblique-bit/oblique/commit/7af44d04ff669d562c436463d4717164e2f9dd95))

# [11.3.0](https://github.com/oblique-bit/oblique/compare/11.2.4...11.3.0) (2024-07-05)

## Features

- **code-examples:** add external link example ([1b16c1c5](https://github.com/oblique-bit/oblique/commit/1b16c1c56072f69eee6ff987d76288ad5671d6e8))
- **selectable:** add sample as custom form element ([f35bac94](https://github.com/oblique-bit/oblique/commit/f35bac94bfdefccf81576654ed67b356eee4503b))
- **styles:** enable separate scrolling for side navigation and content ([8b0f1eb3](https://github.com/oblique-bit/oblique/commit/8b0f1eb35b0281d18a05d420349f4c4eed444b55))

# [11.2.4](https://github.com/oblique-bit/oblique/compare/11.2.3...11.2.4) (2024-06-28)

## Bug Fixes

- **code-examples:** update link to new stackblitz unsaved changes example ([4ce4b9df](https://github.com/oblique-bit/oblique/commit/4ce4b9dfc8a53b77f8ee620beff58b984a6dd2f4))
- **code-examples:** update link to new stackblitz master layout example ([ece66f36](https://github.com/oblique-bit/oblique/commit/ece66f366fd457d78eb23a452c117773a139aadb))
- **code-examples:** update link to new stackblitz translations example ([b7dbb9a4](https://github.com/oblique-bit/oblique/commit/b7dbb9a4b8d1fe0114fd5a8115cf6a8b66f3e1c1))
- **code-examples:** update link to new stackblitz date pipe example ([955f5b69](https://github.com/oblique-bit/oblique/commit/955f5b69b03281797a6710a2584e9983d1500c40))
- **code-examples:** update link to new stackblitz unknown route example ([c4513de2](https://github.com/oblique-bit/oblique/commit/c4513de2165c6f8a817e0c0e87e93ec26dfbd7a0))
- **code-examples:** update link to new stackblitz setLocaleOnAdapter() example ([37348001](https://github.com/oblique-bit/oblique/commit/373480018292ff055021f0ff34e6c53ebad74d47))
- **code-examples:** update link to new stackblitz breadcrumb example ([b69fd0dc](https://github.com/oblique-bit/oblique/commit/b69fd0dc356abbdeb0b6ce2f0ae0d9e0d43ed184))
- **code-examples:** update link to new stackblitz column layout example ([b16cd2ea](https://github.com/oblique-bit/oblique/commit/b16cd2ea29256d66f55f4a371c518b77ebea3515))
- **code-examples:** update link to new stackblitz banner example ([25520008](https://github.com/oblique-bit/oblique/commit/25520008083a21781fbb3da1b4f12f4ca58ad3b2))
- **code-examples:** update link to new stackblitz off canvas example ([2334cf07](https://github.com/oblique-bit/oblique/commit/2334cf07bccd4d9189d41b1de8594f3e9776ca62))
- **side-navigation:** avoid mixing template driven and reactive forms on the version control ([d3a1256b](https://github.com/oblique-bit/oblique/commit/d3a1256b3fc3d077d9225e15c18b1a670822128e))

## Features

- **sds:** add banner for disability pride month ([4517e9cf](https://github.com/oblique-bit/oblique/commit/4517e9cf69b3371a226bacb1f404b213dd8e744f))

# [11.2.2](https://github.com/oblique-bit/oblique/compare/11.2.1...11.2.2) (2024-06-14)

## Bug Fixes

- **autocomplete:** ensure input prefix doesn't overlap with input label ([334d0e7d](https://github.com/oblique-bit/oblique/commit/334d0e7d47a06950ad80237d693284c5d1fea18b))
- **material:** ensure input prefix doesn't overlap with input label ([42b87846](https://github.com/oblique-bit/oblique/commit/42b8784648ab99f83917db134dce5ee578ed9a49))

# [11.2.1](https://github.com/oblique-bit/oblique/compare/11.2.0...11.2.1) (2024-06-07)

## Bug Fixes

- **focus-invalid:** remove `MatNativeDateModule` ([2c4223d7](https://github.com/oblique-bit/oblique/commit/2c4223d75fca2dea39cf0bf0228aa4805019658a))
- **material:** use swiss format for the datepicker ([a8fad51c](https://github.com/oblique-bit/oblique/commit/a8fad51cf8bd335a2a2ef04749355ddbe5d8d0fe))

## Features

- **material:** add validation on datepicker's min and max fields ([e74aff42](https://github.com/oblique-bit/oblique/commit/e74aff421b456dabd88e56f273f9e93b846510c7))
- **material:** add some context to the datepicker's other options ([b2b62a21](https://github.com/oblique-bit/oblique/commit/b2b62a210a5ba669e74acfa327f8db2d0a8c56a3))

# [11.2.0](https://github.com/oblique-bit/oblique/compare/11.1.3...11.2.0) (2024-05-31)

## Features

- **focus-invalid:** add new focus-invalid directive code example ([39a1fbd4](https://github.com/oblique-bit/oblique/commit/39a1fbd43f5df280c04b882a3eb4a4b3c4ce503c))
- **material:** add an avatar to the card example ([84fb18d4](https://github.com/oblique-bit/oblique/commit/84fb18d46d6cf777cd3b259c22c6d462d4e6aa56))
- **rxjs-operators:** add `obPauseWhenPageHidden` operator example ([3acfcf4a](https://github.com/oblique-bit/oblique/commit/3acfcf4a97349920c3cfbfe24cdd8bd028f2301b))
- **selectable:** add `disabled` feature ([4f22dece](https://github.com/oblique-bit/oblique/commit/4f22dece3600808eb9bf617504a35e9bddbc8c27))

# [11.1.3](https://github.com/oblique-bit/oblique/compare/11.1.2...11.1.3) (2024-05-24)

## Bug Fixes

- **tabbed-page:** make sure the selected tab has a new value each time the URL changes ([6c60bf54](https://github.com/oblique-bit/oblique/commit/6c60bf54474122d32546717a14606e3e61399382))
- **tabbed-page:** get the selected tab again each time the route changes ([af271a7e](https://github.com/oblique-bit/oblique/commit/af271a7e5b39d660b92ee2525ce68737b2bbcf18))

# [11.1.1](https://github.com/oblique-bit/oblique/compare/11.1.0...11.1.1) (2024-05-03)

## Bug Fixes

- **code-examples:** remove alert from translation example ([c670b451](https://github.com/oblique-bit/oblique/commit/c670b45158a2121a2c20d7f7d3f417650fae7ae3))

# [11.1.0](https://github.com/oblique-bit/oblique/compare/11.0.3...11.1.0) (2024-04-26)

## Features

- **button:** add right-side icon example ([436ad560](https://github.com/oblique-bit/oblique/commit/436ad560d8bb454c31404a6dcaf122601efcf699))
- **code-examples:** add list examples ([e48a2c0e](https://github.com/oblique-bit/oblique/commit/e48a2c0e1892e7352b14c910756c683021d1aba0))
- **icon:** change code example order ([0ea987a7](https://github.com/oblique-bit/oblique/commit/0ea987a7ed1dfb0799dd390944fab952807902e1))

# [11.0.3](https://github.com/oblique-bit/oblique/compare/11.0.2...11.0.3) (2024-04-19)

## Bug Fixes

- **material:** add `mat-chip-set`to code examples ([b174a40a](https://github.com/oblique-bit/oblique/commit/b174a40a6258644139c32e39610a595a3fea6b35))

## Features

- **side-navigation:** show exact latest version number in the versions dropdown ([fc565093](https://github.com/oblique-bit/oblique/commit/fc565093b72fbc51d8ce33eb4d50580d140a3ac6))

# [11.0.1](https://github.com/oblique-bit/oblique/compare/11.0.0...11.0.1) (2024-04-02)

## Bug Fixes

- **material:** ensure that badges are not overlapping text ([80122dc8](https://github.com/oblique-bit/oblique/commit/80122dc8cd011537b72be8393d506dedf8d1aeee))
- **sds:** ensure no heading levels are skipped ([c5c2ae8e](https://github.com/oblique-bit/oblique/commit/c5c2ae8e2a438cb7a12f12e283b564fbe3ad3e2b))
- **tabbed-page:** ensure that material components have enough time to load ([1d930bfd](https://github.com/oblique-bit/oblique/commit/1d930bfd98098a432988df34f474288772b6b8ae))
- **tabbed-page:** keep fragment in URL when navigating to a tab and then in the body ([12cef96f](https://github.com/oblique-bit/oblique/commit/12cef96fa0bfb990efa4787cdd79703e37a3693c))

# [11.0.0](https://github.com/oblique-bit/oblique/compare/10.3.1...11.0.0) (2024-02-22)

## Bug Fixes

- **code-examples:** use the correct hover and focus color, and icon ([eb725e0a](https://github.com/oblique-bit/oblique/commit/eb725e0ad92ca242abd6fc6a873225f45211a4d0))
- **code-examples:** add disabled value to disabled checkbox ([f01e412d](https://github.com/oblique-bit/oblique/commit/f01e412d6eda41e60f18ec9bcba753ea542fb1ed))
- **code-examples:** fix a typo that makes the content of the sticky component page not load ([3a24e76b](https://github.com/oblique-bit/oblique/commit/3a24e76b6f711cac0a6833c8772d76e5ff043e55))
- **code-examples:** display `form-example-input-clear-preview.component.scss` in preview ([0f350b79](https://github.com/oblique-bit/oblique/commit/0f350b7952cd566ce75476751cce0e5ef06c0df6))
- **code-examples:** add `min-width`s to input clear examples that overflowed ([30944d21](https://github.com/oblique-bit/oblique/commit/30944d219de918d32d121aa38f47fb7027175a4c))
- **code-examples:** fix required behavior in form ([a7331076](https://github.com/oblique-bit/oblique/commit/a7331076b5dd6e7843e71213ac445c07c9c52a4d))
- **code-examples:** remove warning about "Critical dependency" ([5ad25011](https://github.com/oblique-bit/oblique/commit/5ad250118c2f5d01e30d797651a89b76cfc644d0))
- **code-examples:** correct duplicate component selectors from copy paste ([a0fcdb45](https://github.com/oblique-bit/oblique/commit/a0fcdb452d5850eda3417893b657015b265b1508))
- **code-examples:** adjust `add-code-example` schematic to check for exact matches ([b46c4083](https://github.com/oblique-bit/oblique/commit/b46c4083137dea11609715450cd542e47dfa3289))
- **code-examples:** handle correct folder name in `CodeExamples` model ([59f7019c](https://github.com/oblique-bit/oblique/commit/59f7019cdb81ed0411387ed99670607c95efc326))
- **component-pages:** correct `.layout-column` by prefixing it with `&` ([dca826be](https://github.com/oblique-bit/oblique/commit/dca826bee15c2244794a01952ba3cb96bd7a6400))
- **component-pages:** correct typo ([7f4a88a2](https://github.com/oblique-bit/oblique/commit/7f4a88a224006bde4f89c0d471256dd31ee627f1))
- **component-pages:** `list-group` examples cleanup ([d7b51b19](https://github.com/oblique-bit/oblique/commit/d7b51b1910edb24c4ba31d0a5047d242a213de46))
- **component-pages:** rename tab property `title` to `name` to remove standard browser tooltip ([bdc4b99c](https://github.com/oblique-bit/oblique/commit/bdc4b99c84ce3f1c0433a8ac64df0532970e9897))
- **component-pages:** ensure a content is shown when no preview is available ([56219b79](https://github.com/oblique-bit/oblique/commit/56219b793da7c27cef1a4d47fa2f87dd689fd6a2))
- **feedback:** fix error messages not showing up when input is left blank ([d6bdcdb0](https://github.com/oblique-bit/oblique/commit/d6bdcdb0ebf994caea4273a7ea181de4552ecaa1))
- **icon:** make sure only the actual icon is enlarged ([214820fb](https://github.com/oblique-bit/oblique/commit/214820fbfb52ef04d0d774687a601facfbf0ac21))
- **material:** correct the surface color of the tooltip ([424e9649](https://github.com/oblique-bit/oblique/commit/424e9649314757c711a0bb63301a41eb417748b6))
- **material:** add NgOptimizedImage import to list Group code example to fix broken images ([5d9077f8](https://github.com/oblique-bit/oblique/commit/5d9077f8887f042dce66b5a62fa8a8546a902004))
- **material:** changed pictures in list group code examples to resolve licensing issue ([3428ace3](https://github.com/oblique-bit/oblique/commit/3428ace36a216d0b12a75318a4e522ac64a022cb))
- **material:** use the correct id for the slider's preview ([818371d7](https://github.com/oblique-bit/oblique/commit/818371d72493fb68ab46b7fa8dc9c019769921f1))
- **notification:** deduplicate css selector ([d504fe83](https://github.com/oblique-bit/oblique/commit/d504fe83d1a49ce9e6c71c0bc4028bab448c092d))
- **notification:** remove `PreviewComponent` interface ([9db5ab52](https://github.com/oblique-bit/oblique/commit/9db5ab520bb83cb68af5d0352a50548be14fc3fa))
- **off-canvas:** update the stackblitz example ([2a4822d9](https://github.com/oblique-bit/oblique/commit/2a4822d96211c92de2f685c1c08700555d3ba847))
- **schematics:** correct the path to the `CodeExamplesMapper` ([390bb591](https://github.com/oblique-bit/oblique/commit/390bb5911a7fdca5a9dd313deecb89a96bf60937))
- **sds:** make left menu button outline be visible again ([b886569b](https://github.com/oblique-bit/oblique/commit/b886569ba9a3d514bc07b973156037df8922b38f))
- **sds:** do not load SDS translations files as they do not exist ([b39fc9b6](https://github.com/oblique-bit/oblique/commit/b39fc9b68280efa6a828f52ba325d4a6c4a7621d))
- **sds:** initialize the `TranslateService` so that translations are loaded ([fea167de](https://github.com/oblique-bit/oblique/commit/fea167ded344cfec1856bb005c0cef7fad33a35f))
- **side-navigation:** always use default font size for all viewports ([43cfde3f](https://github.com/oblique-bit/oblique/commit/43cfde3ffd8febe3712f29968cf2280bc80a84c3))
- **side-navigation:** remove margin-bottom from last navigation element ([280f4cad](https://github.com/oblique-bit/oblique/commit/280f4cadd75fbe16e150d1c0b8ed559535ad20ed))
- **side-navigation:** make links in navigation unclickable when collapsed ([13b5b6df](https://github.com/oblique-bit/oblique/commit/13b5b6df448e762d9b2d4be05a8d94a4bab25ab1))
- **styles:** remove min-with property of first `td` ([2d4400d8](https://github.com/oblique-bit/oblique/commit/2d4400d8120561999cc9bc46e81391dc3dccd6ef))
- **styles:** scope out headings scss file to resolve interference with sticky code examples ([fab184bf](https://github.com/oblique-bit/oblique/commit/fab184bfc055390110f864d4f5e3947d97ff7f20))
- **styles:** make sure table styles are only applied to code from Directus ([380cbc9e](https://github.com/oblique-bit/oblique/commit/380cbc9ef4b0c61c4651eb4f435be48c1dbc460f))
- **styles:** ensure table styles for API don't affect Oblique tables ([7433b137](https://github.com/oblique-bit/oblique/commit/7433b1373e4d000451a3cafee4ca99429c48946b))
- **tabbed-page:** allow sub pages ([0370c062](https://github.com/oblique-bit/oblique/commit/0370c062f6f7fb1f88f4414894bc7103d0367fec))
- **tabbed-page:** use correct `componentId` ([c913a13d](https://github.com/oblique-bit/oblique/commit/c913a13dd1bacace040a621f34d45d0ec74074cc))

## Features

- **alert:** add TS files to the previews ([385b97a8](https://github.com/oblique-bit/oblique/commit/385b97a81b28d08b725ceb568bd1997938c0f1ae))
- **autocomplete:** remove deprecated `filterRegexPattern` code example ([86a80e33](https://github.com/oblique-bit/oblique/commit/86a80e33c7dd85f647d082b1175c0cd6cbeb30f5))
- **autocomplete:** add autocomplete code examples ([db169ec6](https://github.com/oblique-bit/oblique/commit/db169ec6e949dce4368513667103cbc834d650d1))
- **breadcrumb:** link to stackblitz example ([2cd314a6](https://github.com/oblique-bit/oblique/commit/2cd314a6ac08b53c014d9cd18c1cedc107970f99))
- **button:** add TS files to the previews ([ebc47669](https://github.com/oblique-bit/oblique/commit/ebc476695643c95c66c1177b499e23a212aecc38))
- **button:** add code examples ([56322780](https://github.com/oblique-bit/oblique/commit/563227803ca877fc3002182b3a6e3274fed406e6))
- **cms:** update URL to the new CMS instance ([ab7f48d8](https://github.com/oblique-bit/oblique/commit/ab7f48d8b1ac6aacb5788cd60684b4db572dd040))
- **cms:** sort the queries by the name of the page ([0a418504](https://github.com/oblique-bit/oblique/commit/0a418504602ccaf43ca8197cd04be5a06fdad681))
- **cms:** fetch data for the text pages ([fbbe6d87](https://github.com/oblique-bit/oblique/commit/fbbe6d87f297d136936033fbb53ba26bdb5371ac))
- **cms:** add `category` property to the `TabbedPageComplete` model ([d3b50036](https://github.com/oblique-bit/oblique/commit/d3b5003623709bfab843ca172305c513c7122083))
- **cms:** fetch the category for the tabbed pages ([7497a2aa](https://github.com/oblique-bit/oblique/commit/7497a2aa0e1d46c75d10e270a03706445b719d46))
- **code-examples:** add stackblitz example for unknown route ([2e0a273d](https://github.com/oblique-bit/oblique/commit/2e0a273d2759facd5c1330427fea93d58386aa56))
- **code-examples:** add `error-messages` examples ([a63b3908](https://github.com/oblique-bit/oblique/commit/a63b39087bf0fa7aa13fbb53b580505ad0bb293a))
- **code-examples:** stackblitz example for setLocaleOnAdapter() ([3070b0a4](https://github.com/oblique-bit/oblique/commit/3070b0a430107fe4b709b1e91a7ba8f1b7238b2f))
- **code-examples:** stackblitz example for Date pipe ([0b6c953a](https://github.com/oblique-bit/oblique/commit/0b6c953a34e0ba2fb75c2611da9b60704befab11))
- **code-examples:** make the padding visible in spacing example ([f64a9de1](https://github.com/oblique-bit/oblique/commit/f64a9de1ca5a2f3f0ba4a703c8beca1d3d52e029))
- **code-examples:** actually show the variables' usage in spacing example ([76874818](https://github.com/oblique-bit/oblique/commit/7687481896b0de530c0d2f1a80bf1848f86e655e))
- **code-examples:** don't highlight styling rules for spacing example ([b81b1723](https://github.com/oblique-bit/oblique/commit/b81b1723c77b528ea5ab9e863b07836c5fea946c))
- **code-examples:** remove `layout` example ([b2ddff4e](https://github.com/oblique-bit/oblique/commit/b2ddff4e61ffc04db8b4a94718bfd7373f2c1445))
- **code-examples:** add error state example for stepper ([9f3c922b](https://github.com/oblique-bit/oblique/commit/9f3c922b24c7788d43d9021d39765fa442009e92))
- **code-examples:** add collapse examples ([4682f43c](https://github.com/oblique-bit/oblique/commit/4682f43c89d2d0de1523cbde81a0ec6fa00fc38d))
- **code-examples:** add typography examples ([e969ef77](https://github.com/oblique-bit/oblique/commit/e969ef77e34fb2d8e6ae0187beffcf1fc2888dd7))
- **code-examples:** add expansion-panel examples ([83453490](https://github.com/oblique-bit/oblique/commit/834534903a710ec8cd8d037ff202f58b2e21353c))
- **code-examples:** add types to labels ([f35516a8](https://github.com/oblique-bit/oblique/commit/f35516a835e9325ff5e4338dbc326cf4e878345c))
- **code-examples:** multiselect examples ([5cfc7dc0](https://github.com/oblique-bit/oblique/commit/5cfc7dc00d8f980f2f542a04e6fc1b91ae709b35))
- **code-examples:** make code snippets optional ([a623d83c](https://github.com/oblique-bit/oblique/commit/a623d83c52fe922592e2b8a8805368e1087d620d))
- **code-examples:** remove file preview in off-canvas ([c6793fc3](https://github.com/oblique-bit/oblique/commit/c6793fc31ca6babd355f304d04f4da06ad2be6b5))
- **code-examples:** ensure every scss file content is presented ([4d67713f](https://github.com/oblique-bit/oblique/commit/4d67713f14a50bb362c57c99dd33fa69ff4678b5))
- **code-examples:** add form input prefixes & suffixes preview ([0623b62e](https://github.com/oblique-bit/oblique/commit/0623b62ed11b9be36b30f791954f37bef1bf6ec2))
- **code-examples:** add confirmation for deletion in the material editable table preview ([e657addd](https://github.com/oblique-bit/oblique/commit/e657addde54a523024c10c902a73335ffcd3ee4e))
- **code-examples:** remove `ob-body2-line-height-letter-spacing` mixin ([cf379c95](https://github.com/oblique-bit/oblique/commit/cf379c95acc84afa3d0d0d75eb1aaa142a21e19b))
- **code-examples:** split up `public-scss-variables-and-mixins-code-examples` ([6fd601ae](https://github.com/oblique-bit/oblique/commit/6fd601aec21e84777f68eb7983967a0d3ce3c88f))
- **code-examples:** remove table examples with `ob-table-cicd` class ([18faa2fb](https://github.com/oblique-bit/oblique/commit/18faa2fb0e6ecdb4da3986eb481fd5f530aa3a40))
- **code-examples:** ensure `getJsonSnippet` is only used to load JSON files ([987d4584](https://github.com/oblique-bit/oblique/commit/987d4584ef522a736612c709eba4c994776edc71))
- **code-examples:** add translations examples ([eb7d9002](https://github.com/oblique-bit/oblique/commit/eb7d9002bfdce455b82534c0de338da11c00eb94))
- **code-examples:** add oblique i18n folder to `getJsonRequire` in `code-examples.model.ts` ([cd802123](https://github.com/oblique-bit/oblique/commit/cd802123e49d8f64d97e7d6ebb4a2cf54c1e4299))
- **code-examples:** adjust `add-code-example` schematic to produce kebab-case slugs ([cc4b8386](https://github.com/oblique-bit/oblique/commit/cc4b83867e1f96b119d6230e5b11aac97f35834a))
- **code-examples:** kebab-case all keys, which allows routes to be kebab-case ([f210e865](https://github.com/oblique-bit/oblique/commit/f210e86599064d7c8b2058428012a5c7342ba2b6))
- **code-examples:** enable json previews ([4461878f](https://github.com/oblique-bit/oblique/commit/4461878fd015bbc26335e362cedb0c5b12b26aae))
- **code-examples:** add form examples ([e83b8d70](https://github.com/oblique-bit/oblique/commit/e83b8d70b5a238e1bb4eda87ce3a2696415cf42d))
- **column-layout:** adjust structure of stackblitz example to match guidelines ([dd34b0db](https://github.com/oblique-bit/oblique/commit/dd34b0dbc1fd69a4f1c86b31659056bc46ac89a1))
- **column-layout:** add code examples ([750d8f3e](https://github.com/oblique-bit/oblique/commit/750d8f3ee75be36e2e2a8e5d680ab93d85e75278))
- **component-pages:** add ability to preview files located in component-pages root ([65ce96b7](https://github.com/oblique-bit/oblique/commit/65ce96b716c47a8d6e1120b5ac03f3f64c7e91d2))
- **component-pages:** add public scss variables and mixins examples ([9a95de5d](https://github.com/oblique-bit/oblique/commit/9a95de5d8d4488f9f12b2752671539adb163570b))
- **component-pages:** add ability to display scss code from the oblique library ([4495e3a3](https://github.com/oblique-bit/oblique/commit/4495e3a3bdf3883bf1be8e51c460fc5843bf1921))
- **component-pages:** add nested form examples ([b4a4d8c5](https://github.com/oblique-bit/oblique/commit/b4a4d8c5ddc2204760394f1ee2f9a6df2dc65e47))
- **component-pages:** improve tabs styling ([3883394d](https://github.com/oblique-bit/oblique/commit/3883394d3e74a44129a47b3ffe7ba615daf95049))
- **component-pages:** add grid system examples ([169e2fb0](https://github.com/oblique-bit/oblique/commit/169e2fb0148580a4513815c1e9807676bac17698))
- **component-pages:** add spacing between all file lists in stackblitz link examples ([d53f7b3c](https://github.com/oblique-bit/oblique/commit/d53f7b3cc2342ca319d27c411fd9e85900bf25da))
- **component-pages:** make paginator adhere to sds component documentation guidelines ([99ee7799](https://github.com/oblique-bit/oblique/commit/99ee7799f3245d42f2adc8964bc50e0d8b366d0e))
- **component-pages:** add `.flex-end` option to `.layout-column` ([272f176b](https://github.com/oblique-bit/oblique/commit/272f176be73ae1a44f3f6ec95450a0b9060c2c84))
- **component-pages:** make datepicker adhere to sds component documentation guidelines ([e8f45442](https://github.com/oblique-bit/oblique/commit/e8f454427af91f887002d5e6b44dd8e3594dc579))
- **component-pages:** make badge adhere to sds component documentation guidelines ([402f27ac](https://github.com/oblique-bit/oblique/commit/402f27ac7ee77d5717ab24e139c73b09524ce5a9))
- **component-pages:** make button adhere to sds component documentation guidelines ([38b7b19d](https://github.com/oblique-bit/oblique/commit/38b7b19d8556dc2d012f2f5149bb49bb66ff0a23))
- **component-pages:** add file-upload examples ([edafbe0d](https://github.com/oblique-bit/oblique/commit/edafbe0de136a16d6c433d1c1213a65b56f57a1b))
- **component-pages:** adjust code-example title to accept html so code tag can be used ([8d412b2d](https://github.com/oblique-bit/oblique/commit/8d412b2d2a08f1983af7b7b3e86628e7b9eacb55))
- **component-pages:** make alert adhere to sds component documentation guidelines ([0c913b18](https://github.com/oblique-bit/oblique/commit/0c913b18d7109b2a4131fb7808ff4d8ad39bba6d))
- **component-pages:** hide tabs that have no content ([4970e011](https://github.com/oblique-bit/oblique/commit/4970e0112a9226185651afa4c0953e78d676c6d4))
- **component-pages:** extend tabs with additional functions/options ([4fb0d964](https://github.com/oblique-bit/oblique/commit/4fb0d9644090afab9260094f862755d44b201cc1))
- **component-pages:** add master layout example ([5e95b68a](https://github.com/oblique-bit/oblique/commit/5e95b68aa521d60a8604db03573c2d4393a7f140))
- **component-pages:** add tab code examples ([a24f00c4](https://github.com/oblique-bit/oblique/commit/a24f00c40edfcb759c146a47bc39163c211d15e9))
- **component-pages:** add slide toggle code examples ([b3417a38](https://github.com/oblique-bit/oblique/commit/b3417a3896d76fc04f045234912f70a0abb75997))
- **component-pages:** add title above the tab selection ([fbbe182e](https://github.com/oblique-bit/oblique/commit/fbbe182ee1e641ed5243804891d86e48e287e5cf))
- **component-pages:** add previews for tooltip ([7b6e228d](https://github.com/oblique-bit/oblique/commit/7b6e228daacdc9b9cb32b488d503a88c38505e05))
- **component-pages:** add a title to badge previews ([193f9c48](https://github.com/oblique-bit/oblique/commit/193f9c485e2e506743efef9bb3df52529eb9ee13))
- **component-pages:** add a title to button previews ([81d97c78](https://github.com/oblique-bit/oblique/commit/81d97c78134fb9d3e44fbdc02c781ac88e992e94))
- **component-pages:** add a title to alert previews ([c6695a69](https://github.com/oblique-bit/oblique/commit/c6695a69cd32fcffec08a14947275c996a37a82b))
- **component-pages:** add possibility to add a title to the previews ([9f21a335](https://github.com/oblique-bit/oblique/commit/9f21a3352814b2d3ca5b6f798fd7c86f0cf01c5b))
- **component-pages:** add style for example components ([8b75c85e](https://github.com/oblique-bit/oblique/commit/8b75c85e7a520f776995dab4b0e52ecf40da80a1))
- **component-pages:** use the same template for all `CodeExamples` components ([95a1954c](https://github.com/oblique-bit/oblique/commit/95a1954c9a41a6bea8684a94b81316fe218ccdd6))
- **component-pages:** loop on each preview instead of duplicating the code ([c7571455](https://github.com/oblique-bit/oblique/commit/c757145584a0d1986b0d8b2c53619fd3a86397d3))
- **component-pages:** move the `snippets` info to the `previews` property ([552809e6](https://github.com/oblique-bit/oblique/commit/552809e6ad4db4fa902d6115863bbaad511867c3))
- **component-pages:** move the `idParts` info to `previews` property ([9a50f471](https://github.com/oblique-bit/oblique/commit/9a50f4718fc7594d4eb11995e70a272e280177bd))
- **component-pages:** let the previews render a component instead of a template ([9258485c](https://github.com/oblique-bit/oblique/commit/9258485cbf38a4a6da773e7062e857b4bfdf8cd6))
- **documentation-pages:** display pages for the foundations category ([329ac24d](https://github.com/oblique-bit/oblique/commit/329ac24d1466de30186b743830bdda9cfe9db122))
- **feedback:** add a 'close' button to the feedback form ([68e369f7](https://github.com/oblique-bit/oblique/commit/68e369f7149782d3aa914e8e33a6eddbae917680))
- **feedback:** add fallback to sending a mail when the collector doesn't work ([841a3fd0](https://github.com/oblique-bit/oblique/commit/841a3fd0c8ff01c239d3585816e03d4034c0b655))
- **feedback:** automatically fill `Documentation URL` ([71c042a4](https://github.com/oblique-bit/oblique/commit/71c042a4386414ee4556164a9094b66a8df7d336))
- **feedback:** add feedback button linked to a JIRA collector ([58f94c93](https://github.com/oblique-bit/oblique/commit/58f94c93617af06ba18bd07fbbda69b4af521fef))
- **file-upload:** add cancel confirmation example ([c501d64c](https://github.com/oblique-bit/oblique/commit/c501d64c23128635daa5c659e93ca945e35ee39a))
- **global-events:** add global events examples ([aeff2b89](https://github.com/oblique-bit/oblique/commit/aeff2b89695400b823a2ab2b1f0d7c0ee714a63d))
- **icon:** add examples ([177c111d](https://github.com/oblique-bit/oblique/commit/177c111df01b79a8497d158a34f8de331ecfeba1))
- **master-layout:** add stackblitz code example ([dfc49786](https://github.com/oblique-bit/oblique/commit/dfc49786a9ed7737d4921737086419ddee0c19fe))
- **master-layout:** adjust structure of stackblitz example to match guidelines ([979f74ad](https://github.com/oblique-bit/oblique/commit/979f74add93b5d5b193aef883dd78bbb2da4b38c))
- **master-layout:** improve link in master layout example ([3cb37d8d](https://github.com/oblique-bit/oblique/commit/3cb37d8d1f6c7a07045d91d101d39e15fabdb6b5))
- **material:** improve chips showcase ([89b05513](https://github.com/oblique-bit/oblique/commit/89b05513e393c2cb045491718954243c692ce9bd))
- **material:** update the datepicker examples to show the hints in the `en-CH` format ([c808035a](https://github.com/oblique-bit/oblique/commit/c808035aa27ec61680eefc01ce38f787ebd7469d))
- **material:** replace the illustration image for the image example of the List page ([320c5900](https://github.com/oblique-bit/oblique/commit/320c5900c6f7beb64e8144bd4b9a69bf6e4ed593))
- **material:** replace the illustration image for the card example ([0a95eb52](https://github.com/oblique-bit/oblique/commit/0a95eb52900b28ed400d4c1b73a5e3c519832e00))
- **material:** add stepper code examples ([87c53dd7](https://github.com/oblique-bit/oblique/commit/87c53dd7dd936e97a2c719fdede53dace0bb85c2))
- **material:** add table code examples ([155907f5](https://github.com/oblique-bit/oblique/commit/155907f5634a18e5e0628b9b40b217a81af93c04))
- **material:** add spinner code examples ([19887a5d](https://github.com/oblique-bit/oblique/commit/19887a5d019af2d8653d7456589db8899407e908))
- **material:** add TS files to the slider's previews ([f54c830c](https://github.com/oblique-bit/oblique/commit/f54c830c24a63e30ff43ec895040aa221a9744f9))
- **material:** renamed TS tab of the list-group's previews ([b2d1c5b5](https://github.com/oblique-bit/oblique/commit/b2d1c5b537e44dfca0652e3b4e320492674b892f))
- **material:** add mapping to dialog code examples ([d73720df](https://github.com/oblique-bit/oblique/commit/d73720dfd28ff00f3b4a4f4e8aaf6ae15a8bf848))
- **material:** reorder snippets of the dialog's previews ([9c1d255e](https://github.com/oblique-bit/oblique/commit/9c1d255e65cd06e627953929aac9e7e159181cec))
- **material:** reorder snippets of the datepicker's previews ([db0292ef](https://github.com/oblique-bit/oblique/commit/db0292ef40d73c1caea3f8af85747ad806e2fe7d))
- **material:** add TS files to the chips's previews ([ea63701a](https://github.com/oblique-bit/oblique/commit/ea63701a6c6d16dfa0bee23c30653b222bf7ea2d))
- **material:** add TS files to the card's previews ([89eac096](https://github.com/oblique-bit/oblique/commit/89eac0968d4f7efd993426ea20adcd54f11de8ea))
- **material:** add TS files to the badge's previews ([fd1dbb81](https://github.com/oblique-bit/oblique/commit/fd1dbb817083a3adde95e799e58d0e65d4942f0d))
- **material:** add progress bar code examples ([9696fe53](https://github.com/oblique-bit/oblique/commit/9696fe5325857de3024d20bf3a8b4d1163e545a4))
- **material:** add chips code examples ([b0d709fa](https://github.com/oblique-bit/oblique/commit/b0d709fa6e01044026fccd1524a8e65ed15fc9b3))
- **material:** add card code examples ([feba8b8d](https://github.com/oblique-bit/oblique/commit/feba8b8dafd2c62982fb5e65e731de3a9bac7285))
- **material:** add slider code examples ([9ac284f2](https://github.com/oblique-bit/oblique/commit/9ac284f282f90e45fd1e5b368802ee2677e5cf8f))
- **material:** add dialog code examples ([ad418367](https://github.com/oblique-bit/oblique/commit/ad4183672ddb93ccf721f40f59fd870a0fce4e11))
- **material:** add paginator code examples ([8d570c85](https://github.com/oblique-bit/oblique/commit/8d570c85c7577994b39e77926c8079ea9b51889d))
- **material:** default datepicker demonstrating the WGL 2023 design ([d9efc7ed](https://github.com/oblique-bit/oblique/commit/d9efc7ed5334ce6423445559f11627618a324beb))
- **material:** add list-group code examples ([019be4e0](https://github.com/oblique-bit/oblique/commit/019be4e0e333831f0ec656feceb9f913b33e432b))
- **material:** add badge code examples ([723910ec](https://github.com/oblique-bit/oblique/commit/723910ecbfafa7118c9f7814c95699105ea20697))
- **nav-tree:** add code examples ([21ba4fcb](https://github.com/oblique-bit/oblique/commit/21ba4fcb2cdeba564c774d383b05dcbc53ad1728))
- **notification:** add code examples ([3436dd6b](https://github.com/oblique-bit/oblique/commit/3436dd6bfd3cf543b8c18a687eeb67915f320ce4))
- **number-format:** add code examples ([69bd6a49](https://github.com/oblique-bit/oblique/commit/69bd6a492d97dde9a4453df287d759c6d94420b1))
- **off-canvas:** add off-canvas stackblitz link example ([d767b04e](https://github.com/oblique-bit/oblique/commit/d767b04ed632d44280ec32941556ffe42cb0c8b4))
- **paginator:** add TS files to the previews ([455b74ba](https://github.com/oblique-bit/oblique/commit/455b74ba4d3ce9978b9c7eba7ff2f32dd0048f13))
- **popover:** add code examples ([ed0faab7](https://github.com/oblique-bit/oblique/commit/ed0faab70d13b59ac16f25087d0ce962da830c80))
- **schema-validation:** add code examples ([f3adfdff](https://github.com/oblique-bit/oblique/commit/f3adfdffcdb050c64310389b700b99d769a601ed))
- **schematics:** allow hyphen in input ([68adfda4](https://github.com/oblique-bit/oblique/commit/68adfda44f69b644a1ee79881302a870a7849865))
- **schematics:** add code-example and preview generation ([b112bde7](https://github.com/oblique-bit/oblique/commit/b112bde7f0c9f3718848cd415c9a42be18e9af01))
- **sds:** add fallback with a dialog to collector ([56f2b613](https://github.com/oblique-bit/oblique/commit/56f2b613faec4f0a25cc25dc5f60e4d516bbff21))
- **sds:** add possibility to give default values to collector fields on dialog opening ([9e72178b](https://github.com/oblique-bit/oblique/commit/9e72178b6b46db74d6879faca3138e9687601363))
- **sds:** add JIRA collector service ([77fcc1e2](https://github.com/oblique-bit/oblique/commit/77fcc1e2eab3d5fa18b3446be7b6faadfe582f09))
- **sds:** add generic comment to scss files to identify demo code ([5018c44a](https://github.com/oblique-bit/oblique/commit/5018c44a981d1ab6efff0b79f2e3c47ad3f1b4e4))
- **sds:** allow tabbed pages to have anchor links to the active tab ([6c8598bc](https://github.com/oblique-bit/oblique/commit/6c8598bcce7b0db382d85ee9bc9ee7ff7dd9adac))
- **sds:** change application title to "Oblique" ([1dabe678](https://github.com/oblique-bit/oblique/commit/1dabe6781cdfc6531ecab64f61a2f2c9d765bcba))
- **sds:** remove internationalization category ([f0e53326](https://github.com/oblique-bit/oblique/commit/f0e53326fbb17cfc52ff88f270e0607b5471bfb3))
- **sds:** add internationalization category ([0052f35f](https://github.com/oblique-bit/oblique/commit/0052f35f3703e32a7c666e2ba27734b9c46e42b0))
- **sds:** add helpers route ([bcb7b262](https://github.com/oblique-bit/oblique/commit/bcb7b262efa669ea2acbaea187e7e64702d2c0c6))
- **sds:** improve aesthetics on xl devices ([238a605a](https://github.com/oblique-bit/oblique/commit/238a605ac2bea056090e5303adab2c81fca5fe15))
- **sds:** add `ob-media-breakpoint` mixins with same structure as oblique ([bd300d9b](https://github.com/oblique-bit/oblique/commit/bd300d9b690c31c721feeaf61cc48f46358cb238))
- **sds:** load translation files, add 2 file-upload translations ([97dc2d3c](https://github.com/oblique-bit/oblique/commit/97dc2d3c2194866b16e0afb1fd23a91edb862c32))
- **sds:** add file-upload interceptor ([7c6d6d86](https://github.com/oblique-bit/oblique/commit/7c6d6d86e23864cb1a2e7bf6014c2473b493068c))
- **sds:** add ` | undefined` to the return type of `CodeExamplesMapper.getCodeExampleComponent` ([6af34afc](https://github.com/oblique-bit/oblique/commit/6af34afc95cd59e65ca1bd528e37874712aefb3c))
- **sds:** add `SafeHtmlPipe` (`safeHtml`) to turn a string into `SafeHtml` ([1349c70a](https://github.com/oblique-bit/oblique/commit/1349c70a42662c56a2d0f05c309313d584150462))
- **selectable:** add code examples ([6309d59c](https://github.com/oblique-bit/oblique/commit/6309d59cb6ddaf85aa2c57f3bcf0ed88b56745dd))
- **side-navigation:** reorder categories, text pages and tabbed pages ([d11577a7](https://github.com/oblique-bit/oblique/commit/d11577a73cd4e62e9a3cc2b13de253cd47faedd2))
- **side-navigation:** add space underneath of the menu ([0fba2ca9](https://github.com/oblique-bit/oblique/commit/0fba2ca9bed55f2e453c864e5ae5f15db18fdb76))
- **side-navigation:** allow tabbed pages to be in any category ([b8c0d36b](https://github.com/oblique-bit/oblique/commit/b8c0d36bfbf3979b073ac40f5a62c362175c4599))
- **side-navigation:** add margin to last item ([23e70fd9](https://github.com/oblique-bit/oblique/commit/23e70fd9b2b587af351c002a694770848854ecad))
- **sticky:** add code examples ([a0d9f08e](https://github.com/oblique-bit/oblique/commit/a0d9f08ed71b7a266903d89323cd9db47f900d8f))
- **styles:** add styling of table caption ([cbd397ba](https://github.com/oblique-bit/oblique/commit/cbd397ba58c62b75f6e6559bf5c01fc4c7fd5eb4))
- **styles:** add envelope icon after `mailto:` links ([198c6e35](https://github.com/oblique-bit/oblique/commit/198c6e35bce1ce9b9f592c2e039394e717b9c097))
- **styles:** add section styles ([01ac9aee](https://github.com/oblique-bit/oblique/commit/01ac9aee5750d0ab591125c583ada2c2dc85819b))
- **styles:** add `$hr-color` variable and update `headings.scss` file accordingly ([f3d18016](https://github.com/oblique-bit/oblique/commit/f3d180162f69297e6850086a0fe8039ffd6f136a))
- **styles:** add space between table and following paragraph ([3662cc08](https://github.com/oblique-bit/oblique/commit/3662cc08b7f09651c5c410cfa0c86ac195211113))
- **styles:** element style adjustments ([6bbf3538](https://github.com/oblique-bit/oblique/commit/6bbf35384e7a26a12985ce455227166aaf9bf703))
- **styles:** move inline styles from Directus into SDS (using elements as selectors) ([84ffb136](https://github.com/oblique-bit/oblique/commit/84ffb136df41fce3c6e3182bda5569c50bb122ad))
- **translate-params:** add code example ([8f482f6b](https://github.com/oblique-bit/oblique/commit/8f482f6be88f0b326450ad0e8e9fcb3dda808a64))
- **unknown-route:** add code example ([3039199b](https://github.com/oblique-bit/oblique/commit/3039199b8ee8a9ea3fb8012572dd89af3d5fd336))
- **unsaved-changes:** add stackblitz example ([3641f5d2](https://github.com/oblique-bit/oblique/commit/3641f5d20d9df2e9b86ee088fbe9585019f196ed))
