import {NotificationService} from './notification-service';

export class NotificationsDirective {
    restrict = 'AE';
    templateUrl = '../oblique/ui/notifications/notifications.tpl.html';
    replace = true;
    scope = false;
    controller = NotificationsDirectiveController;
    controllerAs = 'ctrl';
}

export class NotificationsDirectiveController {
    notifications:any [];

    alertType = {
        default: 'alert',
        info: 'alert alert-info',
        success: 'alert alert-success',
        warning: 'alert alert-warning',
        error: 'alert alert-danger'
    };

    /*@ngInject*/
    constructor(private notificationService:NotificationService) {
        this.notifications = notificationService.notifications;
    }

    isClosable(notification) {
        return notification.sticky;
    }

    remove(notification) {
        this.notificationService.remove(notification.id);
    }
}

