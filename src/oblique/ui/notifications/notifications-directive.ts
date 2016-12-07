import {NotificationsDirectiveController} from './notifications-directive-controller';

export class NotificationsDirective implements ng.IDirective {
	restrict = 'AE';
	templateUrl = 'oblique/ui/notifications/notifications.tpl.html';
	replace = true;
	scope = false;
	controller = NotificationsDirectiveController;
	controllerAs = 'orNotificationCtrl';
}
