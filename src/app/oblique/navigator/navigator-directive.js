(function () {
	'use strict';

	angular.module('__MODULE__.oblique')
	.directive('navigator', function ($navigator, $document) {
		return {
			restrict: 'E',
			replace: true,
			template:   '<a href="" ng-click="up()">' +
							'<span class="fa fa-chevron-left"></span>' +
						'</a>',
			link: function (scope, element, attrs) {
				var eventName = 'keyup.navigator';

				scope.up = function() {
					return $navigator.up();
				};

				$document.on(eventName, function (event) {
					if (event.which === 27) { // ESC key
						event.preventDefault();
						return scope.up();
					}
				});

				element.on('$destroy', function() {
					$document.off(eventName);
				});
			}
		};
	});
}());
