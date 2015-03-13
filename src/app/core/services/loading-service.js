/* global angular */
(function () {
	"use strict";

	angular
		.module('__MODULE__.core')
		.provider('LoadingService', function () {

			var timeout = 10000;

			return {
				setTimeout: function (value) {
					timeout = value;
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
						// Store id for later comparison:
						var id = loadingId;
						// Create timeout and fail in case request takes too long to execute:
						loadings.push({id: loadingId, timeout: $timeout(function () {
							// when timeout, search if timeout is still active, when yes show error
							var loading = _.filter(loadings, function (loading) { // FIXME: remove lodash?
								return loading.id === id;
							});
							if (typeof loading !== 'undefined') {
								stop();
								NotificationService.add('error', 'error.other.timeout');
							}
						}, timeout)});
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
