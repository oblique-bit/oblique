import {ObENotificationType} from '../../notification/notification.module';
import {Injectable} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Injectable()
export class ObMockHttpApiInterceptorConfig {
	api = {
		url: '',
		spinner: true,
		spinnerChannel: 'default',
		notification: {
			active: true,
			severity: ObENotificationType.ERROR,
			title: undefined,
			text: undefined,
			sticky: undefined,
		},
	};
	timeout = 15000;
}
