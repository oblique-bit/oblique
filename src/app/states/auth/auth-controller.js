(function () {
	'use strict';

	angular
		.module('__MODULE__.auth')
		.controller('AuthController', function ($scope, $state, $http, AuthService, NotificationService) {

			// Properties --------------------------------------------------------------------------------------------------
			$scope.user = {
				email: 'eui@bit.admin.ch',
				password: '12345678'
			};

			$scope.login = function () {
				NotificationService.clear();
				AuthService.login($scope.user).then(function (data, status) {
					NotificationService.success(data.message || 'states.auth.login.success');
					$state.go('home');
				}, function (error) {
					NotificationService.error(error.data && error.data.message ? error.data.message  : 'states.auth.login.error');
				});
			};

			$scope.logout = function () {
				NotificationService.clear();
				AuthService.logout().then(function (data, status) {
					NotificationService.success(data.message || 'states.auth.logout.success');
					$state.go('home');
				}, function (error) {
					NotificationService.error(error.data.message || 'states.auth.logout.error');
				});
			};

			$scope.register = function () {
				NotificationService.clear();
				AuthService.register($scope.user).then(function (data, status) {
					NotificationService.success(data.message || 'states.auth.register.success');
					$state.go('home');
				}, function (error) {
					NotificationService.error(error.data.message || 'states.auth.register.error');
				});
			};
		});
}());
