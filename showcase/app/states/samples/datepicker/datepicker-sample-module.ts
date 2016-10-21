import {DatepickerSampleController} from './datepicker-sample-controller';

export const DatepickerModule = '__MODULE__.samples.datepicker';

angular
	.module(DatepickerModule, [])
	.config(($stateProvider) => {
		$stateProvider.state('samples.datepicker', {
			url: '/datepicker',
			templateUrl: 'app/states/samples/datepicker/datepicker-sample.tpl.html',
			controller: 'datepickerSampleController',
			controllerAs: 'ctrl'
		});
	})
	.controller('datepickerSampleController', DatepickerSampleController);
