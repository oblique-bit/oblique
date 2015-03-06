(function () {
	'use strict';

	angular
		.module('__MODULE__.home')

		.controller('HomeController', function ($scope, $state) {
			$scope.query = null;

			$scope.search = function () {
				$state.go('movies', {
					query: $scope.query
				});
			};
		});
}());
