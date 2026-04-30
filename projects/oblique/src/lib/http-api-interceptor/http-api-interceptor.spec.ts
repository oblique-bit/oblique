import {HttpErrorResponse, HttpEvent, HttpRequest, HttpResponse} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subject, of, throwError} from 'rxjs';
import {WINDOW} from '../utilities';
import {ObENotificationType} from '../notification/notification.model';
import {ObNotificationService} from '../notification/notification.module';
import {ObSpinnerService} from '../spinner/spinner.module';
import {ObHttpApiInterceptorConfig} from './http-api-interceptor.config';
import {ObHttpApiInterceptorEvents} from './http-api-interceptor.events';
import {ObHttpApiInterceptor} from './http-api-interceptor';

describe(ObHttpApiInterceptor.name, () => {
	let config: ObHttpApiInterceptorConfig;
	let events: ObHttpApiInterceptorEvents;
	let interceptor: ObHttpApiInterceptor;
	let spinner: {activate: jest.Mock; forceDeactivate: jest.Mock};
	let notificationService: {error: jest.Mock; warning: jest.Mock; send: jest.Mock};
	let translate: {get: jest.Mock};
	let windowMock: {setTimeout: jest.Mock};

	beforeEach(() => {
		jest.clearAllMocks();

		spinner = {
			activate: jest.fn(),
			forceDeactivate: jest.fn(),
		};
		notificationService = {
			error: jest.fn(),
			warning: jest.fn(),
			send: jest.fn(),
		};
		translate = {
			get: jest.fn(),
		};
		windowMock = {
			setTimeout: jest.fn(),
		};

		TestBed.configureTestingModule({
			providers: [
				ObHttpApiInterceptor,
				ObHttpApiInterceptorConfig,
				ObHttpApiInterceptorEvents,
				{provide: ObSpinnerService, useValue: spinner},
				{provide: ObNotificationService, useValue: notificationService},
				{provide: TranslateService, useValue: translate},
				{provide: WINDOW, useValue: windowMock},
			],
		});

		config = TestBed.inject(ObHttpApiInterceptorConfig);
		events = TestBed.inject(ObHttpApiInterceptorEvents);
		interceptor = TestBed.inject(ObHttpApiInterceptor);
		config.api.url = '/api';
		config.timeout = 0;
		translate.get.mockReturnValue(of({}));
		windowMock.setTimeout.mockReturnValue(0);
	});

	it('adds the SPA header and toggles the spinner on the default channel for API requests', () => {
		let interceptedRequest: HttpRequest<unknown> | undefined;

		intercept('/api/users', request => {
			interceptedRequest = request;
			return of(new HttpResponse({status: 200}));
		}).subscribe();

		expect(interceptedRequest?.headers.get('X-Requested-With')).toBe('XMLHttpRequest');
		expect(spinner.activate).toHaveBeenCalledWith(ObSpinnerService.CHANNEL);
		expect(spinner.forceDeactivate).toHaveBeenCalledWith(ObSpinnerService.CHANNEL);
	});

	it('does not add the SPA header or toggle the spinner for non API requests', () => {
		let interceptedRequest: HttpRequest<unknown> | undefined;

		intercept('/assets/config.json', request => {
			interceptedRequest = request;
			return of(new HttpResponse({status: 200}));
		}).subscribe();

		expect(interceptedRequest?.headers.has('X-Requested-With')).toBe(false);
		expect(spinner.activate).not.toHaveBeenCalled();
		expect(spinner.forceDeactivate).not.toHaveBeenCalled();
	});

	it('uses the configured spinner channel and only deactivates it when the last request completes', () => {
		config.api.spinnerChannel = 'details';
		const firstResponse$ = interceptWithPendingResponse('/api/first');
		const secondResponse$ = interceptWithPendingResponse('/api/second');

		expect(spinner.activate).toHaveBeenNthCalledWith(1, 'details');
		expect(spinner.activate).toHaveBeenNthCalledWith(2, 'details');

		firstResponse$.next(new HttpResponse({status: 200}));
		firstResponse$.complete();

		expect(spinner.forceDeactivate).not.toHaveBeenCalled();

		secondResponse$.next(new HttpResponse({status: 200}));
		secondResponse$.complete();

		expect(spinner.forceDeactivate).toHaveBeenCalledTimes(1);
		expect(spinner.forceDeactivate).toHaveBeenCalledWith('details');
	});

	it('still deactivates the spinner when request tracking is missing during finalize', () => {
		const response$ = interceptWithPendingResponse('/api/users');

		(interceptor as unknown as {activeRequestUrlsByChannel: Map<string, string[]>}).activeRequestUrlsByChannel =
			new Map();

		response$.next(new HttpResponse({status: 200}));
		response$.complete();

		expect(spinner.forceDeactivate).toHaveBeenCalledWith(ObSpinnerService.CHANNEL);
	});

	it('uses the request spinner overrides emitted by the interceptor events only for the intercepted call', () => {
		events.requestIntercepted.subscribe(request => {
			request.spinner = false;
			request.spinnerChannel = '';
		});

		intercept('/api/users').subscribe();

		expect(spinner.activate).not.toHaveBeenCalled();
		expect(spinner.forceDeactivate).not.toHaveBeenCalled();
	});

	it('uses request spinner channels independently for concurrent API calls with the same URL', () => {
		let requestNumber = 0;
		events.requestIntercepted.subscribe(request => {
			requestNumber++;
			if (requestNumber === 1) {
				request.spinnerChannel = 'details';
			}
		});
		const firstResponse$ = interceptWithPendingResponse('/api/users');
		const secondResponse$ = interceptWithPendingResponse('/api/users');

		expect(spinner.activate).toHaveBeenNthCalledWith(1, 'details');
		expect(spinner.activate).toHaveBeenNthCalledWith(2, ObSpinnerService.CHANNEL);

		firstResponse$.next(new HttpResponse({status: 200}));
		firstResponse$.complete();

		expect(spinner.forceDeactivate).toHaveBeenNthCalledWith(1, 'details');

		secondResponse$.next(new HttpResponse({status: 200}));
		secondResponse$.complete();

		expect(spinner.forceDeactivate).toHaveBeenNthCalledWith(2, ObSpinnerService.CHANNEL);
	});

	it('keeps the spinner active until all requests on the same channel complete even when they share the same URL', () => {
		const firstResponse$ = interceptWithPendingResponse('/api/users');
		const secondResponse$ = interceptWithPendingResponse('/api/users');

		expect(spinner.activate).toHaveBeenNthCalledWith(1, ObSpinnerService.CHANNEL);
		expect(spinner.activate).toHaveBeenNthCalledWith(2, ObSpinnerService.CHANNEL);

		firstResponse$.next(new HttpResponse({status: 200}));
		firstResponse$.complete();

		expect(spinner.forceDeactivate).not.toHaveBeenCalled();

		secondResponse$.next(new HttpResponse({status: 200}));
		secondResponse$.complete();

		expect(spinner.forceDeactivate).toHaveBeenCalledTimes(1);
		expect(spinner.forceDeactivate).toHaveBeenCalledWith(ObSpinnerService.CHANNEL);
	});

	it('starts a timeout warning and clears the timer when the request completes', () => {
		const clearTimeoutSpy = jest.spyOn(globalThis, 'clearTimeout').mockImplementation();
		config.timeout = 2500;
		windowMock.setTimeout.mockImplementation(callback => {
			callback();
			return 42;
		});

		intercept('/api/users').subscribe();

		expect(windowMock.setTimeout).toHaveBeenCalledTimes(1);
		expect(notificationService.warning).toHaveBeenCalledWith('i18n.oblique.http.error.timeout');
		expect(clearTimeoutSpy).toHaveBeenCalledWith(42);
	});

	it('reports unknown errors with the generic notification and rethrows the original error', done => {
		const unknownError = new Error('boom');

		intercept('/api/users', () => throwError(() => unknownError)).subscribe({
			next: () => done.fail('Expected the request to fail.'),
			error: error => {
				expect(error).toBe(unknownError);
				expect(notificationService.error).toHaveBeenCalledWith('i18n.oblique.http.error.general');
				expect(notificationService.send).not.toHaveBeenCalled();
				done();
			},
		});
	});

	it('emits the session expired event for 401 responses and skips the notification', done => {
		const sessionExpireSpy = jest.spyOn(events, 'sessionExpire');

		intercept('/api/users', () =>
			throwError(
				() =>
					new HttpErrorResponse({
						status: 401,
						statusText: 'Unauthorized',
						url: '/api/users',
					})
			)
		).subscribe({
			next: () => done.fail('Expected the request to fail.'),
			error: error => {
				expect(error).toBeInstanceOf(HttpErrorResponse);
				expect(sessionExpireSpy).toHaveBeenCalledTimes(1);
				expect(notificationService.send).not.toHaveBeenCalled();
				done();
			},
		});
	});

	it('sends a translated HTTP error notification', done => {
		translate.get.mockReturnValue(
			of({
				'i18n.oblique.http.error.status.500': 'Translated text',
				'i18n.oblique.http.error.status.500.title': 'Translated title',
			})
		);

		intercept('/api/users', () =>
			throwError(
				() =>
					new HttpErrorResponse({
						status: 500,
						statusText: 'Server Error',
						url: '/api/users',
					})
			)
		).subscribe({
			next: () => done.fail('Expected the request to fail.'),
			error: error => {
				expect(error).toBeInstanceOf(HttpErrorResponse);
				expect(translate.get).toHaveBeenCalledWith([
					'i18n.oblique.http.error.status.500',
					'i18n.oblique.http.error.status.500.title',
				]);
				expect(notificationService.send).toHaveBeenCalledWith({
					message: 'i18n.oblique.http.error.status.500',
					title: 'i18n.oblique.http.error.status.500.title',
					type: ObENotificationType.ERROR,
					sticky: undefined,
				});
				done();
			},
		});
	});

	it('falls back to the generic message and status text when translations are missing', done => {
		translate.get.mockReturnValue(
			of({
				'i18n.oblique.http.error.status.418': 'i18n.oblique.http.error.status.418',
				'i18n.oblique.http.error.status.418.title': 'i18n.oblique.http.error.status.418.title',
			})
		);

		intercept('/api/users', () =>
			throwError(
				() =>
					new HttpErrorResponse({
						status: 418,
						statusText: 'Teapot',
						url: '/api/users',
					})
			)
		).subscribe({
			next: () => done.fail('Expected the request to fail.'),
			error: error => {
				expect(error).toBeInstanceOf(HttpErrorResponse);
				expect(notificationService.send).toHaveBeenCalledWith({
					message: 'i18n.oblique.http.error.general',
					title: 'Teapot',
					type: ObENotificationType.ERROR,
					sticky: undefined,
				});
				done();
			},
		});
	});

	it('uses the request notification overrides emitted by the interceptor events', done => {
		config.api.notification = {
			active: true,
			severity: ObENotificationType.WARNING,
			title: undefined,
			text: undefined,
			sticky: undefined,
		};
		events.requestIntercepted.subscribe(request => {
			request.notification.severity = ObENotificationType.SUCCESS;
			request.notification.title = 'custom-title';
			request.notification.text = 'custom-text';
			request.notification.sticky = true;
		});

		intercept('/api/users', () =>
			throwError(
				() =>
					new HttpErrorResponse({
						status: 400,
						statusText: 'Bad Request',
						url: '/api/users',
					})
			)
		).subscribe({
			next: () => done.fail('Expected the request to fail.'),
			error: error => {
				expect(error).toBeInstanceOf(HttpErrorResponse);
				expect(notificationService.send).toHaveBeenCalledWith({
					message: 'custom-text',
					title: 'custom-title',
					type: ObENotificationType.SUCCESS,
					sticky: true,
				});
				done();
			},
		});
	});

	it('skips the HTTP error notification when the next API call disables it through the interceptor events', done => {
		events.deactivateNotificationOnNextAPICalls();

		intercept('/api/users', () =>
			throwError(
				() =>
					new HttpErrorResponse({
						status: 400,
						statusText: 'Bad Request',
						url: '/api/users',
					})
			)
		).subscribe({
			next: () => done.fail('Expected the request to fail.'),
			error: error => {
				expect(error).toBeInstanceOf(HttpErrorResponse);
				expect(notificationService.send).not.toHaveBeenCalled();
				expect(notificationService.error).not.toHaveBeenCalled();
				done();
			},
		});
	});

	it('applies notification overrides only to the next API call', done => {
		events.deactivateNotificationOnNextAPICalls();

		intercept('/api/users', () =>
			throwError(
				() =>
					new HttpErrorResponse({
						status: 400,
						statusText: 'Bad Request',
						url: '/api/users',
					})
			)
		).subscribe({
			next: () => done.fail('Expected the first request to fail.'),
			error: firstError => {
				expect(firstError).toBeInstanceOf(HttpErrorResponse);
				expect(notificationService.send).not.toHaveBeenCalled();

				intercept('/api/users', () =>
					throwError(
						() =>
							new HttpErrorResponse({
								status: 400,
								statusText: 'Bad Request',
								url: '/api/users',
							})
					)
				).subscribe({
					next: () => done.fail('Expected the second request to fail.'),
					error: secondError => {
						expect(secondError).toBeInstanceOf(HttpErrorResponse);
						expect(notificationService.send).toHaveBeenCalledTimes(1);
						done();
					},
				});
			},
		});
	});

	function intercept(
		url: string,
		handle: (request: HttpRequest<unknown>) => Observable<HttpEvent<unknown>> = () =>
			of(new HttpResponse({status: 200}))
	): Observable<HttpEvent<unknown>> {
		return interceptor.intercept(new HttpRequest('GET', url), {
			handle: request => handle(request),
		});
	}

	function interceptWithPendingResponse(url: string): Subject<HttpEvent<unknown>> {
		const response$ = new Subject<HttpEvent<unknown>>();

		intercept(url, () => response$).subscribe();

		return response$;
	}
});
