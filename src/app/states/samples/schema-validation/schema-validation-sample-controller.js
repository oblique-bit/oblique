(function () {
	'use strict';

	angular.module('__MODULE__.samples')
	.controller('SchemaValidationSampleController', function ($scope, $state, schema, data, NotificationService) {
		$scope.sampleSchema = schema;
		$scope.data = data;

		$scope.save = function(form) {
			$scope.$broadcast('validationSchemaEvent');
			if(form.$valid) {
				NotificationService.success('Congratulations, form is valid!');
			}
		};
	});
}());
