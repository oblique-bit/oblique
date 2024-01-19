import {ObENotificationType} from '../../notification/notification.module';
import {Injectable} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
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
