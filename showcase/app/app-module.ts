//TODO: remove this, as soon as typescript 2 is supported by IntelliJ
//Fixes the types
/// <reference path="../../typings/index.d.ts" />

//Loads the ObliqueReactive module
import {ObliqueModule, LoadingServiceProvider, SchemaValidateConfig, DatepickerPopupConfig} from 'oblique-reactive/oblique-reactive';

import {AppController} from './app-controller';
import {CommonModule} from './common/common-module';
import {AuthModule} from './states/auth/auth-module';
import {HomeModule} from './states/home/home-module';
import {MoviesModule} from './states/movies/movies-module';
import {SamplesModule} from './states/samples/samples-module';

//Makes sure, that the app-templates will be loaded (and bundled)
import './app-templates';

angular
    .module('__MODULE__', [
        'ngAnimate',
        'ngCookies',
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
    .config(($httpProvider:ng.IHttpProvider, CONFIG) => {
        if (CONFIG.dev && CONFIG.dev.sendCredentials) {
            //$httpProvider.defaults.withCredentials = CONFIG.dev.sendCredentials;
        }
        $httpProvider.interceptors.push('HttpInterceptor');
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
    .config((CONFIG, $authProvider) => {
        $authProvider.baseUrl = '/' + CONFIG.api.path;
        $authProvider.signupUrl = '/auth/register';
        //$authProvider.signupRedirect = '/';
        $authProvider.loginUrl = '/auth/login';
        $authProvider.loginRedirect = '/';
        $authProvider.logoutRedirect = '/';
        $authProvider.tokenPrefix = CONFIG.module; // Local Storage name prefix
    })
    .config((CONFIG, $urlRouterProvider:ng.ui.IUrlRouterProvider) => {
        $urlRouterProvider.otherwise('/' + CONFIG.defaults.state);
    })
    .config(($animateProvider:ng.animate.IAnimateProvider) => {
        // Let ngAnimate know which elements to *not* handle (see https://github.com/angular/angular.js/issues/3613):
        $animateProvider.classNameFilter(/^((?!(navigable)).)*$/);
    })

    // Optional configuration
    // --------------------------------------------------------
    .config(($logProvider:ng.ILogProvider) => {
        $logProvider.debugEnabled(true);
    })
    .config((CONFIG, uibDatepickerConfig:ng.ui.bootstrap.IDatepickerConfig, uibDatepickerPopupConfig:DatepickerPopupConfig) => {
        uibDatepickerConfig.showWeeks = false;
        uibDatepickerConfig.startingDay = 1; // Weeks start on Monday
        uibDatepickerPopupConfig.datepickerPopup = CONFIG.defaults.format && CONFIG.defaults.format.date ? CONFIG.defaults.format.date : 'dd.MM.yyyy';
        uibDatepickerPopupConfig.showButtonBar = false;
        uibDatepickerPopupConfig.modelAsIsoFormat = 'yyyy-MM-dd';//false; // Specifies if model values should be written as ISO-based string
        uibDatepickerPopupConfig.altInputFormats = ['d!.M!.yy'];
    })
    .config((CONFIG, loadingServiceProvider:LoadingServiceProvider) => {
        loadingServiceProvider.setTimeout(CONFIG.defaults.http.timeout);
    })
    .config((schemaValidateConfig:SchemaValidateConfig) => {
        //todo Add custom error reporter here
        /*schemaValidateConfig.customErrorReporter = (error, data, schema) => {

            return 'error: ' + error.code;
        };*/
    })
    .controller('appController', AppController);

// Bootstrap angular:

angular.element(document).ready(() => {
    angular.bootstrap(document, ['__MODULE__']);
});

