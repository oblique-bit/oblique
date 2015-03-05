(function () {
	'use strict';

	angular
		.module('__MODULE__.core')
		.controller('TableController', function ($scope) {
			$scope.selectedRow = -1;
			$scope.selectRow = function (rowIndex) {
				$scope.selectedRow = rowIndex;
			};
		});
}());
