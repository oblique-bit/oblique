(function () {
    'use strict';

    var module = angular.module('__MODULE__.oblique');

    module.directive('navigable', function () {

        var arrows = {
            up: 38,
            down: 40
        };

        return {
            restrict: 'A',
            // TODO: refactor HTML markup (particularly <tr affair-report>) to avoid multiple isolated scopes
            //scope : {
            //    navigable: '=',
            //    navigableSelection: '=',
            //    navigableOnMove: '?&' // Triggered by holding CTRL + SHIFT + [UP, DOWN]
            //},
            link: function (scope, element, attrs) {

                // As we don't have an isolated scope, evaluate attributes to enable/access two-way & function expression binding :
                var model = scope.$eval(attrs.navigable);
                var navigableSelection = scope.$eval(attrs.navigableSelection);
                scope.navigableSelection = angular.isArray(navigableSelection) ? navigableSelection : [];
                var navigableOnMove = scope.$eval(attrs.navigableOnMove) || angular.noop;

                // Initialize elements:
                element.addClass('navigable');
                element.attr('tabindex', element.attr('tabindex') || 0); // Enables focus on current element.
                var container = element.closest('.navigable-group, body');

                /* Selection ************************ */
                var selection = {
                    add: function() {
                        if(!selection.contains(model)){
                            scope.$apply(function() {
                                scope.navigableSelection.push(model);
                            });
                        }
                    },
                    remove: function() {
                        scope.$apply(function() {
                            scope.navigableSelection.splice(scope.navigableSelection.indexOf(model), 1);
                        });
                    },
                    contains: function(item) {
                        return scope.navigableSelection.indexOf(item) > -1;
                    }
                };

                //scope.$parent.$watchCollection(attrs.navigableSelection, function() {
                //    console.log(selection.contains(model));
                //});

                /* Public API binding ************************ */
                scope.navigable = {
                    activate : function(target, combine, focus) {
                        scope.navigable.deactivate(scope.navigable.active());
                        scope.navigable.select(target, combine);
                        (target || element).addClass('navigable-active');

                        if(focus) {
                            //next.trigger('focus', [{navigable-focus: true}]); FIXME: uncomment and refactor when https://github.com/jquery/jquery/issues/2342
                            (target || element).data('navigable-focus', true).focus();
                        }
                    },
                    deactivate: function(target) {
                        (target || element).removeClass('navigable-active');
                    },
                    select: function(target, combine) {
                        if(!combine) {
                            scope.navigable.unselect(scope.navigable.selected());
                            scope.$apply(function() {
                                scope.navigableSelection.length = 0;
                            });
                        }
                        (target || element).addClass('navigable-selected');
                        selection.add();
                    },
                    unselect: function(target) {
                        (target || element).removeClass('navigable-selected');
                        selection.remove();
                    },
                    move: function(direction, combine) {
                        var items = scope.navigable.items();
                        var active = scope.navigable.active();
                        var index = items.index(active);
                        var next = null;

                        if(direction === arrows.up) {
                            next = items.eq(Math.max(index - 1, 0));
                        } else if (direction === arrows.down) {
                            next = items.eq(Math.min(index + 1, items.length));
                        }

                        if(next && next.length) {
                            next.hasClass('navigable-selected') && scope.navigable.unselect(active);

                            // Trigger focus on next item in order to ensure activation is performed within the right scope:
                            next.data('navigable-combine', combine).focus();
                        }
                    },
                    range: function(target) {
                        var items = scope.navigable.items();
                        var active = scope.navigable.active();
                        var from = items.index(active);
                        var to = items.index(target || element);
                        var slice = items.slice(Math.min(from, to), Math.max(from, to) + 1);

                        scope.navigable.activate(target || element, false, true);
                        slice.trigger('select.navigable', true);
                    },
                    active: function() {
                        return container.find('.navigable-active');
                    },
                    selected: function() {
                        return container.find('.navigable-selected');
                    },
                    items: function() {
                        return container.find('.navigable');
                    }
                };

                /* Event binding ************************ */

                element.keydown(function(event) {
                    var keyCode = event.keyCode;
                    if(keyCode === arrows.up || keyCode === arrows.down) {
                        var focused = element.find(':focus');
                        if(!focused.is('.dropdown-toggle') && (focused.parents('.dropdown-menu').length === 0)) {
                            event.preventDefault();
                            if(event.ctrlKey && event.shiftKey) {
                                scope.$apply(function() {
                                    navigableOnMove(event, model, keyCode === arrows.up);
                                });
                            } else {
                                scope.navigable.move(keyCode, event.ctrlKey || event.shiftKey);
                            }
                        }
                    }
                });

                // Using mousedown instead of click event to ensure it is triggered before focus event:
                element.mousedown(function (event) {
                    var canFocus = $(focusable(event.target));
                    if(!canFocus.length || canFocus.is(element)){
                        // Focus event may be triggered afterwards, ensure that handler gets notified:
                        element.data('navigable-focus', true);

                        // Check for modifier:
                        if(event && event.ctrlKey) {
                            if (!element.hasClass('navigable-selected')) {
                                scope.navigable.activate(element, true);
                            } else {
                                scope.navigable.deactivate(element);
                                scope.navigable.unselect(element);
                                event.preventDefault();
                                element.removeData('navigable-focus');
                            }
                        } else if(event && event.shiftKey) {
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

                element.focus(function (event) {
                    if(!element.data('navigable-focus')) {
                        scope.navigable.activate(element, element.data('navigable-combine'));
                    } else {
                        // Activation has already been performed by 'mousedown' event:
                        element.removeData('navigable-focus');
                    }
                });

                element.on('select.navigable', function (event, combine) {
                    scope.navigable.select(element, combine);
                });
            }
        };

    });

    /**
     * From jQuery UI: https://github.com/jquery/jquery-ui/blob/master/ui/core.js#L183
     *
     * @param element
     * @param isTabIndexNotNaN
     * @returns {*}
     */
    function focusable( element, isTabIndexNotNaN ) {
        var map, mapName, img,
            nodeName = element.nodeName.toLowerCase();
        if ( nodeName === "area" ) {
            map = element.parentNode;
            mapName = map.name;
            if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
                return false;
            }
            img = $( "img[usemap=#" + mapName + "]" )[0];
            return !!img && visible( img );
        }
        return ( /input|select|textarea|button|object/.test( nodeName ) ?
                !element.disabled :
                nodeName === "a" ?
                element.href || isTabIndexNotNaN :
                    isTabIndexNotNaN) &&
                // the element and all of its ancestors must be visible
            visible( element );
    }

    function visible( element ) {
        return $.expr.filters.visible( element ) &&
            !$( element ).parents().addBack().filter(function() {
                return $.css( this, "visibility" ) === "hidden";
            }).length;
    }
}());
