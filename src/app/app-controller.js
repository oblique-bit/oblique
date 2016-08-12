/* global angular */
(function () {
	"use strict";

	angular.module('__MODULE__')
		.controller('AppController', function (CONFIG, $scope, $rootScope, $state, $translate, $sce, $log, tmhDynamicLocale, authService, LoadingService, notificationService) {
			var $this = this;
			var LOG = $log.getInstance('AppController');

			// Global properties:
			$this.context = authService.context;
			$this.spinner = LoadingService.loading;
			$this.title = CONFIG.title;
			$this.page = {
				layout: {},
				title: '',
				description: CONFIG.description || ''
			};
			$this.locale = {
				current: CONFIG.defaults.locale || 'en',
				use: function (locale) {
					$translate.use(locale);
				}
			};

			// Global actions:
			$this.isAuthenticated = function () { return authService.isAuthenticated()};
			$this.isAuthorized = function () { return authService.isAuthorized()};
			$this.logout = function () { return authService.logout()};

			// Global events handling:
			$rootScope.$on('$httpInterceptorError', function (event, response) {
				if (response.data && response.data.errors) {
					event.preventDefault();
					response.data.errors.forEach(function (error, index) {
						notificationService.add(error.severity, 'error.business.' + error.messageKey);
					});
				}
			});

			$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
				notificationService.clear();
				if (toState.resolve) {
					$this.spinner.active = true;
				}
			});

			$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
				$this.page.layout = toState.data && toState.data.layout ? toState.data.layout : {};
				$this.page.title = toState.data && toState.data.title ? toState.data.title : 'states.' + toState.name + '.title';
				$this.page.description = toState.data && toState.data.description ? toState.data.description : (CONFIG.description || '');
				$this.spinner.active = false;
			});

			$rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
				LOG.error(error);
				$this.spinner.active = false;
				$state.reload(fromState);
			});

			$rootScope.$on('$translateChangeSuccess', function (event, data) {
				tmhDynamicLocale.set(data.language);
				$this.locale.current = data.language;
			});

			// Scope-related
			// ------------------------------------------------

			// Utilities:
			$scope.safeHtml = function (html) {
				return $sce.trustAsHtml(html);
			};

			// Try to resolve & authenticate user, if any:
			// FIXME: this should be resolved in another way, cf: https://github.com/angular/angular.js/issues/5854
			authService.resolve();
		});
}());
