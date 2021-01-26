# [6.0.0-RC.1](https://github.com/oblique-bit/oblique/compare/5.2.1...6.0.0-RC.1) (2021-01-26)

## Bug Fixes
* **dropdown:** align dropdown arrow ([3d5aed3](https://github.com/oblique-bit/oblique/commit/3d5aed339af482df21f16ceec39fcb5ec7b271c3))
* **dropdown:** prefix the component class with `ob` ([83d4312](https://github.com/oblique-bit/oblique/commit/83d4312dd44e806c9f276e40c608591d71125514))
* **error-messages:** let the `mat-error` component be used without a `ObErrorMessagesDirective` ([563ef0f](https://github.com/oblique-bit/oblique/commit/563ef0f44ff44719d4719f03b2a6e4b599f64165))
* **master-layout:** add padding on all sides of sub-navigation items ([bd3fbf6](https://github.com/oblique-bit/oblique/commit/bd3fbf605e89d8a11c9e6382bdc6147e41e20d16))
* **master-layout:** correctly identify external links ([5be630a](https://github.com/oblique-bit/oblique/commit/5be630a277eecd291774eb24456d99a93f308fa6))
* **master-layout:** ensure `offCanvas` do not rely on bootstrap ([95be171](https://github.com/oblique-bit/oblique/commit/95be1719d8ade185e49ae874f0e34a107ebba3be))
* **master-layout:** ensure the banner is long enough ([8676a59](https://github.com/oblique-bit/oblique/commit/8676a59ddedc112a1ae94db0859001fd4ff92412))
* **master-layout:** remove the header controls title if there's no control (accessibility) ([6394297](https://github.com/oblique-bit/oblique/commit/639429789f98d2e61fcee658576c773429b8533d))
* **notification:** close non sticky notifications after the specified timeout is expired ([6ac7c4a](https://github.com/oblique-bit/oblique/commit/6ac7c4aa8b6261f37b729c47864003b728296bc1))
* **schematics:** add a comment before uses of `isScrollable` to help migrate it ([62886af](https://github.com/oblique-bit/oblique/commit/62886af6dd17ac658eda07504f3d8c85d2d0e420))
* **schematics:** ensure `localize` has the same version as angular ([6f95af5](https://github.com/oblique-bit/oblique/commit/6f95af53cc881112c9d026941a55db39accfa468))
* **schematics:** let `format` script added by `ng-add` lint only the `src` folder ([e0fc3d7](https://github.com/oblique-bit/oblique/commit/e0fc3d78a41e5d27f9a2f64e8ac96c6b3d03b6b5))
* **spinner:** let the overlay inherit the `border-radius` property ([f0bc884](https://github.com/oblique-bit/oblique/commit/f0bc884cec91260982d16a50fb38c4f532841ed3))
* **theme:** add a `background-color` to material's inputs ([88a27f5](https://github.com/oblique-bit/oblique/commit/88a27f50431c79a0dca7d0cb77dde73aeb1e3912))
* **theme:** ensure `alert`'s icon is vertically centered ([952eaeb](https://github.com/oblique-bit/oblique/commit/952eaeb7f7608df2e8d40df8e448d203c779f0b4))
* **theme:** fix alert styling when `oblique-core` is loaded before `oblique-bootstrap` ([30324cc](https://github.com/oblique-bit/oblique/commit/30324cc8b54ca6517a6b7611b62442635d4902da))
* **theme:** insert dynamic theme link right after oblique-core ([f1b5c7c](https://github.com/oblique-bit/oblique/commit/f1b5c7c10db23806347adf4a16ee63f823a42934))
* **theme:** update expansion panel's height and color ([16277b5](https://github.com/oblique-bit/oblique/commit/16277b554a57e18491dceb8c0ffa65d141756510))
* **theme:** update style of `mat-chips` ([27e772e](https://github.com/oblique-bit/oblique/commit/27e772eb90757e3a100c7e5c0211d1760df77643))
* **toolchain:** add `umdModuleIds` ([bf76ae8](https://github.com/oblique-bit/oblique/commit/bf76ae8ab88ef3084108cb364a64122276f814e3))
* **toolchain:** do no generate themes before build ([aa15a3f](https://github.com/oblique-bit/oblique/commit/aa15a3f2d88a9c1e6a6f981d28ffbb2815794661))
* **toolchain:** let `ng-add` add `ngx-translate` as dependency instead of devDependency ([d41a128](https://github.com/oblique-bit/oblique/commit/d41a128237e6e49e4967c8aa57b7a0aa9905e7be))
* **toolchain:** replace require statements during build ([31b8caa](https://github.com/oblique-bit/oblique/commit/31b8caa0f85f95f125bebfc04d38a723611ab1d4))
* **toolchain:** use relative paths for SCSS imports in global styles ([bbbebf1](https://github.com/oblique-bit/oblique/commit/bbbebf1e82be5db4a852ae1fde0c9b59b7abbcaf))

## chore
* **toolchain:** update dependencies and refactor accordingly ([e5db59d](https://github.com/oblique-bit/oblique/commit/e5db59d49354c0e84b404b457dc4849bc7b41652))

## Code Refactoring
* **multiselect:** replace the `filter-box` with a regular input ([3696d03](https://github.com/oblique-bit/oblique/commit/3696d03dead038b75aec3ded6a07218d9939d1a0))
* **search-box:** use the `ob-dropdown` component to show the results ([98a487f](https://github.com/oblique-bit/oblique/commit/98a487f7cb55adc59dfc2864162d8221e1f53ec0))
* **theme:** harmonize class names and selectors ([8b55ea2](https://github.com/oblique-bit/oblique/commit/8b55ea2bd466141e3162f161bae5118cc3fdf798))

## Features
* **button:** add a `brand-primary` border ([b10254c](https://github.com/oblique-bit/oblique/commit/b10254c690b93444867600f8538496aae94b361f))
* **button:** add button directive to enforce oblique's variants ([75d8c36](https://github.com/oblique-bit/oblique/commit/75d8c36224f8ed723cee4e9754fc2f7fb8974f19))
* **collapse:** add an input to configure the animation speed ([f0fb3ee](https://github.com/oblique-bit/oblique/commit/f0fb3eed15612a2b7c789347300e7f0062dab6bb))
* **dropdown:** make the dropdown accessible ([3ecd88b](https://github.com/oblique-bit/oblique/commit/3ecd88b0ee20c790838fa73404705b85ff754915))
* **error-messages:** add `MatSelect` support for `ObErrorMessagesDirective` ([ce7ff72](https://github.com/oblique-bit/oblique/commit/ce7ff7249e6f5ed0df9e3fcbc86a8fb87a5de473))
* **filter-box:** remove feature ([eca9372](https://github.com/oblique-bit/oblique/commit/eca93726b85217fd618be706c65c21e55ca243c8))
* **language:** add the language feature ([0b01bdc](https://github.com/oblique-bit/oblique/commit/0b01bdcccfae6788b41333e36596f6c26bc913a9))
* **master-layout:** add new `display` property to locale configuration ([80c2fca](https://github.com/oblique-bit/oblique/commit/80c2fca5ae4225037868f174da35ed7b86a9dced))
* **master-layout:** disable off-canvas per default ([251bbac](https://github.com/oblique-bit/oblique/commit/251bbacdd31f28fe98e995c3fb49dbfd40423d15))
* **master-layout:** improve responsiveness on small viewports ([8a04f96](https://github.com/oblique-bit/oblique/commit/8a04f96373b07cb715eeb6e0bb0298add2206446))
* **master-layout:** make the header's red line sticky on a continuous layout without a sticky header ([39633cd](https://github.com/oblique-bit/oblique/commit/39633cd4dd0d497633d4cb108dcc51d517af601d))
* **navigable:** remove feature ([bcb6ea7](https://github.com/oblique-bit/oblique/commit/bcb6ea7d3cfb343f87fb326f00ecd96aa5389edc))
* **navigator:** remove feature ([330717b](https://github.com/oblique-bit/oblique/commit/330717bccf8110049cfbd1c5661965f19b94c70f))
* **schematics:** make `ng-update` remove unnecessary dependencies ([e19e779](https://github.com/oblique-bit/oblique/commit/e19e779cf8e42df25b545d3119896700a0df6ce3))
* **selectable:** add sort function ([a4edecb](https://github.com/oblique-bit/oblique/commit/a4edecb0f14a77f41c00b338cfce845fb6fdb8d8))
* **selectable:** rework feature and add selection modes ([dc920de](https://github.com/oblique-bit/oblique/commit/dc920de74947c08b9d11ad036a2819a3aeb9bff4))
* **spinner:** add `forceDeactivate` method ([3855dfd](https://github.com/oblique-bit/oblique/commit/3855dfd267da4d08a30cb82976e483919b246b47))
* **spinner:** hide the spinner only when `deactivate` has been called as many times as `activate` ([b099a2f](https://github.com/oblique-bit/oblique/commit/b099a2f782ba1ef19e21510e4bb719c06bdba8f8))
* **theme:** adapt color palette ([6c92252](https://github.com/oblique-bit/oblique/commit/6c922522efc6441debf24ef8c04af181cdc04080))
* **theme:** add a `z-index` system with variables ([b573b50](https://github.com/oblique-bit/oblique/commit/b573b50179458843b7575f8ecd7524d85f3ed057))
* **theme:** add CSS for selectable cards ([1d0a9ab](https://github.com/oblique-bit/oblique/commit/1d0a9ab26c8f3dfb646d7b183ff6095d396a0180))
* **theme:** improve `alert`'s responsiveness on small viewports ([3002bac](https://github.com/oblique-bit/oblique/commit/3002bac6ddbb8b43b877e2a39d1c97de4f990e41))
* **theme:** set the font through `angular.json` instead of an injection token ([7094a95](https://github.com/oblique-bit/oblique/commit/7094a95dd66f501d54512ebba16486c3aa5aab06))
* **toolchain:** add missing translations ([2350cfc](https://github.com/oblique-bit/oblique/commit/2350cfc6e2c8dce43ac41da005762201339feb59))
* **toolchain:** optimize performance of font-loading ([e898854](https://github.com/oblique-bit/oblique/commit/e89885497fa82fe2d25c582ccdddbbff26416abe))
* **toolchain:** rework browser compatibility and noscript features ([f69b6eb](https://github.com/oblique-bit/oblique/commit/f69b6eb90b4435c09772d462b3d5f31540a125f4))
* **toolchain:** split oblique's assets in 2 folders ([330783f](https://github.com/oblique-bit/oblique/commit/330783f34efcacab70601adc393e5a8473c956d2))
* **unsubscribe:** remove feature ([f058959](https://github.com/oblique-bit/oblique/commit/f058959fbc425975351cbbf1bdb714830c753d3e))
* **utilities:** add some utility functions to schematics ([2de1cdb](https://github.com/oblique-bit/oblique/commit/2de1cdb54d7f9fb865ade7ffa0178e1d94e8bf6e))
* **utilities:** enhance telemetry with more info ([70678d1](https://github.com/oblique-bit/oblique/commit/70678d1adb224b0896e121c7a02f8c84a19c0539))
* **utilities:** use API v2 for `telemetry` ([53ad6d6](https://github.com/oblique-bit/oblique/commit/53ad6d603c872a36e79075242ce293e3ce836281))

## Tests
* **collapse:** prefix MockCollapse classes with Ob ([927465c](https://github.com/oblique-bit/oblique/commit/927465c6f6609f3cb7821a551339c175014330a4))

## BREAKING CHANGES
* **toolchain:** Support for Angular below 11 has been dropped
* **master-layout:** Off-canvas has been deactivated by default in the Master Layout config. It now needs to be explicitly activated when needed
* **unsubscribe:** The `unsubscribe` feature has been removed with no replacement (solved by schematics)
* **filter-box:** The `filter-box` feature has been removed with no replacement
* **multiselect:** The `multiselect` doesn't use the `filter-box` component anymore
* **navigator:** The `navigator` feature has been removed with no replacement
* **navigable:** The `navigable` feature has been removed with no replacement
  * the item selection has been replaced with `ObSelectable`
  * the keyboard navigation has been replaced with `ObSelectable`
  * the hover effect on buttons has been replaced by the `hover-visible` class
  * the items reordering feature has been lost but was incomplete anyway
* **search-box:** `ObSearchBoxResultsComponent` and `ObSearchBoxDirective` have been removed in favor of `ObDropdown` (should be transparent for the applications)
* **theme:** almost all Oblique's classes have been prefixed with `ob` (solved with schematics)
* **master-layout:**  Master layout classes have been renamed from `application-*` to `ob-master-layout-*` (solved with schematics)
* **offcanvas:**  Off-canvas classes have been renamed from `offcanvas-*` to `ob-off-canvas-*` (solved with schematics)
* **spinner:** the spinner will be hidden only when the `deactivate` method has been called as many times as the `activate` one. The old behavior can still be achieved with `forceDeactivate`
* **collapse:** `MockCollapseComponent` has been renamed into `ObMockCollapseComponent` (solved with schematics)
* **collapse:** `MockCollapseModule` has been renamed into `ObMockCollapseModule` (solved with schematics)
* **master-layout:** with the continuous layout and no sticky header, the red line under the header becomes sticky
* **theme:** `OBLIQUE_FONT` injection token has been removed in favor of inserting the font in `angular.json`'s styles array (solved with schematics)
* **toolchain:** the translation files have been prefixed with `oblique-` (should be transparent for the applications)
* **toolchain:** the translation files have been moved in the `assets` folder (should be transparent for the applications)
* **toolchain:** `favicon.png` and `logo.svg` have been moved in the `assets` folder (should be transparent for the applications)
* **toolchain:** `favicon.ico` and `logo_small.jpg` have been removed (should be transparent for the applications)
* **toolchain:**  Oblique's assets have been split in 2 folders, meaning that the `assets` property in angular.json have to be adapted (solved with schematics)
* **dropdown:** `dropdown` class has been changed to `ob-dropdown` (should be transparent for the applications)
* **dropdown:** The trigger button is now part of the component and must not be specified in the template anymore(solved by schematics)


# [5.2.1](https://github.com/oblique-bit/oblique/compare/5.2.0...5.2.1) (2020-11-03)

## Bug Fixes
* **datepicker:** ensure consistent height for Edge and IE11 ([bc9fa01](https://github.com/oblique-bit/oblique/commit/bc9fa01101d8a4d606faa941be27224487f3f313))
* **document-meta:** ensure the title is being set correctly ([ad129e7](https://github.com/oblique-bit/oblique/commit/ad129e756a04f00f26d91d3a6a50ae497f5c9f37))
* **master-layout:** ensure `accesskey`s numbering consistency ([7c0e114](https://github.com/oblique-bit/oblique/commit/7c0e1142ce71e9d24cbb7ef81ea74b0eefefe388))
* **master-layout:** improve accessibility by not using out of context headings ([cad3d31](https://github.com/oblique-bit/oblique/commit/cad3d31b2950f91e33ab3ea3f8901cbb37d7354c))
* **master-layout:** let default `spinner` be fixed ([2b56043](https://github.com/oblique-bit/oblique/commit/2b56043405d899d47d7404316525896bc19dcba7))
* **spinner:** not reposition spinner container ([becb894](https://github.com/oblique-bit/oblique/commit/becb894ff734c913dfcb9d571cd4d9aea8b692e3))
* **toolchain:** apply schematics to all projects ([6ab6121](https://github.com/oblique-bit/oblique/commit/6ab612169d9925f8070a449999dddd5bd48f3797))
* **toolchain:** ensure `angular.json` do load `css` files ([1ee0d14](https://github.com/oblique-bit/oblique/commit/1ee0d1481a9664b67489359744856e716bfb37a6))
* **toolchain:** ensure `ng-add` doesn't try to add something already present ([c9d2e91](https://github.com/oblique-bit/oblique/commit/c9d2e912e9c9ff0556ac2f67b9d8b7957175b27a))
* **toolchain:** ensure that `ng-update` correctly removes providers ([8fce7ea](https://github.com/oblique-bit/oblique/commit/8fce7ea37fe645b8c137c2eabc2c1d350eeea6e2))
* **toolchain:** install deps directly from npm ([97b147f](https://github.com/oblique-bit/oblique/commit/97b147fef1799b6e84c85343beee0576d25c1174))
* **toolchain:** let `ng-add` adapt `tsconfig` for jest ([632e1ec](https://github.com/oblique-bit/oblique/commit/632e1ec88d36adb3f25600e7abb47c698afcf871))
* **toolchain:** let `ng-update` keep closing datepicker tag ([af2f3f9](https://github.com/oblique-bit/oblique/commit/af2f3f98cc22486942b999595efe60f7ad00b1fc))
* **toolchain:** let prettier work on Windows ([b5074e9](https://github.com/oblique-bit/oblique/commit/b5074e96bfe09862f496b7e6bdf133dca256f8e9))
* **toolchain:** make `ng-add` add Windows compatible linting scripts ([cbce6b1](https://github.com/oblique-bit/oblique/commit/cbce6b1a399599d0fa0c9b3dcb85a0b0fb3421f5))
* **toolchain:** not make `ng-update` fail on unmet peer dependencies ([1870deb](https://github.com/oblique-bit/oblique/commit/1870deb4c415f97b7e3b0bf437923c935a39714f))
* **toolchain:** remove misleading infoLog with `ng-update` ([a8a8e0b](https://github.com/oblique-bit/oblique/commit/a8a8e0b3b40bfd6ebea9aab37818ab6c4263c19d))


# [5.2.0](https://github.com/oblique-bit/oblique/compare/5.1.1...5.2.0) (2020-10-05)

## Bug Fixes
* **master-layout:** correctly defines default language ([8a00e24](https://github.com/oblique-bit/oblique/commit/8a00e2428e05d27939988cba5c3f98d8b74fa3b6))
* **master-layout:** fix jump links icon alignment ([0120db0](https://github.com/oblique-bit/oblique/commit/0120db02235eed6e64ca92bdc44aa5e967dfdd4a))
* **master-layout:** let it be accessible ([0094f08](https://github.com/oblique-bit/oblique/commit/0094f0855a5aa55654c64e67f3cf67e6b17e0af5))
* **master-layout:** secure external links with `noreferer` ([f818a80](https://github.com/oblique-bit/oblique/commit/f818a80d6031ef331d839c11323c0a68053a7fbd))
* **master-layout:** translate off-canvas close button ([a2b8881](https://github.com/oblique-bit/oblique/commit/a2b8881634d925e1e7984d9dc44ed4ff1917042e))
* **notification:** add alert role for accessibility ([ce2b80b](https://github.com/oblique-bit/oblique/commit/ce2b80bf7d5366c9be6564ddd9a731b50d4f78ec))
* **off-canvas:** delay toggle upon click ([78a7d9a](https://github.com/oblique-bit/oblique/commit/78a7d9a58390d8494dfa575895b694eec004c2f6))
* **scrolling:** let it be accessible ([f4cbfe6](https://github.com/oblique-bit/oblique/commit/f4cbfe6b5d653c5c829bc71c6c09cca2130f3cc4))
* **search-box:** align the drop-down's arrow ([38b5e53](https://github.com/oblique-bit/oblique/commit/38b5e53f87c69d39eac8155dcd773d36d99f215f))
* **sticky:** add padding when application has no layout ([baeecb5](https://github.com/oblique-bit/oblique/commit/baeecb5ead8b7ff8e5ab1fd9b7efd1aa5454cf51))
* **theme:** display connecting lines correctly ([f72aa59](https://github.com/oblique-bit/oblique/commit/f72aa59d60975ccd6b5402cc9ba4b277c9cd2ee3))
* **toolchain:** add missing dependency ([ba22c06](https://github.com/oblique-bit/oblique/commit/ba22c06953895f50858d83d1b22c94bc0b082675))
* **toolchain:** avoid error when `ng-add` tries to access an undefined JSON property ([0640412](https://github.com/oblique-bit/oblique/commit/064041264c42984fe536064ec40ad971f9d3669b))
* **toolchain:** fix `ng-add` language configuration ([e3c93ce](https://github.com/oblique-bit/oblique/commit/e3c93ce54997c544876ffed3cd5e4b864c5bc903))
* **toolchain:** fix `ng-add` proxy configuration ([7fda0c7](https://github.com/oblique-bit/oblique/commit/7fda0c717f9a3b594f97e48c3297d0b2a1d563cd))
* **toolchain:** improve schematics regex to transform `or` into `ob` ([f49e273](https://github.com/oblique-bit/oblique/commit/f49e273f745bb823b87ec1dd41f0611479c2834b))
* **toolchain:** let `ng-add` schematic add the `favicon` ([2f9f96d](https://github.com/oblique-bit/oblique/commit/2f9f96d46efb00bce64f7c353f393365485b162c))
* **toolchain:** let `ng-add` work without `AppRoutingModule` ([79dfe16](https://github.com/oblique-bit/oblique/commit/79dfe161f114cb69f493b02e9c4191d5a799d4d6))
* **toolchain:** let schematics check for file status before altering them ([98fd377](https://github.com/oblique-bit/oblique/commit/98fd37794367d0601ad9becf0668990ac3b0cd21))
* **toolchain:** let schematics use `tsconfig.base.json` only if it exists ([3255c34](https://github.com/oblique-bit/oblique/commit/3255c3443e0d8a3be2b28647dcba9d1cc6588818))
* **toolchain:** make linting work on windows ([fa7f275](https://github.com/oblique-bit/oblique/commit/fa7f2755f02bc2c1302a5f5aaee6ede2a0b1b6bb))
* **toolchain:** read global schematics' config if there's not a project's one ([5b2f67a](https://github.com/oblique-bit/oblique/commit/5b2f67a61e6433ace11f0a925a128b757e60d609))
* **toolchain:** throw an error if `ng-add` is missing some preconditions ([54c70d3](https://github.com/oblique-bit/oblique/commit/54c70d3bc5c2f612b9cda6641f0875fd344472cb))

## Features
* **column-layout:** improve accessibility ([b0c6843](https://github.com/oblique-bit/oblique/commit/b0c68435a7bb9a105de2851a385f1afed785b1b7))
* **filter-box:** deprecate it and mark for removal in Oblique 6 ([5b685eb](https://github.com/oblique-bit/oblique/commit/5b685eb02a45659ef01eeba7ddcc328d1ab65f7f))
* **master-layout:** define the current language on the `html` tag ([3a73086](https://github.com/oblique-bit/oblique/commit/3a7308620a7cf8b15bea7ff08a7d9e2b5bbbbf4a))
* **master-layout:** add custom jump links ([7a85a40](https://github.com/oblique-bit/oblique/commit/7a85a404df24fb1eada4d357c448261b7d481480))
* **master-layout:** make the navigation accept `fragment` and `queryParams` ([c372d3e](https://github.com/oblique-bit/oblique/commit/c372d3e668e6e8ed744e1cf6c540b85a9e4b8d86))
* **master-layout:** make the navigation accept external links ([4a76646](https://github.com/oblique-bit/oblique/commit/4a766464475cfef62e161a3f5abb761aa08e1688))
* **nav-tree:** add parameters for label translation ([e616093](https://github.com/oblique-bit/oblique/commit/e61609382291ba250f6671918b8ac2e6478437ea))
* **navigable:** mark it for removal in Oblique 6 ([ed9180b](https://github.com/oblique-bit/oblique/commit/ed9180b1a0022f7eea19bc30ec7332f0cda3c70d))
* **navigator:** mark it for removal in Oblique 6 ([32f7cf6](https://github.com/oblique-bit/oblique/commit/32f7cf686ed242a86d807229d9bbbcb120154625))
* **notification:** enlarge closing button ([4bdcd69](https://github.com/oblique-bit/oblique/commit/4bdcd699d0096f49440bc9203ae5bbf5a3a7b64a))
* **theme:** improve accessibility of material theme ([24679d4](https://github.com/oblique-bit/oblique/commit/24679d427c5ef806aaa7b305efd74a6c9f507d94))
* **theme:** reduce `border-radius` of buttons ([a274112](https://github.com/oblique-bit/oblique/commit/a27411294be449fa355d926b30fd588b6f4345cc))
* **theme:** use default color for text ([c75f954](https://github.com/oblique-bit/oblique/commit/c75f954304faaf3b7f12e1a140a42d267c366981))
* **toolchain:** add pagination to `ng-add` questions ([75dddb0](https://github.com/oblique-bit/oblique/commit/75dddb057863e851146d85bc1c8477807106c2c7))
* **toolchain:** let `ng-add` create a component for the default route ([840c04e](https://github.com/oblique-bit/oblique/commit/840c04e643abab843637ea3818d71a78d39a3eb6))
* ensure each oblique's component has a class that match its selector ([a7599c5](https://github.com/oblique-bit/oblique/commit/a7599c5c456a7fc879a075e7af7e5018f005e969))


# [5.1.1](https://github.com/oblique-bit/oblique/compare/5.1.0...5.1.1) (2020-09-21)

## Bug Fixes
* **master-layout:** fix dropdown content not visible in header ([d78557e](https://github.com/oblique-bit/oblique/commit/d78557e53effb35d8e3439c717533feac744b1c1))


# [5.1.0](https://github.com/oblique-bit/oblique/compare/5.0.5...5.1.0) (2020-08-21)

## Bug Fixes
* **input-clear:** add `MatDatepicker` input ([105838d](https://github.com/oblique-bit/oblique/commit/105838d71c8198b585c68e7e48eb7da8287248e5))
* **master-layout:** fix separator color in header ([bee37b8](https://github.com/oblique-bit/oblique/commit/bee37b82738a6507511e0239b9d8aed8394ac0aa))
* **telemetry:** use absolute path for `package.json` ([01d50e1](https://github.com/oblique-bit/oblique/commit/01d50e176b90ca6e3510bb0ba7bffc05bf61ce11))
* **theme:** fix `line-height` for alert's icons ([9ae93df](https://github.com/oblique-bit/oblique/commit/9ae93df0fd22c579409fb62635a7605b1c47f41a))
* **theme:** improve material's icon alignment on `datepicker` ([fe50e6c](https://github.com/oblique-bit/oblique/commit/fe50e6c8a74db473423d27f2a834c6d301c839f3))
* **theme:** use relative path for `Frutiger` ([7f9fe92](https://github.com/oblique-bit/oblique/commit/7f9fe924830a58155f377d5f7603f9671c0bd394))
* **toolchain:** fix peer dependencies version ([1440ce1](https://github.com/oblique-bit/oblique/commit/1440ce19f661ac085017237f5f75fa0020b7a51b))
* **toolchain:** do not alter `require('package.json')` during build ([c69ee2f](https://github.com/oblique-bit/oblique/commit/c69ee2f88014fef7a45ecf4618cacbbff27b3696))
* **toolchain:** `ObMockTranslateService`.`get` emits the given key instead of an empty string ([e07509d](https://github.com/oblique-bit/oblique/commit/e07509d04f975222ca684fbaecea8bec9b9d9377))
* **toolchain:** fix `ObMockTranslateService` signature ([6f7f716](https://github.com/oblique-bit/oblique/commit/6f7f71675d0d3f62dacddfb8283358af45c98aa5))
* **toolchain:** ensure no reference to `oblique-oblique.*` remains ([69c295f](https://github.com/oblique-bit/oblique/commit/69c295f5e60ea71e265006389355e4b30314ad11))
* **toolchain:** fix types for `ObMockTranslatePipe` ([d4131c7](https://github.com/oblique-bit/oblique/commit/d4131c7275e76b99b801270d1bbecb02035e8ef4))
* **toolchain:** fix typo in FR translations ([8ab8ff2](https://github.com/oblique-bit/oblique/commit/8ab8ff2dcba0018154d4f44158e5888e03546e89))
* **toolchain:** remove empty imports ([0026b73](https://github.com/oblique-bit/oblique/commit/0026b732c089c9186101767f74fae03398ff6e14))
* **toolchain:** use a valid SPDX license ([2b806dd](https://github.com/oblique-bit/oblique/commit/2b806dd96e3b95fa146e5176d1862cd90867a164))
* **translate-params:** mock returns given value instead of empty string ([ae8ebb5](https://github.com/oblique-bit/oblique/commit/ae8ebb56f761d389a09d976e6e69b9980a818f3b))
* remove circular dependencies ([6ca42d0](https://github.com/oblique-bit/oblique/commit/6ca42d030931c4aecdd6ffe2ec5d77bccc91b2cf))

## Features
* **http-api-interceptor:** check if request is an api one before adding http headers ([82eb899](https://github.com/oblique-bit/oblique/commit/82eb89935d6f6158e317b67f84fc9e4ec723f3f8))
* **master-layout:** add `obHeaderAction` to allow content before the logo ([763714c](https://github.com/oblique-bit/oblique/commit/763714cef6b5e01e7a4af8bcaafa3c3c992460c4))
* **master-layout:** can keep the red line when the header is scrolled away ([af0ca53](https://github.com/oblique-bit/oblique/commit/af0ca53394106501be579b9bfce7d8f16881fa1e))
* **master-layout:** header logo is customizable ([2524b6c](https://github.com/oblique-bit/oblique/commit/2524b6cf11e489d77e5c0f380c1514e8d2d91591))
* **master-layout:** add colored banner to show env ([5bd116a](https://github.com/oblique-bit/oblique/commit/5bd116ab1a806058801a3dee2858c1ce9866cb89))
* **master-layout:** add `obHeaderCustomControl` to pass header controls as a block ([6301a71](https://github.com/oblique-bit/oblique/commit/6301a713364c97451d21a6f3b747c663a9904dd8))
* **master-layout:** allow content projection into header for mobile layout ([6be915a](https://github.com/oblique-bit/oblique/commit/6be915a564eef52a395502afaaf2280fe9242e26))
* **selectable:** add `tabindex` to host element ([2da26e3](https://github.com/oblique-bit/oblique/commit/2da26e33fee1b5e9c7c9be581f6bb3e5c2be9340))
* **selectable:** also toggle selection on `space` keydown ([5ce92b2](https://github.com/oblique-bit/oblique/commit/5ce92b2973e7460c9e9ca5bed62ebaf176de4056))
* **theme:** add error icon on invalid field with MD ([f37154e](https://github.com/oblique-bit/oblique/commit/f37154e9700881cdb905827322568a4f93511ac1))
* **toolchain:** add `peerDependencies` according to theme ([70d4c60](https://github.com/oblique-bit/oblique/commit/70d4c60e275fe0a290230e16d67545e96e001195))
* **toolchain:** schematics to add banner ([9a8f196](https://github.com/oblique-bit/oblique/commit/9a8f196768344aaad27f8abedefc077bc31a8450))
* **toolchain:** check commit msg and code format with `husky` ([ce9828c](https://github.com/oblique-bit/oblique/commit/ce9828ce205cdf108e3cc4fdc138e9a8733dcb62))
* **toolchain:** add `ng-add` schematics ([8e6ab44](https://github.com/oblique-bit/oblique/commit/8e6ab44d501ad7eec420bc584e59240aa218a99f))
* **toolchain:** format code with `prettier` ([f22cb7a](https://github.com/oblique-bit/oblique/commit/f22cb7adec0f9f76d7095e6e3e502cd48d6ca4ae))
* **utilities:** add `OB_MATERIAL_CONFIG` to overwrite default Material config ([f43c6f8](https://github.com/oblique-bit/oblique/commit/f43c6f873e4bc47b5a42e0c119a08b3b794ef0e6))


# [5.0.5](https://github.com/oblique-bit/oblique/compare/5.0.4...5.0.5) (2020-04-28)

## Bug Fixes
* **error-messages:** retranslate the error messages upon lang change ([9fa6483](https://github.com/oblique-bit/oblique/commit/9fa64839b52d7139f4e498e11bddf5e47a3a245c))
* **error-messages:** unsubscribe from Observable in `mat-error` ([1a42558](https://github.com/oblique-bit/oblique/commit/1a425582e46410a8c8006236638a810158a18c8e))
* **master-layout:** use uppercase for language selection ([5e704e2](https://github.com/oblique-bit/oblique/commit/5e704e2e780fe0bc64b27bf6ec01a9a377683c70))


# [5.0.4](https://github.com/oblique-bit/oblique/compare/5.0.3...5.0.4) (2020-03-25)

## Bug Fixes
* **column-layout:** hide collapsed columns content ([b132af7](https://github.com/oblique-bit/oblique/commit/b132af7c664067cac1fdba1e98112c0c8140ef7f))
* **datepicker:** provide `NG_VALUE_ACCESSOR` in the mock ([647b0b8](https://github.com/oblique-bit/oblique/commit/647b0b820e87b5421ae9ae95a2f994b2a00e81f3))
* **master-layout:** re-enable toggle icons ([4457fde](https://github.com/oblique-bit/oblique/commit/4457fde48c711022975bdc00297b0a6de0b3d2d3))
* **master-layout:** use the correct class for header controls ([82485bc](https://github.com/oblique-bit/oblique/commit/82485bca1849570e90bc10b74aef237c43526def))
* **multiselect:** fix css & re-enable toggle icons ([26ff9a9](https://github.com/oblique-bit/oblique/commit/26ff9a9f9ce57bb6494092723ca26d7776cb9ab1))
* **search-box:** fix css & remove unnecessary code ([73ea808](https://github.com/oblique-bit/oblique/commit/73ea8087179c9488722a5da41332d41ef76f4647))
* **telemetry:** do not throw errors if `package.json` cannot be read ([895dd36](https://github.com/oblique-bit/oblique/commit/895dd367fbde8b8fa2b5bde3e7ce4dac87019bb8))
* **theme:** adapt button's hover & focus aspect ([21159f1](https://github.com/oblique-bit/oblique/commit/21159f1183ccb6f6cfacc66a29d4b83c9968f10f))
* **theme:** adapt color palette ([92d0762](https://github.com/oblique-bit/oblique/commit/92d0762ed9883aa1fb7e587a331cb5aec514777d))
* **theme:** add `margin-right` to icons within buttons ([102951d](https://github.com/oblique-bit/oblique/commit/102951d1093fb6113495b1e3d7f50a369911f5e3))
* **theme:** add red border on top of selected tab with bootstrap ([27d0f0b](https://github.com/oblique-bit/oblique/commit/27d0f0b2639383910dd9ba4109db29aeb1e8a469))
* **theme:** enlarge navigation item padding ([5b955a2](https://github.com/oblique-bit/oblique/commit/5b955a2c4d176d9dcf98a9939b8a725298448055))
* **theme:** ensure a theme is defined in `ThemeService` ([6116144](https://github.com/oblique-bit/oblique/commit/6116144a3731741cdb03927bb5d9117acfe325ee))
* **theme:** rework spacing for heading and description lists ([30ac2d3](https://github.com/oblique-bit/oblique/commit/30ac2d310c52a747bd3c0925e5f4328fc09f27e8))
* **toolchain:** add missing functions and properties to mock translate ([f585e64](https://github.com/oblique-bit/oblique/commit/f585e64961fdc26dae89d31657a9b9b3288108ad))
* **toolchain:** add null pointer check for schematics ([5dcb841](https://github.com/oblique-bit/oblique/commit/5dcb8419c8c67c01fdd7fdf04aba266d61376216))
* **toolchain:** deploy on public npm registry ([51737ed](https://github.com/oblique-bit/oblique/commit/51737edd353077b9cde009516f7a2e7dc3c60fba))
* ensures that all services, pipes, enums, interfaces, types, components and directives are exported ([6caa1c5](https://github.com/oblique-bit/oblique/commit/6caa1c5b712186fd3ecec4964b23f64c6735d235))

## Refactor
* **toolchain:** migrate from `TSLint` to `ESLint` ([935919b](https://github.com/oblique-bit/oblique/commit/935919b44a9474f4020b7111ce6868ea1bf19805))


# [5.0.3](https://github.com/oblique-bit/oblique/compare/5.0.1...5.0.3) (2020-03-11)

## Bug Fixes
* **master-layout:** fix css selector name ([61d6017](https://github.com/oblique-bit/oblique/commit/61d60175ef395540b8f200c7116da2fce2fe1fef))
* **navigable:** fix css selector name ([2a088ac](https://github.com/oblique-bit/oblique/commit/2a088ac74044edd3652e8fbcb01b6b892a761772))
* **search-box:** fix css selector name ([c70af3f](https://github.com/oblique-bit/oblique/commit/c70af3fa27454d0e3d29c4f419f317df1246343b))
* **spinner:** calculate position manually if no `.application-fixed` exists ([eade31f](https://github.com/oblique-bit/oblique/commit/eade31f51a73fa7ae661c6a9c704c23fca3dd195))
* **spinner:** do not defined unused arguments for `HostListener` ([0e6811e](https://github.com/oblique-bit/oblique/commit/0e6811e1e55db0efff11be9e18ee9cd1e84f1ae2))
* **theme:** `visited` color on `btn` anchors is unchanged ([41b74af](https://github.com/oblique-bit/oblique/commit/41b74afc08a7c09f470e1a5a93d3317328bf25d2))
* **toolchain:** add `bootstrap` & `font-awesome` as optional peer dependencies ([32f7232](https://github.com/oblique-bit/oblique/commit/32f7232c08d3be5faed28ebafbe08c2bd04e420e))
* **toolchain:** ensure the banner do not corrupt the bundle ([9fa56bb](https://github.com/oblique-bit/oblique/commit/9fa56bb94f1b391c6c9a25fd9182a351a1bfbc92))
* **toolchain:** fix licence url ([7bee739](https://github.com/oblique-bit/oblique/commit/7bee739f8c3bfb03154579a8d8d1fd11c042ef53))
* **toolchain:** fix SCSS import paths in the library ([f129787](https://github.com/oblique-bit/oblique/commit/f12978702c932c56e06f623d9a8b11dcc1da1326))
* **toolchain:** remove unnecessary files ([8aa0cca](https://github.com/oblique-bit/oblique/commit/8aa0cca93352d0a9b0f01916ad1b370207a6dd8a))
* **toolchain:** add schema for apis ([9a05337](https://github.com/oblique-bit/oblique/commit/9a0533715a735faa9fde16fe84d163c16d62f0d9))

# [5.0.2](https://github.com/oblique-bit/oblique/compare/5.0.1...5.0.2) (2020-03-09)

## Bug Fixes
* **master-layout:** fix css selector name ([61d6017](https://github.com/oblique-bit/oblique/commit/61d60175ef395540b8f200c7116da2fce2fe1fef))
* **navigable:** fix css selector name ([2a088ac](https://github.com/oblique-bit/oblique/commit/2a088ac74044edd3652e8fbcb01b6b892a761772))
* **search-box:** fix css selector name ([c70af3f](https://github.com/oblique-bit/oblique/commit/c70af3fa27454d0e3d29c4f419f317df1246343b))
* **theme:** `visited` color on bootstrap's `btn` anchors is unchanged ([41b74af](https://github.com/oblique-bit/oblique/commit/41b74afc08a7c09f470e1a5a93d3317328bf25d2))
* **toolchain:** add `bootstrap` & `font-awesome` as optional peer dependencies ([32f7232](https://github.com/oblique-bit/oblique/commit/32f7232c08d3be5faed28ebafbe08c2bd04e420e))
* **toolchain:** ensure the banner do not corrupt the bundle ([9fa56bb](https://github.com/oblique-bit/oblique/commit/9fa56bb94f1b391c6c9a25fd9182a351a1bfbc92))
* **toolchain:** fix SCSS import paths in the library ([f129787](https://github.com/oblique-bit/oblique/commit/f12978702c932c56e06f623d9a8b11dcc1da1326))
* **toolchain:** update `ngx-translate` peer dependency to version 12 ([55686ba](https://github.com/oblique-bit/oblique/commit/55686bac1ddfa7bfd632b841b1190ce6cd1d463b))


## [5.0.1](https://github.com/oblique-bit/oblique/compare/5.0.0...5.0.1) (2020-03-04)

## Bug Fixes
* **collapse:** always use `flex` display for header ([1be353e](https://github.com/oblique-bit/oblique/commit/1be353ec676baf7e432d8c2f39d0d66ad792895b))
* **column-layout:** apply alternate `padding` if master-layout has no layout ([781eeaa](https://github.com/oblique-bit/oblique/commit/781eeaa16171490df010a180ad70b87d74518c7f))
* **column-layout:** apply padding to `column-contain` instead of its parent ([d0c8775](https://github.com/oblique-bit/oblique/commit/d0c8775f931f47a4b414ce6e1e52b676b72f3802))
* **master-layout:** remove unwanted text in header ([9d0341d](https://github.com/oblique-bit/oblique/commit/9d0341d6199c319aab8b4bed3f2efc71f16da3be))
* **stepper:** ensure the `:after` pseudo-element is not displayed above the stepper ([bc33ef3](https://github.com/oblique-bit/oblique/commit/bc33ef335be7b983b3696efbd61b7586d979baee))
* **theme:** `icon` mixin inherits `line-height` ([90638b7](https://github.com/oblique-bit/oblique/commit/90638b7cb588726baa9c0bb3d5b07f68e8f083f0))
* **toolchain:** ignore whitespace in HTML schematics ([b5126f2](https://github.com/oblique-bit/oblique/commit/b5126f239c0484f8d4361afa64945c9617b972db))
* **toolchain:** use `ng update` to set oblique version to it's latest ([addccd6](https://github.com/oblique-bit/oblique/commit/addccd6606c2cfcad40eec92c8e69e26e7b31b4a))


# [5.0.0](https://github.com/oblique-bit/oblique/compare/4.1.1...5.0.0) (2020-03-03)

## Bug Fixes
* **error-messages:** emit an error as soon as possible ([0ce1924](https://github.com/oblique-bit/oblique/commit/0ce1924))
* **master-layout:** theme's observables are created in constructor ([88060d2](https://github.com/oblique-bit/oblique/commit/88060d28a95e079d8a0212122aac568db682aa6a))
* **master-layout:** adapt header's medium and collapsed heights ([9d684d8](https://github.com/oblique-bit/oblique/commit/9d684d8297b77dd6a3ad9b7001ca86e519256ecf))
* **master-layout:** do not refresh the navigation if main navigation is disabled ([82090e2](https://github.com/oblique-bit/oblique/commit/82090e21ff1b28174c4c6e39585a9a3ee329e618))
* **master-layout:** add available languages to `TranslateService` ([66316d5](https://github.com/oblique-bit/oblique/commit/66316d52d4f273fa49e13e2d042840303f3b381b))
* **master-layout:** ensure consistent header height ([32766d7](https://github.com/oblique-bit/oblique/commit/32766d7200cd13ca409c6e1df7bf79a4ca4cae8e))
* **multiselect:** apply given `idPrefix` to toggle button ([31f2e4a](https://github.com/oblique-bit/oblique/commit/31f2e4a881a51da404706fa16119b4ec7f1258fb))
* **multiselect:** remove `input` decorator on `disabled` property ([dc87d7b](https://github.com/oblique-bit/oblique/commit/dc87d7b))
* **nav-tree:** children are collapsible ([89f8994](https://github.com/oblique-bit/oblique/commit/89f89943d78679d9a0617a90f9e54e8e94661f26))
* **notification:** cancel timeout when notification closed ([78f449b](https://github.com/oblique-bit/oblique/commit/78f449b))
* **search-box:** remove padding when collapsed ([8302da5](https://github.com/oblique-bit/oblique/commit/8302da59295e6404524c471cd8ee5ca9eaa1e786))
* **sticky:** apply initial values and keep `sticky` class ([7bf7ba9](https://github.com/oblique-bit/oblique/commit/7bf7ba9246402c237621f51ed2c56fe220cc5caa))
* **theme:** ensure custom styles overrides those of material design ([84daa2d](https://github.com/oblique-bit/oblique/commit/84daa2dcf7ec663d12f1b4aad8e8d0719da996c0))
* **theme:** fix cover layout background image path ([ffed67d](https://github.com/oblique-bit/oblique/commit/ffed67d53f3e0424859144ba737e2af3281db4ee))
* **theme:** change `btn-link` color to `brand-primary` ([f7f4d6b](https://github.com/oblique-bit/oblique/commit/f7f4d6b288b8966deb4348b24b06f133e2cda902))
* **theme:** move `form-actions` class into core ([36561cc](https://github.com/oblique-bit/oblique/commit/36561cc7967a8b891ac47199790ef2ce1cc19066))
* **toolchain:** ensure no `map` file points to a file named `oblique-oblique.*` ([afd8f46](https://github.com/oblique-bit/oblique/commit/afd8f464a44e35c9a4c5dc8f58982d2b5500615f))
* **toolchain:** ensure correct file order in `oblique-compat` ([3659e6e](https://github.com/oblique-bit/oblique/commit/3659e6e73c20e62dff45d26c1fc96d570bbdf4d2))
* **toolchain:** ensure all components have external, non encapsulated, styles ([d448243](https://github.com/oblique-bit/oblique/commit/d448243ee8a17b61825d4a22e435bea47f30084e))
* **toolchain:** include nested folders in `oblique-components` ([a6e47d6](https://github.com/oblique-bit/oblique/commit/a6e47d6))
* **translate-params:** return non string parameters unchanged ([23bff42](https://github.com/oblique-bit/oblique/commit/23bff42))
* **unknown-route:** do not alter `default-layout` ([a39f869](https://github.com/oblique-bit/oblique/commit/a39f8699487806b49fea6b7fc7d84687ad7514d8))

## Features
* **master-layout:** accessibility improvement ([8d45976](https://github.com/oblique-bit/oblique/commit/8d459762c8fdecc31e9ac6eec7567dea5e4d9bcb))
* **master-layout:** add cancelable default padding ([e47012c](https://github.com/oblique-bit/oblique/commit/e47012cfe1221b0dce395ff75312c801444d3b5c))
* **master-layout:** remove `default-layout` class ([0e5a60f](https://github.com/oblique-bit/oblique/commit/0e5a60f29ac99db5c6a157e9547e560fe6eb2ac0))
* **column-layout:** reduce toggle width to fit the default padding ([20bcb14](https://github.com/oblique-bit/oblique/commit/20bcb1484176d1c0fc8f11425405d27f57f998a3))
* **column-layout:** add `wider` option to widen side panels ([9eec269](https://github.com/oblique-bit/oblique/commit/9eec269ec3dd4d2f6d616c70bf913bd65209e0fe))
* **column-layout:** add cancelable default padding ([b6166de](https://github.com/oblique-bit/oblique/commit/b6166de6c69826ced16e66697d84b895505e4d7d))
* **collapse:** transform `toggle` feature into `collapse` ([b932369](https://github.com/oblique-bit/oblique/commit/b93236987ee85addbafc6de9ac245eaf0c138e90))
* **datepicker:** add size option ([7b35257](https://github.com/oblique-bit/oblique/commit/7b35257))
* **datepicker:** improve error rendering ([ae0301c](https://github.com/oblique-bit/oblique/commit/ae0301c))
* **datepicker:** improve outlined and selected day rendering ([5cd24c7](https://github.com/oblique-bit/oblique/commit/5cd24c7))
* **datepicker:** mark as deprecated for `Material` ([18c7dc5](https://github.com/oblique-bit/oblique/commit/18c7dc5))
* **error-messages:** add support for nested forms ([c07346d](https://github.com/oblique-bit/oblique/commit/c07346d4cd4dc1d5b71c029b6eccbe268557d06e))
* **form-control-state:** add support for nested forms ([c61e834](https://github.com/oblique-bit/oblique/commit/c61e834))
* **master-layout:** replace `isScrollable` with `scrollMode` ([de25521](https://github.com/oblique-bit/oblique/commit/de25521d4a37680c7ea8130dc1e46ac1cbe38719))
* **master-layout:** shows oblique version number on `or-master-layout` ([77274f4](https://github.com/oblique-bit/oblique/commit/77274f4337fccbad17835b4d1045a1012eab856a))
* **multi-translate-loader:** add custom loader for `TranslateModule` ([89d5078](https://github.com/oblique-bit/oblique/commit/89d507806a71706bfba29f0576fe350f6a39db51))
* **nav-tree:** remove `pathPrefix` input ([33b097c](https://github.com/oblique-bit/oblique/commit/33b097c80301d38b5beb2cb4f87ed46b097b6474))
* **nav-tree:** remove content projection ([94c16ad](https://github.com/oblique-bit/oblique/commit/94c16ad31cf5737a06e8db9adb5a51e75a2c6b8a))
* **navigable:** mark as deprecated ([de0ecb1](https://github.com/oblique-bit/oblique/commit/de0ecb1b2a135c056176e4c7e4078e2f5e6592a2))
* **navigator:** also depreciate the module ([e9c149c](https://github.com/oblique-bit/oblique/commit/e9c149c0b5e916ef8b74aa0a861dce3f41144631))
* **nested-form:** add feature ([2ea5ccf](https://github.com/oblique-bit/oblique/commit/2ea5ccf178aebc2803040333b3496ccad155c493))
* **notification:** add message params in notification id ([8834e82](https://github.com/oblique-bit/oblique/commit/8834e82b36cdca361b4f849ecf9b3fac50aeaf41))
* **notification:** remove obsolete `KeyWithParams` interface ([6ea60ed](https://github.com/oblique-bit/oblique/commit/6ea60ed6aaac0090f9b8060b3ac10ff4a4fa3efd))
* **pop-up:** add `PopUpService` ([ad16987](https://github.com/oblique-bit/oblique/commit/ad1698760fbba82334be83532615fe5d885b4796))
* **selectable:** add feature ([307991c](https://github.com/oblique-bit/oblique/commit/307991c01456ebe2026277352918d58bcfad8a50))
* **sticky:** add cancelable default padding ([10aa9e2](https://github.com/oblique-bit/oblique/commit/10aa9e2739903bfa23b71f80029e12806361a9e8))
* **telemetry:** send data only when necessary ([5630c7e](https://github.com/oblique-bit/oblique/commit/5630c7e53c7e1673f01efa61d448e9e6465dca5b))
* **theme:** force stepper's `displayDefaultIndicatorType` to `false` ([4c5474e](https://github.com/oblique-bit/oblique/commit/4c5474ec41680f17e3ca276c0807bf20a7eebc9e))
* **theme:** `setTheme` now supports custom theme ([6e9a08b](https://github.com/oblique-bit/oblique/commit/6e9a08b9798e4c0c30f67179e1e8a9acb48accb7))
* **theme:** add `Roboto` font option ([cf80919](https://github.com/oblique-bit/oblique/commit/cf809191e8831c0673c8edaaf31b3377b2663763))
* **theme:** rework `card` feature ([a4df9af](https://github.com/oblique-bit/oblique/commit/a4df9afc04e9233221afb7d2890949cfe007bcb1))
* **theme:** rework `chips` feature ([6bcf5ba](https://github.com/oblique-bit/oblique/commit/6bcf5babf91dc0976f044fdc088efc48aab10e13))
* **theme:** rework `dialog` feature ([0586457](https://github.com/oblique-bit/oblique/commit/05864570c627370b9ca9339f3592ab3e45e894a2))
* **theme:** rework `stepper` feature ([297635f](https://github.com/oblique-bit/oblique/commit/297635f1f6e5e8f0dcd50ad0c9997abdb3836a05))
* **theme:** rework `table` feature ([193dd67](https://github.com/oblique-bit/oblique/commit/193dd67986dab183f1a59154d4ed7f575f0df4fa))
* **theme:** rework `tabs` feature ([9663362](https://github.com/oblique-bit/oblique/commit/96633621cae49480789b83502c369f323ab78d7e))
* **theme:** rework `tooltip` feature ([d9eeb40](https://github.com/oblique-bit/oblique/commit/d9eeb4025fcc5750bbf33eab1861a505e5ed5c33))
* **theme:** rework color palette ([9a40f23](https://github.com/oblique-bit/oblique/commit/9a40f23a5776681c7f192db31a63a27b13913256))
* **theme:** rework font management ([94df5f1](https://github.com/oblique-bit/oblique/commit/94df5f1e8159659ec44c04b210399b9bafcbe3ad))
* **theme:** rework spacers and add `$spacing-lg` ([146f2d0](https://github.com/oblique-bit/oblique/commit/146f2d0eca9d25542c930be6d90d77f28f39612f))
* **theme:** rework typography ([d91195a](https://github.com/oblique-bit/oblique/commit/d91195aab552b3e489187cd5e9c18b315d298e3a))
* **theme:** add `hover-visible` class ([aeb2480](https://github.com/oblique-bit/oblique/commit/aeb2480a42d00d2090436a817380d89c6ce95509))
* **theme:** add `oblique-compat.scss` ([5a0aa0c](https://github.com/oblique-bit/oblique/commit/5a0aa0c0415eba7a56ec1f2a106971c7a48fe919))
* **theme:** show deprecation notice only once per element ([0d2661e](https://github.com/oblique-bit/oblique/commit/0d2661e0d3fabff2120056ddd85a917622ba363e))
* **theme:** show warning in console when Frutiger cannot be loaded ([2751f2d](https://github.com/oblique-bit/oblique/commit/2751f2dc96cb8330b3cd9435effa654f2b14f865))
* **theme:** theme isn't set automatically anymore ([2f80199](https://github.com/oblique-bit/oblique/commit/2f801992b6a7d2cb6a97aaa28de00a855580f36d))
* **toolchain:** replace `FONTS.ARIAL` with `FONTS.NONE` ([829b732](https://github.com/oblique-bit/oblique/commit/829b732fc7a65a0c46208f3be8b4307ee285fa57))
* **toolchain:** set up schematics for update to oblique 5 ([1deb5cc](https://github.com/oblique-bit/oblique/commit/1deb5cc27f123a5379f648bb00b4d326b21fc58a))
* **toolchain:** remove `test_helpers` ([15416d2](https://github.com/oblique-bit/oblique/commit/15416d2e40f84ed489449104bbe9bebf1ef03fbc))
* **unknown-route:** add feature ([e65f90a](https://github.com/oblique-bit/oblique/commit/e65f90acad86f528b2df6309e370f0eb2efd6284))
* **utilities:** add configurable multi translation loader ([daf8dbb](https://github.com/oblique-bit/oblique/commit/daf8dbb485cf174b805e30349c2aa699cca02ed7))
* **utilities:** add `WINDOW` InjectionToken for SSR compatibility ([a34eb41](https://github.com/oblique-bit/oblique/commit/a34eb41730dfb38aae0bfc761a79d3ccd4ef4e95))

## Code Refactoring
* **datepicker:** transform the component into a form element ([6235e97](https://github.com/oblique-bit/oblique/commit/6235e970964072042125cb472b684785d2b5c911))
* **http-interceptor:** rename files and classes of `ObliqueHttpModule` ([78b852e](https://github.com/oblique-bit/oblique/commit/78b852e14a9126f2c528ef13b1ddc230a664a151))
* **input-clear:** rename `text-control-clear` into `input-clear` ([dda514e](https://github.com/oblique-bit/oblique/commit/dda514ec338da939c432e41ad6a4f97ad33dac51))
* **master-layout:** rename `ObNavigationLink` into `ObINavigationLink` ([5f0ff42](https://github.com/oblique-bit/oblique/commit/5f0ff425838dc920b1e6c2982217aa2de9411672))
* **sticky:** move sticky-related CSS into `sticky` component ([724fbe5](https://github.com/oblique-bit/oblique/commit/724fbe571779c53cbbd3cbd4fecb2af26db46db6))
* add `ob` prefix to every Oblique element (selectors, classes, interfaces, ...) ([ebd81d6](https://github.com/oblique-bit/oblique/commit/ebd81d6990e4659c4d6b387dfc90465a8b794028))
* all oblique translations keys starts with `i18n.oblique` ([5f1ed2d](https://github.com/oblique-bit/oblique/commit/5f1ed2d213c86b72c9f713ac5ac7301675984c4a)

## BREAKING CHANGES
* **collapse:** `toggle` feature has been removed in favor of `collapse`
* **collapse:** `toggle` css now needs `oblique-compat.css` to be used without the `collapse` component
* **datepicker:** content projection has been removed, the aspect is now immutable (solved with schematics)
* **datepicker:** some `ngbDatePicker` properties are not accessible anymore, see API for more info
* **datepicker:** some `ngbDatePicker` properties can be set through the `options` input, see API for more info
* **datepicker:** some `ngbDatePicker` properties can be set through inputs, see API for more info
* **datepicker:** default navigation has been set to `select` instead of `arrows`
* **datepicker:** `forRoot` method has been removed with no replacement. It is not useful anymore (solved with schematics)
* **http-interceptor:** `ObliqueHttpInterceptor` has been renamed to `HttpApiInterceptor` (solved with schematics)
* **http-interceptor:** `ObliqueHttpInterceptorConfig` has been renamed to `HttpApiInterceptorConfig` (solved with schematics)
* **http-interceptor:** `ObliqueHttpInterceptorEvents` has been renamed to `HttpApiInterceptorEvents` (solved with schematics)
* **http-interceptor:** `ObliqueHttpInterceptorModule` has been renamed to `HttpApiInterceptorModule` (solved with schematics)
* **http-interceptor:** `ObliqueRequest` has been renamed to `HttpApiRequest` (solved with schematics)
* **input-clear:** `orTextControlClear` has been renamed to `orInputClear` (solved with schematics)
* **master-layout:** `default-layout` class has been dropped in favor of oblique's default padding
* **master-layout:** `isScrollable` configuration has been replaced with `scrollMode`
* **multiselect:** id of `or-multiselect` component has been changed to `<idPrefix>-container` instead of `<idPrefix>`
* **multiselect:** id of multiselect toggle has been changed to `<idPrefix>` instead of `<idPrefix>-toggle`
* **multiselect:** `id` property has been removed in favor of `idPrefix`
* **multiselect:** `_0` is removed from `idPrefix`
* **nav-tree:** `pathPrefix` input has been removed with no replacement. It was without effect anyway
* **notification:** `KeyWithParams` interface has been dropped in favor of `INotification`
* **sticky:** sticky layouts built without the component need the `oblique-components.css` file
* **theme:** `FRUTIGER` injection token has been removed in favor of `OBLIQUE_FONT` (solved with schematics)
* **theme:** `setFrutiger` method has been removed in favor of `setFont` (solved with schematics)
* **theme:** `setDefaultTheme` has been renamed into `setDefaultFont` (should not be used)
* **theme:** `OBLIQUE_THEME` injection token has been removed (solved with schematics)
* **theme:** theme link in `head` is only added if `setTheme` has been called
* **theme:** font link in `head` is only added if `setFont` has been called with a static font
* **theme:** there is no default theme anymore, one must be defined in `angular.json`. Under `projects > <projectName> > architect > build > options > styles` either `"projects/oblique/src/styles/scss/oblique-material.scss"` or `"projects/oblique/src/styles/scss/oblique-bootstrap.scss"` has to be added. (solved with schematics)
* **theme:** `_nav-tabs.scss` has been renamed into `_tabs.scss` (solved with schematics)
* **theme:** tabs look and feel has been adapted, use `oblique-compat.css` to keep the old style
* **theme:** stepper look and feel has been adapted, use `oblique-compat.css` to keep the old style
* **theme:** tables are not CI/CD conform anymore, the `cicd` class is needed to achieve the previous CI/CD style
* **theme:** `$gray-lighter` has been renamed into `$gray-extra-light` (solved with schematics)
* **theme:** `$gray-lighter-2` has been renamed into `$gray-lighter` (solved with schematics)
* **theme:** `$brand-extralight` has been renamed into `$brand-extra-light` (solved with schematics)
* **theme:** `$gray-dark`, `$brand-dark`, `$brand-light`, `$brand-extra-light`, `$brand-warning-dark`, `$brand-error` and `$brand-error-dark` have been slightly changed
* **theme:** `$brand-secondary` has been removed without replacement (still available under the name `$secondary` for bootstrap theme)
* **theme:** anchors are always `underlined` for accessibility reasons
* **theme:** `Roboto` is now the alternate font instead of `Arial`
* **theme:** all spacers and structural heights have been slightly adapted
* **theme:** `$spacing-md` has been removed in favor of `$spacing-sm` (solved with schematics)
* **theme:** `FONTS.ARIAL` has been renamed into `FONTS.NONE` (solved with schematics)
* **toolchain:** localize is now a peer dependency: `ng add @angular/localize` (solved with schematics)
* **toolchain:** `test_helpers` directory have been removed in favor of `ObliqueTestingModule` (solved with schematics)
* all oblique translations keys starts with `i18n.oblique`
* all selectors prefixes has been changed from `or` to `ob` (solved with schematics)
* all classes has been prefixed with `Ob` (solved with schematics)
* all enums has been prefixed with `ObE` (solved with schematics)
* all interfaces has been prefixed with `ObI` (solved with schematics)

# [4.1.1](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/browse?at=4.1.1) (2019-10-18)

## Bug Fixes
* **packaging:** restore previous Oblique's translation keys ([82d4fa4](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/82d4fa4))


# [4.1.0](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/browse?at=4.1.0) (2019-10-15)

## Bug Fixes
* **http-interceptor:** pass `sticky` parameter to notification ([88444f2](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/88444f2))
* **multiselect:** throw error with duplicate `id`s ([c1ac9e1](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/c1ac9e1))
* **notification:** use provided `sticky` value even if it's `false` ([df0ce69](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/df0ce69))
* **schema-validation:** let `orSchemaValidate` match reactive forms ([cd954e9](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/cd954e9))
* **theme:** do not use `unset` CSS value (IE11) ([a3a134a](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/a3a134a))
* **theme:** fix icon position on datepicker for MD ([0f9d457](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/0f9d457))
* **theme:** use relative font size for typography ([2c699f2](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/2c699f2))

## Features
* **error-messages:** add directive to show errors with MD ([f58bbb5](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/f58bbb5))
* **http-interceptor:** add helper functions to tweak the interceptor ([2dd5a89](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/2dd5a89))
* **multiselect:** add `count` property ([bd9b7a1](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/bd9b7a1))
* **multiselect:** add `titleProperty` and  `titleFormater` ([29ac09c](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/29ac09c))
* **multiselect:** add selected items list for accessibility ([ebf2ec4](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/ebf2ec4))
* **notification:** can clear all notifications on navigate ([7a80920](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/7a80920))
* **notification:** can group similar notifications ([1b7e408](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/1b7e408))
* **telemetry:** add telemetry feature ([ed149d2](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/ed149d2))
* **theme:** improve errors and hints rendering for MD ([313952c](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/313952c))
* **theme:** add relative font sizes ([03bd4a5](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/03bd4a5))
* **toolchain:** add support for multiple translation files ([6672112](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/6672112))
* **toolchain:** provide translation files with Oblique and common keys ([7422c16](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/7422c16))
* **utilities:** add `MockTranslateService` to `test_helpers` ([2a908a7](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/2a908a7))


# [4.0.3](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/browse?at=4.0.3) (2019-09-25)

## Bug Fixes
* **column-layout:** do not use `unset` CSS value (IE11) ([beb1b92](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/beb1b92))
* **dropdown:** better align the bubble-tail ([c0d3db3](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/c0d3db3))
* **dropdown:** do not use `unset` CSS value (IE11) ([4741130](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/4741130))
* **filter-box:** allow multiple prefix and suffix ([9fbf6f8](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/9fbf6f8))
* **master-layout:** do not use `unset` or `initial` CSS values (IE11) ([aee60b5](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/aee60b5))
* **master-layout:** fix scroll `padding-bottom` on `.application` ([e82c1eb](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/e82c1eb))
* **search-box:** do not animate left and right padding of hit list ([d00f359](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/d00f359))
* **search-box:** do not use `unset` CSS value (IE11) ([bac090f](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/bac090f))
* **theme:** `themes$` observable deliver `THEMES` instead of `string` ([b440bff](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/b440bff))
* **theme:** add `margin-top` to avoid clipping label with Material ([928df57](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/928df57))
* **theme:** align Material's `prefix` and `suffix` with input text ([8b1035d](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/8b1035d))
* **theme:** do not use `unset` CSS value (IE11) ([5e69d96](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/5e69d96))
* **theme:** fix Bootstrap's `input-groups` dropdown appearance ([909a444](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/909a444))
* **theme:** fix bootstrap's prepend and append icon height ([270d9d3](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/270d9d3))
* **theme:** improve contrast of bootstrap's `list-group` ([eb0b3f7](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/eb0b3f7))
* **theme:** show full hint or error texts only on hover ([aeafaf2](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/aeafaf2))


# [4.0.2](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/browse?at=4.0.2) (2019-09-17)

## Bug Fixes
* **datepicker:** export as `orDatePicker` ([bea3ab6](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/bea3ab6))
* **dropdown:** fix `z-index` ([46d0d03](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/46d0d03))
* **dropdown:** fix position with material design ([05d7eed](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/05d7eed))
* **error-messages:** export as `orErrorMessages` ([cceec64](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/cceec64))
* **form-control-state:** export as `orFormControlState` ([f4e6353](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/f4e6353))
* **master-layout:** fix double scrollbar ([32d16fe](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/32d16fe))
* **master-layout:** fix flickering upon scrolling ([9c80b4b](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/9c80b4b))
* **master-layout:** fix layout with `hasScrollTransition` disabled ([279a1ed](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/279a1ed))
* **master-layout:** footer service monitor footer `hasScrollTransition` property ([1f24a99](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/1f24a99))
* **master-layout:** show off-canvas backdrop below layout collapse ([9f0fef3](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/9f0fef3))
* **master-layout:** use initial value of `hasScrollTransition` ([9bc4da7](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/9bc4da7))
* **notification:** do not use `KeyWithParams` interface and deprecate it ([b141570](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/b141570))
* **theme:** add `margin-bottom` to alert ([aa8d175](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/aa8d175))
* **theme:** add bootstrap's grid to `oblique-utilities` ([6c97ef6](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/6c97ef6))
* **theme:** add scroll on `pre` element ([0506d5a](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/0506d5a))
* **theme:** correctly read `FRUTIGER` value ([9864fd5](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/9864fd5))
* **theme:** do not add border and padding to `code` within `pre` ([becfa83](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/becfa83))
* **theme:** add fontawesome 5 font files ([7f00f15](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/7f00f15))
* **theme:** add fontawesome SCSS files ([2915181](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/2915181))
* **theme:** remove fontawesome 4 font files ([d6ddd04](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/d6ddd04))
* **toggle:** can place toggle before or after ([f609400](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/f609400))
* **toolchain:** fix `dist` on Windows ([1fe07f9](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/1fe07f9))


# [4.0.1](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/browse?at=4.0.1) (2019-08-15)

## Bug Fixes
* **master-layout:** use white for heading in `offcanvas-sidebar` only ([daabf9b](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/daabf9b))
* **theme:** integrate FA5 CSS with oblique-core without `@import` ([bfe26de](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/bfe26de))


# [4.0.0](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/browse?at=4.0.0) (2019-08-14)

## Bug Fixes
* **master-layout:** fix `off-canvas` animation ([4063da7](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/4063da7))
* **master-layout:** reduce `off-canvas` header height if header is collapsed ([6143bc3](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/6143bc3))
* **master-layout:** set `default-layout` to `off-canvas` content ([a330416](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/a330416))
* **master-layout:** use white color for headings within `off-canvas` ([6e20249](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/6e20249))
* **master-layout:** fix accessibility quick links ([0083863](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/0083863))
* **master-layout:** no `overflow` on main navigation ([47e9841](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/47e9841))
* **master-layout:** timing issue with `application-scrolling` ([0e42337](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/0e42337))
* **master-layout:** close main navigation menu on `Escape` ([b8c61ba](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/b8c61ba))
* **master-layout:** close main navigation menu on outside click ([70a4714](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/70a4714))
* **master-layout:** main navigation menu is active when sub-route is active ([601dd2f](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/601dd2f))
* **toggle:** remove leading whitespace in class list ([8df4c32](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/8df4c32))
* **search-box:** fix bootstrap rendering ([c4f924d](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/c4f924d))
* **search-box:** mouse up and down events are not propagated ([076fb5a](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/076fb5a))
* **theme:** add `nav-tabs` component ([3e529b9](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/3e529b9))
* **theme:** fix stepper with material ([d5bfc58](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/d5bfc58))
* **multiselect:** correctly pass prepend to filter-box ([92143f4](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/92143f4))
* **multiselect:** correctly handle `disable` state ([b434daf](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/b434daf))
* **packaging:** `test_helpers` is correctly copied ([33d3c0f](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/33d3c0f))

## Features
* **master-layout:** add `scrolled` event to provide scroll offset ([959e8b1](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/959e8b1))
* **master-layout:** navigation is displayed with multiple columns with full width ([1099780](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/1099780))
* **master-layout:** full width main navigation is disabled by default ([c30ad65](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/c30ad65))
* **master-layout:** use lighter grey on submenu item hover ([80d5e56](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/80d5e56))
* **notification:** only `oblique` chanel has `position: fixed` ([8143f54](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/8143f54))
* **notification:** add `id`s on notification's elements ([b68d340](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/b68d340))
* **notification:** remove `default` notification ([0a54f3e](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/0a54f3e))
* **theme:** add `$brand-info` colors and use them ([c2e02f4](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/c2e02f4))
* **theme:** add `theme` service to take care of themes and fonts ([a76fc20](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/a76fc20))
* **theme:** add all CI/CD colors and use them ([e4a540b](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/e4a540b))
* **theme:** redefine material color palette with oblique colors ([f91087c](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/f91087c))
* **theme:** redefine typography ([35a3727](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/35a3727))
* **theme:** replace `OpenSans` with `Frutiger` and `Arial` as fallback ([00c839d](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/00c839d))
* **theme:** style `table` according to CI/CD ([2712f1e](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/2712f1e))
* **theme:** adjust colors ([72d25a0](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/72d25a0))
* **theme:** provide minified css files in the dist ([80e3362](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/80e3362))
* **theme:** separate `oblique-bootstrap` from `oblique-core` ([8dcd1b8](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/8dcd1b8))
* **theme:** extract alert into a standalone css component ([bbab6cc](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/bbab6cc))
* **theme:** remove callout css component ([23be35e](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/23be35e))
* **theme:** add `oblique-utilities` ([82c5a3e](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/82c5a3e))
* **theme:** add `angular material` variant  ([cce3b02](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/cce3b02))
* **theme:** force `outline` input variant for all Oblique modules ([fb28717](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/fb28717))
* **theme:** `OBLIQUE_THEME` can be used to change the main theme ([a76fc208c78](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/a76fc208c78))
* **theme:** `FRUTIGER` can be used to disable `frutiger` font ([a76fc208c78](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/a76fc208c78))
* **multiselect:** add `id`s on multiselect's elements ([0ee04c1](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/0ee04c1))
* **toggle:** can be activated by default with `active` input ([e092e6c](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/e092e6c))
* **toggle:** remove `toggle-collapse` class ([462c9c9](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/462c9c9))
* **dropdown:** add `dropdown` component ([7629d5a](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/7629d5a))
* **column-layout:** vertically center the toggle ([c9e1535](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/c9e1535))
* **filter-box:** add `angular material` variant ([cd7c148](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/cd7c148))

## Code Refactoring
* **package:** rename library to `@oblique/oblique` ([10095d5](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/10095d5))
* **theme:** rename `brand-danger` into `brand-error` ([61b473a](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/61b473a))
* **datepicker:** remove `DatepickerModule` form `ObliqueModule` ([a8383e9](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/a8383e9))
* **toggle:** rename `activate` function into `toggle` ([3510496](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/3510496))
* **toggle:** use `@Input` instead of classes for toggle direction ([686f8d7](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/686f8d7))
* **master-layout:** remove `ScrollDetectionDirective` ([3c7af50](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/3c7af50))
* **master-layout:** rename `scrolled` event into `isScrolled` ([b0a975a](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/b0a975a))
* **master-layout:** separate MasterLayoutService into multiple files ([76a84f1](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/76a84f1))
* **unsaved-changes:** split code into 2 modules ([02df9ae](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/02df9ae))
* **notification:** simplify notification signatures ([6febfbe](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/6febfbe))
* **http-interceptor:** refactor according to notification changes ([c3e214a](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique/commits/c3e214a))

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
# [3.1.1](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=3.1.1) (2019-04-29)

## Bug Fixes
* **master-layout:** close main navigation menu on `Escape` ([b8c61ba](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b8c61ba))
* **master-layout:** close main navigation menu on outside click ([70a4714](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/70a4714))
* **master-layout:** main navigation menu is active when sub-route is active ([601dd2f](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/601dd2f))
* **multiselect:** add `setDisabledState` function ([b434daf](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b434daf))
* **packaging:** `test_helpers` is correctly copied ([33d3c0f](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/33d3c0f))

<a name="3.1.0"></a>
# [3.1.0](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=3.1.0) (2019-03-12)

## Dependencies updates
* **Angular:** 7.2.8
* **ObliqueUI:** 3.0.0
* **ng-bootstrap:** 4.1.0
* **ngx-translate:** 11.0.1
* **ajv:** 6.10.0
* **rxjs:** 6.4.0
* **zone.js:** 0.8.29

### Bug Fixes
* **datepicker:** remove onDocumentClick ([3cd4b47](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/3cd4b47))
* **master-layout:** `offCanvas` can be dynamically toggled on/off ([2b00202](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/2b00202))
* **master-layout:** apply `nav-link` class on child anchors of header control ([74e528a](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/74e528a))
* **master-layout:** custom navigation can be scrollable ([375a647](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/375a647))
* **multiselect:** add customizable `id` to underlying input ([0423b82](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0423b82))
* **nav-tree:** pass `translateService` to the default formatter factory ([efa999a](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/efa999a))
* **schema-validator:** accepts `properties` property to be empty or not present ([269a897](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/269a897))
* **security:** links to cross-origin destinations are unsafe ([595f0cf](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/595f0cf))
* **spinner:** delay `$state` change to avoid `ExpressionChangedAfterItHasBeenCheckedError` ([f23621e](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f23621e))
* **unsaved-changes:** use correct type for `Subscription` ([4f29c10](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/4f29c10))

### Features
* **error-messages:** use `orTranslateParams` instead of `translate` ([d2434ed](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d2434ed))
* **interceptor:** keep track of running requests ([e234f23](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/e234f23))
* **master-layout:** apply `control-icon` class automatically on `nav-link` elements ([669d94b](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/669d94b))
* **nav-tree:** translate labels ([901d42e](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/901d42e))
* **translate-params:** add `orTranslateParams` pipe ([4c27ed1](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/4c27ed1))


<a name="3.0.0"></a>
# [3.0.0](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=3.0.0) (2018-11-27)

## Dependencies updates
* **Angular:** 7.1.0
* **ObliqueUI:** 3.0.0
* **ng-bootstrap:** 4.0.0
* **ngx-translate:** 11.0.1
* **ajv:** 6.5.5
* **rxjs:** 6.9.3
* **tslib:** 1.9.3

## Bug Fixes
* **changelog:** use correct link to named versions ([207392c](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/207392c))
* **master-layout:** add a normal space on the right of the locale selection ([0186d2a](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0186d2a))
* **master-layout:** apply `home` link on footer logo ([34afa1d](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/34afa1d))
* **master-layout:** improve contrast of locale buttons ([ee459f3](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/ee459f3))
* **off-canvas:** increase the size of the close button ([d39949c](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d39949c))
* **off-canvas:** do not set `default-layout` on off-canvas content ([7d90998](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7d90998))
* **master-layout:** ensure user chosen language is supported ([0e0cbd4](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0e0cbd4))
* **master-layout:** can dynamically update custom footer ([359c8ff](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/359c8ff))
* **master-layout:** close main navigation when sub-navigation is active on mobile mode ([11cac0e](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/11cac0e))
* **master-layout:** do not highlight `#content` and `#navigation` when focused ([2aa4540](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/2aa4540))
* **master-layout:** improve aspect of language selection buttons ([1df4f59](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1df4f59))
* **master-layout:** remove navigation jump link when there is no navigation ([0d6ea68](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0d6ea68))
* **master-layout:** remove navigation title when there is no navigation ([2372d92](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/2372d92))
* **master-layout:** use same language for both the default and current language ([1710405](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1710405))
* **nav-tree:** filtering treats regex terminals as string instead of throwing an error ([e415570](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/e415570))
* **master-layout:** `.navbar` inherits `background-color` from parent ([19d7a02](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/19d7a02))
* **master-layout:** jumplinks use angular route fragments ([d1f4b61](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d1f4b61))
* **master-layout:** transform `NodeList` into `array` (IE compatibility) ([5fd0b9a](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/5fd0b9a))

## Features
* **master-layout:** remove `[orOffCanvas]` content projection from `MasterLayoutComponent` ([a50e91e](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/a50e91e))
* **master-layout:** add `[orFooter]` and `[orHeader]` content projection to use a completely custom content ([aca2775](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/aca2775))
* **master-layout:** add controls for offCanvas, custom header and footer and scroll transitions for header and footer ([0dde5ab](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0dde5ab))
* **master-layout:** add support for ids on navigation items ([014c916](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/014c916))
* **master-layout:** add support for `Enter` key for menu toggle ([4d0937d](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/4d0937d))
* **master-layout:** can now totally disable Oblique language management ([593cb77](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/593cb77))
* **master-layout:** can specify an id per locale ([885f5d6](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/885f5d6))
* **master-layout:** dropdown navigation can be toggled with `Enter` key ([b279e72](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b279e72))
* **master-layout:** dynamically add oblique classes on header controls ([b587df6](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b587df6))
* **master-layout:** move `ScrollingConfig.transitions.header` to `MasterLayoutConfig.header.scrollTransitions` ([08269d7](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/08269d7))
* **master-layout:** navigation can be scrollable ([81887ea](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/81887ea))
* **master-layout:** remove `[orFooterInfoSMCollapse]` ([80b12f6](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/80b12f6))
* **master-layout:** remove `[orFooterLinks]` content projection from `MasterLayoutComponent` ([1b3a45f](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1b3a45f))
* **master-layout:** remove `[orHeaderControls]` content projection from `MasterLayoutComponent` ([65f65eb](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/65f65eb))
* **master-layout:** remove `ORFooterLink` from `MasterLayoutConfig` ([be6dfd9](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/be6dfd9))
* **master-layout:** remove deprecated master layout code ([81fc6ff](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/81fc6ff))
* **master-layout:** use browser language as default and remove locale related warnings ([ffa5c3b](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/ffa5c3b))
* **master-layout:** use named templates for header controls and footer links ([6994b3f](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/6994b3f))
* **master-layout:** wrap `defaultLocale` and `locales` within `locale` ([9ea5ff2](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/9ea5ff2))

## Code Refactoring
* change `EventEmitter` to `rxjs.Subject` where applicable ([e3d57e3](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/e3d57e3))
* use the cli to build the distribution ([f703b61](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f703b61))


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
# [2.1.2](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.1.2) (2018-09-25)

## Dependencies updates
* **Angular:** 6.1.8
* **ng-bootstrap:** 3.2.2
* **ajv:** 6.5.4
* **oblique-ui:** 2.0.2

## Bug Fixes
* **master-layout:** `menuCollapsed` is set to `false` when the menu is opened and to `true` when it is closed ([0dfdd92](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0dfdd92))
* **master-layout:** can provide the whole header controls list as content projection ([515af00](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/515af00))
* **master-layout:** controls are not focusable during header closure ([9c96bea](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/9c96bea))
* **master-layout:** each Oblique webapp has it's own language token ([8331bbe](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/8331bbe))
* **master-layout:** export everything in index.html ([91f4080](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/91f4080))
* **master-layout:** export MasterLayoutComponent as `orMasterLayout` ([f23e3d8](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f23e3d8))
* **master-layout:** header controls are automatically focusable when the layout is not collapsed ([f3413a8](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f3413a8))
* **master-layout:** masterLayoutDirective uses old selector for the menu toggle ([00949d0](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/00949d0))
* **master-layout:** set default `true` value for `menuCollapsed` ([25c0a80](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/25c0a80))
* **nav-tree:** correctly match active links ([425288e](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/425288e))
* **navigable:** correctly exports the directive ([7c9f36c](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7c9f36c))
* **off-canvas:** sidebar is shown on mobile view ([35b2ea3](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/35b2ea3))
* **off-canvas:** toggle is also activated on `enter` key ([7d29701](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7d29701))


<a name="2.1.1"></a>
# [2.1.1](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.1.1) (2018-09-07)

## Dependencies updates
* **Angular:** 6.1.7
* **ng-bootstrap:** 3.2.0
* **rxjs:** 6.3.2

## Bug Fixes
* **column-layout:** remove `console.log` ([8fa7a60](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/8fa7a60))
* **master-layout:** `defaultLocale` can also be specified in the config ([3c517dc](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/3c517dc))
* **master-layout:** footer links can be specified through an input as well ([16c4523](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/16c4523))
* **master-layout:** navigation links can be specified through an input as well ([271de5e](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/271de5e))
* **master-layout:** check validity of default locale before applying it ([26c917e](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/26c917e))
* **master-layout:** only display locale choice if there are multiple ones ([c7090d7](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/c7090d7))

<a name="2.1.0"></a>
# [2.1.0](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.1.0) (2018-08-29)

## Dependencies updates
* **Angular:** 6.1.3
* **ObliqueUI:** 2.0.1
* **Bootstrap:** 4.1.3
* **ng-bootstrap:** 3.0.0
* **ajv:** 6.5.3

## Bug Fixes
* **schema-validation:** do not return a `type` error with empty fields ([7418eb5](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7418eb5))

## Features
* **master-layout:** master layout can be controlled by a component, eliminating the use of `Handlebars` and `Gulp` (see master layout documentation) ([9079064](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/9079064))
* **off-canvas:** add static off-canvas with dedicated toggle ([b557845](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b557845))


<a name="2.0.0"></a>
# [2.0.0](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0) (2018-07-18)

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
* **http:** add a custom Http interceptor for Oblique-based projects ([1ab2986](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1ab2986))
* **spinner:** SpinnerComponent now supports channels in order to handle multiple spinners within the same page ([506e263](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/506e263))
* **multiselect:** MultiselectComponent is now exported as `orMultiselect` ([7d6cc9a](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7d6cc9a))
* **multiselect:** dropped the input `[settings]`, every property of `MultiselectConfig` is now an input of `MuliselectComponent`. This ensures, that we can change the settings at runtime
* **toolchain:** PhantomJS has been removed in favor of ChromeHeadless (FirefoxHeadless under Windows as per privileges issues) ([0c34dce](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0c34dce))
* **toolchain:** add npm script & Gulp task for npm linking and watching distribution files ([8ed5c89](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/8ed5c89))
* **toolchain** Enable NodeJS 8+ & npm 5+ support.
* **orNavTreeFakeFocus:** add fake focus for `orNavTree` ([ea12cfb](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/ea12cfb))
* **text-control-clear:** add a `TextControlClearDirective` based on ObliqueUI `.text-control-clear` for clearing input controls ([c090f6e](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/c090f6e))
* **footer:** add configuration parameter for enabling small footer variant ([b399e26](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b399e26))
* **footer:** add Footer component for layout customization ([1bcb191](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1bcb191))
* **number-format:** add directive ([9a364c5](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/9a364c5))
* **unsubscribe:** add `Unsubscribable` class to unsubscribe form `Observable` ([d20d4bd](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d20d4bd))
* **column-layout:** dispose content within collapsible/expansible columns using `ColumnLayoutComponent` (or `ColumnPanelDirective` & `ColumnPanelDirective`) ([4348d51](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/4348d51))
* **filterBox:** add `size`, `disabled` and `readonly` attributes ([847d3a7](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/847d3a7))
* **formControlState:** add reactive form sample ([226d0d5](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/226d0d5))
* **schema-validation** add `getValidator` function for reactive forms ([d3ff5f3](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d3ff5f3))
* **schema-validation** add reactive form to the showcase ([1e4afde](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1e4afde))
* **schema-validation** move Draft06 transformation into a decorator ([75a8b8b](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/75a8b8b))
* **schema-validation** `SchemaValidationDirective` now accepts JSON schema draft 06 and partially drafts 04 and 03 as well.
* **toggle:** add `ToggleDirective` for icon toggle ([dc6f8e8](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/dc6f8e8))
* **unsavedChanges:** expose `discardChanges` function ([3e84226](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/3e84226))
* **master-layout:** provide a `noNavigation` parameter for collapsing the application navigation ([7ed28e5](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7ed28e5))
* **master-layout:** add a `MasterLayoutHeaderToggleDirective` for toggling the application header ([299a55b](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/299a55b))
* **master-layout** `MasterLayoutHeaderDirective` & `MasterLayoutHeaderService` added for controlling the application header.
* **master-layout** `MasterLayoutNavigation`, `MasterLayoutNavigationItem`, `MasterLayoutNavigationToggle` & `MasterLayoutNavigation` added for controlling the application navigation.
* **master-layout** `ScrollDetectionDirective` & `ScrollingConfig` added for controlling the application scroll.
* **notification:** can pass parameters to title and message translations ([d781e19](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d781e19))
* **notification:** use Angular animations for transitions (_enter_ & _leave_).
* **notification:** can now be configured using `NotificationConfig` for default notification parameters (`channel`, `sticky`, `timeout`).
* **document-meta** title `suffix` is now translated as well.
* **document-meta** page `title`, `suffix` and `description` are now translated on locale change.
* **filter-box**`FilterBoxComponent` added to building search pattern-like components.
* **form-control** `control-mandatory` CSS class is added if `required` attribute is set on form control.

## Bug Fixes
* **form-control-state:** fix `control-mandatory` class ([33c916d](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/33c916d))
* **toolchain:** ensure `--prod` parameter is properly propagated to `ng test` ([fd42fbc](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/fd42fbc))
* **toolchain:** ensure `prebuild` npm script is executed during `ci-build` ([482a4b6](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/482a4b6))
* **toolchain:** workaround for resolving Karma timeout issues on Windows (cf. https://github.com/karma-runner/karma-chrome-launcher/issues/154, https://github.com/karma-runner/karma/issues/2652) ([5526c37](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/5526c37))
* **datepicker-i18n:** fix german translation for short months labels ([f259a5d](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f259a5d)), closes [#579](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/issues/579)
* **navigable:** events are now successfully registered on new added navigables (which may be created by adding new data models) ([14c7121](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/14c7121))
* **MasterLayoutNavigationMenuDirective:** (MS Edge) access `HTMLElement.style.cssText` instead of `HTMLElement.style` to avoid *Assignment to read-only properties is not allowed in strict mode* runtime errors ([eb689de](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/eb689de))
* **NavTreeFakeFocusDirective:** (MS Edge | IE) use `KeyboardEvent.keyCode` instead of `KeyboardEvent.key` for browser compatibility ([f41daa7](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f41daa7))
* **orMasterLayoutHeaderToggle:** Fix lint error ([f465266](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f465266))
* **notification:** do not show default title if a title is provided ([3e6810a](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/3e6810a))
* **notification:** add `alert-default` class to default alerts ([dac70b1](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/dac70b1))
* **schema-validation:** `SchemaValidationModule` now provides `schemaValidationService` ([acbc7f9](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/acbc7f9))
* **AoT:** avoid lambda function on providers ([8a90825](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/8a90825))
* **navigator:** fix routing to module ([74e2778](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/74e2778))
* **observable:** unsubscribe from all observables ([95b4b7a](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/95b4b7a))
* **formControlState:**
	- `name` attribute is not mandatory. Either `ngModel`, `ngModelChange` or `formControlName` is ([7abce66](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7abce66))
	- for reactive forms, allow `pristineValidation` and set `control-mandatory` on page initialisation ([19d5f5c](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/19d5f5c))
	- remove `has-error` class on form reset ([d1c605f](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d1c605f))
* **schemaValidation:**
	- never pass null to ajv ([afc7468](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/afc7468), [4353179](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/4353179))
	- prevent multiple compile with same schema ([84c9dac](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/84c9dac))

## Code Refactoring
* **filter-box:** use the new `text-control` ObliqueUI component for clearing filter box control (& refactor other component to use `OrFilterBox`) ([ea3d02e](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/ea3d02e))
* **orNavTree:** use `ngTemplate` instead of recursive component ([b8e9e59](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b8e9e59))
* **orNavTreeFakeFocus:** do not change CSS resources at runtime, reorganize source code and fix some minor issues ([f8882c7](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f8882c7))
* **toolchain:** migrate to Gulp 4 ([788c987](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/788c987))
* **navigator:** rename `orNavigator` into `or-navigator` ([0cb9f47](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0cb9f47))
* **scss:** remove module SCSS resources and cleanup showcase ones ([d2f3383](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d2f3383))

## BREAKING CHANGES
* **navigable:**
	- `NavigableGroupComponent` is now exported as `orNavigableGroup`
	- `NavigableDirective` is now exported as `orNavigable`
* **navigator:** rename `orNavigator` into `or-navigator`
* **scss:** remove any import of ObliqueReactive CSS styles (mainly in your Angular CLI configuration) as they are now bundled with components.
* **Webpack**:
	- ObliqueUI CSS & images folders are now located directly on the root of the dependency module instead of the `dist/` folder. These references should be adapted on your [Angular CLI](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse/.angular-cli.json?at=2.0.0-RC.2) configuration.
	- ObliqueUI JavaScript resources are no more required to run ObliqueReactive-based applications. These references should be removed from the [Angular CLI](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse/.angular-cli.json?at=2.0.0-RC.2) configuration.
* **master-layout**:
	* ObliqueUI master layout has been completely refactored. Refer to ObliqueUI changelog for potential breaking changes.
	* `LayoutManagerService` has been renamed to `MasterLayoutApplicationService`
* **animations:**
	* You need to include an animation strategy module in your app as some ObliqueReactive components are using Angular animations. Simply import `BrowserAnimationsModule` (or alternatively `NoopAnimationsModule` if you prefer to disable animations) in your `app-module.ts`.
* **multiselect:**
	- If you used `[settings]` of `MultiselectComponent` you now have to bind every config value separately.
* **toolchain:** ObliqueReactive has been migrated to Angular 4. This of course breaks all compatibility to any previous release of ObliqueReactive. 


<a name="1.5.0"></a>
# [1.5.0](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.5.0) (2019-03-20)

## Dependencies updates
* **AngularJS:** 1.7.8
* **@uirouter/angularjs:** 1.0.22

##Bug Fixes
* **form-control-state**: add has-error on init only if pristineValidation is explicitly set to true ([1898d04](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1898d04))
* **form-control-state**: correct handling of control-mandatory class ([b601989](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b601989))


<a name="1.4.1"></a>
# [1.4.1](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.4.1) (2018-10-23)

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
# [1.4.0](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.4.0) (2018-03-20)

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
# [1.3.9](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.9) (2017-10-17)

## Bug Fixes
* **schemaValidation:** accept zero for `number` and `integer` inputs ([7a14c14](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/7a14c14))


<a name="1.3.8"></a>
# [1.3.8](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.8) (2017-09-18)

## Bug Fixes
* **number-format:** ensure model value is always of type number (instead of string) ([b90fcf7](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/b90fcf7))


<a name="1.3.7"></a>
# [1.3.7](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.7) (2017-08-15)

## Features
* **number-format:**
	- provide a `NumberFormatConfig` to customize `number-format` default settings ([bea72fe](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/bea72fe))
	- add a `update-model-decimals` scope attribute to defines if decimals formatting should be applied on model value as well ([bea72fe](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/bea72fe))

## Bug Fixes
* **translation:** normalize translations keys ([f9e8c7a](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/f9e8c7a))
* **translation:** use `oblique` prefix for `unsavedChanges` validation message ([b9205d4](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/b9205d4))

<a name="1.3.6"></a>
# [1.3.6](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.6) (2017-05-24)

## Bug Fixes
* **datepicker:** providing custom template for the uib-datepicker-popup, this ensures the rebinding of the min- and max-dates ([11767d8](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/11767d8)), closes [#OUI-464](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-464)


<a name="1.3.5"></a>
# [1.3.5](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.5) (2017-05-11)

## Dependencies updates
* **AngularJS:** 1.6.4
* **tv4:** 1.3.0
* **moment:** 2.18.1

## Bug Fixes
* **datepicker:** parse programmatically changed min- and max-dates ([46ab410](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/46ab410)), closes [#OUI-448](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-448)
* **number-format:** ensure that empty values are correctly parsed and that formatter understands 0 decimals ([0d87acb](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/0d87acb)), closes [#OUI-449](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-449) [#OUI-450](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-450)

## Features
* **date-picker:** new `dateChange` binding allows tracking of `ngModel` changes ([ea5de08](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/ea5de08)), closes [#OUI-447](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-447)


<a name="1.3.4"></a>
# [1.3.4](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.4) (2017-04-11)

## Bug Fixes
* **error-messages:** renders error messages at the same time as form-control adds the has-error class ([7d9003a](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/7d9003a))
* **datepicker:** triggers min/max validation if the min or max value changes ([123fed5](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/123fed5))
* **number-format:** keeps an invalid viewValue on focus ([d9d19e4](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/d9d19e4))

## Features
* **number-format:** only parses number if its not `NaN` ([8e452b0](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/8e452b0))

## BREAKING CHANGES
* **datepicker:** Now uses the ngModelOption `allowInvalid = true`: Dates that do not pass the min/max validation will still be written to the model ([123fed5](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/123fed5))


<a name="1.3.3"></a>
# [1.3.3](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.3) (2017-03-16)

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
# [1.3.2](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.2) (2017-03-14)

## Dependencies updates
* **ObliqueUI:** 1.3.2
* **AngularJS:** 1.6.2
* **angular-translate:** 2.15.1
* **angular-ui-bootstrap:** 2.5.0

(see [package.json](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse/package.json?at=1.3.1) for the full list of dependencies)

## Bug Fixes
* **datepicker:** `appendToBody` option does not change the style of the popup ([ea189b7](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/ea189b7))
* **form-inline:** ensure custom components are displayed correctly under `.form-inline` ([e9662c4](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e9662c4))
* **ObliqueHttpInterceptor:** do not stop `loadingService` for silent or back-end calls ([c906532](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/c906532))
* **publish:** execute ngAnnotate during `publish` build task ([8b78254](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/8b78254))

## Features
* **error-messages:** implementation of an `error-message-component` for displaying validation errors ([d2796f0](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/d2796f0))
* **date-picker:**
	- the new `error-message-component` is now used to render `date-picker` validation messages ([f70a818](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/f70a818))
	- add placeholder option, which accepts a text or a translation key ([a0d88da](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/a0d88da)), [#OUI-395](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-395))
* **i18n:** locales are now added to the lib and use a `oblique` prefix ([cdb20da](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/cdb20da)), [#OUI-389](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-389), [#OUI-394](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-394)). See breaking changes below as well.
* **SchemaValidation:** use `schema-validator` to determine if an input is mandatory ([26f13ad](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/26f13ad))
* **unsaved-hanges:** unsaved changes within modals are now tracked as well ([7355e69](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/7355e69))
* **modules:** add modules for most components ([a9bd573](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/a9bd573))
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
* `HttpInterceptor` has been renamed to `ObliqueHttpInterceptor` ([c727ac7](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/c727ac7)). If you use `ObliqueHttpInterceptor`, you will have to update the interceptor config in your `app.module` from `$httpProvider.interceptors.push('ObliqueHttpInterceptor');` to `$httpProvider.interceptors.push('HttpInterceptor');`.


<a name="1.3.1"></a>
# [1.3.1](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.1) (2017-01-24)

## Dependencies updates
* **ObliqueUI:** 1.3.1
* **AngularJS:** 1.6.1
* **angular-ui-bootstrap:** 2.4.0
* **angular-ui-router:** 0.4.2

(see [package.json](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse/package.json?at=1.3.1) for the full list of dependencies)


<a name="1.3.0"></a>
# [1.3.0](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.0) (2016-12-12)

## Dependencies updates
* **ObliqueUI:** 1.3.0
* **AngularJS:** 1.6.0
* **angular-translate:** 2.13.1
* **angular-ui-bootstrap:** 2.3.1
* **angular-ui-router:** 0.3.2
* **lodash:** 4.17.2
* **moment:** 2.17.1

(see [package.json](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse/package.json?at=1.3.0) for the full list of dependencies)

## Features
* **form-control:** rewrite `has-error` directive in order to provide better handling on form controls (validation and mandatory states), see breaking changes as well ([9aac98d](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/9aac98d))
* **unsaved-changes:** integrate `UnsavedChangesDirective` and provide an usage sample ([1b91cf4](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/1b91cf4))
* **top-control:** add a wrapper for the ObliqueUI [TopControl](https://eui.bit.admin.ch/oblique-ui/1.3.0/components.html#components-feedback-top-control) component ([d423315](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/d423315))
* **webpack:** bundle UI with Webpack and separate `showcase` and `src` builds ([526e803](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/526e803))
* **typescript:** rewrite ObliqueReactive into TypeScript ([3db0ca7](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/3db0ca7), [1e702e4](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/1e702e4), [9503d46](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/9503d46))
* **sourcemaps:** sourcemap integration in dev and publish build ([9e2504c](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/9e2504c))
* **css:** ObliqueReactive Less resources are now bundled ([dc84849](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/dc84849))

## Bug Fixes
* **notifications:**
	- ensure notification message key is correctly retrieved for translation ([e028fd4](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e028fd4))
	- removed CSS class `.lead` to match ObliqueUI [notifications](https://eui.bit.admin.ch/oblique-ui/1.3.0-RC.8/components.html#components-dialogs-notifications) specs ([a01b0ef](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/a01b0ef))
* **spinner:**
	- callable from other controllers than `app-controller` ([b9d527d](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/b9d527d))
	- overlay uses the fixed variant ([e343224](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e343224))
* **datepicker:** fix min/max date validation ([9cea457](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/9cea457))
* **multiselect:** add support for schema validation ([506d8ec](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/506d8ec))
* **navigable:** ensure `navigable-activate` and `navigable-highlight` are properly evaluated ([ba992b7](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/ba992b7))
* **navigator:** ensure UP & BACK navigation is performed as expected ([53113d5](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/53113d5))
* **validation:**
	- datepicker + schema-validate ([5e40bca](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/5e40bca), [487126d](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/487126d))
	- ensure `date-picker`, `schema-validation` and `has-error` directives work nicely together, add support for JSON schema v3 & update live examples ([d4ae8dc](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/d4ae8dc))

## Code Refactoring
* **validation:** normalize namings of validation components (directives & events), see breaking changes as well ([817a9a0](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/817a9a0))

## BREAKING CHANGES
* **navigator:** `navigator` implementation is now based on AngularJS component design and needs to be referenced using the element tag (i.e. `&lt;navigator&gt;&lt;/navigator&gt;`) ([927d7e3](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/927d7e3))
* **notifications:** `notifications` implementation is now based on AngularJS component design and needs to be referenced using the element tag (i.e. `&lt;notifications&gt;&lt;/notifications&gt;`) ([ea2044d](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/ea2044d))
* **multiselect:** `multiselect` implementation is now based on AngularJS component design and needs to be referenced using the element tag (i.e. `&lt;multiselect&gt;&lt;/multiselect&gt;`) ([3ea1b53](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/3ea1b53))
* **date-picker:** `date-picker` implementation is now based on AngularJS component design and needs to be referenced using the element tag (i.e. `&lt;date-picker&gt;&lt;/date-picker&gt;`) ([d6e22eb](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/d6e22eb))
* **header-navigation:** partial needs to be updated to support ObliqueUI 1.3.0 (see [primary navigation](https://eui.bit.admin.ch/oblique-ui/1.3.0/components.html#components-navs-navbars-primary))
* **footer:** partial needs to be updated to support ObliqueUI 1.3.0 (see [footer](https://eui.bit.admin.ch/oblique-ui/1.3.0/components.html#components-branding-footer))
* **validation**:
	- `validation-schema` directive has been renamed into `schema-validation`
	- `validationSchemaEvent` event has been renamed into `schemaValidationEvent`
	- `validationBusinessEvent` event has been renamed into `businessValidationEvent`
* **has-error**: `has-error` directive is removed in favor of `form-control` component ([9aac98d](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/9aac98d))
	- `has-error="controlName"` becomes `&lt;form-control name="controlName" /&gt;`
	- `has-error-pristine` becomes `&lt;form-control pristine-validation /&gt;`


<a name="1.2.7"></a>
# [v1.2.7](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=v1.2.7) (2016-05-31)

## Features
* **navigable:**
	- enable item activation on load ([93f46f0](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/93f46f0))
	- enable item highlighting on load ([e57a76a](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e57a76a))
* **npm:** remove Bower and use only npm to fetch all dependencies ([094709a](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/094709a), [2e01c74](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/2e01c74), [e8f9e2f](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e8f9e2f), [929bf49](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/929bf49))

## Bug Fixes
* **navigable:** ensure `navigable` item gets activated when a child element gets focused ([972e7ad](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/972e7ad), [df64911](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/df64911))
* **ngAnimate:** ensure `ngRepeat` does not show stale items due to ngAnimate transitions ([51cbfdc](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/51cbfdc))
* **typeahead:** provide a workaround for scrollable AngularUI Typeahead suggestions and create a sample state to showcase it. ([cca3282](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/cca3282))


<a name="1.2.2"></a>
# [v1.2.2](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=v1.2.2) (2015-09-11)

## Features
* **delayed-change:** Added delayed-change directive for firing delayed callback when inputs value changes ([f84d177](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/f84d177))
* **locale:** enable i18n localization for 3rd-party directives (including AngularUI datepicker) ([d9e93fc](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/d9e93fc))
* **navigator:** implement a state navigator service & directive and provide sample usage ([e3ef760](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e3ef760))
* **auth:**
	- bind user roles with UI elements ([90cc7b3](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/90cc7b3))
	- finalize client-side authentication and refactor accordingly ([e75752a](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e75752a))
	- prepare application for client-side authentication ([43addf0](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/43addf0))

## Bug Fixes
* **locale:** do not determine preferred language as locale keys are inconsistent across browsers ([8e55f4b](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/8e55f4b))
* **notifications:** notification can now be dismissed with the close button ([a24bf28](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/a24bf28))
* **schema-validation:** fix nested properties validation and showcase with a sample usage ([6ff2932](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/6ff2932))


<a name="0.0.3"></a>
# [v0.0.3](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=v0.0.3) (2015-03-18)

## Bug Fixes
* **notifications:** ensure notifications are correctly displayed for API exceptions ([527807e](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/527807e))

## BREAKING CHANGES
* notifications: API-specific methods are now scoped under `$http.api` (i.e. `$http.api.get()`, `$http.api.post()`, etc.)


<a name="0.0.2"></a>
# [v0.0.2](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=v0.0.2) (2015-03-11)

## Features
* **AppController:** enable global control for core UI components (layout, page title & spinner) ([58a25c8](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/58a25c8))
* **head-title:** implement composable block for the head `title` element and use `ng-bind` to avoid curlies (`{{}}`) FoC ([17e6404](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/17e6404))

## Bug Fixes
* **navbar-global:** use `ui-sref` and `ui-sref-active` directives instead of custom state handling ([cdd754d](https://bitbucket.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/cdd754d))
