import {NotificationServiceProvider} from './notification-service-provider';
import {NotificationsComponent} from './notifications-component';

import '../../oblique-reactive-templates';

export const ORNotificationModule = 'oblique-reactive.notification';

angular.module(ORNotificationModule, ['oblique-reactive.app-templates'])
    .provider('notificationService', () => new NotificationServiceProvider())
    .component('notifications', new NotificationsComponent());