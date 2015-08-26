/* global angular */
(function () {
	"use strict";

	angular
		.module('__MODULE__.oblique')
		.factory('HttpInterceptor', function (CONFIG, $q, $log, $injector, $rootScope, NotificationService, LoadingService) {

			var LOG = $log.getInstance('HttpInterceptor');

			return {
				'request': handleRequest,
				'requestError': handleRequestError,
				'response': handleResponse,
				'responseError': handleResponseError
			};

			function handleRequest(config) {
				if (http().api.isApiCall(config.url) && !isSilent(config)) {
					LoadingService.start();
				}
				return config;
			}

			function handleRequestError(rejection) {
				return $q.reject(rejection);
			}

			function handleResponse(response) {
				var $http = http();
				if ($http.api.isApiCall(response.config.url)) {
					LoadingService.stop();
				}
				return response;
			}

			function handleResponseError(rejection) {
				var $http = http();
				if ($http.api.isApiCall(rejection.config.url)) {
					LoadingService.stop();
				}
				if (!$rootScope.$broadcast('$httpInterceptorError', rejection).defaultPrevented) {
					if(rejection.status >= 500 && !isSilent(rejection.config)) {
						NotificationService.add('error', 'error.http.status.' + rejection.status);
					}
				}
				LOG.error(rejection);
				return $q.reject(rejection);
			}

			function isSilent(config) {
				return config && config.data && config.data.silent;
			}

			// Others services are injected on demand in order to prevent circular dependency during factory creation:
			function http(){
				return $injector.get('$http');
			}
		});
}());
