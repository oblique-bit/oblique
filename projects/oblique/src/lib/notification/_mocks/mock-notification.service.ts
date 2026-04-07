import {Injectable, inject} from '@angular/core';
import {Subject} from 'rxjs';
import {ObENotificationType, ObINotification} from '../notification.model';
import {ObNotificationConfig} from '../notification.config';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Injectable()
export class ObMockNotificationService {
	config = inject(ObNotificationConfig);
	clearAllOnNavigate = false;

	events = new Subject<ObINotification>();

	info(config: ObINotification | string): ObINotification {
		return {} as ObINotification;
	}

	success(config: ObINotification | string): ObINotification {
		return {} as ObINotification;
	}

	warning(config: ObINotification | string): ObINotification {
		return {} as ObINotification;
	}

	error(config: ObINotification | string): ObINotification {
		return {} as ObINotification;
	}

	send(config: ObINotification | string, type?: ObENotificationType): ObINotification {
		return {} as ObINotification;
	}

	clear(channel): void {}

	clearAll(): void {}
}
