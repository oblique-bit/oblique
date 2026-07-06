import {TestBed} from '@angular/core/testing';
import {Observable, of, throwError} from 'rxjs';
import {ObNotificationService} from '../../notification/notification.service';
import {ObServiceNavigationStateApiService} from './service-navigation-state-api.service';
import {ObServiceNavigationCountApiService} from './service-navigation-message-count-api.service';
import {ObServiceNavigationPollingService} from './service-navigation-polling.service';

describe('ObServiceNavigationPollingService', () => {
	let service: ObServiceNavigationPollingService;
	let countApiService: ObServiceNavigationCountApiService;
	let stateApiService: ObServiceNavigationStateApiService;
	let notification: ObNotificationService;

	const mockStateResponse = {data: {test: true}};
	const mockCountResponse = {data: 42};

	beforeEach(() => {
		jest.useFakeTimers();
		TestBed.configureTestingModule({
			providers: [
				{
					provide: ObServiceNavigationStateApiService,
					useValue: {get: jest.fn().mockReturnValue(of(mockStateResponse))},
				},
				{
					provide: ObServiceNavigationCountApiService,
					useValue: {get: jest.fn().mockReturnValue(of(mockCountResponse))},
				},
				{provide: ObNotificationService, useValue: {error: jest.fn(), success: jest.fn()}},
				ObServiceNavigationPollingService,
			],
		});

		service = TestBed.inject(ObServiceNavigationPollingService);
		stateApiService = TestBed.inject(ObServiceNavigationStateApiService);
		countApiService = TestBed.inject(ObServiceNavigationCountApiService);
		notification = TestBed.inject(ObNotificationService);
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.clearAllTimers();
		jest.useRealTimers();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('state$', () => {
		it('should be an observable', () => {
			expect(service.state$ instanceof Observable).toBe(true);
		});

		it('should not emit default data', () => {
			let hasEmitted = false;
			service.state$.subscribe(() => {
				hasEmitted = true;
			});
			jest.advanceTimersByTime(1000);
			expect(hasEmitted).toBe(false);
		});
	});

	describe('initializeStateUpdate', () => {
		it('should call both polling endpoints immediately when initialized', () => {
			service.initializeStateUpdate(1, 2, 'http://rootUrl/', 1);
			jest.advanceTimersByTime(0);

			expect(stateApiService.get).toHaveBeenCalledTimes(1);
			expect(stateApiService.get).toHaveBeenCalledWith('http://rootUrl/', 1);
			expect(countApiService.get).toHaveBeenCalledTimes(1);
			expect(countApiService.get).toHaveBeenCalledWith('http://rootUrl/');
		});

		describe.each([
			{elapsedMs: 0, expectedCalls: 1},
			{elapsedMs: 999, expectedCalls: 1},
			{elapsedMs: 1000, expectedCalls: 2},
			{elapsedMs: 4500, expectedCalls: 5},
		])('after $elapsedMs ms with 1s interval', ({elapsedMs, expectedCalls}) => {
			beforeEach(() => {
				service.initializeStateUpdate(1, 1, 'http://rootUrl/', 1);
				jest.advanceTimersByTime(elapsedMs);
			});

			it(`should call "stateApiService.get" ${expectedCalls} times`, () => {
				expect(stateApiService.get).toHaveBeenCalledTimes(expectedCalls);
			});

			it('should call "stateApiService.get" with "http://rootUrl/"', () => {
				expect(stateApiService.get).toHaveBeenCalledWith('http://rootUrl/', 1);
			});
		});

		describe.each([
			{elapsedMs: 0, expectedCalls: 1},
			{elapsedMs: 999, expectedCalls: 1},
			{elapsedMs: 1000, expectedCalls: 1},
			{elapsedMs: 4500, expectedCalls: 3},
		])('after $elapsedMs ms with 2s interval', ({elapsedMs, expectedCalls}) => {
			beforeEach(() => {
				service.initializeStateUpdate(1, 2, 'http://rootUrl/', 1);
				jest.advanceTimersByTime(elapsedMs);
			});

			it(`should call "countApiService.get" ${expectedCalls} times`, () => {
				expect(countApiService.get).toHaveBeenCalledTimes(expectedCalls);
			});

			it('should call "countApiService.get" with "http://rootUrl/"', () => {
				expect(countApiService.get).toHaveBeenCalledWith('http://rootUrl/');
			});
		});
	});

	describe.each([
		{service: 'state', apiService: () => stateApiService},
		{service: 'count', apiService: () => countApiService},
	])('with an error while fetching the $service', ({apiService}) => {
		beforeEach(() => {
			jest.spyOn(apiService(), 'get').mockReturnValue(throwError(() => new Error('test')));
			jest.spyOn(notification, 'error');
		});

		it('should throw an error', () => {
			service.initializeStateUpdate(1, 1, 'http://rootUrl/', 1);
			expect(() => jest.advanceTimersByTime(1000)).toThrow('Cannot load service navigation state');
		});

		it('should show a notification', () => {
			service.initializeStateUpdate(1, 1, 'http://rootUrl/', 1);
			try {
				jest.advanceTimersByTime(1000);
			} catch {
				/* empty */
			}
			expect(notification.error).toHaveBeenCalledWith({
				message: 'i18n.oblique.service-navigation.state.error.message',
				title: 'i18n.oblique.service-navigation.state.error.title',
			});
		});
	});

	describe.each([{status: 500}, {status: 0}])('when a request returns status $status', ({status}) => {
		it('should retry after the state interval', () => {
			jest
				.spyOn(stateApiService, 'get')
				.mockImplementationOnce(() => throwError(() => ({status})))
				.mockReturnValue(of(mockStateResponse));

			service.initializeStateUpdate(2, 60, 'http://rootUrl/', 1);
			jest.advanceTimersByTime(0);

			const callsAfterFirstFailure = jest.mocked(stateApiService.get).mock.calls.length;

			jest.advanceTimersByTime(1999);
			expect(stateApiService.get).toHaveBeenCalledTimes(callsAfterFirstFailure);

			jest.advanceTimersByTime(2);
			expect(jest.mocked(stateApiService.get).mock.calls.length).toBeGreaterThan(callsAfterFirstFailure);
		});

		it('should display a retry notification', () => {
			jest.spyOn(stateApiService, 'get').mockReturnValue(throwError(() => ({status})));

			service.initializeStateUpdate(1, 60, 'http://rootUrl/', 1);
			jest.advanceTimersByTime(1000);

			expect(notification.error).toHaveBeenCalledWith({
				message: 'i18n.oblique.service-navigation.state.error.retry',
				title: 'i18n.oblique.service-navigation.state.error.title',
			});
		});

		it(`should trigger the retry notification only once after two consecutive ${status} errors`, () => {
			jest
				.spyOn(stateApiService, 'get')
				.mockImplementationOnce(() => throwError(() => ({status})))
				.mockImplementationOnce(() => throwError(() => ({status})))
				.mockReturnValue(of(mockStateResponse));

			service.initializeStateUpdate(1, 60, 'http://rootUrl/', 1);
			jest.advanceTimersByTime(1001);

			expect(notification.error).toHaveBeenCalledTimes(1);
		});

		it(`should display an "is back" success notification when a ${status} error is followed by a successful response`, () => {
			jest
				.spyOn(stateApiService, 'get')
				.mockImplementationOnce(() => throwError(() => ({status})))
				.mockReturnValue(of(mockStateResponse));

			service.initializeStateUpdate(1, 60, 'http://rootUrl/', 1);
			jest.advanceTimersByTime(1001);

			expect(notification.success).toHaveBeenCalledWith({
				message: 'i18n.oblique.service-navigation.state.is-back.message',
				title: 'i18n.oblique.service-navigation.state.is-back.title',
			});
		});
	});

	describe.each([{status: 500}, {status: 0}])('when an endpoint fails with status $status', ({status}) => {
		it('should trigger the retry notification when the state endpoint returns the error', () => {
			jest.spyOn(stateApiService, 'get').mockReturnValue(throwError(() => ({status})));

			service.initializeStateUpdate(1, 60, 'http://rootUrl/', 1);
			jest.advanceTimersByTime(1);

			expect(notification.error).toHaveBeenCalledWith({
				message: 'i18n.oblique.service-navigation.state.error.retry',
				title: 'i18n.oblique.service-navigation.state.error.title',
			});
		});

		it('should trigger the retry notification when the count endpoint returns the error', () => {
			jest.spyOn(countApiService, 'get').mockReturnValue(throwError(() => ({status})));

			service.initializeStateUpdate(1, 1, 'http://rootUrl/', 1);
			jest.advanceTimersByTime(1);

			expect(notification.error).toHaveBeenCalledWith({
				message: 'i18n.oblique.service-navigation.state.error.retry',
				title: 'i18n.oblique.service-navigation.state.error.title',
			});
		});
	});
});
