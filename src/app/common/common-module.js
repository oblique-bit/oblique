(function () {
	'use strict';

	angular.module('__MODULE__.common', [])
		.filter("asDate", ['$filter', function ($filter) {
			return function (input) {
				return input ? $filter('date')(new Date(input), 'dd.MM.yyyy') : input;
			};
		}])
		.filter("asLongDate", ['$filter', function ($filter) {
			return function (input) {
				return input ? $filter('date')(new Date(input), 'EEEE d MMMM yyyy') : input;
			};
		}])
		.filter("asMediumDate", ['$filter', function ($filter) {
			return function (input) {
				return input ? $filter('date')(new Date(input), 'EEE, d MMM yyyy') : input;
			};
		}])
		.filter("asLongMonth", ['$filter', function ($filter) {
			return function (input) {
				return input ? $filter('date')(new Date(input), 'MMMM yyyy') : input;
			};
		}])
		.filter("asDateTime", ['$filter', function ($filter) {
			return function (input) {
				return input ? $filter('date')(new Date(input), 'dd.MM.yyyy HH:mm') : input;
			};
		}]);
}());
