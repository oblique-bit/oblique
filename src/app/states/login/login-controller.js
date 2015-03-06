(function () {
	'use strict';

	angular
		.module('__MODULE__.login')

		.controller('LoginController', function ($scope, $state) {

			$scope.login = function () {

				$state.go('home', {
					query: $scope.query
				});
			};
		});
}());
