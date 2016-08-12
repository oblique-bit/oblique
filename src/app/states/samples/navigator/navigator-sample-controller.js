(function () {
	'use strict';

	angular.module('__MODULE__.samples')
	.controller('NavigatorSampleController', function ($scope, $rootScope, notificationService, $timeout) {
		$rootScope.$on('$navigatorStateError', function(scope, error){
			$timeout(function() {
				notificationService.warn(error.message, 'Unable to navigate to parent state [' + error.parent.name + '] from state [' + error.current.name +']', true);
			});
		});
	});
}());
