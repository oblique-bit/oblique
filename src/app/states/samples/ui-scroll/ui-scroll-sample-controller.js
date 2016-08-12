(function () {
	'use strict';

	angular.module('__MODULE__.samples')
		.controller('UiScrollSampleController', function ($scope, $timeout, $rootScope, $location, $http, notificationService, countries) {
			$scope.countries = countries;
			$scope.selection = [];
			$scope.datasource = {
				get : function(index, count, success) {
					var from = index - 1;
					var to = from + count;
					var result = countries.slice(from, to);
					return success(result);
				}
			};

			$scope.datasourceAdapter = {
				remain: true
			};

			$scope.remove = function (country) {
				_.remove($scope.countries, country);
				$scope.datasourceAdapter.applyUpdates(function(item, scope) {
					if(item.code === country.code) {
						return [];
					}
				});
				notificationService.success('Country removed: ' + country.name);
			};
		});
}());
