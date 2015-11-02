(function () {
	'use strict';

	/**
	 * Wrapper for AngularJS Dropdown Multiselect:
	 * http://dotansimha.github.io/angularjs-dropdown-multiselect/
	 */
	angular.module('__MODULE__.oblique')
		.constant('multiselectConfig', {
			extraSettings : {
				buttonClasses: "btn btn-default",
				idProp: 'id',
				displayProp: 'label',
				externalIdProp: '', // Return the full item model when selected
				scrollable: false,
				showCheckAll: false,
				showUncheckAll: false,
				// TODO fixme that's a hack
				smartButtonMaxItems: 1000
			},
			translationTexts : {
				checkAll: 'multiselect.checkAll',
				uncheckAll: 'multiselect.uncheckAll',
				buttonDefaultText: 'multiselect.buttonDefaultText'
			}
		})
		.directive('multiselect', function (multiselectConfig, $filter) {
			return {
				restrict: 'E',
				template: '<div ng-dropdown-multiselect options="options" selected-model="ngModel" checkboxes="true" extra-settings="settings" translation-texts="translations"></div>',
				require: 'ngModel',
				scope: {
					ngModel:            '=',    // The object the will contain the model for the selected items in the dropdown.
					options:            '=',    // The options for the dropdown.
					extraSettings:      '&?',   // See 'Settings' section on http://dotansimha.github.io/angularjs-dropdown-multiselect/
					translationTexts:   '&?',   // See 'Translation Texts' section on http://dotansimha.github.io/angularjs-dropdown-multiselect/
					dropup:             '='     // Defines if a dropup menu should be used instead on a dropdown
				},
				controller: function ($rootScope, $scope, $attrs) {
					// Configuration:
					$scope.settings = angular.extend(multiselectConfig.extraSettings, $scope.extraSettings ? $scope.extraSettings() : {});
					$scope.translations = angular.extend(
						multiselectConfig.translationTexts,
						$scope.translationTexts ? $scope.translationTexts() : {}
					);

					// Binding:
					$scope.ngModel = $scope.ngModel || [];

				},
				link: function (scope, element, attrs, ngModelCtrl) {
					var container = element.find('.multiselect-parent');
					var dropdownMultiselect = angular.element(container).scope();
					if (dropdownMultiselect) {
						// Close on ESC keypress:
						element.bind('keydown', function (evt) {
							if (evt.which === 27) { // ESC key
								evt.preventDefault();
								evt.stopPropagation();
								dropdownMultiselect.open = false;
								// Trigger $digest cycle:
								scope.$apply();
							}
						});

						// Dropup?
						if(scope.dropup){
							container.addClass('dropup');
							element.find('.dropdown-toggle').addClass('dropdown-toggle-up');
						}

						// Enable labels translation:
						// FIXME: remove when https://github.com/dotansimha/angularjs-dropdown-multiselect/issues/54
						translateLabels(dropdownMultiselect);
						scope.$root.$on('$translateChangeSuccess', function (event, data) {
							translateLabels(dropdownMultiselect);
						});
					}

					// Toggle dirty state:
					var originalValue = angular.copy(scope.ngModel);
					scope.$watch('ngModel', function (newValue, oldValue) {
						if (!angular.equals(originalValue, newValue)) {
							ngModelCtrl.$setDirty();
						}
					}, true);

					// FIXME: remove when https://github.com/dotansimha/angularjs-dropdown-multiselect/issues/54
					function translateLabels(dropdownMultiselect) {
						angular.forEach(scope.translations, function(value, key) {
							dropdownMultiselect.texts[key] = $filter('translate')(value);
						});
					}
				}
			};
		});
}());

