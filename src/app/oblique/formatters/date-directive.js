(function () {
	'use strict';

	var module = angular.module('__MODULE__.oblique');

	module.directive('date', function () {
		return {
			restrict: 'E',
			scope: {
				date: '=date'
			},
			template: '{{ date | date : \'dd.MM.yyyy\'}}'
		};
	});
}());
