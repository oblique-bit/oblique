(function () {
	'use strict';

	angular.module('__MODULE__.samples')
	.controller('NavigatorSampleController', function ($scope, $rootScope, NotificationService, $timeout) {
		$rootScope.$on('$navigatorStateError', function(scope, error){
			$timeout(function() {
				NotificationService.warn(error.message, 'Unable to navigate to parent state [' + error.parent.name + '] from state [' + error.current.name +']', true);
			});
		});
	});
}());
