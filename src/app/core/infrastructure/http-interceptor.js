/* global angular */
(function () {
	"use strict";

	angular
		.module('__MODULE__.core')
		.factory('HttpInterceptor', function (CONFIG, $q, $log, $injector, NotificationService, LoadingService) {

			var LOG = $log.getInstance('HttpInterceptor');

			return {
				'request': handleRequest,
				'requestError': handleRequestError,
				'response': handleResponse,
				'responseError': handleResponseError
			};

			function handleRequest(config) {
				if (isApiCall(config.url)) {
					LoadingService.start();
				}
				return config;
			}

			function handleRequestError(rejection) {
				return $q.reject(rejection);
			}

			function handleResponse(response) {
				if (isApiCall(response.config.url)) {
					LoadingService.stop();
				}
				// Unwrap api responses
				if (response.data && isApiCall(response.config.url)) {
					return response.data;
				} else {
					return response;
				}
			}

			function handleResponseError(rejection) {
				console.log(rejection);
				if (isApiCall(rejection.config.url)) {
					LoadingService.stop();
				}
				if (rejection && rejection.data && rejection.data.error && rejection.data.error.errors) {
					rejection.data.error.errors.forEach(function (error, index) {
						NotificationService.add(error.messageSeverity, 'error.business.' + error.messageKey);
						handleOptimisticLockingException(error);
					});
				} else {
					NotificationService.add('error', 'error.http.status.' + rejection.status);
				}
				LOG.error(rejection);
				return $q.reject(rejection);
			}

			function handleOptimisticLockingException(error) {
				if (error.messageKey === 'ObjectOptimisticLockingFailureException') {
					// injected here to prevent circular dependency during factory creation
					var $state = $injector.get('$state');

					// reload state
					$state.go($state.current.name, {}, {reload: true});
				}
			}

			function isApiCall(url) {
				return url.indexOf(CONFIG.api.url) > -1;
			}
		});
}());
