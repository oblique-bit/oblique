/* global angular */
(function () {
	"use strict";

	angular
		.module('__MODULE__.core')
		.config(function ($provide) {
			$provide.decorator("$exceptionHandler", function ($delegate, $injector) {

				var LOG = $injector.get('$log').getInstance('$exceptionHandler');
				return function (exception, cause) {
					LOG.error(exception, cause);
				};
			});
		});
}());
