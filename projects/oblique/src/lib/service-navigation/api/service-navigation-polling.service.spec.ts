import {TestBed, discardPeriodicTasks, fakeAsync, tick} from '@angular/core/testing';
import {Observable, of} from 'rxjs';
import {ObServiceNavigationStateApiService} from './service-navigation-state-api.service';
import {ObServiceNavigationCountApiService} from './service-navigation-message-count-api.service';
import {ObServiceNavigationPollingService} from './service-navigation-polling.service';

describe('ObServiceNavigationPollingService', () => {
	let service: ObServiceNavigationPollingService;
	let countApiService: ObServiceNavigationCountApiService;
	let stateApiService: ObServiceNavigationStateApiService;
	const mockData = {
		test: true
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{provide: ObServiceNavigationStateApiService, useValue: {get: jest.fn().mockReturnValue(of(mockData))}},
				{provide: ObServiceNavigationCountApiService, useValue: {get: jest.fn().mockReturnValue(of({messageCount: 42}))}},
				ObServiceNavigationPollingService
			]
		});

		service = TestBed.inject(ObServiceNavigationPollingService);
		stateApiService = TestBed.inject(ObServiceNavigationStateApiService);
		countApiService = TestBed.inject(ObServiceNavigationCountApiService);
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
			{time: 0, number: 1},
			{time: 999, number: 1},
			{time: 1000, number: 2},
			{time: 4500, number: 5}
		])('with 1s interval and $time ms processing time', ({time, number}) => {
			beforeEach(fakeAsync(() => {
				service.initializeStateUpdate(1, 1, 'http://rootUrl/');
				tick(time);
				discardPeriodicTasks();
			}));

			it(`should call "stateApiService.get" ${number} times`, () => {
				expect(stateApiService.get).toHaveBeenCalledTimes(number);
			});

			it('should call "stateApiService.get" with "http://rootUrl/"', () => {
				expect(stateApiService.get).toHaveBeenCalledWith('http://rootUrl/');
			});
		});

		describe.each([
			{time: 0, number: 1},
			{time: 999, number: 1},
			{time: 1000, number: 1},
			{time: 4500, number: 3}
		])('with 2s interval and $time ms processing time', ({time, number}) => {
			beforeEach(fakeAsync(() => {
				service.initializeStateUpdate(1, 2, 'http://rootUrl/');
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
});
