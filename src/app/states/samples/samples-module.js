(function () {
	'use strict';

	angular
		.module('__MODULE__.samples', ['ui.router'])
		.config(function ($stateProvider) {
			$stateProvider.state('samples', {
				url: '/samples',
				abstract: true,
				template: '<div ui-view />'
			});
		});
}());
