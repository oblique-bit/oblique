(function () {
	'use strict';

	angular
		.module('__MODULE__.home', ['ui.router'])
		.config(function ($stateProvider) {
			$stateProvider.state('home', {
				url: '/home',
				templateUrl: 'home/home.tpl.html',
				controller: 'HomeController',
				data: {
					title: 'states.home.title'
				}
			});
		});
}());
