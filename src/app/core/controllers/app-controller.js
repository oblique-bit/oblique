/* global angular */
(function () {
	"use strict";

	angular.module('__MODULE__.core')
		.controller('AppController', function ($scope, $rootScope, $location, $state, $log, $translate, LoadingService) {
			var ctrl = this;
			var LOG = $log.getInstance('AppController - $stateChangeError');

			ctrl.spinner = LoadingService.loading;
			ctrl.datepickers = {};
			ctrl.toggleDatepicker = function ($event, datepickerName) {
				$event.preventDefault();
				$event.stopPropagation();
				ctrl.datepickers[datepickerName] = ctrl.datepickers[datepickerName] ? false : true;
			};

			$scope.$state = $state;

			$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
				if (toState.resolve) {
					ctrl.spinner.active = true;
				}
			});

			$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
				// Scroll to top of page on state change:
				$("html, body").animate({scrollTop: 0}, 0);

				ctrl.layout = toState.data && toState.data.layout ? toState.data.layout : 'default';
				ctrl.pageTitle = toState.data && toState.data.title ? toState.data.title : 'states.' + toState.name + '.title';
				ctrl.spinner.active = false;
			});

			$rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
				LOG.error(error);
				ctrl.spinner.active = false;
				$state.reload(fromState);
			});
		});
}());
