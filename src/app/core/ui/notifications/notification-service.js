(function () {
	"use strict";

	angular.module('__MODULE__.core')
	.provider('NotificationService', function () {

		var timeout = 1500;
		var notifications = [];
		var types = {
			'default': {
				priority: 0
			},
			info: {
				priority: 1
			},
			success: {
				priority: 2
			},
			warning: {
				priority: 3
			},
			error: {
				priority: 4
			}
		};

		var sortByType = function(a, b) {
			return types[a.type].priority < types[b.type].priority;
		};

		return {
			setTimeout: function (value) {
				timeout = value;
			},
			$get: function ($timeout) {
				var currentId = 0;

				var service = {};
				service.notifications = notifications;
				service.add = function (type, messageKey, title, sticky) {
					var notification = {
						id: currentId,
						type: type,
						messageKey: messageKey,
						title: title,
						sticky: type === 'error' || sticky
					};
					notifications.unshift(notification);
					notifications.sort(sortByType);
					if (!notification.sticky) {
						$timeout(function () {
							service.remove(notification.id);
						}, timeout * 2);
					}
					currentId++;
				};
				service.remove = function (id) {
					notifications.forEach(function (notification, index) {
						if (id === notification.id) {
							notifications.splice(index, 1);
						}
					});
				};
				service.clear = function() {
					notifications.length = 0; // ;)
				};

				// Shortcuts:
				service.default = function(messageKey, title, sticky) { return service.add('default', messageKey, title, sticky);};
				service.info = function(messageKey, title, sticky) { return service.add('info', messageKey, title, sticky);};
				service.success = function(messageKey, title, sticky) { return service.add('success', messageKey, title, sticky);};
				service.warn = function(messageKey, title, sticky) { return service.add('warning', messageKey, title, sticky);};
				service.warning = service.warn; // Alias only
				service.error = function(messageKey, title, sticky) { return service.add('error', messageKey, title, sticky);};

				return service;
			}
		};
	});
}());
