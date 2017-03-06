import {NotificationsController} from './notifications-controller';

/**
 * Wrapper for ObliqueUI notifications.
 *
 * @see https://eui.bit.admin.ch/oblique-ui/1.3.0/components.html#components-dialogs-notifications
 */
export class NotificationsComponent implements ng.IComponentOptions {
	templateUrl = 'oblique/notification/notifications.tpl.html';
	controller = NotificationsController;
	controllerAs = 'orNotificationsCtrl';
}
