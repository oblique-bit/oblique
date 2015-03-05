/* global angular */
(function () {
	"use strict";

	/**
	 * Reworked from standard decorator which uses $delegate to service which is called during application
	 * initialization in app-module.js (run method) to prevent circular dependency (3rd party upload service)
	 **/

	angular
		.module('__MODULE__.core')
		.factory('$httpDecorator', function (CONFIG, $http) {

			return {
				decorate: function () {
					$http.apiHead = useApiUrl($http.head);
					$http.apiGet = useApiUrl($http.get);
					$http.apiPost = useApiUrl($http.post);
					$http.apiPut = useApiUrl($http.put);
					$http.apiDelete = useApiUrl($http['delete']);
					$http.apiPatch = useApiUrl($http.patch);
				}
			};

			function useApiUrl(httpFunction) {
				return function () {
					var args = [].slice.call(arguments);
					args[0] = CONFIG.api.url + args[0];
					return httpFunction.apply(null, args);
				};
			}
		});
}());
