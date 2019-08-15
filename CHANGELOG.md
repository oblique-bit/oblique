## [4.0.1](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=4.0.1) (2019-08-15)

## Bug Fixes
* **master-layout:** use white for heading in `offcanvas-sidebar` only ([daabf9b](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/daabf9b))
* **themes:** integrate FA5 CSS with oblique-core without `@import` ([bfe26de](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/bfe26de))


# [4.0.0](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=4.0.0) (2019-08-14)

## Bug Fixes
* **master-layout:** fix offcanvas animation ([4063da7](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/4063da7))
* **master-layout:** reduce offcanvas header height if header is collapsed ([6143bc3](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/6143bc3))
* **master-layout:** set `default-layout` to offcanvas content ([a330416](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/a330416))
* **master-layout:** use white color for headings within offcanvas ([6e20249](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/6e20249))
* **themes:** Frutiger is enabled by default ([610d69b](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/610d69b))

## BREAKING CHANGES
* **toolchain:** `angular.json ` has to be patched, under `<projectName>.architect.build.options.assets`
	* change `"input": "node_modules/oblique-reactive/styles/images"` into `"node_modules/@oblique/oblique/styles"`
	* change `"output": "/assets/styles/images"` into `"output": "/assets/styles"`

# [4.0.0-RC.4](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=4.0.0-RC.4) (2019-08-13)

## Bug Fixes
* **toggle:** remove leading whitespace in class list ([8df4c32](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/8df4c32))

## Code Refactoring
* **package:** rename to `@oblique/oblique` ([10095d5](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/10095d5))
* **themes:** change `warning` colors ([a794b53](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/a794b53))
* **themes:** rename `brand-danger` into `brand-error` ([61b473a](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/61b473a))
* **toggle:** rename `activate` function into `toggle` ([3510496](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/3510496))

## Features
* **notification:** only `oblique` chanel has `position: fixed` ([8143f54](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/8143f54))
* **themes:** add `$brand-info` colors and use them ([c2e02f4](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/c2e02f4))
* **themes:** add `theme` service to take care of themes and font ([a76fc20](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/a76fc20))
* **themes:** add all CI/CD colors and use them ([e4a540b](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/e4a540b))
* **themes:** redefine material color palette with oblique colors ([f91087c](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/f91087c))
* **themes:** redefine typography ([35a3727](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/35a3727))
* **themes:** replace OpenSans with Frutiger and Arial as fallback ([00c839d](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/00c839d))
* **toggle:** can be activated by default with `active` input ([e092e6c](http://stash.eap.bit.admin.ch/scm/oui/oblique2-reactive/commits/e092e6c))

## BREAKING CHANGES
* **themes:** `MaterialService` has been replace by `ThemeService`
* **themes:** `MATERIAL_DESIGN_DISABLE` token has been replaced by `OBLIQUE_THEME`
* **themes:** `$brand-warning-semilight` has been removed, use `$brand-warning-light` instead
* **themes:** `$brand-danger` SCSS variable has been renamed into `$brand-error`
* **package:** Oblique has been renamed `@oblique/oblique` to be consistent with angular naming. It means that all imports have to be updated and that the package is available under its new name
* **toggle:** `activate` function has been renamed into `toggle`


# [4.0.0-RC.3](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=4.0.0-RC.3) (2019-07-26)

## Bug Fixes
* **master-layout:** fix accessibility quick links ([0083863](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0083863))

## Code Refactoring
* **package:** package has been fully renamed into `oblique-bit` 


# [4.0.0-RC.2](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=4.0.0-RC.2) (2019-07-25)

## Bug Fixes
* **master-layout:** no `overflow` on main navigation ([47e9841](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/47e9841))
* **master-layout:** timing issue with `application-scrolling` ([0e42337](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0e42337))
* **search-box:** fix bootstrap rendering ([c4f924d](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/c4f924d))
* **themes:** add `nav-tabs` component ([3e529b9](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/3e529b9))
* **themes:** fix stepper with material ([d5bfc58](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d5bfc58))


## Code Refactoring
* **datepicker:** remove `DatePickerModule` form `ObliqueModule` ([a8383e9](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/a8383e9))
* **master-layout:** remove `ScrollDetectionDirective` ([3c7af50](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/3c7af50))
* **master-layout:** rename `scrolled` event into `isScrolled` ([b0a975a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b0a975a))
* **unsaved-changes:** split code into 2 modules ([02df9ae](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/02df9ae))

## Features
* **column-layout:** vertically center the toggle ([c9e1535](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/c9e1535))
* **dropdown:** add `dropdown` component ([7629d5a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7629d5a))
* **master-layout:** add `scrolled` event to provide scroll offset ([959e8b1](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/959e8b1))
* **themes:** add `hover-effect` to `oblique-utilities` ([4279e9b](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/4279e9b))
* **themes:** improve typography definitions ([9f376b2](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/9f376b2))
* **themes:** style `table` according to CI/CD ([2712f1e](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/2712f1e))

## BREAKING CHANGES
* **unsaved-changes:** all code related to Bootstrap's tabset has been moved into a new `UnsavedChangesTabsModule` module which has to be imported separately from `ObliqueModule`.
* **unsaved-changes:** to Monitor changes on Bootstrap's Tabset, `orUnsavedChangesTabs` directive has to be used instead of `orUnsavedChanges`
* **datepicker:** `DatePickerModule` has to be imported separately from `ObliqueModule`
* **master-layout:** `ScrollEvents.scrolled` has been renamed into `ScrollEvents.isScrolled`
* **master-layout:** `ScrollDetectionDirective` has been removed with no replacement


# [4.0.0-RC.1](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=4.0.0-RC.1) (2019-07-19)

## Bug Fixes
* **master-layout:** use lighter grey on submenu item hover ([80d5e56](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/80d5e56))
* **multiselect:** correctly pass prepend to filter-box ([92143f4](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/92143f4))
* **search-box:** mouse up and down events are not propagated ([076fb5a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/076fb5a))

## Code Refactoring
* **http-interceptor:** refactor according to notification changes ([c3e214a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/c3e214a))
* **master-layout:** separate MasterLayoutService into multiple files ([76a84f1](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/76a84f1))
* **notification:** simplify notification signatures ([6febfbe](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/6febfbe))
* **toggle:** use @Input() instead of classes for toggle direction ([686f8d7](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/686f8d7))
* **package:** `oblique-reactive` has been renamed into `oblique` but is distributed under `oblique-bit` ([12b9a99](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/12b9a99))

## Features
* **master-layout:** use multiple column with full width navigation ([1099780](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1099780))
* **master-layout:** full width main navigation is disabled by default ([c30ad65](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/c30ad65))
* **multiselect:** add `id`s on multiselect's elements ([0ee04c1](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0ee04c1))
* **notification:** add `id`s on notification's elements ([b68d340](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b68d340))
* **notification:** remove `default` notification ([0a54f3e](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0a54f3e))
* **themes:** adjust colors ([72d25a0](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/72d25a0))
* **themes:** provide minified css files in the dist ([80e3362](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/80e3362))
* **themes:** separate `oblique-bootstrap` from `oblique-core` ([8dcd1b8](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/8dcd1b8))
* **themes:** extract alert into a standalone css component ([bbab6cc](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/bbab6cc))
* **themes:** remove callout css component ([23be35e](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/23be35e))
* **themes:** add `oblique-utilities` ([82c5a3e](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/82c5a3e))
* **toggle:** remove `toggle-collapse` class ([462c9c9](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/462c9c9))

### BREAKING CHANGES
* **package:** `oblique-reactive` has been renamed into `oblique` but is distributed under `oblique-bit`, this means all imports have to be adapted
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
* **themes:** `callout` have been removed in favor of `alert`
* **themes:**  a theme `oblique-material` or `oblique-bootstrsap` has to be imported either in `angular.json`or in the project main stylesheet, usually `styles.scss`
* **themes:**  without importing  `oblique-bootstrap`, Oblique does not provide bootstrap's SCSS variables anymore
* **themes:**   following CSS classes have been dropped with no replacement:
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
* **themes:**   almost all oblique mixins have either been removed or modified
* **themes:**   following Oblique CSS components are only available with `oblique-bootstrap` theme:
	* `badge`
	* `button`
	* `dropdown`
	* `form-check`
	* `input-group`
	* `table`
* **themes:** Oblique CSS is imported form `node_modules/oblique-reactive/styles/scss/oblique-core.scss` instead of
`node_modules/oblique-reactive/styles/css/oblique-ui.css`


# [4.0.0-Beta.2](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=4.0.0-Beta.2) (2019-04-30)

## Bug Fixes
* **master-layout:** close main navigation menu on `Escape` ([b8c61ba](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b8c61ba))
* **master-layout:** close main navigation menu on outside click ([70a4714](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/70a4714))
* **master-layout:** main navigation menu is active when sub-route is active ([601dd2f](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/601dd2f))
* **multiselect:** correctly handle `disable` state ([b434daf](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b434daf))
* **packaging:** `test_helpers` is correctly copied ([33d3c0f](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/33d3c0f))

## Features
* **material:** use Roboto as base font ([233c902](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/233c902))


# [4.0.0-Beta.1](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=4.0.0-Beta.1) (2019-04-15)

## Features
* **filter-box:** add `angular material` variant ([cd7c148](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/cd7c148))
* **material:** add `angular material` variant with Roboto font ([cce3b02](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/cce3b02))
* **material:** force `outline` variants for all Oblique modules ([fb28717](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/fb28717))

## BREAKING CHANGES
* **filter-box:** 
    * prefixed content cannot be projected with `.input-group-prepend` anymore. Use `#prepend` instead.
    * suffixed content cannot be projected with `.input-group-append` anymore. Use `#append` instead.

<a name="3.1.1"></a>
# [3.1.1](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=3.1.1) (2019-04-29)

## Bug Fixes
* **master-layout:** close main navigation menu on `Escape` ([b8c61ba](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b8c61ba))
* **master-layout:** close main navigation menu on outside click ([70a4714](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/70a4714))
* **master-layout:** main navigation menu is active when sub-route is active ([601dd2f](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/601dd2f))
* **multiselect:** add `setDisabledState` function ([b434daf](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b434daf))
* **packaging:** `test_helpers` is correctly copied ([33d3c0f](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/33d3c0f))

<a name="3.1.0"></a>
# [3.1.0](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=3.1.0) (2019-03-12)

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
# [3.0.0](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=3.0.0) (2018-11-27)

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
# [2.1.2](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.1.2) (2018-09-25)

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
# [2.1.1](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.1.1) (2018-09-07)

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
# [2.1.0](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.1.0) (2018-08-29)

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
# [2.0.0](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0) (2018-07-18)

## Dependencies updates
* **Angular:** 6.0.9
* **ObliqueUI:** 2.0.0
* **Bootstrap:** 4.1.2
* **rxjs:** 6.2.2

## Features
* **http:** add a custom Http interceptor for Oblique-based projects ([1ab2986](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1ab2986))

## Bug Fixes
* **form-control-state:** fix `control-mandatory` class ([33c916d](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/33c916d))
* **test:** ensure `--prod` parameter is properly propagated to `ng test` ([fd42fbc](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/fd42fbc))
* **test:** ensure `prebuild` npm script is executed during `ci-build` ([482a4b6](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/482a4b6))


<a name="2.0.0-RC.5"></a>
# [2.0.0-RC.5](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0-RC.5) (2018-07-04)

## Dependencies updates
* **Angular:** 6.0.7
* **ObliqueUI:** 2.0.0-RC.5
* **Bootstrap:** 4.1.1
* **ng-bootstrap:** 2.2.0
* **ajv:** 6.5.2
* **rxjs:** 6.2.1

## Features
* **spinner:** SpinnerComponent now supports channels in order to handle multiple spinners within the same page ([506e263](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/506e263))
* **multiselect:** MultiselectComponent is now exported as `orMultiselect` ([7d6cc9a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7d6cc9a))
* **tests:** PhantomJS has been removed in favor of ChromeHeadless (FirefoxHeadless under Windows as per privileges issues) ([0c34dce](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0c34dce))

## Bug Fixes
* **datepicker-i18n:** fix german translation for short months labels ([f259a5d](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f259a5d)), closes [#579](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/issues/579)
* **navigable:** events are now successfully registered on new added navigables (which may be created by adding new data models) ([14c7121](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/14c7121))
* **tests:** workaround for resolving Karma timeout issues on Windows (cf. https://github.com/karma-runner/karma-chrome-launcher/issues/154, https://github.com/karma-runner/karma/issues/2652) ([5526c37](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/5526c37))

## BREAKING CHANGES
* **navigable:**
	- `NavigableGroupComponent` is now exported as `orNavigableGroup`
	- `NavigableDirective` is now exported as `orNavigable`


<a name="2.0.0-RC.4"></a>
# [2.0.0-RC.4](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0-RC.4) (2018-04-17)

## Dependencies updates
* **ObliqueUI:** 2.0.0-RC.4
* **Bootstrap:** 4.1.0
* **Angular:** 5.2.10
* **ng-bootstrap:** 1.1.2
* **ajv:** 6.3.0
* **rxjs:** 5.5.10
* **zone.js:** 0.8.26

(see [package.json](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse/package.json?at=2.0.0-RC.2-1) for the full list of dependencies)

## Features
* **orNavTreeFakeFocus:** add fake focus for `orNavTree` ([ea12cfb](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/ea12cfb))
* **master-layout:** provide a `noNavigation` parameter for collapsing the application navigation ([7ed28e5](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7ed28e5))
* **text-control-clear:** add a `TextControlClearDirective` based on ObliqueUI `.text-control-clear` for clearing input controls ([c090f6e](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/c090f6e))

## Bug Fixes
* **MasterLayoutNavigationMenuDirective:** (MS Edge) access `HTMLElement.style.cssText` instead of `HTMLElement.style` to avoid *Assignment to read-only properties is not allowed in strict mode* runtime errors ([eb689de](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/eb689de))
* **NavTreeFakeFocusDirective:** (MS Edge | IE) use `KeyboardEvent.keyCode` instead of `KeyboardEvent.key` for browser compatibility ([f41daa7](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f41daa7))
* **orMasterLayoutHeaderToggle:** Fix lint error ([f465266](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f465266))

## Code Refactoring
* **filter-box:** use the new `text-control` ObliqueUI component for clearing filter box control (& refactor other component to use `OrFilterBox`) ([ea3d02e](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/ea3d02e))
* **orNavTree:** use `ngTemplate` instead of recursive component ([b8e9e59](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b8e9e59))
* **orNavTreeFakeFocus:** do not change CSS resources at runtime, reorganize source code and fix some minor issues ([f8882c7](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/f8882c7))


<a name="2.0.0-RC.3-1"></a>
# [2.0.0-RC.3-1](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0-RC.3-1) (2018-02-08)

## Dependencies updates
* **ObliqueUI:** 2.0.0-RC.3-1
* **Bootstrap:** 4.0.0
* **Angular:** 5.2.3
* **ng-bootstrap:** 1.0.0
* **ngx-translate:** 9.1.1
* **zone.js:** 0.8.20

## Bug Fixes
* **notification:** do not show default title if a title is provided ([3e6810a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/3e6810a))

## Features
* **footer:**
	- add configuration parameter for enabling small footer variant ([b399e26](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b399e26))
	- add Footer component for layout customization ([1bcb191](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1bcb191))
* **master-layout:** add a `MasterLayoutHeaderToggleDirective` for toggling the application header ([299a55b](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/299a55b))
* **number-format:** add directive ([9a364c5](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/9a364c5))

## Code Refactoring
* **toolchain:** migrate to Gulp 4 ([788c987](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/788c987))


<a name="2.0.0-RC.3"></a>
# [2.0.0-RC.3](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0-RC.3) (2018-01-09)

## Dependencies updates
* **ObliqueUI:** 2.0.0-RC.3
* **Bootstrap:** 4.0.0-beta.3
* **Angular:** 5.1.3
* **ng-bootstrap:** 1.0.0-beta.9
* **ngx-translate:** 9.0.2
* **rxjs:** 5.5.6
* **ajv:** 6.0.0

## Features
* **notification:** can pass parameters to title and message translations ([d781e19](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d781e19))
* **unsubscribe:** add `Unsubscribable` class to unsubscribe form `Observable` ([d20d4bd](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d20d4bd))

## Bug Fixes
* **schema-validation:** `SchemaValidationModule` now provides `schemaValidationService` ([acbc7f9](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/acbc7f9))
* **AoT:** avoid lambda function on providers ([8a90825](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/8a90825))
* **navigator:** fix routing to module ([74e2778](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/74e2778))
* **notification:** add `alert-default` class to default alerts ([dac70b1](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/dac70b1))
* **observable:** unsubscribe from all observables ([95b4b7a](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/95b4b7a))


<a name="2.0.0-RC.2-1"></a>
# [2.0.0-RC.2-1](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0-RC.2-1) (2017-11-01)

## Dependencies updates
* **ObliqueUI:** 2.0.0-RC.2-1
* **Bootstrap:** 4.0.0-beta.2
* **Angular:** 4.4.6
* **rxjs:** 5.5.1
* **ajv:** 5.3.0

(see [package.json](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse/package.json?at=2.0.0-RC.2-1) for the full list of dependencies)

## Bug Fixes
* **formControlState:**
	- `name` attribute is not mandatory. Either `ngModel`, `ngModelChange` or `formControlName` is ([7abce66](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7abce66))
	- for reactive forms, allow `pristineValidation` and set `control-mandatory` on page initialisation ([19d5f5c](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/19d5f5c))
	- remove `has-error` class on form reset ([d1c605f](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d1c605f))
* **schemaValidation:**
	- never pass null to ajv ([afc7468](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/afc7468), [4353179](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/4353179))
	- prevent multiple compile with same schema ([84c9dac](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/84c9dac))

## Code Refactoring
* **navigator:** rename `orNavigator` into `or-navigator` ([0cb9f47](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0cb9f47))
* **scss:** remove module SCSS resources and cleanup showcase ones ([d2f3383](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d2f3383))

## Features
* **column-layout:** dispose content within collapsible/expansible columns using `ColumnLayoutComponent` (or `ColumnPanelDirective` & `ColumnPanelDirective`) ([4348d51](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/4348d51))
* **filterBox:** add `size`, `disabled` and `readonly` attributes ([847d3a7](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/847d3a7))
* **formControlState:** add reactive form sample ([226d0d5](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/226d0d5))
* **schemaValidation:**
	- add `getValidator` function for reactive forms ([d3ff5f3](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d3ff5f3))
	- add reactive form to the showcase ([1e4afde](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1e4afde))
	- move Draft06 transformation into a decorator ([75a8b8b](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/75a8b8b))
* **toggle:** add `ToggleDirective` for icon toggle ([dc6f8e8](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/dc6f8e8))
* **toolchain:** add npm script & Gulp task for npm linking and watching distribution files ([8ed5c89](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/8ed5c89))
* **unsavedChangesService:** expose `discardChanges` function ([3e84226](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/3e84226))

## BREAKING CHANGES
* **navigator:** rename `orNavigator` into `or-navigator`
* **scss:** remove any import of ObliqueReactive CSS styles (mainly in your Angular CLI configuration) as they are now bundled with components.


<a name="2.0.0-RC.2"></a>
# [2.0.0-RC.2](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0-RC.2) (2017-08-04)

## Dependencies updates
* **ObliqueUI:** 2.0.0-RC.2
* **jQuery:** 3.2.1
* **Bootstrap:** 4.0.0-beta
* **Angular:** 4.4.3
* **ng-bootstrap:** 1.0.0-beta.5
* **ngx-translate:** 8.0.0
* **rxjs:** 5.4.3

(see [package.json](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse/package.json?at=2.0.0-RC.2) for the full list of dependencies)

## Features
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

## BREAKING CHANGES
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


<a name="2.0.0-RC.1"></a>
# [2.0.0-RC.1](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0-RC.1) (2017-06-23)

## Dependencies updates
* **ObliqueUI:** 2.0.0-RC.1
* **jQuery:** 3.2.1
* **Bootstrap:** 4.0.0-alpha.6
* **Angular:** 4.2.4
* **ng-bootstrap:** 1.0.0-alpha.26
* **ngx-translate:** 7.0.0
* **rxjs:** 5.4.1

## BREAKING CHANGES
ObliqueReactive has been migrated to Angular 4.
This of course breaks all compatibility to any previous release of ObliqueReactive. 


<a name="1.5.0"></a>
# [1.5.0](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.5.0) (2019-03-20)

## Dependencies updates
* **AngularJS:** 1.7.8
* **@uirouter/angularjs:** 1.0.22

##Bug Fixes
* **form-control-state**: add has-error on init only if pristineValidation is explicitly set to true ([1898d04](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1898d04))
* **form-control-state**: correct handling of control-mandatory class ([b601989](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/b601989))


<a name="1.4.1"></a>
# [1.4.1](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.4.1) (2018-10-23)

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
# [1.4.0](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.4.0) (2018-03-20)

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
# [1.3.9](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.9) (2017-10-17)

## Bug Fixes
* **schemaValidation:** accept zero for `number` and `integer` inputs ([7a14c14](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/7a14c14))


<a name="1.3.8"></a>
# [1.3.8](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.8) (2017-09-18)

## Bug Fixes
* **number-format:** ensure model value is always of type number (instead of string) ([b90fcf7](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/b90fcf7))


<a name="1.3.7"></a>
# [1.3.7](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.7) (2017-08-15)

## Features
* **number-format:**
	- provide a `NumberFormatConfig` to customize `number-format` default settings ([bea72fe](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/bea72fe))
	- add a `update-model-decimals` scope attribute to defines if decimals formatting should be applied on model value as well ([bea72fe](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/bea72fe))

## Bug Fixes
* **translation:** normalize translations keys ([f9e8c7a](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/f9e8c7a))
* **translation:** use `oblique` prefix for `unsavedChanges` validation message ([b9205d4](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/b9205d4))

<a name="1.3.6"></a>
# [1.3.6](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.6) (2017-05-24)

## Bug Fixes
* **datepicker:** providing custom template for the uib-datepicker-popup, this ensures the rebinding of the min- and max-dates ([11767d8](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/11767d8)), closes [#OUI-464](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-464)


<a name="1.3.5"></a>
# [1.3.5](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.5) (2017-05-11)

## Dependencies updates
* **AngularJS:** 1.6.4
* **tv4:** 1.3.0
* **moment:** 2.18.1

## Bug Fixes
* **datepicker:** parse programmatically changed min- and max-dates ([46ab410](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/46ab410)), closes [#OUI-448](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-448)
* **number-format:** ensure that empty values are correctly parsed and that formatter understands 0 decimals ([0d87acb](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/0d87acb)), closes [#OUI-449](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-449) [#OUI-450](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-450)

## Features
* **date-picker:** new `dateChange` binding allows tracking of `ngModel` changes ([ea5de08](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/ea5de08)), closes [#OUI-447](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-447)


<a name="1.3.4"></a>
# [1.3.4](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.4) (2017-04-11)

## Bug Fixes
* **error-messages:** renders error messages at the same time as form-control adds the has-error class ([7d9003a](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/7d9003a))
* **datepicker:** triggers min/max validation if the min or max value changes ([123fed5](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/123fed5))
* **number-format:** keeps an invalid viewValue on focus ([d9d19e4](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/d9d19e4))

## Features
* **number-format:** only parses number if its not `NaN` ([8e452b0](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/8e452b0))

## BREAKING CHANGES
* **datepicker:** Now uses the ngModelOption `allowInvalid = true`: Dates that do not pass the min/max validation will still be written to the model ([123fed5](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/123fed5))


<a name="1.3.3"></a>
# [1.3.3](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.3) (2017-03-16)

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
# [1.3.2](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.2) (2017-03-14)

## Dependencies updates
* **ObliqueUI:** 1.3.2
* **AngularJS:** 1.6.2
* **angular-translate:** 2.15.1
* **angular-ui-bootstrap:** 2.5.0

(see [package.json](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse/package.json?at=1.3.1) for the full list of dependencies)

## Bug Fixes
* **datepicker:** `appendToBody` option does not change the style of the popup ([ea189b7](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/ea189b7))
* **form-inline:** ensure custom components are displayed correctly under `.form-inline` ([e9662c4](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e9662c4))
* **ObliqueHttpInterceptor:** do not stop `loadingService` for silent or back-end calls ([c906532](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/c906532))
* **publish:** execute ngAnnotate during `publish` build task ([8b78254](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/8b78254))

## Features
* **error-messages:** implementation of an `error-message-component` for displaying validation errors ([d2796f0](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/d2796f0))
* **date-picker:**
	- the new `error-message-component` is now used to render `date-picker` validation messages ([f70a818](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/f70a818))
	- add placeholder option, which accepts a text or a translation key ([a0d88da](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/a0d88da)), [#OUI-395](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-395))
* **i18n:** locales are now added to the lib and use a `oblique` prefix ([cdb20da](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/cdb20da)), [#OUI-389](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-389), [#OUI-394](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-394)). See breaking changes below as well.
* **SchemaValidation:** use `schema-validator` to determine if an input is mandatory ([26f13ad](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/26f13ad))
* **unsaved-hanges:** unsaved changes within modals are now tracked as well ([7355e69](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/7355e69))
* **modules:** add modules for most components ([a9bd573](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/a9bd573))
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
* `HttpInterceptor` has been renamed to `ObliqueHttpInterceptor` ([c727ac7](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/c727ac7)). If you use `ObliqueHttpInterceptor`, you will have to update the interceptor config in your `app.module` from `$httpProvider.interceptors.push('ObliqueHttpInterceptor');` to `$httpProvider.interceptors.push('HttpInterceptor');`.


<a name="1.3.1"></a>
# [1.3.1](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.1) (2017-01-24)

## Dependencies updates
* **ObliqueUI:** 1.3.1
* **AngularJS:** 1.6.1
* **angular-ui-bootstrap:** 2.4.0
* **angular-ui-router:** 0.4.2

(see [package.json](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse/package.json?at=1.3.1) for the full list of dependencies)


<a name="1.3.0"></a>
# [1.3.0](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.0) (2016-12-12)

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
* **form-control:** rewrite `has-error` directive in order to provide better handling on form controls (validation and mandatory states), see breaking changes as well ([9aac98d](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/9aac98d))
* **unsaved-changes:** integrate `UnsavedChangesDirective` and provide an usage sample ([1b91cf4](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/1b91cf4))
* **top-control:** add a wrapper for the ObliqueUI [TopControl](https://eui.bit.admin.ch/oblique-ui/1.3.0/components.html#components-feedback-top-control) component ([d423315](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/d423315))
* **webpack:** bundle UI with Webpack and separate `showcase` and `src` builds ([526e803](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/526e803))
* **typescript:** rewrite ObliqueReactive into TypeScript ([3db0ca7](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/3db0ca7), [1e702e4](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/1e702e4), [9503d46](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/9503d46))
* **sourcemaps:** sourcemap integration in dev and publish build ([9e2504c](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/9e2504c))
* **css:** ObliqueReactive Less resources are now bundled ([dc84849](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/dc84849))

## Bug Fixes
* **notifications:**
	- ensure notification message key is correctly retrieved for translation ([e028fd4](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e028fd4))
	- removed CSS class `.lead` to match ObliqueUI [notifications](https://eui.bit.admin.ch/oblique-ui/1.3.0-RC.8/components.html#components-dialogs-notifications) specs ([a01b0ef](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/a01b0ef))
* **spinner:**
	- callable from other controllers than `app-controller` ([b9d527d](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/b9d527d))
	- overlay uses the fixed variant ([e343224](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e343224))
* **datepicker:** fix min/max date validation ([9cea457](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/9cea457))
* **multiselect:** add support for schema validation ([506d8ec](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/506d8ec))
* **navigable:** ensure `navigable-activate` and `navigable-highlight` are properly evaluated ([ba992b7](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/ba992b7))
* **navigator:** ensure UP & BACK navigation is performed as expected ([53113d5](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/53113d5))
* **validation:**
	- datepicker + schema-validate ([5e40bca](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/5e40bca), [487126d](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/487126d))
	- ensure `date-picker`, `schema-validation` and `has-error` directives work nicely together, add support for JSON schema v3 & update live examples ([d4ae8dc](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/d4ae8dc))

## Code Refactoring
* **validation:** normalize namings of validation components (directives & events), see breaking changes as well ([817a9a0](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/817a9a0))

## BREAKING CHANGES
* **navigator:** `navigator` implementation is now based on AngularJS component design and needs to be referenced using the element tag (i.e. `&lt;navigator&gt;&lt;/navigator&gt;`) ([927d7e3](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/927d7e3))
* **notifications:** `notifications` implementation is now based on AngularJS component design and needs to be referenced using the element tag (i.e. `&lt;notifications&gt;&lt;/notifications&gt;`) ([ea2044d](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/ea2044d))
* **multiselect:** `multiselect` implementation is now based on AngularJS component design and needs to be referenced using the element tag (i.e. `&lt;multiselect&gt;&lt;/multiselect&gt;`) ([3ea1b53](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/3ea1b53))
* **date-picker:** `date-picker` implementation is now based on AngularJS component design and needs to be referenced using the element tag (i.e. `&lt;date-picker&gt;&lt;/date-picker&gt;`) ([d6e22eb](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/d6e22eb))
* **header-navigation:** partial needs to be updated to support ObliqueUI 1.3.0 (see [primary navigation](https://eui.bit.admin.ch/oblique-ui/1.3.0/components.html#components-navs-navbars-primary))
* **footer:** partial needs to be updated to support ObliqueUI 1.3.0 (see [footer](https://eui.bit.admin.ch/oblique-ui/1.3.0/components.html#components-branding-footer))
* **validation**:
	- `validation-schema` directive has been renamed into `schema-validation`
	- `validationSchemaEvent` event has been renamed into `schemaValidationEvent`
	- `validationBusinessEvent` event has been renamed into `businessValidationEvent`
* **has-error**: `has-error` directive is removed in favor of `form-control` component ([9aac98d](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/9aac98d))
	- `has-error="controlName"` becomes `&lt;form-control name="controlName" /&gt;`
	- `has-error-pristine` becomes `&lt;form-control pristine-validation /&gt;`


<a name="1.2.7"></a>
# [v1.2.7](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=v1.2.7) (2016-05-31)

## Features
* **navigable:**
	- enable item activation on load ([93f46f0](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/93f46f0))
	- enable item highlighting on load ([e57a76a](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e57a76a))
* **npm:** remove Bower and use only npm to fetch all dependencies ([094709a](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/094709a), [2e01c74](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/2e01c74), [e8f9e2f](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e8f9e2f), [929bf49](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/929bf49))

## Bug Fixes
* **navigable:** ensure `navigable` item gets activated when a child element gets focused ([972e7ad](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/972e7ad), [df64911](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/df64911))
* **ngAnimate:** ensure `ngRepeat` does not show stale items due to ngAnimate transitions ([51cbfdc](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/51cbfdc))
* **typeahead:** provide a workaround for scrollable AngularUI Typeahead suggestions and create a sample state to showcase it. ([cca3282](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/cca3282))


<a name="1.2.2"></a>
# [v1.2.2](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=v1.2.2) (2015-09-11)

## Features
* **delayed-change:** Added delayed-change directive for firing delayed callback when inputs value changes ([f84d177](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/f84d177))
* **locale:** enable i18n localization for 3rd-party directives (including AngularUI datepicker) ([d9e93fc](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/d9e93fc))
* **navigator:** implement a state navigator service & directive and provide sample usage ([e3ef760](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e3ef760))
* **auth:**
	- bind user roles with UI elements ([90cc7b3](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/90cc7b3))
	- finalize client-side authentication and refactor accordingly ([e75752a](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e75752a))
	- prepare application for client-side authentication ([43addf0](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/43addf0))

## Bug Fixes
* **locale:** do not determine preferred language as locale keys are inconsistent across browsers ([8e55f4b](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/8e55f4b))
* **notifications:** notification can now be dismissed with the close button ([a24bf28](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/a24bf28))
* **schema-validation:** fix nested properties validation and showcase with a sample usage ([6ff2932](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/6ff2932))


<a name="0.0.3"></a>
# [v0.0.3](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=v0.0.3) (2015-03-18)

## Bug Fixes
* **notifications:** ensure notifications are correctly displayed for API exceptions ([527807e](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/527807e))

## BREAKING CHANGES
* notifications: API-specific methods are now scoped under `$http.api` (i.e. `$http.api.get()`, `$http.api.post()`, etc.)


<a name="0.0.2"></a>
# [v0.0.2](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=v0.0.2) (2015-03-11)

## Features
* **AppController:** enable global control for core UI components (layout, page title & spinner) ([58a25c8](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/58a25c8))
* **head-title:** implement composable block for the head `title` element and use `ng-bind` to avoid curlies (`{{}}`) FoC ([17e6404](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/17e6404))

## Bug Fixes
* **navbar-global:** use `ui-sref` and `ui-sref-active` directives instead of custom state handling ([cdd754d](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/cdd754d))
