(function () {
	"use strict";

	angular
		.module('__MODULE__.oblique')
		.directive('notifications', function (NotificationService) {
			return {
				restrict: 'AE',
				templateUrl: '../oblique/ui/notifications/notifications.tpl.html',
				replace: true,
				scope: false,
				controller: function ($scope, $element, $attrs) {
					$scope.notifications = NotificationService.notifications;
					$scope.alertType = {
						default: 'alert',
						info: 'alert alert-info',
						success: 'alert alert-success',
						warning: 'alert alert-warning',
						error: 'alert alert-danger'
					};

					$scope.isClosable = function (notification) {
						return notification.sticky;
					};

					$scope.remove = function (notification) {
						NotificationService.remove(notification.id);
					};
				},
				link: function (scope, element, attrs) {
				}
			};
		});

}());
