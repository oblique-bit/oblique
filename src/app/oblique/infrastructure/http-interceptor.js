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
				// TODO: redesign blocking/silent/background operations
				if (!isSilent(config) && !isBackground(config) && http().api.isApiCall(config.url)) {
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
					if(!isSilent(rejection.config) && (rejection.status >= 500 || rejection.status === 0)) {
						// Mark this rejection as already handled:
						rejection.defaultPrevented = true;

						// Notify user:
						NotificationService.error('error.http.status.' + rejection.status);
					}
				}
				LOG.error(rejection);
				return $q.reject(rejection);
			}

			function isSilent(config) {
				return config && (config.silent || (config.data && config.data.silent));
			}

			function isBackground(config) {
				return config && (config.background || (config.data && config.data.background));
			}

			// Others services are injected on demand in order to prevent circular dependency during factory creation:
			function http(){
				return $injector.get('$http');
			}
		});
}());
