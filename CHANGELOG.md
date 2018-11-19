### ObliqueReactive
#### [3.0.0-RC.2](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/compare/3.0.0-RC.1...3.0.0-RC.2) (2018-11-19)

##### Bug Fixes
* **master-layout:** ensure user chosen language is supported ([0e0cbd4](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/0e0cbd4))
* **master-layout:** apply `control-link` and `nav-link` on same element ([b52f551](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/b52f551))
* **master-layout:** can dynamically update custom footer ([359c8ff](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/359c8ff))
* **master-layout:** close main navigation when sub-navigation is active on mobile mode ([11cac0e](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/11cac0e))
* **master-layout:** do not highlight `#content` and `#navigation` when focused ([2aa4540](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/2aa4540))
* **master-layout:** improve aspect of language selection buttons ([1df4f59](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/1df4f59))
* **master-layout:** remove navigation jump link when there is no navigation ([0d6ea68](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/0d6ea68))
* **master-layout:** remove navigation title when there is no navigation ([2372d92](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/2372d92))
* **master-layout:** use same language for both the default and current language ([1710405](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/1710405))
* **nav-tree:** filtering treats regex terminals as string instead of throwing an error ([e415570](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/e415570))

##### Features
* **master-layout:** remove `[orOffCanvas]` content projection from `MasterLayoutComponent` ([a50e91e](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/a50e91e))

##### BREAKING CHANGES
* **master-layout:** the content of the main off-canvas cannot be projected with `[orOffCanvas]` anymore. Use `[orOffCanvasTitle]` and `[orOffCanvasContent]` instead.


<a name="3.0.0-RC.1"></a>
#### [3.0.0-RC.1](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/compare/2.1.2...3.0.0-RC.1) (2018-11-14)

##### Bug Fixes
* **master-layout:** `.navbar` inherits `background-color` from parent ([19d7a02](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/19d7a02))
* **master-layout:** apply `control-link` and `nav-link` on same element ([b52f551](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/b52f551))
* **master-layout:** close main navigation when sub-navigation is active on mobile mode ([11cac0e](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/11cac0e))
* **master-layout:** jumplinks use angular route fragments ([d1f4b61](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/d1f4b61))
* **master-layout:** transform `NodeList` into `array` (IE compatibility) ([5fd0b9a](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/5fd0b9a))
* **off-canvas:** only toggle offCanvas with `Enter` key if the focus is on the toggle ([904e0b8](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/904e0b8))

##### Code Refactoring
* use the cli to build the distribution ([f703b61](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/f703b61))

##### Features
* **master-layout:** add `[orFooter]` and `[orHeader]` content projection to use a completely custom content ([aca2775](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/aca2775))
* **master-layout:** add controls for offCanvas, custom header and footer and scroll transitions for header and footer ([0dde5ab](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/0dde5ab))
* **master-layout:** add support for ids on navigation items ([014c916](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/014c916))
* **master-layout:** add support for `Enter` key for menu toggle ([4d0937d](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/4d0937d))
* **master-layout:** can now totally disable Oblique language management ([593cb77](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/593cb77))
* **master-layout:** can specify an id per locale ([885f5d6](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/885f5d6))
* **master-layout:** dropdown navigation can be toggled with `Enter` key ([b279e72](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/b279e72))
* **master-layout:** dynamically add oblique classes on header controls ([b587df6](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/b587df6))
* **master-layout:** move `ScrollingConfig.transitions.header` to `MasterLayoutConfig.header.scrollTransitions` ([08269d7](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/08269d7))
* **master-layout:** move `ScrollingConfig.transitions.footer` to `MasterLayoutConfig.footer.scrollTransitions` ([882aca2](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/882aca2))
* **master-layout:** navigation can be scrollable ([81887ea](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/81887ea))
* **master-layout:** remove `[orFooterInfoSMCollapse]` ([80b12f6](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/80b12f6))
* **master-layout:** remove `[orFooterLinks]` content projection from `MasterLayoutComponent` ([1b3a45f](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/1b3a45f))
* **master-layout:** remove `[orHeaderControls]` content projection from `MasterLayoutComponent` ([65f65eb](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/65f65eb))
* **master-layout:** remove `ORFooterLink` from `MasterLayoutConfig` ([be6dfd9](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/be6dfd9))
* **master-layout:** remove deprecated master layout code ([81fc6ff](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/81fc6ff))
* **master-layout:** use browser language as default and remove locale related warnings ([ffa5c3b](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/ffa5c3b))
* **master-layout:** use named templates for header controls and footer links ([6994b3f](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/6994b3f))
* **master-layout:** wrap `defaultLocale` and `locales` within `locale` ([9ea5ff2](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/9ea5ff2))

##### BREAKING CHANGES
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
* **master-layout:** footer info for medium size footer cannot be projected with `[orFooterInfoSMCollapse]` anymore. Use  `[orFooterInfo]` for all footer info, Oblique will display only the 1st line with small footer size on non collapsed mode
* **master-layout:** footer links cannot be projected with `[orFooterLinks]` anymore. Use `#orFooterLink` template instead
* **master-layout:** footer links cannot be set as an `ORFooterLink` list in `MasterLayoutConfig` anymore. Use `#orFooterLink` template instead
* **master-layout:** header control templates projected into `MasterLayoutComponent` must have `#orHeaderControl` attribute
* The library is now delivered in Angular Package Format (APF). As a side-effect, the bundle name is now `oblique.reactive.umd.js`



<a name="2.1.2"></a>
#### [2.1.2](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/compare/2.1.1...2.1.2) (2018-09-25)

##### Dependencies updates
* **Angular:** 6.1.8
* **ng-bootstrap:** 3.2.2
* **ajv:** 6.5.4
* **oblique-ui:** 2.0.2

##### Bug Fixes
* **master-layout:** `menuCollapsed` is set to `false` when the menu is opened and to `true` when it is closed ([0dfdd92](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/0dfdd92))
* **master-layout:** can provide the whole header controls list as content projection ([515af00](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/515af00))
* **master-layout:** controls are not focusable during header closure ([9c96bea](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/9c96bea))
* **master-layout:** each Oblique webapp has it's own language token ([8331bbe](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/8331bbe))
* **master-layout:** export everything in index.html ([91f4080](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/91f4080))
* **master-layout:** export MasterLayoutComponent as `orMasterLayout` ([f23e3d8](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/f23e3d8))
* **master-layout:** header controls are automatically focusable when the layout is not collapsed ([f3413a8](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/f3413a8))
* **master-layout:** masterLayoutDirective uses old selector for the menu toggle ([00949d0](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/00949d0))
* **master-layout:** set default `true` value for `menuCollapsed` ([25c0a80](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/25c0a80))
* **nav-tree:** correctly match active links ([425288e](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/425288e))
* **navigable:** correctly exports the directive ([7c9f36c](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/7c9f36c))
* **off-canvas:** sidebar is shown on mobile view ([35b2ea3](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/35b2ea3))
* **off-canvas:** toggle is also activated on `enter` key ([7d29701](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/7d29701))


<a name="2.1.1"></a>
#### [2.1.1](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/compare/2.1.0...2.1.1) (2018-09-07)

##### Dependencies updates
* **Angular:** 6.1.7
* **ng-bootstrap:** 3.2.0
* **rxjs:** 6.3.2

##### Bug Fixes
* **column-layout:** remove `console.log` ([8fa7a60](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/8fa7a60))
* **master-layout:** `defaultLocale` can also be specified in the config ([3c517dc](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/3c517dc))
* **master-layout:** footer links can be specified through an input as well ([16c4523](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/16c4523))
* **master-layout:** navigation links can be specified through an input as well ([271de5e](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/271de5e))
* **master-layout:** check validity of default locale before applying it ([26c917e](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/26c917e))
* **master-layout:** only display locale choice if there are multiple ones ([c7090d7](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/c7090d7))

<a name="2.1.0"></a>
#### [2.1.0](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/compare/2.0.0...2.1.0) (2018-08-29)

##### Dependencies updates
* **Angular:** 6.1.3
* **ObliqueUI:** 2.0.1
* **Bootstrap:** 4.1.3
* **ng-bootstrap:** 3.0.0
* **ajv:** 6.5.3

##### Bug Fixes
* **schema-validation:** do not return a `type` error with empty fields ([7418eb5](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/7418eb5))

##### Features
* **master-layout:** master layout can be controlled by a component, eliminating the use of `Handlebars` and `Gulp` (see master layout documentation) ([9079064](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/9079064))
* **off-canvas:** add static off-canvas with dedicated toggle ([b557845](http://stash.eap.bit.admin.ch/scm/oui/oblique-reactive/commits/b557845))


<a name="2.0.0"></a>
### [2.0.0](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0) (2018-07-18)

##### Dependencies updates
* **Angular:** 6.0.9
* **ObliqueUI:** 2.0.0
* **Bootstrap:** 4.1.2
* **rxjs:** 6.2.2

##### Features
* **http:** add a custom Http interceptor for Oblique-based projects ([1ab2986](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1ab2986))

##### Bug Fixes
* **form-control-state:** fix `control-mandatory` class ([33c916d](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/33c916d))
* **test:** ensure `--prod` parameter is properly propagated to `ng test` ([fd42fbc](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/fd42fbc))
* **test:** ensure `prebuild` npm script is executed during `ci-build` ([482a4b6](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/482a4b6))

<a name="2.0.0-RC.5"></a>
#### [2.0.0-RC.5](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0-RC.5) (2018-07-04)

##### Dependencies updates
* **Angular:** 6.0.7
* **ObliqueUI:** 2.0.0-RC.5
* **Bootstrap:** 4.1.1
* **ng-bootstrap:** 2.2.0
* **ajv:** 6.5.2
* **rxjs:** 6.2.1

##### Features
* **spinner:** SpinnerComponent now supports channels in order to handle multiple spinners within the same page ([506e263](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/506e263))
* **multiselect:** MultiselectComponent is now exported as `orMultiselect` ([7d6cc9a](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7d6cc9a))
* **tests:** PhantomJS has been removed in favor of ChromeHeadless (FirefoxHeadless under Windows as per privileges issues) ([0c34dce](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0c34dce))

##### Bug Fixes
* **datepicker-i18n:** fix german translation for short months labels ([f259a5d](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f259a5d)), closes [#579](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/issues/579)
* **navigable:** events are now successfully registered on new added navigables (which may be created by adding new data models) ([14c7121](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/14c7121))
* **tests:** workaround for resolving Karma timeout issues on Windows (cf. https://github.com/karma-runner/karma-chrome-launcher/issues/154, https://github.com/karma-runner/karma/issues/2652) ([5526c37](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/5526c37))

##### BREAKING CHANGES
* **navigable:**
	- `NavigableGroupComponent` is now exported as `orNavigableGroup`
	- `NavigableDirective` is now exported as `orNavigable`

<a name="2.0.0-RC.4"></a>
#### [2.0.0-RC.4](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0-RC.4) (2018-04-17)

##### Dependencies updates
* **ObliqueUI:** 2.0.0-RC.4
* **Bootstrap:** 4.1.0
* **Angular:** 5.2.10
* **ng-bootstrap:** 1.1.2
* **ajv:** 6.3.0
* **rxjs:** 5.5.10
* **zone.js:** 0.8.26

(see [package.json](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse/package.json?at=2.0.0-RC.2-1) for the full list of dependencies)

##### Features
* **orNavTreeFakeFocus:** add fake focus for `orNavTree` ([ea12cfb](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/ea12cfb))
* **master-layout:** provide a `noNavigation` parameter for collapsing the application navigation ([7ed28e5](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7ed28e5))
* **text-control-clear:** add a `TextControlClearDirective` based on ObliqueUI `.text-control-clear` for clearing input controls ([c090f6e](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/c090f6e))

##### Bug Fixes
* **MasterLayoutNavigationMenuDirective:** (MS Edge) access `HTMLElement.style.cssText` instead of `HTMLElement.style` to avoid *Assignment to read-only properties is not allowed in strict mode* runtime errors ([eb689de](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/eb689de))
* **NavTreeFakeFocusDirective:** (MS Edge | IE) use `KeyboardEvent.keyCode` instead of `KeyboardEvent.key` for browser compatibility ([f41daa7](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f41daa7))
* **orMasterLayoutHeaderToggle:** Fix lint error ([f465266](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f465266))

##### Code Refactoring
* **filter-box:** use the new `text-control` ObliqueUI component for clearing filter box control (& refactor other component to use `OrFilterBox`) ([ea3d02e](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/ea3d02e))
* **orNavTree:** use `ngTemplate` instead of recursive component ([b8e9e59](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b8e9e59))
* **orNavTreeFakeFocus:** do not change CSS resources at runtime, reorganize source code and fix some minor issues ([f8882c7](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f8882c7))

<a name="2.0.0-RC.3-1"></a>
#### [2.0.0-RC.3-1](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0-RC.3-1) (2018-02-08)

##### Dependencies updates
* **ObliqueUI:** 2.0.0-RC.3-1
* **Bootstrap:** 4.0.0
* **Angular:** 5.2.3
* **ng-bootstrap:** 1.0.0
* **ngx-translate:** 9.1.1
* **zone.js:** 0.8.20

##### Bug Fixes
* **notification:** do not show default title if a title is provided ([3e6810a](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/3e6810a))

##### Features
* **footer:**
	- add configuration parameter for enabling small footer variant ([b399e26](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b399e26))
	- add Footer component for layout customization ([1bcb191](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1bcb191))
* **master-layout:** add a `MasterLayoutHeaderToggleDirective` for toggling the application header ([299a55b](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/299a55b))
* **number-format:** add directive ([9a364c5](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/9a364c5))

##### Code Refactoring
* **toolchain:** migrate to Gulp 4 ([788c987](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/788c987))


<a name="2.0.0-RC.3"></a>
#### [2.0.0-RC.3](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0-RC.3) (2018-01-09)

##### Dependencies updates
* **ObliqueUI:** 2.0.0-RC.3
* **Bootstrap:** 4.0.0-beta.3
* **Angular:** 5.1.3
* **ng-bootstrap:** 1.0.0-beta.9
* **ngx-translate:** 9.0.2
* **rxjs:** 5.5.6
* **ajv:** 6.0.0

##### Features
* **notification:** can pass parameters to title and message translations ([d781e19](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d781e19))
* **unsubscribe:** add `Unsubscribable` class to unsubscribe form `Observable` ([d20d4bd](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d20d4bd))

##### Bug Fixes
* **schema-validation:** `SchemaValidationModule` now provides `schemaValidationService` ([acbc7f9](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/acbc7f9))
* **AoT:** avoid lambda function on providers ([8a90825](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/8a90825))
* **navigator:** fix routing to module ([74e2778](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/74e2778))
* **notification:** add `alert-default` class to default alerts ([dac70b1](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/dac70b1))
* **observable:** unsubscribe from all observables ([95b4b7a](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/95b4b7a))


<a name="2.0.0-RC.2-1"></a>
#### [2.0.0-RC.2-1](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0-RC.2-1) (2017-11-01)

##### Dependencies updates
* **ObliqueUI:** 2.0.0-RC.2-1
* **Bootstrap:** 4.0.0-beta.2
* **Angular:** 4.4.6
* **rxjs:** 5.5.1
* **ajv:** 5.3.0

(see [package.json](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse/package.json?at=2.0.0-RC.2-1) for the full list of dependencies)

##### Bug Fixes
* **formControlState:**
	- `name` attribute is not mandatory. Either `ngModel`, `ngModelChange` or `formControlName` is ([7abce66](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7abce66))
	- for reactive forms, allow `pristineValidation` and set `control-mandatory` on page initialisation ([19d5f5c](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/19d5f5c))
	- remove `has-error` class on form reset ([d1c605f](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d1c605f))
* **schemaValidation:**
	- never pass null to ajv ([afc7468](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/afc7468), [4353179](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/4353179))
	- prevent multiple compile with same schema ([84c9dac](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/84c9dac))

##### Code Refactoring
* **navigator:** rename `orNavigator` into `or-navigator` ([0cb9f47](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0cb9f47))
* **scss:** remove module SCSS resources and cleanup showcase ones ([d2f3383](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d2f3383))

##### Features
* **column-layout:** dispose content within collapsible/expansible columns using `ColumnLayoutComponent` (or `ColumnPanelDirective` & `ColumnPanelDirective`) ([4348d51](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/4348d51))
* **filterBox:** add `size`, `disabled` and `readonly` attributes ([847d3a7](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/847d3a7))
* **formControlState:** add reactive form sample ([226d0d5](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/226d0d5))
* **schemaValidation:**
	- add `getValidator` function for reactive forms ([d3ff5f3](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d3ff5f3))
	- add reactive form to the showcase ([1e4afde](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1e4afde))
	- move Draft06 transformation into a decorator ([75a8b8b](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/75a8b8b))
* **toggle:** add `ToggleDirective` for icon toggle ([dc6f8e8](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/dc6f8e8))
* **toolchain:** add npm script & Gulp task for npm linking and watching distribution files ([8ed5c89](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/8ed5c89))
* **unsavedChangesService:** expose `discardChanges` function ([3e84226](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/3e84226))

##### BREAKING CHANGES
* **navigator:** rename `orNavigator` into `or-navigator`
* **scss:** remove any import of ObliqueReactive CSS styles (mainly in your Angular CLI configuration) as they are now bundled with components.

<a name="oblique-reactive-2.0.0-RC.2"></a>
#### [2.0.0-RC.2](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0-RC.2) (2017-08-04)

##### Dependencies updates
* **ObliqueUI:** 2.0.0-RC.2
* **jQuery:** 3.2.1
* **Bootstrap:** 4.0.0-beta
* **Angular:** 4.4.3
* **ng-bootstrap:** 1.0.0-beta.5
* **ngx-translate:** 8.0.0
* **rxjs:** 5.4.3

(see [package.json](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse/package.json?at=2.0.0-RC.2) for the full list of dependencies)

##### Features
* **toolchain**
	- Enable NodeJS 8+ & npm 5+ support.
* **master-layout**
	- `MasterLayoutHeaderDirective` & `MasterLayoutHeaderService` added for controlling the application header.
	- `MasterLayoutNavigation`, `MasterLayoutNavigationItem`, `MasterLayoutNavigationToggle` & `MasterLayoutNavigation` added for controlling the application navigation.
	- `ScrollDetectionDirective` & `ScrollingConfig` added for controlling the application scroll.
* **notification**
	- Notifications now use Angular animations for transitions (_enter_ & _leave_).
	- Notifications can now be configured using `NotificationConfig` for default notification parameters (`channel`, `sticky`, `timeout`).
* **document-meta**
	- Title `suffix` is now translated as well.
	- Page `title`, `suffix` and `description` are now translated on locale change.
* **filter-box**
	- `FilterBoxComponent` added to building search pattern-like components.
* **form-control**
	- `control-mandatory` CSS class is added if `required` attribute is set on form control.
* **schema-validation**
	- `SchemaValidationDirective` now accepts JSON schema draft 06 and partially drafts 04 and 03 as well.
* **multiselect:**
	- dropped the input `[settings]`, every property of `MultiselectConfig` is now an input of `MuliselectComponent`. This ensures, that we can change the settings at runtime

##### BREAKING CHANGES
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

<a name="oblique-reactive-2.0.0-RC.1"></a>
#### [2.0.0-RC.1](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0-RC.1) (2017-06-23)

##### Dependencies updates
* **ObliqueUI:** 2.0.0-RC.1
* **jQuery:** 3.2.1
* **Bootstrap:** 4.0.0-alpha.6
* **Angular:** 4.2.4
* **ng-bootstrap:** 1.0.0-alpha.26
* **ngx-translate:** 7.0.0
* **rxjs:** 5.4.1

##### BREAKING CHANGES
ObliqueReactive has been migrated to Angular 4.
This of course breaks all compatibility to any previous release of ObliqueReactive. 
