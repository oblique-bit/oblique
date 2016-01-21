(function () {
	'use strict';

	angular
		.module('__MODULE__.samples')
		.config(function ($stateProvider) {
			$stateProvider.state('samples.uiScroll', {
				url: '/ui-scroll',
				templateUrl: 'app/states/samples/ui-scroll/ui-scroll-sample.tpl.html',
				controller: 'UiScrollSampleController',
				resolve: {
					countries: function($http, NotificationService) {
						return $http.api.get('/countries').catch(function() {
							NotificationService.error('Unable to load countries from server!');
						});
					}
				}
			});
		});
}());
