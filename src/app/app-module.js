(function () {
	'use strict';

	angular
		.module('__MODULE__', [
			'ngCookies',
			'ui.router',
			'pascalprecht.translate',
			'satellizer',

			'__MODULE__.app-templates',
			'__MODULE__.core',
			'__MODULE__.auth',
			'__MODULE__.home',
			'__MODULE__.movies'
		])
		.constant('CONFIG', window['__MODULE__'].CONFIG)
		.config(function ($logProvider) {
			$logProvider.debugEnabled(true);
		})
		.config(function (CONFIG, $authProvider) {
			$authProvider.signupUrl = CONFIG.api.url + '/auth/register';
			$authProvider.signupRedirect = '/';
			$authProvider.loginUrl = CONFIG.api.url + '/auth/login';
			$authProvider.loginRedirect = '/';
			$authProvider.logoutRedirect = '/';
			$authProvider.tokenPrefix = CONFIG.module; // Local Storage name prefix
		})
		.config(function ($httpProvider, CONFIG) {
			if (CONFIG.dev && CONFIG.dev.sendCredentials) {
				//$httpProvider.defaults.withCredentials = CONFIG.dev.sendCredentials;
			}
			$httpProvider.interceptors.push('HttpInterceptor');
		})
		.config(function (CONFIG, $urlRouterProvider) {
			$urlRouterProvider.otherwise('/' + CONFIG.defaults.state);
		})
		.config(function (CONFIG, $translateProvider) {
			$translateProvider.useStaticFilesLoader({
				prefix: 'app/i18n/locale-',
				suffix: '.json'
			});
			$translateProvider.preferredLanguage(CONFIG.defaults.locale);
			$translateProvider.useLocalStorage();
		})
		.run(function ($httpDecorator) {
			// Decorate $http with prebuilt API methods:
			$httpDecorator.decorate();
		});

	// Bootstrap angular:
	angular.element(document).ready(function () {
		angular.bootstrap(document, ['__MODULE__']);
	});
}());
