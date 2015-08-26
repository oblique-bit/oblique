(function () {
	'use strict';

	angular.module('__MODULE__.core')
	.directive('navigator', function ($navigator, $document) {
		return {
			restrict: 'E',
			replace: true,
			template:   '<a href="" ng-click="up()">' +
							'<span class="fa fa-chevron-left"></span>' +
						'</a>',
			link: function (scope, element, attrs) {
				console.log(arguments);

				var eventName = 'keyup.navigator';

				scope.up = function() {
					return $navigator.up();
				};

				$document.on(eventName, function (event) {
					console.log(event);
					if (event.which === 27) { // ESC key
						event.preventDefault();
						return scope.up();
					}
				});

				element.on('$destroy', function() {
					console.log('destroy');
					$document.off(eventName);
					//$interval.cancel(timeoutId);
				});
			}
		};
	});
}());
