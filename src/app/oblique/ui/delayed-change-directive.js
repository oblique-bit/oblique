/**
 * Enrich an input field with a delayed callback when its model changes.
 * Example:
 *
 * <input type="text" ng-model="query" delayed-change="filter()" delay="750">
 *
 * When the value of the input field changes (i.e. the query value) then the callback
 * filter() is fired with a delay of 750 milliseconds.
 */
(function () {

    'use strict';

    var module = angular.module('__MODULE__.oblique');

    module.directive('delayedChange', function () {

        var defaultDelay = 500;

        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                ngModel: '=',
                delayedChange: '&'
            },
            link: function (scope, element, attrs) {
                var timeout = null,
                    delay = (attrs.delay && parseInt(attrs.delay, 10)) || defaultDelay;

                scope.$watch('ngModel', function (newValue, oldValue) {
                    if (!angular.equals(newValue, oldValue)) {
                        (timeout && window.clearTimeout(timeout));
                        timeout = window.setTimeout(function () {
                            scope.delayedChange();
                        }, delay);
                    }
                }, true);
            }
        };

    });
}());
