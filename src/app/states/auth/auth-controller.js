(function () {
	'use strict';

	angular
		.module('__MODULE__.auth')
		.controller('AuthController', function ($scope, $state, $http, AuthService, NotificationService) {

			// Properties --------------------------------------------------------------------------------------------------
			$scope.user = {
				email: 'info@bit.admin.ch',
				password: '12345678'
			};

			$scope.login = function () {
				AuthService.login($scope.user).then(function (data, status) {
					NotificationService.add('success', 'states.auth.login.success');
					$state.go('home');
				}, function () {
					NotificationService.add('error', 'states.auth.login.error');
				});
			};

			$scope.logout = function () {
				AuthService.logout().then(function (data, status) {
					NotificationService.add('success', 'states.auth.logout.success');
					$state.go('home');
				}, function (error) {
					NotificationService.add('error', 'states.auth.logout.error');
				});
			};

			$scope.register = function () {
				AuthService.register($scope.user).then(function (data, status) {
					NotificationService.add('success', 'states.auth.register.success');
					$state.go('home');
				}, function (error) {
					NotificationService.add('error', 'states.auth.register.error');
				});
			};
		});
}());
