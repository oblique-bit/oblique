/* global angular, moment */
(function () {
	"use strict";

	angular
		.module('__MODULE__.core')
		.config(function ($provide) {
			$provide.decorator("$log", function (CONFIG, $delegate, $injector) {

				$delegate.getInstance = function (context) {
					return {
						log: decorate('log', context),
						info: decorate('info', context),
						warn: decorate('warn', context),
						error: decorate('error', context),
						debug: decorate('debug', context)
					};
				};

				var apiLogPath = CONFIG.api && CONFIG.api.log;

				function decorate(level, context) {
					return function () {
						var args = [].slice.call(arguments);
						var message = moment().format() + ' - [' + context + ']';

						if (args[0] && args[0] instanceof Error) {
							message += args[0].message;
						} else {
							message += JSON.stringify(args);
						}

						// Use $delegate as logger interface:
						$delegate[level](message);

						// Log to backend, if required:
						if(apiLogPath && !isFailedBackendLogRequest(args)){
							var $http = $injector.get('$http');
							$http.api.post(apiLogPath, {level: level, message: message, silent: true});
						}
					};
				}

				function isFailedBackendLogRequest(args) {
					return args && args[0] && args[0].config && args[0].config.url && args[0].config.url.indexOf(apiLogPath) > -1;
				}

				return $delegate;
			});
		});

}());

