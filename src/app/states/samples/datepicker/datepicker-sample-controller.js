(function () {
	'use strict';

	angular.module('__MODULE__.samples')
		.controller('DatepickerSampleController', function ($scope, dateFilter, uibDatepickerPopupConfig, NotificationService) {
			$scope.data = {
				date: null,
				minMax: {
					date: null,
					min: moment().subtract(1, 'w').toDate(),
					max: moment().add(1, 'w').toDate()
				},
				range: {
					from: null,
					to: null
				},
				editable: {
					date: new Date(),
					enabled: false
				}
			};

			$scope.controls = {
				date: {
					today : function () {
						$scope.data.date = new Date();
					},
					toISO : function () {
						$scope.data.date = dateFilter(new Date(), uibDatepickerPopupConfig.modelAsIsoFormat);
					},
					toTimestamp: function () {
						$scope.data.date = Date.now();
					}
				},
				minMax: {
					invalidMin : function() {
						$scope.data.minMax.date = moment($scope.data.minMax.min).subtract(1, 'd').toDate();
					},
					invalidMax : function() {
						$scope.data.minMax.date = moment($scope.data.minMax.max).add(1, 'd').toDate();
					}
				},
				editable: {
					toggle: function() {
						$scope.data.editable.enabled = !$scope.data.editable.enabled;
					}
				}
			};

			$scope.check = function (form) {
				if (form.$valid) {
					NotificationService.success('Congratulations, form is valid!');
				}
			};
		});
}());
