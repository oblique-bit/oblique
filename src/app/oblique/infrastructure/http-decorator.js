/* global angular */
(function () {
	"use strict";

	/**
	 * Decorates the `$http` service with shortcut for including contextual API methods.
	 *
	 * Reworked from standard decorator which uses $delegate to service which is called during application
	 * initialization in app-module.js (run method) to prevent circular dependency (3rd party upload service)
	 **/
	angular
		.module('__MODULE__.oblique')
		.factory('$httpDecorator', function (CONFIG, $http) {

			return {
				decorate: function () {
					$http.api = $http.api || {};
					$http.api.url = CONFIG.api.schema + "://" + CONFIG.api.hostname + ':' + CONFIG.api.port + CONFIG.api.context;

					$http.api.head = withApiUrl($http.head);
					$http.api.get = withApiUrl($http.get);
					$http.api.post = withApiUrl($http.post);
					$http.api.put = withApiUrl($http.put);
					$http.api.delete = withApiUrl($http['delete']);
					$http.api.patch = withApiUrl($http.patch);

					$http.api.isApiCall= function(url) {
						return url.indexOf($http.api.url) > -1;
					};
				}
			};

			function withApiUrl(httpFunction) {
				return function () {
					var args = [].slice.call(arguments);
					args[0] = $http.api.url + args[0];
					return httpFunction.apply(null, args).then(function(response) {
						// Unwrap API responses:
						return response.data;
					});
				};
			}
		});
}());
