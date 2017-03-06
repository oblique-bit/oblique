import {LoadingService} from './loading-service';
import {NotificationService} from '../notification/notification-service';

export class LoadingServiceProvider implements ng.IServiceProvider {

	public context = {
		timeout: 10000
	};

	setTimeout(timeout:number) {
		this.context.timeout = timeout;
	}

	/*@ngInject*/
	$get($timeout:ng.ITimeoutService, notificationService:NotificationService) {
		return new LoadingService($timeout, notificationService, this.context);
	}
}