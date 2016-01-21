(function () {
	'use strict';

	angular
		.module('__MODULE__.auth', ['ui.router'])
		.config(function ($stateProvider) {
			$stateProvider.state('auth', {
				url: '/auth',
				templateUrl: 'app/states/auth/auth.tpl.html',
				controller: 'AuthController',
				data: {
					layout: {
						variant: 'no-navigation has-cover'
					}
				}
			});
		});
}());
