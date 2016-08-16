//TODO: needs refactoring

export class NavigableDirective implements ng.IDirective {
    restrict = 'A';

    // Do not request an isolated scope to avoid collisions with other directives!
    //scope : {
    //    navigable: '=', // Model
    //    navigableSelection: '=', // Array containing selected elements
    //    navigableActivate: '&?' // Should the current element be activated (focused) by default?
    //    navigableHighlight: '&?' // Should the current element be visually highlighted by default?
    //    navigableOnActivation: '&?' // Triggered when an element is activated
    //    navigableOnMove: '&?' // Triggered by holding CTRL + SHIFT + [UP, DOWN]
    //},


    private arrows = {
        up: 38,
        down: 40
    };

    constructor(private $parse:ng.IParseService,
                private $timeout:ng.ITimeoutService) {

    }

    link = (scope, element, attrs) => {
        // As we don't have an isolated scope, evaluate attributes to enable/access two-way & function expression binding :
        let model = scope.$eval(attrs.navigable);
        let navigableSelection = scope.$eval(attrs.navigableSelection);
        scope.navigableSelection = angular.isArray(navigableSelection) ? navigableSelection : [];
        let navigableOnActivation = this.$parse(attrs.navigableOnActivation) || angular.noop;
        let navigableOnMove = scope.$eval(attrs.navigableOnMove) || angular.noop;

        // Initialize elements:
        element.addClass('navigable');
        element.attr('tabindex', element.attr('tabindex') || 0); // Enables focus on current element.

        /* Selection ************************ */
        let selection = {
            add: () => {
                if (!selection.contains(model)) {
                    scope.$apply(() => {
                        scope.navigableSelection.push(model);
                    });
                }
            },
            remove: () => {
                scope.$apply(() => {
                    scope.navigableSelection.splice(scope.navigableSelection.indexOf(model), 1);
                });
            },
            contains: (item) => {
                return scope.navigableSelection.indexOf(item) > -1;
            }
        };

        /* Public API binding *************** */
        scope.navigable = {
            activate: (target, combine, focus) => {
                scope.navigable.deactivate(scope.navigable.active());
                scope.navigable.select(target, combine);
                (target || element).addClass('navigable-active');

                if (focus) {
                    //FIXME: uncomment and refactor when https://github.com/jquery/jquery/issues/2342
                    //next.trigger('focus', [{navigable-focus: true}]);
                    (target || element).data('navigable-focus', true).focus();
                }

                scope.$apply(() => {
                    navigableOnActivation(scope, model);
                });
            },
            deactivate: (target) => {
                (target || element).removeClass('navigable-active');
            },
            select: (target, combine) => {
                if (!combine) {
                    scope.navigable.unselect(scope.navigable.selected());
                    scope.$apply(() => {
                        scope.navigableSelection.length = 0;
                    });
                }
                (target || element).addClass('navigable-selected');
                selection.add();
            },
            unselect: (target) => {
                (target || element).removeClass('navigable-selected navigable-highlight');
                selection.remove();
            },
            move: (direction, combine) => {
                let items = scope.navigable.items();
                let active = scope.navigable.active();
                let index = items.index(active);
                let next = null;

                if (direction === this.arrows.up) {
                    next = items.eq(Math.max(index - 1, 0));
                } else if (direction === this.arrows.down) {
                    next = items.eq(Math.min(index + 1, items.length));
                }

                if (next && next.length) {
                    if(next.hasClass('navigable-selected')) {
                        scope.navigable.unselect(active);
                    }


                    // Trigger focus on next item in order to ensure activation is performed within the right scope:
                    next.data('navigable-combine', combine).focus();
                }
            },
            range: (target) => {
                let items = scope.navigable.items();
                let active = scope.navigable.active();
                let from = items.index(active);
                let to = items.index(target || element);
                let slice = items.slice(Math.min(from, to), Math.max(from, to) + 1);

                scope.navigable.activate(target || element, false, true);
                slice.trigger('select.navigable', true);
            },
            active: () => {
                return scope.navigable.container().find('.navigable-active');
            },
            selected: () => {
                return scope.navigable.container().find('.navigable-selected');
            },
            items: () => {
                return scope.navigable.container().find('.navigable');
            },
            container: () => {
                // Container is retrieved on-demand to ensure `element` has been already attached to DOM:
                return element.closest('.navigable-group, body');
            }
        };

        /* Event binding ******************** */
        element.keydown((event) => {
            let keyCode = event.keyCode;
            if (keyCode === this.arrows.up || keyCode === this.arrows.down) {
                let focused = element.find(':focus');
                if (!focused.is('.dropdown-toggle') && (focused.parents('.dropdown-menu').length === 0)) {
                    event.preventDefault();
                    if (event.ctrlKey && event.shiftKey) {
                        scope.$apply(() => {
                            navigableOnMove(event, model, keyCode === this.arrows.up);
                        });
                    } else {
                        scope.navigable.move(keyCode, event.ctrlKey || event.shiftKey);
                    }
                }
            }
        });

        // Using mousedown instead of click event to ensure it is triggered before focus event:
        element.mousedown((event) => {
            let canFocus = $(this.focusable(event.target));
            if (!canFocus.length || canFocus.is(element)) {
                // Focus event may be triggered afterwards, ensure that handler gets notified:
                element.data('navigable-focus', true);

                // Check for modifier:
                if (event && event.ctrlKey) {
                    if (!element.hasClass('navigable-selected')) {
                        scope.navigable.activate(element, true);
                    } else {
                        scope.navigable.deactivate(element);
                        scope.navigable.unselect(element);
                        event.preventDefault();
                        element.removeData('navigable-focus');
                    }
                } else if (event && event.shiftKey) {
                    event.preventDefault();
                    scope.navigable.range(element);
                } else {
                    scope.navigable.activate(element);
                }
            } else {
                // Focus is on a child element of current item but let's ensure it gets activated:
                if (!element.hasClass('navigable-selected')) {
                    scope.navigable.activate(element, event.ctrlKey);
                }
            }
        });

        element.focus((event) => {
            if (!element.data('navigable-focus')) {
                scope.navigable.activate(element, element.data('navigable-combine'));
            } else {
                // Activation has already been performed by 'mousedown' event:
                element.removeData('navigable-focus');
            }
        });

        element.on('select.navigable', (event, combine) => {
            scope.navigable.select(element, combine);
        });

        /* Initialization ******************* */
        if (attrs.navigableHighlight && scope.$eval(attrs.navigableHighlight)) {
            this.$timeout(() => {
                // Highlight element by selecting (with combination) it:
                scope.navigable.select(element, true);
                element.addClass('navigable-highlight');
            });
        }

        if (attrs.navigableActivate && scope.$eval(attrs.navigableActivate)) {
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
        return $.expr.filters.visible(element) && !$(element).parents().addBack().filter(function() {
                //Typings are failing
                return (<any>$).css(this,'visibility') === 'hidden';
            }).length;
    }
}



