import {TestBed} from '@angular/core/testing';
import {Subject} from 'rxjs';
import {ObServiceNavigationTimeoutCookieService} from './service-navigation-timeout-cookie.service';
import {ObServiceNavigationTimeoutCookieActivityService} from './service-navigation-timeout-cookie-activity.service';
import {ObGlobalEventsService} from '../../global-events/global-events.service';

jest.useFakeTimers();
describe('ServiceNavigationTimeoutCookieActivityService', () => {
	let service: ObServiceNavigationTimeoutCookieActivityService;
	let fakeWheel: Subject<string>;
	let fakeMouseMove: Subject<string>;
	let fakeClick: Subject<string>;
	let fakeKeyDown: Subject<string>;
	const fakeSetCookie = jest.fn();

	beforeEach(() => {
		fakeWheel = new Subject<string>();
		fakeMouseMove = new Subject<string>();
		fakeClick = new Subject<string>();
		fakeKeyDown = new Subject<string>();

		TestBed.configureTestingModule({
			providers: [
				ObServiceNavigationTimeoutCookieActivityService,
				{provide: ObServiceNavigationTimeoutCookieService, useValue: {setCookie: fakeSetCookie}},
				{
					provide: ObGlobalEventsService,
					useValue: {
						wheel$: fakeWheel.asObservable(),
						mouseMove$: fakeMouseMove.asObservable(),
						click$: fakeClick.asObservable(),
						keyDown$: fakeKeyDown.asObservable()
					}
				}
			]
		});
		service = TestBed.inject(ObServiceNavigationTimeoutCookieActivityService);
		fakeSetCookie.mockReset();
		jest.clearAllTimers();
	});

	it('create an instance', () => {
		expect(service).toBeTruthy();
	});

	describe('refreshActivity()', () => {
		it.each([
			['wheel', () => fakeWheel],
			['mouse move', () => fakeMouseMove],
			['click', () => fakeClick],
			['key down', () => fakeKeyDown]
		])('should be triggered when there is a %s event', (__, fakeEvent) => {
			fakeEvent().next('');
			expect(fakeSetCookie).toBeCalledTimes(1);
		});

		it('should be able to handle multiple events', () => {
			fakeWheel.next('');
			jest.advanceTimersByTime(10000);
			fakeMouseMove.next('');
			jest.advanceTimersByTime(10000);
			fakeClick.next('');
			jest.advanceTimersByTime(10000);
			fakeKeyDown.next('');
			jest.advanceTimersByTime(10000);
			expect(fakeSetCookie).toBeCalledTimes(4);
		});

		it('should set the cookie with the correct data', () => {
			fakeWheel.next('');
			const now = Date.now();
			expect(fakeSetCookie).toBeCalledWith('eportal-last-user-activity', `${now}`);
		});
	});
});
