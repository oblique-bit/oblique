import {NavigableDirectiveController} from './navigable-directive-controller';

export class NavigableDirective implements ng.IDirective {
	require = 'navigable';
	restrict = 'A';

	// Do not request an isolated scope to avoid collisions with other directives!
	bindToController = {
		model: '=navigable',            // Model
		navigableSelection: '=',        // Array containing selected elements
		navigableActivate: '&?',        // Should the current element be activated (focused) by default?
		navigableHighlight: '&?',       // Should the current element be visually highlighted by default?
		navigableOnActivation: '&?',    // Triggered when an element is activated
		navigableOnMove: '&?'           // Triggered by holding CTRL + SHIFT + [UP, DOWN]
	};
	controller = NavigableDirectiveController;
	controllerAs = 'orNavigableController';

	constructor(private $timeout:ng.ITimeoutService) {
	}

	link = (scope, element, attrs, navigable:NavigableDirectiveController) => {

		let arrows = navigable.arrows;

		// Initialize elements:
		element.addClass('navigable');
		element.attr('tabindex', element.attr('tabindex') || 0); // Enables focus on current element.

		/* Event binding ******************** */
		element.keydown((event:JQueryKeyEventObject) => {
			let keyCode = event.keyCode;
			if (keyCode === arrows.up || keyCode === arrows.down) {
				let focused = element.find(':focus');
				if (!focused.is('.dropdown-toggle') && (focused.parents('.dropdown-menu').length === 0)) {
					event.preventDefault();
					if (event.ctrlKey && event.shiftKey) {
						scope.$apply(() => {
							navigable.navigableOnMove(event, navigable.model, keyCode === arrows.up);
						});
					} else {
						navigable.move(keyCode, event.ctrlKey || event.shiftKey);
					}
				}
			}
		});

		// Using mousedown instead of click event to ensure it is triggered before focus event:
		element.mousedown((event:JQueryKeyEventObject) => {
			let canFocus = $(this.focusable(event.target));
			if (!canFocus.length || canFocus.is(element)) {
				// Focus event may be triggered afterwards, ensure that handler gets notified:
				element.data('navigable-focus', true);

				// Check for modifier:
				if (event && event.ctrlKey) {
					if (!element.hasClass('navigable-selected')) {
						navigable.activate(element, true);
					} else {
						navigable.deactivate(element);
						navigable.unselect(element);
						event.preventDefault();
						element.removeData('navigable-focus');
					}
				} else if (event && event.shiftKey) {
					event.preventDefault();
					navigable.range(element);
				} else {
					navigable.activate(element);
				}
			} else {
				// Focus is on a child element of current item but let's ensure it gets activated:
				if (!element.hasClass('navigable-selected')) {
					navigable.activate(element, event.ctrlKey);
				}
			}
		});

		element.focus((event) => {
			if (!element.data('navigable-focus')) {
				navigable.activate(element, element.data('navigable-combine'));
			} else {
				// Activation has already been performed by 'mousedown' event:
				element.removeData('navigable-focus');
			}
		});

		element.on('select.navigable', (event, combine) => {
			navigable.select(element, combine);
		});

		/* Initialization ******************* */
		if (navigable.navigableHighlight && scope.$eval(navigable.navigableHighlight)) {
			this.$timeout(() => {
				// Highlight element by selecting (with combination) it:
				navigable.select(element, true);
				element.addClass('navigable-highlight');
			});
		}

		if (navigable.navigableActivate && scope.$eval(navigable.navigableActivate)) {
			// Manually perform focus in order to activate the element and ensure it scrolls
			// into view (if contained within a scrollable parent):
			this.$timeout(() => element.focus());
		}
	};

	/**
	 * From jQuery UI: https://github.com/jquery/jquery-ui/blob/master/ui/focusable.js#L28
	 *
	 * @param element
	 * @param hasTabindex
	 * @returns {*}
	 */
	private focusable(element) {
		let map, mapName, img, focusableIfVisible, fieldset,
			nodeName = element.nodeName.toLowerCase();
		if (nodeName === "area") {
			map = element.parentNode;
			mapName = map.name;
			if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
				return false;
			}
			img = $("img[usemap='#" + mapName + "']");
			return img.length > 0 && img.is(":visible");
		}

		if(/^(input|select|textarea|button|object)$/.test(nodeName)) {
			focusableIfVisible = !element.disabled;

			if(focusableIfVisible) {
				// Form controls within a disabled fieldset are disabled.
				// However, controls within the fieldset's legend do not get disabled.
				// Since controls generally aren't placed inside legends, we skip
				// this portion of the check.
				fieldset = $(element).closest("fieldset")[0];
				if ( fieldset ) {
					focusableIfVisible = !fieldset.disabled;
				}
			}
		} else if ( "a" === nodeName ) {
			focusableIfVisible = element.href || $(element).attr('tabindex');
		} else {
			focusableIfVisible = $(element).attr('tabindex');
		}

		return focusableIfVisible && $(element).is(":visible") && this.visible($(element));
	}

	// Support: IE 8 only
	// IE 8 doesn't resolve inherit to visible/hidden for computed values
	private visible(element) {
		let visibility = element.css("visibility");
		while (visibility === "inherit") {
			element = element.parent();
			visibility = element.css("visibility");
		}
		return visibility !== "hidden";
	}
}
