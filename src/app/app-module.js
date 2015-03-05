(function () {
	'use strict';

	angular
		.module('__MODULE__', [
			'ui.router',
			'pascalprecht.translate',

			'__MODULE__.app-templates',
			'__MODULE__.core',
			'__MODULE__.home',
			'__MODULE__.movies'
		])
		.constant('CONFIG', window['__MODULE__'].CONFIG)
		.config(function ($logProvider) {
			$logProvider.debugEnabled(true);
		})
		.config(function ($httpProvider, CONFIG) {
			if (CONFIG.dev && CONFIG.dev.sendCredentials) {
				$httpProvider.defaults.withCredentials = CONFIG.dev.sendCredentials;
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
		})
		.run(function ($rootScope, $httpDecorator) {

			$rootScope.state = $rootScope.state || {};

			$rootScope.$on('$stateChangeSuccess', function (event, current/*, previous*/) {
				// Esure current state metadata is available globally:
				$rootScope.state.name = current.name;
				$rootScope.state.title = current.title;

				// Ensure start of injected content is visible:
				document.documentElement.scrollTop = 0;
			});

			// Decorate $http with prebuilt API methods:
			$httpDecorator.decorate();
		});

	// Bootstrap angular:
	angular.element(document).ready(function () {
		angular.bootstrap(document, ['__MODULE__']);
	});
}());
