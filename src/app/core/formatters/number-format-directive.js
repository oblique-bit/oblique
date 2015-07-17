(function () {
	'use strict';

	angular.module('__MODULE__.core')
	.directive('numberFormat', function ($filter, $parse) {
		return {
			require: 'ngModel',
			link: function (scope, element, attrs, ngModelController) {

				var decimals = $parse(attrs.decimals)(scope) || 2;

				ngModelController.$parsers.push(function (data) {
					// Attempt to convert user input into a numeric type to store
					// as the model value (otherwise it will be stored as a string)
					// NOTE: Return undefined to indicate that a parse error has occurred
					//       (i.e. bad user input)
					var parsed = parseFloat(data);
					return !isNaN(parsed) ? parsed : undefined;
				});

				ngModelController.$formatters.push(function (data) {
					//convert data from model format to view format
					return $filter('number')(data, decimals); //converted
				});

				element.bind('focus', function () {
					element.val(ngModelController.$modelValue);
				});

				element.bind('blur', function () {
					if(ngModelController.$valid) {
						// Apply formatting on the stored model value for display
						var formatted = $filter('number')(ngModelController.$modelValue, decimals);
						element.val(formatted);
					}
				});
			}
		};
	});
}());
