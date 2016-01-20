(function () {
	'use strict';

	angular
		.module('__MODULE__.samples')
		.config(function ($stateProvider) {
			$stateProvider.state('samples.datepicker', {
				url: '/datepicker',
				templateUrl: 'samples/datepicker/datepicker-sample.tpl.html',
				controller: 'DatepickerSampleController'
			});
		});
}());
