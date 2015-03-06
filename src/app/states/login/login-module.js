(function () {
	'use strict';

	angular
		.module('__MODULE__.login', ['ui.router'])
		.config(function ($stateProvider) {
			$stateProvider.state('login', {
				url: '/login',
				templateUrl: 'login/login.tpl.html',
				controller: 'LoginController',
				data: {
					title: 'states.login.title',
					layout: 'cover'
				}
			});
		});
}());
