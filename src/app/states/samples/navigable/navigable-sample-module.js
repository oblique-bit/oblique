(function () {
	'use strict';

	angular
		.module('__MODULE__.samples')
		.config(function ($stateProvider) {
			$stateProvider.state('samples.navigable', {
				url: '/navigable',
				templateUrl: 'samples/navigable/navigable-sample.tpl.html',
				controller: 'NavigableSampleController'
			});
		});
}());
