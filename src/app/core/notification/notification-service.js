/* global angular */
(function () {
	"use strict";

	angular
		.module('__MODULE__.core')
		.provider('NotificationService', function () {

			var timeout = 1500;
			var notifications = [];

			return {
				setTimeout: function (value) {
					timeout = value;
				},
				$get: function ($timeout) {
					var notificationId = 0;

					return {
						notifications: notifications,
						add: add,
						remove: remove
					};

					function add(type, messageKey, sticky) {
						if (!sticky && type === 'error') {
							sticky = true;
						}
						var notification = {
							notificationId: notificationId,
							type: type,
							messageKey: messageKey,
							sticky: sticky
						};
						notifications.unshift(notification);
						notifications.sort(sortNotifications);
						if (!sticky) {
							$timeout(removeWithTimeout(notificationId), timeout*2);
						}
						notificationId++;
					}

					function remove(notificationId) {
						notifications.forEach(function (displayedNotification, index) {
							if (notificationId === displayedNotification.notificationId) {
								notifications.splice(index, 1);
							}
						});
					}

					function removeWithTimeout(notificationId) {
						var id = notificationId;
						return function () {
							notifications.forEach(function (displayedNotification, index) {
								if (id === displayedNotification.notificationId) {
									notifications.splice(index, 1);
								}
							});
						};
					}

					function sortNotifications(a, b) {
						function getTypeValue(type) {
							if (type === 'default') {
								return 0;
							}
							if (type === 'info') {
								return 1;
							}
							if (type === 'success') {
								return 2;
							}
							if (type === 'warning') {
								return 3;
							}
							if (type === 'error') {
								return 4;
							}
						}

						return getTypeValue(a.type) < getTypeValue(b.type);
					}
				}
			};
		});
}());
