(function () {
	'use strict';

	angular.module('__MODULE__.samples')
		.controller('SchemaValidationSampleController', function ($scope, $state, $filter, dateFilter, uibDatepickerPopupConfig, schema, data, NotificationService) {
			$scope.sampleSchema = schema;
			$scope.data = data;

			$scope.today = function () {
				$scope.data.date = new Date();
				$scope.data.minDate = moment($scope.data.date).subtract(1, 'd').toDate();
				$scope.data.maxDate = moment($scope.data.date).add(1, 'd').toDate();
			};

			$scope.toISO = function () {
				$scope.data.date = dateFilter(new Date(), uibDatepickerPopupConfig.modelAsIsoFormat);
				$scope.data.minDate = moment($scope.data.date).subtract(1, 'd').format('YYYY-MM-DD');
				$scope.data.maxDate = moment($scope.data.date).add(1, 'd').format('YYYY-MM-DD');
			};

			$scope.toTimestamp = function () {
				$scope.data.date = Date.now();
			};

			$scope.check = function (form) {
				$scope.$broadcast('validationSchemaEvent');
				if (form.$valid) {
					NotificationService.success('Congratulations, form is valid!');
				}
			};

			$scope.jsonSource = function (data) {
				return '<pre>' + $filter('json')(data) + '</pre>';
			};
		});
}());
