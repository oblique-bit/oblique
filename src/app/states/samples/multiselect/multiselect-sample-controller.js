(function () {
	'use strict';

	angular.module('__MODULE__.samples')
		.controller('MultiselectSampleController', function ($scope) {
			$scope.dropdown = {
				model: [
					{"id":1, "label":"Dropdown item 1"}
				],
				translations: {
					allSelectedText:  "multiselect.allSelected"
				},
				settings: {
					scrollableHeight: 'auto',
					showCheckAll: true,
					showUncheckAll: true
				},
				options: [
					{"id":1, "label":"Dropdown item 1"},
					{"id":2, "label":"Dropdown item 2"},
					{"id":3, "label":"Dropdown item 3"},
					{"id":4, "label":"Dropdown item 4"},
					{"id":5, "label":"Dropdown item 5"}
				]
			};

			$scope.dropup = {
				model: [],
				settings: {
					scrollableHeight: '150px',
					scrollable: true,
					showCheckAll: false,
					showUncheckAll: false
				},
				options: [
					{"id":1, "label":"Dropup item 1"},
					{"id":2, "label":"Dropup item 2"},
					{"id":3, "label":"Dropup item 3"},
					{"id":4, "label":"Dropup item 4"},
					{"id":5, "label":"Dropup item 5"}
				]
			};
		});
}());
