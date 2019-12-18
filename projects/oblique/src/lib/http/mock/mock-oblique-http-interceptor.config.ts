import {NotificationType} from '../../notification/notification.module';

export class MockObliqueHttpInterceptorConfig {
	api = {
		url: '',
		spinner: true,
		notification: {
			active: true,
			severity: NotificationType.ERROR,
			title: undefined,
			text: undefined,
			sticky: undefined
		}
	};
	timeout = 15000;
}
