(function () {
	'use strict';

	angular
		.module('__MODULE__.auth')
		.controller('AuthController', function ($scope, $state, $http, AuthService, NotificationService) {

			// Properties --------------------------------------------------------------------------------------------------
			$scope.status = {
				authenticating: false,
				registering: false
			};
			$scope.user = {
				email: 'eui@bit.admin.ch',
				password: '12345678'
			};

			$scope.login = function () {
				$scope.status.authenticating = true;
				NotificationService.clear();
				AuthService.login($scope.user).then(
					function (user) {
						$state.go('home').then(function() {
							NotificationService.success('states.auth.login.success', 'Welcome, ' + user.firstname + '!');
						});
					}, function (error) {
						if (!error.defaultPrevented) {
							NotificationService.error(error.data && error.data.message ? error.data.message : 'states.auth.login.error');
						}
					}
				).finally(function() {
					$scope.status.authenticating = false;
				});
			};

			$scope.logout = function () {
				NotificationService.clear();
				AuthService.logout().then(function () {
					NotificationService.success('states.auth.logout.success');
					$state.go('home');
				}, function (error) {
					if (!error.defaultPrevented) {
						NotificationService.error(error.data && error.data.message || 'states.auth.logout.error');
					}
				});
			};

			$scope.register = function () {
				$scope.status.registering = true;
				NotificationService.clear();
				AuthService.register($scope.user).then(function () {
					NotificationService.success('states.auth.register.success');
					$state.go('home');
				}, function (error) {
					if (!error.defaultPrevented) {
						NotificationService.error(error.data && error.data.message || 'states.auth.register.error');
					}
				}).finally(function() {
					$scope.status.registering = false;
				});
			};
		});
}());
