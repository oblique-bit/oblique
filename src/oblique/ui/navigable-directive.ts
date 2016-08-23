import {NavigableDirectiveController} from './navigable-directive-controller';

export class NavigableDirective implements ng.IDirective {
    require = 'navigable';
    restrict = 'A';

    // Do not request an isolated scope to avoid collisions with other directives!
    bindToController = {
        model:'=navigable', // Model
        navigableSelection:'=', // Array containing selected elements
        navigableActivate:'&?', // Should the current element be activated (focused) by default?
        navigableHighlight:'&?', // Should the current element be visually highlighted by default?
        navigableOnActivation:'&?', // Triggered when an element is activated
        navigableOnMove:'&?' // Triggered by holding CTRL + SHIFT + [UP, DOWN]
    };
    controller = NavigableDirectiveController;
    controllerAs = 'navigableController';

    constructor(private $timeout:ng.ITimeoutService) {

    }

    //TODO: discuss splitting
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
        if (navigable.navigableHighlight) {
            this.$timeout(() => {
                // Highlight element by selecting (with combination) it:
                navigable.select(element, true);
                element.addClass('navigable-highlight');
            });
        }

        if (navigable.navigableActivate) {
            // Manually perform focus in order to activate the element and ensure it scrolls
            // into view (if contained within a scrollable parent):
            this.$timeout(() => element.focus());
        }
    };

    /**
     * From jQuery UI: https://github.com/jquery/jquery-ui/blob/master/ui/core.js#L183
     *
     * @param element
     * @param isTabIndexNotNaN
     * @returns {*}
     */
    private focusable(element, isTabIndexNotNaN?) {
        let map, mapName, img,
            nodeName = element.nodeName.toLowerCase();
        if (nodeName === 'area') {
            map = element.parentNode;
            mapName = map.name;
            if (!element.href || !mapName || map.nodeName.toLowerCase() !== 'map') {
                return false;
            }
            img = $('img[usemap=#' + mapName + ']')[0];
            return !!img && this.visible(img);
        }
        return ( /input|select|textarea|button|object/.test(nodeName) ?
                !element.disabled :
                nodeName === 'a' ?
                element.href || isTabIndexNotNaN :
                    isTabIndexNotNaN) &&
            // the element and all of its ancestors must be visible
            this.visible(element);
    }

    private visible(element) {
        return $.expr.filters.visible(element) && !$(element).parents().addBack().filter(function () {
                //Typings are failing
                return (<any>$).css(this, 'visibility') === 'hidden';
            }).length;
    }
}



