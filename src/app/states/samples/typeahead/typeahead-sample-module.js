(function () {
	'use strict';

	angular
		.module('__MODULE__.samples')
		.config(function ($stateProvider) {
			$stateProvider.state('samples.typeahead', {
				url: '/typeahead',
				templateUrl: 'samples/typeahead/typeahead-sample.tpl.html',
				controller: 'TypeaheadSampleController',
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
