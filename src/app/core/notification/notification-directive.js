/* global angular */
(function () {
	"use strict";

	angular
		.module('__MODULE__.core')
		.directive('notification', function (NotificationService) {
			return {
				restrict: 'A',
				replace: true,
				scope: {},
				controller: function () {

					var ctrl = this;

					ctrl.alertType = {
						'default': 'alert animationFadeIn animationFadeOut',
						info: 'alert alert-info animationFadeIn animationFadeOut',
						success: 'alert alert-success animationFadeIn animationFadeOut',
						warning: 'alert alert-warning animationFadeIn animationFadeOut',
						error: 'alert alert-danger animationFadeIn'
					};

					ctrl.notifications = NotificationService.notifications;

					ctrl.isClosable = function (notification) {
						return notification.sticky;
					};

					ctrl.remove = function (notification) {
						NotificationService.remove(notification.notificationId);
					};
				},
				controllerAs: 'notificationCtrl',

				// TODO: remove from here!
				template: '<div class="animationFadeIn" ng-repeat="notification in notificationCtrl.notifications">' +
				'<div ng-class="notificationCtrl.alertType[notification.type]">' +
				'<button ng-click="notificationCtrl.remove(notification)" ' +
				'ng-show="notificationCtrl.isClosable(notification)" type="button" class="close">' +
				'&times;' +
				'</button>' +
				'<p><strong>{{"notification.notification-" + notification.type | translate}}</strong> {{notification.messageKey | translate}}</p>' +
				'</div>' +
				'</div>',
				link: function (scope, element, attrs) {
				}
			};
		});

}());
