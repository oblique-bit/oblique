import {NotificationService} from 'oblique-reactive/../../../../../../old-lib/oblique-reactive';

export class NavigatorSampleController {
	/*@ngInject*/
	constructor ($scope:ng.IScope,
				 $timeout:ng.ITimeoutService,
				 notificationService:NotificationService) {

		$scope.$on('$navigatorStateError', (scope, error) => {
			$timeout(() => {
				notificationService.warn(error.message, 'Unable to navigate to parent state [' + error.parent.name + '] from state [' + error.current.name +']', true);
			});
		});
	}
}
