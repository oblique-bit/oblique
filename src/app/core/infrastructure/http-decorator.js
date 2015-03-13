/* global angular */
(function () {
	"use strict";

	/**
	 * Decorates the `$http` service with shortcut methods for including contextual API url.
	 *
	 * Reworked from standard decorator which uses $delegate to service which is called during application
	 * initialization in app-module.js (run method) to prevent circular dependency (3rd party upload service)
	 **/
	angular
		.module('__MODULE__.core')
		.factory('$httpDecorator', function (CONFIG, $http) {

			return {
				decorate: function () {
					$http.apiHead = withApiUrl($http.head);
					$http.apiGet = withApiUrl($http.get);
					$http.apiPost = withApiUrl($http.post);
					$http.apiPut = withApiUrl($http.put);
					$http.apiDelete = withApiUrl($http['delete']);
					$http.apiPatch = withApiUrl($http.patch);
				}
			};

			function withApiUrl(httpFunction) {
				return function () {
					var args = [].slice.call(arguments);
					args[0] = CONFIG.api.url + args[0];
					return httpFunction.apply(null, args);
				};
			}
		});
}());
