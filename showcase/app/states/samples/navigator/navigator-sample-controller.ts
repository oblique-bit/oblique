import {NotificationService} from 'oblique-reactive/oblique-reactive';

export class NavigatorSampleController {
	/*@ngInject*/
	constructor ($rootScope:ng.IRootScopeService,
				 notificationService:NotificationService,
				 $timeout:ng.ITimeoutService) {

		$rootScope.$on('$navigatorStateError', (scope, error) => {
			$timeout(() => {
				notificationService.warn(error.message, 'Unable to navigate to parent state [' + error.parent.name + '] from state [' + error.current.name +']', true);
			});
		});
	}
}
