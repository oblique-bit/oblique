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
	const mockData = {
		test: true,
	};

	beforeEach(() => {
		jest.useFakeTimers();
		TestBed.configureTestingModule({
			providers: [
				{provide: ObServiceNavigationStateApiService, useValue: {get: jest.fn().mockReturnValue(of(mockData))}},
				{
					provide: ObServiceNavigationCountApiService,
					useValue: {get: jest.fn().mockReturnValue(of({messageCount: 42}))},
				},
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
});
