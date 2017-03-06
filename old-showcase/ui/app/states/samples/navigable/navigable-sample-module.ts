import {NavigableSampleController} from './navigable-sample-controller';

export const NavigableModule = '__MODULE__.samples.navigable';
angular
	.module(NavigableModule, [])
	.config(($stateProvider) => {
		$stateProvider.state('samples.navigable', {
			url: '/navigable',
			templateUrl: 'app/states/samples/navigable/navigable-sample.tpl.html',
			controller: 'navigableSampleController',
			controllerAs: 'ctrl'
		});
	})
	.controller('navigableSampleController', NavigableSampleController);

