/* global angular */
(function () {
	"use strict";

	angular
		.module('__MODULE__.core')

		.provider('LoadingService', function () {

			var timeoutValue = 10000;

			return {
				setTimeout: function (value) {
					timeoutValue = value;
				},
				$get: function ($log, $timeout, NotificationService) {

					var loadings = [],
						loadingId = 0,
						loading = {
							active: false
						};

					return {
						loading: loading,
						start: start,
						stop: stop
					};

					function start() {
						// store id in start()'s closure
						var id = loadingId;
						// create timeout and fail in case request takes too long to execute
						var timeout = $timeout(function () {
							// when timeout, search if timeout is still active, when yes show error
							var loading = _.filter(loadings, function (loading) { // FIXME: remove lodash?
								return loading.id === id;
							});
							if (typeof loading !== 'undefined') {
								stop();
								NotificationService.add('error', 'error.other.timeout');
							}

						}, timeoutValue);

						loadings.push({id: loadingId, timeout: timeout});
						loadingId++;
						loading.active = loadings.length > 0;
					}

					function stop() {
						// do nothing when no loadings are active
						if (loadings.length <= 0) {
							return;
						}
						$timeout.cancel(loadings.shift().timeout);
						loading.active = loadings.length > 0;
					}
				}
			};
		});
}());
