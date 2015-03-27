/* global angular */
(function () {
	"use strict";

	angular
		.module('__MODULE__.core')
		.provider('NotificationService', function () {

			var timeout = 1500;
			var notifications = [];
			var types = {
				'default' : {
					priority: 0
				},
				info : {
					priority: 1
				},
				success : {
					priority: 2
				},
				warning : {
					priority: 3
				},
				error : {
					priority: 4
				}
			};

			return {
				setTimeout: function (value) {
					timeout = value;
				},
				$get: function ($timeout) {
					var currentId = 0;

					return {
						notifications: notifications,
						add: add,
						remove: remove,
						clear: clear
					};

					function add(type, messageKey, sticky) {
						if (!sticky && type === 'error') {
							sticky = true;
						}
						var notification = {
							id: currentId,
							type: type,
							messageKey: messageKey,
							sticky: sticky
						};
						notifications.unshift(notification);
						notifications.sort(sortNotifications);
						if (!sticky) {
							$timeout(function(){
								remove(notification.id);
							}, timeout*2);
						}
						currentId++;
					}

					function remove(id) {
						notifications.forEach(function (notification, index) {
							if (id === notification.id) {
								notifications.splice(index, 1);
							}
						});
					}

					function clear() {
						notifications.length = 0; // ;)
					}

					function sortNotifications(a, b) {
						return types[a.type].priority < types[b.type].priority;
					}
				}
			};
		});
}());
