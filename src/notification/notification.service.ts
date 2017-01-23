import {Injectable, Inject, Optional} from '@angular/core';
import {Notification, NotificationTypes} from './notification';

/**
 * NotificationService
 *
 * providers:
 *    notificationTimeout: after this timeout (in ms) non sticky notifications get removed
 */
@Injectable()
export class NotificationService {
    public notifications: Notification[] = [];

    public warning = this.warn; //Alias

    private currentId: number = 0;


    constructor(@Optional() @Inject('notificationTimeout') private timeout?: number) {
        if (!timeout) {
            this.timeout = 5000;
        }
    }

    public add(type: NotificationTypes, messageKey: string, title: string, sticky: boolean): number {
        let notification = new Notification(this.currentId, type, messageKey, title, sticky);
        this.notifications.unshift(notification);
        this.notifications.sort((a: Notification, b: Notification) => b.type.priority - a.type.priority);
        if (!notification.sticky) {
            setTimeout(() => this.remove(notification.id), this.timeout);
        }
        this.currentId++;
        return notification.id;
    }

    public remove(id: number) {
        this.notifications.forEach((notification: Notification, index: number) => {
            if (id === notification.id) {
                this.notifications.splice(index, 1);
            }
        });
    }

    public setTimeout(timeout: number) {
        this.timeout = timeout;
    }

    public clear() {
        //clears the array, but does not change the reference
        this.notifications.length = 0;
    }

    public default(messageKey: string, title = '', sticky = false): number {
        return this.add(NotificationTypes.DEFAULT, messageKey, title, sticky);
    }

    public info(messageKey: string, title = '', sticky = false): number {
        return this.add(NotificationTypes.INFO, messageKey, title, sticky);
    }

    public success(messageKey: string, title = '', sticky = false): number {
        return this.add(NotificationTypes.SUCCESS, messageKey, title, sticky);
    }

    public warn(messageKey: string, title = '', sticky = false): number {
        return this.add(NotificationTypes.WARNING, messageKey, title, sticky);
    }

    public error(messageKey: string, title = '', sticky = true): number {
        return this.add(NotificationTypes.ERROR, messageKey, title, sticky);
    }

}
