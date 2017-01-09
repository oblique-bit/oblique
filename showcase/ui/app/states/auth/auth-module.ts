import {AuthController} from './auth-controller';

export const AuthModule = '__MODULE__.auth';

angular
	.module(AuthModule, ['ui.router'])
	.config(($stateProvider:ng.ui.IStateProvider) => {
		$stateProvider.state('auth', {
			url: '/auth',
			templateUrl: 'app/states/auth/auth.tpl.html',
			controller: 'authController',
			controllerAs: 'ctrl',
			data: {
				layout: {
					variant: 'no-navigation has-cover'
				}
			}
		});
	})
	.controller('authController', AuthController);
