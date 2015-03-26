/* global angular */
(function () {
	"use strict";

	angular
		.module('__MODULE__.core')
		.factory('AuthService', function ($http, SessionService) {
			var service = {};

			service.init = function(user) {
				SessionService.create('TODO: session', user, 'TODO: role');
				return user;
			};

			service.resolve = function() {
				// TODO: replace with your own user resolution implementation here!
				return $http.api.get('/me').then(function(user) {
					return service.init(user);
				});
			};

			service.login = function (credentials) {
				// TODO: replace with your own login implementation here!
				return $http.api.post('/auth/login', credentials).then(function(user) {
					return service.init(user);
				});
			};

			service.logout = function () {
				// TODO: replace with your own logout implementation here!
				return $http.api.post('/auth/logout').then(function(user) {
					return SessionService.destroy();
				});
			};

			service.register = function (user) {
				// TODO: replace with your own registration implementation here, if any!
				return $http.api.post('/auth/register').then(function(user) {
					return service.init(user);
				});
			};

			service.isAuthenticated = function () {
				// TODO: replace with your own authentication implementation here!
				return !!SessionService.context.user;
			};

			service.isAuthorized = function (authorizedRoles) {
				// TODO: replace with your own authorization implementation here!
				if (!angular.isArray(authorizedRoles)) {
					authorizedRoles = [authorizedRoles];
				}
				return (service.isAuthenticated() && authorizedRoles.indexOf(SessionService.context.user.role) !== -1);
			};

			return service;
		});
}());
