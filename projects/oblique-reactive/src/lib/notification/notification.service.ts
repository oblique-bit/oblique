import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {INotification, NotificationType} from './notification.interfaces';
import {NotificationConfig} from './notification.config';

/**
 * Service for the `NotificationComponent`. Can be configured using `NotificationConfig`.
 *
 * @see NotificationComponent
 * @see NotificationConfig
 */
@Injectable({providedIn: 'root'})
export class NotificationService {
	private readonly eventSubject: Subject<INotification> = new Subject<INotification>();
	private readonly events$ = this.eventSubject.asObservable();
	private currentId = 0;

	constructor(public config: NotificationConfig) {
	}

	public get events(): Observable<INotification> {
		return this.events$;
	}

	/**
	 * Sends an _info_ notification.
	 */
	public info(config: INotification | string): INotification {
		return this.broadcast(config, NotificationType.INFO);
	}

	/**
	 * Sends a _success_ notification.
	 */
	public success(config: INotification | string): INotification {
		return this.broadcast(config, NotificationType.SUCCESS);
	}

	/**
	 * Sends a _warning_ notification.
	 */
	public warning(config: INotification | string): INotification {
		console.log(config);
		return this.broadcast(config, NotificationType.WARNING);
	}

	/**
	 * Sends an _error_ notification.
	 */
	public error(config: INotification | string): INotification {
		return this.broadcast(config, NotificationType.ERROR);
	}

	public send(config: INotification | string, type?: NotificationType): INotification {
		return this.broadcast(config, type || (config as INotification).type || NotificationType.INFO);
	}

	/**
	 * Broadcasts an event to clear all notifications from specified `channel`.
	 */
	public clear(channel = this.config.channel) {
		this.eventSubject.next({channel});
	}

	/**
	 * Broadcasts an event to clear all notifications from any available.
	 */
	public clearAll() {
		this.eventSubject.next(null);
	}

	private broadcast(config: INotification | string, type: NotificationType): INotification {
		if (typeof config === 'string') {
			config = {
				message: config
			};
		}
		const notification = {
			id: config.id || this.currentId++,
			type: type,
			message: config.message,
			messageParams: config.messageParams,
			title: config.title || this.config[type].title,
			titleParams: config.titleParams,
			channel: config.channel || this.config[type].channel || this.config.channel,
			sticky: config.sticky || this.config[type].sticky || this.config.sticky,
			timeout: config.timeout || this.config[type].timeout || this.config.timeout
		};
		this.eventSubject.next(notification);

		return notification;
	}
}
