(function () {
	'use strict';

	angular
		.module('__MODULE__.core')
		.controller('NavigationController', function (CONFIG, $scope) {
			$scope.currentState = CONFIG.defaults.state;
			$scope.selectState = function (state) {
				$scope.currentState = state;
			};
		});
}());
