/* global angular */
(function () {
	"use strict";

	angular.module('__MODULE__')
		.controller('AppController', function (CONFIG, $scope, $rootScope, $state, $translate, $sce, $log, tmhDynamicLocale, AuthService, LoadingService, NotificationService) {
			var $this = this;
			var LOG = $log.getInstance('AppController');

			// Global properties:
			$this.context = AuthService.context;
			$this.spinner = LoadingService.loading;
			$this.title = CONFIG.title;
			$this.page = {
				title: '',
				description: CONFIG.description || '',
				layout: CONFIG.defaults.layout || 'default'
			};
			$this.locale = {
				current: CONFIG.defaults.locale || 'en',
				use: function (locale) {
					$translate.use(locale);
				}
			};

			// Global actions:
			$this.isAuthenticated = AuthService.isAuthenticated;
			$this.isAuthorized = AuthService.isAuthorized;
			$this.logout = AuthService.logout;

			// Global events handling:
			$rootScope.$on('$httpInterceptorError', function (event, response) {
				if (response.data && response.data.errors) {
					event.preventDefault();
					response.data.errors.forEach(function (error, index) {
						NotificationService.add(error.severity, 'error.business.' + error.messageKey);
					});
				}
			});

			$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
				NotificationService.clear();
				if (toState.resolve) {
					$this.spinner.active = true;
				}
			});

			$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
				// Scroll to top of page on state change:
				$('html, body').animate({scrollTop: 0}, 0);

				$this.page.title = toState.data && toState.data.title ? toState.data.title : 'states.' + toState.name + '.title';
				$this.page.description = toState.data && toState.data.description ? toState.data.description : (CONFIG.description || '');
				$this.page.layout = toState.data && toState.data.layout ? toState.data.layout : 'default';
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
			AuthService.resolve();
		});
}());
