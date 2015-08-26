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

					var ctrl = this;

					ctrl.alertType = {
						default: 'alert',
						info: 'alert alert-info',
						success: 'alert alert-success',
						warning: 'alert alert-warning',
						error: 'alert alert-danger'
					};

					ctrl.notifications = NotificationService.notifications;

					ctrl.isClosable = function (notification) {
						return notification.sticky;
					};

					ctrl.remove = function (notification) {
						NotificationService.remove(notification.id);
					};
				},
				controllerAs: 'notificationCtrl',
				bindToController: true,

				template:
				'<div class="notifications">' +
					'<div class="{{notificationCtrl.alertType[notification.type]}} animated slide-down" ng-repeat="notification in notificationCtrl.notifications">' +
						'<button ng-click="notificationCtrl.remove(notification)" ' +
							'ng-show="notificationCtrl.isClosable(notification)" type="button" class="close">' +
							'&times;' +
						'</button>' +
						'<h4 ng-if="notification.title">{{notification.title}}</h4>' +
						'<p><strong>{{("notification.type." + notification.type) | translate}}</strong> {{notification.messageKey | translate}}</p>' +
					'</div>' +
				'</div>',
				link: function (scope, element, attrs) {
				}
			};
		});

}());
