(function () {
	'use strict';

	/**
	 * Wrapper for UI Bootstrap `datepicker` directive:
	 * https://angular-ui.github.io/bootstrap/#/datepicker
	 */
	angular.module('__MODULE__.oblique')
		.directive('datePicker', function (datepickerPopupConfig) {
			return {
				templateUrl: 'app/oblique/ui/date-picker/date-picker.tpl.html',
				restrict: 'E',
				replace: true,
				scope: {
					ngModel: '=',
					minDate: '=',
					maxDate: '=',
					options: '&?', // See UI Bootstrap `datepicker` 'Popup Settings'
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
					$scope.config = angular.extend({}, datepickerPopupConfig, $scope.options || {});
					$scope.editable = angular.isDefined($scope.editable) ? $scope.editable : true;
					$scope.showClearControl = angular.isDefined($scope.showClearControl) ? $scope.showClearControl : true;
					$scope.opened = false;

					// Public API:
					this.format = $scope.config.datepickerPopup;
				},
				link: function (scope, element, attrs) {

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
	 *  - validation of ISO-formatted date strings (no more accepted by AngularUI v0.13.3)
	 *  - validation of limit dates (minDate/maxDate)
	 *  - activation of ranges (by watching minDate/maxDate properties)
	 *  - ISO model values only
	 *
	 * See:
	 *  - https://github.com/angular-ui/bootstrap/issues/4233
	 */
		.directive("datepickerPopup", function (dateFilter, $dateParser, datepickerPopupConfig) {
			return {
				restrict: "A",
				priority: 1000,
				require: ["ngModel", "^datePicker"],
				link: function (scope, element, attrs, params) {
					var ngModel = params[0];
					var datePicker = params[1];
					var dateFormat = datePicker.format || datepickerPopupConfig.datepickerPopup;
					var originalValidator = ngModel.$validators.date;

					ngModel.$validators.date = function (modelValue, viewValue) {
						return isDateValid(modelValue, viewValue);
					};

					ngModel.$validators.minDate = function (modelValue, viewValue) {
						// Validate only if view value is set and valid:
						var minDate = parse(scope.minDate);
						if (minDate && viewValue && isDateValid(modelValue, viewValue)) {
							return compare(parse(viewValue), minDate) >= 0;
						}
						return true;
					};

					ngModel.$validators.maxDate = function (modelValue, viewValue) {
						// Validate only if view value is set and valid:
						var maxDate = parse(scope.maxDate);
						if (maxDate && viewValue && isDateValid(modelValue, viewValue)) {
							return compare(parse(viewValue), maxDate) <= 0;
						}
						return true;
					};

					scope.$watchGroup(['minDate', 'maxDate'], function (newValues, oldValues) {
						if (!angular.equals(newValues, oldValues)) {
							// Apply model validation as its value may be out of limits:
							ngModel.$validate();
						}
					});

					// Check for ISO model values:
					if (datepickerPopupConfig.useIsoModel) {
						ngModel.$parsers.push(function (value) {
							if (angular.isDate(value)) {
								return dateFilter(value, 'yyyy-MM-dd');
							}
							return value;
						});
					}

					function isDateValid(modelValue, viewValue) {
						var valid = originalValidator(modelValue, viewValue);
						if (!valid) {
							// Try to validate again as date may originate from an ISO-formatted date:
							var date = parse(viewValue, dateFormat);
							valid = viewValue === null || viewValue === '' || angular.isDate(date);
						}
						return valid;
					}

					function parse(viewValue) {
						return $dateParser(viewValue, dateFormat);
					}

					//  <0 : if date1 < date2
					//   0 : if date1 = date2
					//  >0 : if date1 > date2
					function compare(date1, date2) {
						date1.setHours(0, 0, 0, 0);
						date2.setHours(0, 0, 0, 0);
						return date1.getTime() - date2.getTime();
					}
				}
			};
		});
}());
