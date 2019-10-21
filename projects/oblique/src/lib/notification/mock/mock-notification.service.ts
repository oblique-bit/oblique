import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {INotification, NotificationType} from '../notification.interfaces';
import {NotificationConfig} from '../notification.config';

@Injectable()
export class MockNotificationService {
	clearAllOnNavigate = false;

	events = new Subject<INotification>();

	constructor(public config: NotificationConfig) {
	}

	info(config: INotification | string): INotification {
		return {} as INotification;
	}

	success(config: INotification | string): INotification {
		return {} as INotification;
	}

	warning(config: INotification | string): INotification {
		return {} as INotification;
	}

	error(config: INotification | string): INotification {
		return {} as INotification;
	}

	send(config: INotification | string, type?: NotificationType): INotification {
		return {} as INotification;
	}

	clear(channel): void {
	}

	clearAll(): void {
	}
}
