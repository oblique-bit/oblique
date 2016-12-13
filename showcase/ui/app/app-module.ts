// TODO: remove this, as soon as typescript 2 is supported by IntelliJ
// Fixes the types
/// <reference path="../../../typings/index.d.ts" />

// Load the ObliqueReactive module:
import {
	ObliqueModule,
	LoadingServiceProvider,
	SchemaValidationConfig,
	DatepickerPopupConfig,
	NavigatorService
} from 'oblique-reactive/oblique-reactive';

import {AppController} from './app-controller';
import {CommonModule} from './common/common-module';
import {AuthModule} from './states/auth/auth-module';
import {HomeModule} from './states/home/home-module';
import {MoviesModule} from './states/movies/movies-module';
import {SamplesModule} from './states/samples/samples-module';

// Makes sure that the app-templates will be loaded (and bundled):
import './app-templates';

angular
	.module('__MODULE__', [
		'ngAnimate',
		'ngCookies', // Required by $translateCookieStorage <- $translateLocalStorage <- $translate
		'ngSanitize',
		'ui.bootstrap',
		'ui.router',
		'ui.scroll',
		'tmh.dynamicLocale',
		'pascalprecht.translate',
		'satellizer',
		'angular-confirm',
		'angularjs-dropdown-multiselect',
		'checklist-model',
		'monospaced.elastic',

		'__MODULE__.app-templates',
		ObliqueModule,
		CommonModule,
		AuthModule,
		HomeModule,
		MoviesModule,
		SamplesModule
	])
	.constant('CONFIG', window['__MODULE__'].CONFIG)

	// Mandatory configuration
	// --------------------------------------------------------
	.config(($httpProvider:ng.IHttpProvider) => {
		$httpProvider.interceptors.push('HttpInterceptor');
		$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	})
	.config((tmhDynamicLocaleProvider:ng.dynamicLocale.tmhDynamicLocaleProvider) => {
		tmhDynamicLocaleProvider.localeLocationPattern('vendor/angular-i18n/angular-locale_{{locale}}.js');
	})
	.config((CONFIG, $translateProvider:ng.translate.ITranslateProvider) => {
		$translateProvider.preferredLanguage(CONFIG.defaults.locale);
		$translateProvider.useLocalStorage();
		$translateProvider.useSanitizeValueStrategy('escaped');
		$translateProvider.useStaticFilesLoader({
			prefix: 'app/i18n/locale-',
			suffix: '.json'
		});
	})
	.config((CONFIG, $urlRouterProvider:ng.ui.IUrlRouterProvider) => {
		// NOTE: before any change below, see https://github.com/angular-ui/ui-router/issues/600
		$urlRouterProvider.otherwise(function ($injector) {
			$injector.get('$state').go(CONFIG.defaults.state);
		});
	})
	.config(($animateProvider:ng.animate.IAnimateProvider) => {
		// Let ngAnimate know which elements to *not* handle (see https://github.com/angular/angular.js/issues/3613):
		$animateProvider.classNameFilter(/^((?!(navigable|animate-ignore)).)*$/);
	})

	// Optional configuration
	// --------------------------------------------------------
	.config(($logProvider:ng.ILogProvider) => {
		$logProvider.debugEnabled(true);
	})
	.config((CONFIG, uibDatepickerConfig:ng.ui.bootstrap.IDatepickerConfig, uibDatepickerPopupConfig:DatepickerPopupConfig) => {
		uibDatepickerConfig.showWeeks = false;
		uibDatepickerConfig.startingDay = 1; // Weeks start on Monday
		uibDatepickerPopupConfig.datepickerPopup = CONFIG.defaults.format && CONFIG.defaults.format.date ? CONFIG.defaults.format.date : 'd!.M!.yyyy';
		uibDatepickerPopupConfig.showButtonBar = false;

		// DatepickerPopup config extension:
		uibDatepickerPopupConfig.altInputFormats = CONFIG.defaults.format && CONFIG.defaults.format.dateAlt ? CONFIG.defaults.format.dateAlt : ['d!.M!.yy'];
		uibDatepickerPopupConfig.modelAsIsoFormat = 'yyyy-MM-dd';
	})
	.config((CONFIG, loadingServiceProvider:LoadingServiceProvider) => {
		loadingServiceProvider.setTimeout(CONFIG.defaults.http.timeout);
	})
	.config((CONFIG, $authProvider) => {
		$authProvider.baseUrl = '/' + CONFIG.api.path;
		$authProvider.signupUrl = '/auth/register';
		//$authProvider.signupRedirect = '/';
		$authProvider.loginUrl = '/auth/login';
		$authProvider.loginRedirect = '/';
		$authProvider.logoutRedirect = '/';
		$authProvider.tokenPrefix = CONFIG.module; // Local Storage name prefix
	})
	.config((schemaValidationConfig:SchemaValidationConfig) => {
		/*schemaValidationConfig.customErrorReporter = (error, data, schema) => {
			return 'error: ' + error.code;
		};*/
	})
	.controller('appController', AppController)
	.run(($navigator:NavigatorService) => {
		// Initialize $navigator:
		$navigator.init();
	});

// Bootstrap angular:
angular.element(document).ready(() => {
	angular.bootstrap(document, ['__MODULE__']);
});
