(function () {
	'use strict';

	angular.module('__MODULE__.oblique')

	/**
	 * Extend AngularUI Typeahead to ensure that active item remains always visible
	 * on a scrollable popup when using UP/DOWN arrow keys.
	 *
	 * See: http://stackoverflow.com/questions/27705490/up-down-arrow-key-issue-with-typeahead-control-angular-bootstrap-ui
	 */
	.directive('uib-typeahead', function () {
		return {
			restrict: 'A',
			priority: 1000, // Let's ensure AngularUI Typeahead directive gets initialized first!
			link: function (scope, element, attrs) {
				// Bind keyboard events: arrows up(38) / down(40)
				element.bind('keydown', function (evt) {
					if (evt.which === 38 || evt.which === 40) {
						// Broadcast a possible active option change:
						// (Note that we could pass the activeIdx value as event data but AngularUI Typeahead directive
						//  has its own local scope which makes it hard to retrieve, see:
						//  https://github.com/angular-ui/bootstrap/blob/7b7039b4d94074987fa405ee1174cfe7f561320e/src/typeahead/typeahead.js#L104)
						scope.$broadcast('TypeaheadActiveChanged');
					}
				});
			}
		};
	}).directive('uibTypeaheadPopup', function () {
		return {
			restrict: 'EA',
			link: function (scope, element, attrs) {
				var unregisterFn = scope.$on('TypeaheadActiveChanged', function (event) {
					if(scope.activeIdx !== -1) {
						// Retrieve active Typeahead option:
						var option = element.find('#' + attrs.id + '-option-' + scope.activeIdx); // You nay need to change this selector if you are using custom templates
						if(option.length) {
							// Make sure option is visible:
							option[0].scrollIntoView(false);
						}
					}
				});

				// Ensure listener is unregistered when $destroy event is fired:
				scope.$on('$destroy', unregisterFn);
			}
		};
	});
}());
