(function () {
	'use strict';

	angular
		.module('__MODULE__.core')
		.controller('StateController', function ($rootScope, $scope, $state) {
			$scope.currentState = '';
			$rootScope.$on('$stateChangeSuccess', function () {
				$scope.currentState = $state.current.name;
			});
		});
}());
