(function () {
	'use strict';

	angular.module('__MODULE__.samples')
		.controller('TypeaheadSampleController', function ($scope, NotificationService, countries) {
			$scope.selection = null;
			$scope.countries = countries;

			$scope.search = function () {
				if ($scope.selection && $scope.selection.name) {
					NotificationService.success('Selected country: ' + $scope.selection.name);
				}
			};

			$scope.onSelect = function ($item, $model, $label) {
				console.log(arguments);
			};
		});
}());
