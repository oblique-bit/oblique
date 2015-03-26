(function () {
	'use strict';

	angular
		.module('__MODULE__.auth', ['ui.router'])
		.config(function ($stateProvider) {
			$stateProvider.state('auth', {
				url: '/auth',
				templateUrl: 'auth/auth.tpl.html',
				controller: 'AuthController',
				data: {
					layout: 'cover'
				}
			});
		});
}());
