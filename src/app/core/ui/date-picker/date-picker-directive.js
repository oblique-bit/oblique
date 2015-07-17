(function () {
	'use strict';

	/**
	 * Wrapper for UI Bootstrap `datepicker` directive:
	 * https://angular-ui.github.io/bootstrap/#/datepicker
	 */
	angular.module('__MODULE__.core')
	.directive('datePicker', function (datepickerPopupConfig) {
		return {
			templateUrl: '../core/ui/date-picker/date-picker.tpl.html',
			restrict: 'E',
			replace: true,
			scope: {
				ngModel: '=',
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
			controller : function($scope) {
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
				element.keydown(function(e) {
					var control = element.find('input[name=' + scope.name + ']');
					if(angular.element(e.target).is(control) && e.keyCode === 40) { // 40: ArrowDown
						scope.$apply(function (){
							scope.toggle(e);
						});
					}
				});
			}
		};
	})

	/**
	 * Date parsing fix to enforce parsing against the complete date pattern, when date is manually entered.
	 *
	 * See:
	 *  - https://github.com/angular-ui/bootstrap/issues/1235
	 *  - http://stackoverflow.com/questions/18675280/angular-bootstrap-datepicker-and-manual-date-input
	 *  - https://github.com/angular-ui/bootstrap/issues/956
	 */
	.directive("datePickerParser", function(dateFilter, $dateParser, datepickerPopupConfig) {
		return {
			restrict: "A",
			require: ["ngModel", "^datePicker"],
			link: function(scope, element, attrs, params) {
				var ngModel = params[0];
				var datePicker = params[1];
				var dateFormat = datePicker.format || datepickerPopupConfig.datepickerPopup;
				ngModel.$parsers.unshift(function(viewValue) {
					var date = $dateParser(viewValue, dateFormat);
					var isValid = viewValue === null || viewValue === '' || angular.isDate(date);
					ngModel.$setValidity("date", isValid);
					return date ? date : (isValid ? null : undefined);
				});
			}
		};
	});
}());
