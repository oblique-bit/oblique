(function () {
	'use strict';

	angular.module('__MODULE__.samples')
	.controller('SchemaValidationSampleController', function ($scope, $state, $filter, schema, data, NotificationService) {
		$scope.sampleSchema = schema;
		$scope.data = data;

		$scope.today = function() {
			$scope.data.date = new Date();
		};

		$scope.toISO = function() {
			$scope.data.date = (new Date()).toISOString();
		};

		$scope.toTimestamp = function() {
			$scope.data.date = Date.now();
		};

		$scope.save = function(form) {
			$scope.$broadcast('validationSchemaEvent');
			if(form.$valid) {
				NotificationService.success('Congratulations, form is valid!');
			}
		};

		$scope.jsonSource = function(data) {
			return '<pre>' + $filter('json')(data) + '</pre>';
		};
	});
}());
