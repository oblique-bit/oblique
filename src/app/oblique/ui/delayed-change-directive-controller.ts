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