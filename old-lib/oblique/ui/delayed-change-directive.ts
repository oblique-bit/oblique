import {DelayedChangeDirectiveController} from './delayed-change-directive-controller';
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

	bindToController = {
		ngModel:'=',
		delayedChange:'&',
		delay:'@'
	};

	controller = DelayedChangeDirectiveController;
	controllerAs = 'orDelayedChangeCtrl';
}
