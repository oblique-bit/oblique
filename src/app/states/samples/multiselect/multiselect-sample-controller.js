(function () {
	'use strict';

	angular.module('__MODULE__.samples')
		.controller('MultiselectSampleController', function ($scope, NotificationService) {

			$scope.exampledModel = [];

			$scope.exampleTranslate = {
				allSelectedText:  "multiselect.allSelected"
			};

			$scope.exampleSettings = {
				buttonClasses: "btn btn-default btn-block text-left",
				scrollableHeight: '500px',
				scrollable: true,
				showCheckAll: true,
				showUncheckAll: true
			};

			$scope.exampleData = [
				{"id":1, "label":"Label 1"},
				{"id":2, "label":"Label 2"},
				{"id":3, "label":"Label 3"},
				{"id":4, "label":"Label 4"},
				{"id":5, "label":"Label 5"}
			];
		});
}());
