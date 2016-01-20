/**
 * Adds a 'forceReload' method to $state in order to reload the current state from within a controller. This way
 * the resolves are executed as well again.
 *
 * See also: https://github.com/angular-ui/ui-router/issues/582
 */
(function () {
	"use strict";
	angular.module('__MODULE__.oblique')
		.config(function ($provide) {
			$provide.decorator('$state', function ($delegate, $stateParams) {
				$delegate.forceReload = function (state) {
					return $delegate.go(state || $delegate.current, $stateParams, {
						reload: true,
						inherit: false,
						notify: true
					});
				};
				return $delegate;
			});
		});
}());
