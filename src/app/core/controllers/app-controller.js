/* global angular */
(function () {
	"use strict";

	angular.module('__MODULE__.core')
		.controller('AppController', function (CONFIG, $scope, $rootScope, $location, $state, $log, $translate, LoadingService) {
			var ctrl = this;
			var LOG = $log.getInstance('AppController');

			// Global properties:
			ctrl.spinner = LoadingService.loading;
			ctrl.page = {
				title: '',
				description: CONFIG.description || '',
				layout: CONFIG.defaults.layout || 'default'
			};
			ctrl.locale = {
				current : CONFIG.defaults.locale || 'en',
				use: function (locale) {
					$translate.use(locale);
				}
			};

			// Global events handling:
			$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
				if (toState.resolve) {
					ctrl.spinner.active = true;
				}
			});

			$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
				// Scroll to top of page on state change:
				$("html, body").animate({scrollTop: 0}, 0);

				ctrl.page.title = toState.data && toState.data.title ? toState.data.title : 'states.' + toState.name + '.title';
				ctrl.page.description = toState.data && toState.data.description ? toState.data.description : (CONFIG.description || '');
				ctrl.page.layout = toState.data && toState.data.layout ? toState.data.layout : 'default';
				ctrl.spinner.active = false;
			});

			$rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
				LOG.error(error);
				ctrl.spinner.active = false;
				$state.reload(fromState);
			});

			$rootScope.$on('$translateChangeSuccess', function (event, data) {
				ctrl.locale.current = data.language;
			});
		});
}());
