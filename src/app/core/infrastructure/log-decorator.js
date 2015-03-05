/* global angular, moment */
(function () {
	"use strict";

	angular
		.module('__MODULE__.core')
		.config(function ($provide) {
			$provide.decorator("$log", function ($delegate, $injector) {

				$delegate.getInstance = function (context) {
					return {
						log: enhanceLogging('log', context),
						info: enhanceLogging('info', context),
						warn: enhanceLogging('warn', context),
						error: enhanceLogging('error', context),
						debug: enhanceLogging('debug', context)
					};
				};

				function enhanceLogging(level, context) {
					return function () {
						var args = [].slice.call(arguments);
						var timestampContext = moment().format() + ' - [ ' + context + ' ]';

						if (args[0] && args[0] instanceof Error) {
							$delegate.error(timestampContext + ' - ' + args[0].message);
							$delegate.error(args[0]);
						} else {
							$delegate[level](timestampContext + ' - ' + args);
						}
						logToBackend(level, context, args);
					};
				}

				function logToBackend(level, context, args) {
					// Prevent backend error logging when backend is inaccessible
					if (isFailedBackendLogRequest(args)) {
						return;
					}
					var backendLogMessage = '[ ' + context + ' ] - ';
					if (args[0]) {
						if (args[0].hasOwnProperty('status')) {
							backendLogMessage += args[0].status + ', ' + args[0].config.url;
						}
						if (args[0].hasOwnProperty('message')) {
							backendLogMessage += args[0].message;
						} else {
							backendLogMessage += args[0];
						}
					} else {
						backendLogMessage = args;
					}
					var $http = $injector.get('$http');
					$http.apiPost('/log/', {level: level, message: backendLogMessage});
				}

				function isFailedBackendLogRequest(args) {
					return args && args[0] && args[0].config && args[0].config.url && args[0].config.url.indexOf('log') > -1;
				}

				return $delegate;
			});
		});

}());

