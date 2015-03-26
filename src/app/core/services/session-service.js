/* global angular */
(function () {
	"use strict";

	angular
		.module('__MODULE__.core')
		.service('SessionService', function () {

			// Private variables:
			this.context = {
				user: null
			};

			// Declaration -------------------------------------------------------------------------------------------------


			// Implementation ----------------------------------------------------------------------------------------------
			this.create = function (sessionId, user, userRole) {
				console.log(user);
				this.id = sessionId;
				this.context.user = user;
				this.userRole = userRole;
			};
			this.destroy = function () {
				this.id = null;
				this.context.user = null;
				this.userRole = null;
			};
		});
}());
