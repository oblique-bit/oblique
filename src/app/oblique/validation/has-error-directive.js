(function () {
	'use strict';

	angular.module('__MODULE__.oblique')
		.directive('hasError', function () {
			return {
				restrict: 'A',
				require: '^form',
				link: function (scope, element, attrs, form) {
					// Retrieve the underlying form control and its 'name' attribute:
					var control = element.find("[name]");
					var name = control.attr('name') || attrs.hasError;

					if(name) {
						// Watch for control validity changes:
						scope.$watch(form.$name + '.' + name + '.$invalid', function (invalid) {
							element.toggleClass('has-error', invalid === true);
						});
					}
				}
			};
		});
}());
