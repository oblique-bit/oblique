<a name="2.0.0-RC.1-2"></a>
## [2.0.0-RC.1-2](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0-RC.1-2) (2017-06.27)

### Bug Fixes

* **multiselect:** removing unused input pullRight

### Features

* **multiselect:** dropped the input `[settings]`, every property of `MultiselectConfig` is now an input of `MuliselectComponent`. This ensures, that we can change the settings at runtime

###BREAKING CHANGES

If you used `[settings]` of `MultiselectComponent` you now have to bind every config value separately.

<a name="2.0.0-beta.3"></a>
## [2.0.0-beta.3](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0-beta.3) (2017-06.22)

### Features

* **multiselect:** `MultiselectTexts` is now an Injectable that can be modified globally, similar to `MultiselectConfig`

<a name="2.0.0-beta.1"></a>
## [2.0.0-beta.1](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0-beta.1) (2017-06.01)

## Migration to Angular 4

We migrated most of the components from ObliqueReactive 1.3.* to Angular 4. This of course break all compatibility to all older releases of ObliqueReactive. 

