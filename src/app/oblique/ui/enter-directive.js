(function () {
	'use strict';

	angular.module('__MODULE__.oblique')
	.directive('enter', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				element.keydown(function (e) {
					if (e.keyCode === 13 && element.is(e.target)) {
						scope.$apply(function () {
							scope.$eval(attrs.enter);
						});
						e.preventDefault();
					}
				});
			}
		};
	});
}());
