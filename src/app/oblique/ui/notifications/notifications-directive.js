(function () {
	"use strict";

	angular
		.module('__MODULE__.oblique')
		.directive('notifications', function (NotificationService) {
			return {
				restrict: 'AE',
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
				template:
					'<div class="notifications">' +
						'<div class="{{alertType[notification.type]}} animated slide-down" ng-repeat="notification in notifications">' +
							'<button ng-click="remove(notification)" ' +
								'ng-show="isClosable(notification)" type="button" class="close">' +
								'&times;' +
							'</button>' +
							'<h4><span  ng-if="!notification.title">{{("notification.type." + notification.type) | translate}} </span>{{notification.title}}</h4>' +
							'<p class="lead">{{notification.messageKey | translate}}</p>' +
						'</div>' +
					'</div>',
				link: function (scope, element, attrs) {
				}
			};
		});

}());
