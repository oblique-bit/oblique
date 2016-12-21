import {SupportController} from './support-controller';

export const SupportModule = '__MODULE__.support';

angular
	.module(SupportModule, ['ui.router'])
	.controller('supportController', SupportController)
	.config(($stateProvider:ng.ui.IStateProvider) => {
		$stateProvider.state('support', {
			url: '/support',
			templateUrl: 'app/states/support/support.tpl.html',
			controller: 'supportController',
			controllerAs: 'ctrl'
		});
	});
