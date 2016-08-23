import {NotificationService} from './notification-service';

export class NotificationServiceProvider implements ng.IServiceProvider {

    public context= {
        timeout: 5000
    };

    setTimeout(timeout : number) {
        this.context.timeout = timeout;
    }

    /*@ngInject*/
    $get($timeout:ng.ITimeoutService) {
        return new NotificationService($timeout, this.context);
    }
}