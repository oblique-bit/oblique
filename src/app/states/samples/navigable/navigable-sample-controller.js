(function () {
	'use strict';

	angular.module('__MODULE__.samples')
	.controller('NavigableSampleController', function ($scope, $timeout) {
		$scope.scientistsSelection = [];
		$scope.scientists = [
			{
				firstname : "Albert",
				lastname : "Einstein",
				birthdate : "14.03.1879"
			},
			{
				firstname : "Isaac",
				lastname : "Newton",
				birthdate : "04.01.1643"
			},
			{
				firstname : "Galileo",
				lastname : "Galilei",
				birthdate : "15.02.1564"
			}
		];

		// Set focus on first navigable list item:
		// FIXME: this should be set by ng-repeat or navigable:
		$timeout(function() {
			$('.list-group .list-group-item:nth-child(2)').focus();
		});
	});
}());
