(function () {
	'use strict';

	/**
	 * Wrapper for AngularJS Dropdown Multiselect:
	 * http://dotansimha.github.io/angularjs-dropdown-multiselect/
	 */
	angular.module('__MODULE__.oblique')
	.constant('multiselectConfig', {
		extraSettings : {
			idProp: 'value',
			//displayProp: 'text',
			externalIdProp: 'value',
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
			scope: {
				ngModel:            '=',    // The object the will contain the model for the selected items in the dropdown.
				options:            '=',    // The options for the dropdown.
				extraSettings:      '&?',   // See 'Settings' section on http://dotansimha.github.io/angularjs-dropdown-multiselect/
				translationTexts:   '&?'    // See 'Translation Texts' section on http://dotansimha.github.io/angularjs-dropdown-multiselect/
			},
			controller: function ($rootScope, $scope, $attrs) {
				// Configuration:
				$scope.settings = angular.extend(multiselectConfig.extraSettings, $scope.extraSettings ? $scope.extraSettings() : {});
				$scope.translations = angular.extend(
					multiselectConfig.translationTexts,
					$scope.translationTexts ? $scope.translationTexts() : {}
				);

				// Binding:
				$scope.wrap = function () {
					$scope.selectedModel = $scope.ngModel.map(function (item) {
						return {
							value: item
						};
					});
				};

				$scope.unwrap = function () {
					$scope.ngModel = $scope.selectedModel.map(function (item) {
						return item.value;
					});
				};

				$scope.$watch('selectedModel', function () {
					$scope.unwrap();
				}, true);

				$scope.$watch('ngModel', function () {
					$scope.wrap();
				}, true);

				// Initialization
				$scope.wrap();
			},
			template: '<div ng-dropdown-multiselect options="options" selected-model="selectedModel" checkboxes="true" extra-settings="settings" translation-texts="translations"></div>',
			require: 'ngModel',
			link: function (scope, element, attrs, ngModelCtrl) {
				var dropdownMultiselect = angular.element(element.find('.multiselect-parent')).scope();
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
