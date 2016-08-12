(function () {
	'use strict';

	angular
		.module('__MODULE__.samples')
		.config(function ($stateProvider) {
			$stateProvider.state('samples.uiScroll', {
				url: '/ui-scroll',
				templateUrl: 'samples/ui-scroll/ui-scroll-sample.tpl.html',
				controller: 'UiScrollSampleController',
				resolve: {
					countries: function($http, notificationService) {
						return $http.api.get('/countries').catch(function() {
							notificationService.error('Unable to load countries from server!');
						});
					}
				}
			});
		});
}());
