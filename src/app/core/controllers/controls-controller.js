(function () {
	'use strict';

	angular
		.module('__MODULE__.core')
		.controller('ControlsController', function (CONFIG, $scope, $translate) {
			$scope.currentLocale = CONFIG.defaults.locale;
			$scope.changeLocale = function (locale) {
				$scope.currentLocale = locale;
				$translate.use(locale);
			};
		});
}());
