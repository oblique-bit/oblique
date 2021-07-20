import {ObENotificationType} from '../../notification/notification.module';
import {Injectable} from '@angular/core';

@Injectable()
export class ObMockHttpApiInterceptorConfig {
	api = {
		url: '',
		spinner: true,
		notification: {
			active: true,
			severity: ObENotificationType.ERROR,
			title: undefined,
			text: undefined,
			sticky: undefined
		}
	};
	timeout = 15000;
}
