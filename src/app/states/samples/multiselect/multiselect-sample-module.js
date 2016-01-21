(function () {
	'use strict';

	angular
		.module('__MODULE__.samples')
		.config(function ($stateProvider) {
			$stateProvider.state('samples.multiselect', {
				url: '/multiselect',
				templateUrl: 'app/states/samples/multiselect/multiselect-sample.tpl.html',
				controller: 'MultiselectSampleController'
			});
		});
}());
