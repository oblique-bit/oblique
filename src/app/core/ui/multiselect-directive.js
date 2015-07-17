(function () {
	'use strict';

	angular.module('__MODULE__.core')
		.directive('multiselect', function () {
		return {
			restrict: 'E',
			scope: {
				ngModel: '=ngModel',
				options: '=options'
			},
			controller: function ($scope, $filter, $attrs) {
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

				$scope.extraSettings = {
					idProp: 'value',
					//displayProp: 'text',
					externalIdProp: 'value',
					scrollable: false,
					showCheckAll: false,
					showUncheckAll: false,
					// TODO fixme that's a hack
					smartButtonMaxItems: 1000
				};

				$scope.translationTexts = {
					buttonDefaultText: $filter('translate')('common.pleaseSelect')
				};
			},
			template: '<div ng-dropdown-multiselect options="options" selected-model="selectedModel" checkboxes="true" extra-settings="extraSettings" translation-texts="translationTexts"></div>',
			link: function (scope, element, attrs) {
				element.bind('keydown', function (evt) {
					if (evt.which === 27) {
						evt.preventDefault();
						evt.stopPropagation();
						var dropdownMultiselect = angular.element(element.find('.multiselect-parent')).scope();
						if (dropdownMultiselect) {
							dropdownMultiselect.open = false;
							// Trigger $digest cycle:
							scope.$apply();
						}
					}
				});
			}
		};
	});
}());
