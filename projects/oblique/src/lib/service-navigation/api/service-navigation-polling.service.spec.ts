import {TestBed, discardPeriodicTasks, fakeAsync, tick} from '@angular/core/testing';
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
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('state$', () => {
		it('should be an observable', () => {
			expect(service.state$ instanceof Observable).toBe(true);
		});

		it('should not emit default data', fakeAsync(() => {
			let hasEmitted = false;
			service.state$.subscribe(() => {
				hasEmitted = true;
			});
			tick(1000);
			expect(hasEmitted).toBe(false);
		}));
	});

	describe('initializeStateUpdate', () => {
		describe.each([
			{time: 0, number: 2},
			{time: 999, number: 2},
			{time: 1000, number: 3},
			{time: 4500, number: 6},
		])('with 1s interval and $time ms processing time', ({time, number}) => {
			beforeEach(fakeAsync(() => {
				service.initializeStateUpdate(1, 1, 'http://rootUrl/', 1);
				tick(time);
				discardPeriodicTasks();
			}));

			it(`should call "stateApiService.get" ${number} times`, () => {
				expect(stateApiService.get).toHaveBeenCalledTimes(number);
			});

			it('should call "stateApiService.get" with "http://rootUrl/"', () => {
				expect(stateApiService.get).toHaveBeenCalledWith('http://rootUrl/', 1);
			});
		});

		describe.each([
			{time: 0, number: 2},
			{time: 999, number: 2},
			{time: 1000, number: 2},
			{time: 4500, number: 4},
		])('with 2s interval and $time ms processing time', ({time, number}) => {
			beforeEach(fakeAsync(() => {
				service.initializeStateUpdate(1, 2, 'http://rootUrl/', 1);
				tick(time);
				discardPeriodicTasks();
			}));

			it(`should call "countApiService.get" ${number} times`, () => {
				expect(countApiService.get).toHaveBeenCalledTimes(number);
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

		it('should throw an error', fakeAsync(() => {
			service.initializeStateUpdate(1, 1, 'http://rootUrl/', 1);
			expect(() => tick(1000)).toThrow('Cannot load service navigation state');
		}));

		it('should show a notification', fakeAsync(() => {
			service.initializeStateUpdate(1, 1, 'http://rootUrl/', 1);
			try {
				tick(1000);
			} catch {
				/* empty */
			}
			expect(notification.error).toHaveBeenCalledWith({
				message: 'i18n.oblique.service-navigation.state.error.message',
				title: 'i18n.oblique.service-navigation.state.error.title',
			});
		}));
	});
});
