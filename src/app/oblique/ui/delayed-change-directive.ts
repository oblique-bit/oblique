/**
 * Enrich an input field with a delayed callback when its model changes.
 * Example:
 *
 * <input type='text' ng-model='query' delayed-change='filter()' delay='750'>
 *
 * When the value of the input field changes (i.e. the query value) then the callback
 * filter() is fired with a delay of 750 milliseconds.
 */
export class DelayedChangeDirective implements ng.IDirective {
    restrict = 'A';
    require = 'ngModel';
    scope = {};

    bindToController:{
        ngModel:'=',
        delayedChange:'&',
        delay:'@'
    };

    controller:DelayedChangeDirectiveController;
    controllerAs:'ctrl';
}

export class DelayedChangeDirectiveController {
    ngModel;
    delayedChange;
    delay;

    private defaultDelay = 500;

    /*@ngInject*/
    constructor($scope) {
        let timeout = null;
        let delay = (this.delay && parseInt(this.delay, 10)) || this.defaultDelay;

        $scope.$watch('ngModel', (newValue, oldValue) => {
            if (!angular.equals(newValue, oldValue)) {

                if(timeout) {
                    window.clearTimeout(timeout);
                }
                // preventing $digest ?
                timeout = window.setTimeout(() => {
                    this.delayedChange();
                }, delay);
            }
        }, true);
    }
}
