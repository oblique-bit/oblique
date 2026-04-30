import {ObENotificationType} from '../notification/notification.model';
import {ObIHttpApiRequest} from './http-api-interceptor.model';
import {ObHttpApiInterceptorEvents} from './http-api-interceptor.events';

describe(ObHttpApiInterceptorEvents.name, () => {
	let events: ObHttpApiInterceptorEvents;

	beforeEach(() => {
		events = new ObHttpApiInterceptorEvents();
	});

	it('emits request interception events through the public observable', () => {
		const request = createRequest();
		const next = jest.fn();

		events.requestIntercepted.subscribe(next);

		events.requestIntercept(request);

		expect(next).toHaveBeenCalledWith(request);
	});

	it('emits session expiration events through the public observable', () => {
		const next = jest.fn();

		events.sessionExpired.subscribe(next);

		events.sessionExpire();

		expect(next).toHaveBeenCalledTimes(1);
	});

	it('deactivates the spinner on the next configured API calls only', () => {
		const firstRequest = createRequest();
		const secondRequest = createRequest();
		const thirdRequest = createRequest();

		events.deactivateSpinnerOnNextAPICalls(2);

		events.requestIntercept(firstRequest);
		events.requestIntercept(secondRequest);
		events.requestIntercept(thirdRequest);

		expect(firstRequest.spinner).toBe(false);
		expect(secondRequest.spinner).toBe(false);
		expect(thirdRequest.spinner).toBe(true);
		expect(firstRequest.notification.active).toBe(true);
	});

	it('deactivates notifications on the next API call only', () => {
		const firstRequest = createRequest();
		const secondRequest = createRequest();

		events.deactivateNotificationOnNextAPICalls();

		events.requestIntercept(firstRequest);
		events.requestIntercept(secondRequest);

		expect(firstRequest.notification.active).toBe(false);
		expect(firstRequest.spinner).toBe(true);
		expect(secondRequest.notification.active).toBe(true);
	});

	it('deactivates the spinner on the next API call when no number is provided', () => {
		const firstRequest = createRequest();
		const secondRequest = createRequest();

		events.deactivateSpinnerOnNextAPICalls();

		events.requestIntercept(firstRequest);
		events.requestIntercept(secondRequest);

		expect(firstRequest.spinner).toBe(false);
		expect(secondRequest.spinner).toBe(true);
	});

	it('deactivates both notifications and spinner on the next configured API calls only', () => {
		const firstRequest = createRequest();
		const secondRequest = createRequest();
		const thirdRequest = createRequest();

		events.deactivateOnNextAPICalls(2);

		events.requestIntercept(firstRequest);
		events.requestIntercept(secondRequest);
		events.requestIntercept(thirdRequest);

		expect(firstRequest.notification.active).toBe(false);
		expect(firstRequest.spinner).toBe(false);
		expect(secondRequest.notification.active).toBe(false);
		expect(secondRequest.spinner).toBe(false);
		expect(thirdRequest.notification.active).toBe(true);
		expect(thirdRequest.spinner).toBe(true);
	});

	it('deactivates both notifications and spinner on the next API call when no number is provided', () => {
		const firstRequest = createRequest();
		const secondRequest = createRequest();

		events.deactivateOnNextAPICalls();

		events.requestIntercept(firstRequest);
		events.requestIntercept(secondRequest);

		expect(firstRequest.notification.active).toBe(false);
		expect(firstRequest.spinner).toBe(false);
		expect(secondRequest.notification.active).toBe(true);
		expect(secondRequest.spinner).toBe(true);
	});

	function createRequest(): ObIHttpApiRequest {
		return {
			notification: {
				active: true,
				severity: ObENotificationType.ERROR,
				title: undefined,
				text: undefined,
				sticky: undefined,
			},
			spinner: true,
			spinnerChannel: 'oblique',
		};
	}
});
