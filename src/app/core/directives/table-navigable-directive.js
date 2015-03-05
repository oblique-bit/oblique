(function () {
	'use strict';

	angular
		.module('__MODULE__.core')
		.directive('tableNavigable', function () {
			var arrows = {
				up: 38,
				down: 40
			};

			function moveFocus(e, element, direction) {
				var focused,
					rowToSelect;

				focused = element.find(':focus');
				if (!focused.is('.dropdown-toggle') && (focused.parents('.dropdown-menu').length === 0)) {
					e.preventDefault();

					rowToSelect = getRowToSelect(element, direction);
					rowToSelect.focus();
				}
			}

			function getRowToSelect(element, direction) {
				var selectedRow,
					rowToSelect;

				selectedRow = element.find('tbody tr.selected');
				if (direction === arrows.up) {
					rowToSelect = selectedRow.prev();
				} else if (direction === arrows.down) {
					rowToSelect = selectedRow.next();
				}

				return rowToSelect;
			}

			return {
				restrict: 'A',
				link: function (scope, element, attrs) {
					element.keydown(function (e) {
						var keyCode = e.keyCode;
						if (keyCode === arrows.up || keyCode === arrows.down) {
							moveFocus(e, element, keyCode);
						}
					});
				}
			};
		});
}());
