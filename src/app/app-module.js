(function () {
	'use strict';

	angular
		.module('__MODULE__', [
			'ngAnimate',
			'ngSanitize',
			'ngCookies',
			'ui.router',
			'ui.bootstrap',
			'pascalprecht.translate',
			'satellizer',
			'angular-confirm',
			'angularjs-dropdown-multiselect',
			'dateParser',
			'checklist-model',
			'monospaced.elastic',

			'__MODULE__.app-templates',
			'__MODULE__.core',
			'__MODULE__.auth',
			'__MODULE__.home',
			'__MODULE__.movies',
			'__MODULE__.samples'
		])
		.constant('CONFIG', window['__MODULE__'].CONFIG)
		.config(function ($logProvider) {
			$logProvider.debugEnabled(true);
		})
		.config(function (CONFIG, $authProvider) {
			$authProvider.baseUrl = CONFIG.api.url;
			$authProvider.signupUrl = '/auth/register';
			$authProvider.signupRedirect = '/';
			$authProvider.loginUrl = '/auth/login';
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
		.config(function (CONFIG, datepickerConfig, datepickerPopupConfig) {
			datepickerConfig.showWeeks = false;
			datepickerConfig.startingDay = 1;
			datepickerPopupConfig.datepickerPopup = CONFIG.defaults.format && CONFIG.defaults.format.date ? CONFIG.defaults.format.date : 'dd.MM.yyyy';
			datepickerPopupConfig.showButtonBar = false;
		})
		.config(function (CONFIG, $translateProvider) {
			$translateProvider.useSanitizeValueStrategy('escaped');
			$translateProvider.useStaticFilesLoader({
				prefix: 'app/i18n/locale-',
				suffix: '.json'
			});
			$translateProvider.preferredLanguage(CONFIG.defaults.locale);
			$translateProvider.useLocalStorage();
		})
		.config(function (CONFIG, LoadingServiceProvider) {
			LoadingServiceProvider.setTimeout(CONFIG.defaults.http.timeout);
		})

		// Optional configuration
		// --------------------------------------------------------
		.config(function (schemaValidateConfig) {
			schemaValidateConfig.messageParsers.push(function(name, value, error, schema){
				return '* ' + error.message;
			});
		})

		// Run application
		// --------------------------------------------------------
		.run(function ($httpDecorator) {
			// Decorate $http with prebuilt API methods:
			$httpDecorator.decorate();
		});

	// Bootstrap angular:
	angular.element(document).ready(function () {
		angular.bootstrap(document, ['__MODULE__']);
	});
}());
