(function () {
	'use strict';

	/**
	 * Wrapper for UI Bootstrap `datepicker` directive:
	 * https://angular-ui.github.io/bootstrap/#/datepicker
	 */
	angular.module('__MODULE__.oblique')
		.directive('datePicker', function (uibDatepickerPopupConfig, uibDateParser) {
			return {
				restrict: 'E',
				replace: true,
				require: ['^form'],
				templateUrl: '../oblique/ui/date-picker/date-picker.tpl.html',
				scope: {
					ngModel: '=',

					// AngularUI - Datepicker & DatePicker Popup properties:
					options: '=', // See UI Bootstrap `datepicker-options` docs under https://angular-ui.github.io/bootstrap/#/uib-datepicker-settings
					altInputFormats: '=?', // See UI Bootstrap `alt-input-formats` docs under https://angular-ui.github.io/bootstrap/#/uib-datepicker-popup-settings

					// Custom properties:
					disabled: '=?ngDisabled',
					required: '=?ngRequired',
					editable: '=?', // Manual edition
					label: '@label',
					name: '@',
					controlId: '@',
					controlSize: '@', // 'sm'
					showClearControl: '=?'
				},
				controller: function ($scope) {
					$scope.dpOptions = angular.extend({}, uibDatepickerPopupConfig, $scope.options);
					$scope.dpAltInputFormats = (uibDatepickerPopupConfig.altInputFormats || []).concat($scope.altInputFormats || []);
					$scope.editable = angular.isDefined($scope.editable) ? $scope.editable : true;
					$scope.showClearControl = angular.isDefined($scope.showClearControl) ? $scope.showClearControl : true;
					$scope.opened = false;

					$scope.$watchGroup(['options.minDate', 'options.maxDate'], function (newValues, oldValues) {
						if (!angular.equals(newValues, oldValues)) {
							// Ensure min/max dates get parsed correctly:
							parseMinMax();
						}
					});

					function parseMinMax() {
						if ($scope.options) {
							$scope.dpOptions.minDate = $scope.options.minDate && !angular.isDate($scope.options.minDate) ?
								uibDateParser.parse($scope.options.minDate, uibDatepickerPopupConfig.modelAsIsoFormat || $scope.options.datepickerPopup) : $scope.options.minDate;
							$scope.dpOptions.maxDate = $scope.options.maxDate && !angular.isDate($scope.options.maxDate) ?
								uibDateParser.parse($scope.options.maxDate, uibDatepickerPopupConfig.modelAsIsoFormat || $scope.options.datepickerPopup) : $scope.options.maxDate;
						}
					}

					// Init:
					parseMinMax();
				},
				link: function (scope, element, attrs, params) {
					var form = params[0];
					scope.form = form[attrs.name];

					scope.toggle = function ($event) {
						$event.preventDefault();
						$event.stopPropagation();

						scope.opened = !scope.opened;
					};

					scope.clear = function () {
						scope.ngModel = null;
					};

					// Bind event listeners:
					element.keydown(function (e) {
						var control = element.find('input[name=' + scope.name + ']');
						if (angular.element(e.target).is(control) && e.keyCode === 40) { // 40: ArrowDown
							scope.$apply(function () {
								scope.toggle(e);
							});
						}
					});
				}
			};
		})

		/**
		 * DatepickerPopup extensions:
		 *  - validation of ISO-formatted date strings (no more accepted since AngularUI v0.13.3)
		 *  - ISO model values only
		 *
		 * See:
		 *  - https://github.com/angular-ui/bootstrap/issues/4233
		 */
		.directive("uibDatepickerPopup", function (dateFilter, uibDateParser, uibDatepickerPopupConfig) {
			return {
				restrict: "A",
				priority: 9999,
				require: ["ngModel"],
				link: function (scope, element, attrs, params) {
					var ngModel = params[0];

					// Check for ISO model values:
					if (uibDatepickerPopupConfig.modelAsIsoFormat) {
						ngModel.$formatters.push(function (value) {
							return uibDateParser.parse(value, uibDatepickerPopupConfig.modelAsIsoFormat);
						});

						// FIXME: provide a way to store ISO-dates in the model (or any other helper scope variable)
						// FIXME: as of Angular UI Bootstrap v2.x, Datepicker only supports Date objects (cf. http://angular-ui.github.io/bootstrap/#/datepicker)
						/*
						ngModel.$parsers.push(function (value) {
							if (angular.isDate(value)) {
								return dateFilter(value, uibDatepickerPopupConfig.modelAsIsoFormat);
							}
							return value;
						});
						*/
					}
				}
			};
		});
}());