(function () {
	'use strict';

	angular
		.module('__MODULE__.oblique')
		.directive('dropdownClosable', function ($timeout) {
			function closeDropdown(element) {
				$timeout(function () {
					var focused = element.parent().find(':focus');
					if (focused.length === 0) {
						element.attr('aria-expanded', false);
						element.parent().removeClass('open');
					}
				}, 1);
			}

			return {
				restrict: 'A',
				link: function (scope, element, attrs) {
					element.blur(function () {
						closeDropdown(element);
					});

					element.parent().find('a').blur(function () {
						closeDropdown(element);
					});
				}
			};
		});
}());
