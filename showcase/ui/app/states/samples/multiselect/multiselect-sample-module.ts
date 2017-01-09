import {MultiselectSampleController} from './multiselect-sample-controller';

export const MultiselectModule = '__MODULE__.samples.multiselect';

angular
	.module(MultiselectModule, [])
	.config(($stateProvider) => {
		$stateProvider.state('samples.multiselect', {
			url: '/multiselect',
			templateUrl: 'app/states/samples/multiselect/multiselect-sample.tpl.html',
			controller: 'multiselectSampleController',
			controllerAs: 'ctrl'
		});
	})
	.controller('multiselectSampleController', MultiselectSampleController);

