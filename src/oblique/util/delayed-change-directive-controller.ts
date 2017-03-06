export class DelayedChangeDirectiveController implements ng.IComponentController {
	ngModel;
	delayedChange;
	delay;

	private defaultDelay = 500;

	/*@ngInject*/
	constructor(private $scope) {
	}

	$onInit() {
		let timeout = null;
		let delay = (this.delay && parseInt(this.delay, 10)) || this.defaultDelay;

		this.$scope.$watch('orDelayedChangeCtrl.ngModel', (newValue, oldValue) => {
			if (!angular.equals(newValue, oldValue)) {

				if (timeout) {
					window.clearTimeout(timeout);
				}
				// TODO preventing $digest?
				timeout = window.setTimeout(() => {
					this.delayedChange();
				}, delay);
			}
		}, true);
	}
}
