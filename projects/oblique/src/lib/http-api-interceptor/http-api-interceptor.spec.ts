import {async, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController, TestRequest} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {of} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {ObIHttpApiRequest, ObHttpApiInterceptorEvents} from './http-api-interceptor.events';
import {ObHttpApiInterceptorConfig} from './http-api-interceptor.config';
import {ObSpinnerService} from '../spinner/spinner.service';
import {ObNotificationService} from '../notification/notification.service';
import {ObENotificationType} from '../notification/notification.interfaces';

@Injectable()
class DataService {
	static ROOT_URL = 'http://jsonplaceholder.typicode.com';

	constructor(private readonly http: HttpClient) {}

	getUsers() {
		return this.http.get(`${DataService.ROOT_URL}/users`);
	}

	getError(code: number) {
		return this.http.get(`${DataService.ROOT_URL}/${code}`);
	}
}

class MockSpinnerService {
	activate() {
		//
	}

	deactivate() {
		//
	}
}

class MockNotificationService {
	send() {
		//
	}

	error() {
		//
	}

	warning() {
		//
	}
}

class MockHttpApiInterceptorEvents {
	requestIntercepted = of({} as ObIHttpApiRequest);
}

describe('HttpApiInterceptor', () => {
	let service: DataService;
	let httpMock: HttpTestingController;
	let config: ObHttpApiInterceptorConfig;
	let events: ObHttpApiInterceptorEvents;
	let spinner: ObSpinnerService;
	let notification: ObNotificationService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				DataService,
				{provide: ObHttpApiInterceptorEvents, useClass: MockHttpApiInterceptorEvents},
				{provide: ObSpinnerService, useClass: MockSpinnerService},
				{provide: ObNotificationService, useClass: MockNotificationService}
			]
		});

		service = TestBed.get(DataService);
		httpMock = TestBed.get(HttpTestingController);
		config = TestBed.get(ObHttpApiInterceptorConfig);
		events = TestBed.get(ObHttpApiInterceptorEvents);
		spinner = TestBed.get(ObSpinnerService);
		notification = TestBed.get(ObNotificationService);
	}));

	it('should add an X-Requested-With header', () => {
		service = TestBed.get(DataService);
		const httpRequest = getUsers();
		expect(httpRequest.request.headers.has('X-Requested-With'));
	});

	it('should emit a requestIntercepted event', async () => {
		getUsers();
		const evt = await events.requestIntercepted.toPromise();
		expect(evt).toBeTruthy();
	});

	// it('should emit a sessionExpired event in case of 401', () => {
	// 	spyOn(events.expired_exported, 'next');
	// 	getError(401, () => expect(events.expired_exported.next).toHaveBeenCalled());
	// });

	xit('should activate spinner with spinner enabled', () => {
		config.api.spinner = true;
		spyOn(spinner, 'activate');
		spyOn(spinner, 'deactivate');
		getUsers(() => expect(spinner.deactivate).toHaveBeenCalled());
		expect(spinner.activate).toHaveBeenCalled();
	});

	xit('should not activate spinner when spinner is disabled', () => {
		config.api.spinner = false;
		spyOn(spinner, 'activate');
		spyOn(spinner, 'deactivate');
		getUsers(() => expect(spinner.deactivate).not.toHaveBeenCalled());
		expect(spinner.activate).not.toHaveBeenCalled();
	});

	xit('should not display a notification on success when notification is enabled', () => {
		config.api.notification.active = true;
		spyOn(notification, 'send');
		getUsers(() => expect(notification.send).not.toHaveBeenCalled());
	});

	xit('should display a notification on error when notification is enabled', () => {
		config.api.notification.active = true;
		spyOn(notification, 'send');
		getError(404, () => expect(notification.send).toHaveBeenCalled());
	});

	xit('should not display a notification on error when notification is disabled', () => {
		config.api.notification.active = false;
		spyOn(notification, 'send');
		getError(404, () => expect(notification.send).not.toHaveBeenCalled());
	});

	xit('should display a notification or error when notification is disabled but the http status is 500', () => {
		config.api.notification.active = false;
		config.api.notification.title = 'test';
		config.api.notification.text = 'test';
		config.api.notification.severity = ObENotificationType.ERROR;
		spyOn(notification, 'send');
		getError(500, () => expect(notification.send).toHaveBeenCalledWith('test', 'test', ObENotificationType.ERROR));
	});

	xit('should display a notification on error when notification is disabled but http status is 0', () => {
		config.api.notification.active = false;
		config.api.notification.title = 'test';
		config.api.notification.text = 'test';
		config.api.notification.severity = ObENotificationType.ERROR;
		spyOn(notification, 'send');
		getError(0, () => expect(notification.send).toHaveBeenCalledWith('test', 'test', ObENotificationType.ERROR));
	});

	xit('should display a notification after timeout is expired', done => {
		config.timeout = 1;
		spyOn(notification, 'warning');
		getAsyncUsers(() => {
			expect(notification.warning).toHaveBeenCalledWith('i18n.error.other.timeout');
			done();
		});
	});

	function getUsers(success?: Function): TestRequest {
		const req = buildRequest(success);
		req.flush([{name: 'bob'}]);
		return req;
	}

	function getAsyncUsers(success?: Function): TestRequest {
		const req = buildRequest(success);
		setTimeout(() => {
			req.flush([{name: 'bob'}]);
		}, 2);

		return req;
	}

	function buildRequest(success?: Function): TestRequest {
		// call success in `finalize` because `subscribe` is called before `complete` callback
		service
			.getUsers()
			.pipe(finalize(() => success && success()))
			.subscribe(response => {
				expect(response).toBeTruthy();
			});
		const req = httpMock.expectOne(`${DataService.ROOT_URL}/users`);
		expect(req.request.method).toEqual('GET');

		return req;
	}

	function getError(code: number, error?: Function): TestRequest {
		service.getError(code).subscribe(undefined, response => {
			expect(response).toBeTruthy();
			if (error) {
				error();
			}
		});
		const req = httpMock.expectOne(`${DataService.ROOT_URL}/${code}`);
		expect(req.request.method).toEqual('GET');
		req.flush('', {status: code, statusText: getStatusText(code)});

		return req;
	}

	function getStatusText(code: number): string {
		switch (code) {
			case 200:
				return 'OK';
			case 401:
				return 'UNAUTHORIZED';
			case 404:
				return 'NOT FOUND';
			case 500:
				return 'SERVER ERROR';
			case 0:
				return 'SERVICE UNAVAILABLE';
			default:
				return 'UNKNOWN CODE';
		}
	}
});
