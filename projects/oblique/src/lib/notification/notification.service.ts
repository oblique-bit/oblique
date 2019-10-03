import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
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
	clearAllOnNavigate = this.config.clearAllOnNavigate;
	private readonly eventSubject: Subject<INotification> = new Subject<INotification>();
	private readonly events$ = this.eventSubject.asObservable();


	constructor(public config: NotificationConfig, router: Router) {
		router.events.pipe(filter(evt => evt instanceof NavigationEnd && this.clearAllOnNavigate)).subscribe(() => this.clearAll());
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
			idPrefix: config.idPrefix || `notification-${type}-${this.formatMessage(config.message)}-`,
			type: type,
			message: config.message,
			messageParams: config.messageParams,
			title: config.title || this.config[type].title,
			titleParams: config.titleParams,
			channel: config.channel || this.config[type].channel || this.config.channel,
			sticky: config.sticky != null ? config.sticky : (this.config[type].sticky != null ? this.config[type].sticky : this.config.sticky),
			timeout: config.timeout || this.config[type].timeout || this.config.timeout
		};
		this.eventSubject.next(notification);

		return notification;
	}

	// Do not make it static as it breaks the build
	private formatMessage(message: string): string {
		return message.indexOf('i18n') === 0
			? message
			: message.substr(0, 50).replace(/[^\w]/gi, '_').toLowerCase();
	}
}
