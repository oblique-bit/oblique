import {TestBed} from '@angular/core/testing';
import {BrowserModule} from '@angular/platform-browser';
import {ObServiceNavigationTimeoutService} from './service-navigation-timeout.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ObServiceNavigationService} from '../service-navigation.service';
import {WINDOW} from '../../utilities';
import {BehaviorSubject, of} from 'rxjs';
import Cookies from 'js-cookie';
import {ObServiceNavigationTimeoutCookieActivityService} from './service-navigation-timeout-cookie-activity.service';
import {ObServiceNavigationTimeoutRedirectorService} from './service-navigation-timeout-redirector.service';
import {ObServiceNavigationTimeoutCookieService} from './service-navigation-timeout-cookie.service';
import {ObEPamsEnvironment} from '../service-navigation.model';
import {ObServiceNavigationTimeoutApiService} from '../api/service-navigation-timeout-api.service';
import {ObServiceNavigationTimeoutReturnUrlService} from './service-navigation-timeout-return-url.service';

jest.useFakeTimers();
describe('ServiceNavigationTimeout', () => {
	let service: ObServiceNavigationTimeoutService;
	const fakeLogoutUrl = 'http://fakeLogoutUrl.com';
	const fakeRootUrl = 'https://eportal.admin.ch';
	const fakeWindow = {location: {href: fakeRootUrl}};
	const getLoginStateEmitter = new BehaviorSubject<string>('');
	const fakeHeaderService = {
		getLogoutUrl$: jest.fn(() => of(fakeLogoutUrl)),
		getLoginState$: () => getLoginStateEmitter.asObservable()
	};
	const validCookieTime = '999999999999999';
	const expiredCookieTime = '0';

	const logoutCookieName = 'eportal-logout';
	const timeoutCookieName = 'eportal-timeout';
	const pamsLastRefreshCookieName = 'pams-last-refresh';
	const eportalLastUserActivityCookieName = 'eportal-last-user-activity';
	const logoutReminderCookieName = 'eportal-logout-reminder';

	const fakeRedirectorService = {
		redirectOrEmit: jest.fn(),
		logoutCookieName
	};
	const fakeApiService = {
		refreshPamsToken: jest.fn(() => of())
	};

	function configureTestbed(): void {
		TestBed.configureTestingModule({
			imports: [BrowserModule, HttpClientTestingModule],
			providers: [
				ObServiceNavigationTimeoutService,
				{provide: ObServiceNavigationService, useValue: fakeHeaderService},
				{provide: ObServiceNavigationTimeoutCookieActivityService, useValue: {activityCookieName: eportalLastUserActivityCookieName}},
				{provide: ObServiceNavigationTimeoutRedirectorService, useValue: fakeRedirectorService},
				{provide: ObServiceNavigationTimeoutApiService, useValue: fakeApiService},
				ObServiceNavigationTimeoutReturnUrlService,
				ObServiceNavigationTimeoutCookieService,
				{provide: WINDOW, useValue: fakeWindow}
			]
		});
	}

	beforeEach(() => {
		configureTestbed();
		fakeRedirectorService.redirectOrEmit.mockClear();
		fakeWindow.location.href = fakeRootUrl;

		Cookies.remove(logoutCookieName);
		Cookies.remove(timeoutCookieName);
		Cookies.remove(pamsLastRefreshCookieName);
		Cookies.remove(eportalLastUserActivityCookieName);
		Cookies.remove(logoutReminderCookieName);
		jest.clearAllTimers();
	});

	describe('With service initialised in the beforeEach', () => {
		beforeEach(() => {
			service = TestBed.inject(ObServiceNavigationTimeoutService);
			service.loginState = 'S3OK';
			service.logoutUrl = fakeLogoutUrl;
			service.rootUrl = fakeRootUrl;
			service.setUpEportalUrl(ObEPamsEnvironment.DEV);
			getLoginStateEmitter.next('OK');
		});

		it('create an instance', () => {
			expect(service).toBeTruthy();
		});

		describe('User not logged in', () => {
			beforeEach(() => {
				service.loginState = 'SA';
			});

			it('should not be redirected', () => {
				Cookies.set(pamsLastRefreshCookieName, expiredCookieTime);
				Cookies.set(eportalLastUserActivityCookieName, expiredCookieTime);
				jest.advanceTimersByTime(5000);
				expect(fakeRedirectorService.redirectOrEmit).not.toBeCalled();
			});
		});

		describe('Inactive User', () => {
			describe('PAMS cookie is expired', () => {
				it('should logout with timeout', () => {
					Cookies.set(pamsLastRefreshCookieName, expiredCookieTime);
					Cookies.set(eportalLastUserActivityCookieName, expiredCookieTime);
					jest.advanceTimersByTime(5000);
					expect(fakeRedirectorService.redirectOrEmit).toBeCalledWith(fakeLogoutUrl);
				});
			});

			describe('PAMS cookie is valid', () => {
				it('should do nothing', () => {
					Cookies.set(pamsLastRefreshCookieName, validCookieTime);
					Cookies.set(eportalLastUserActivityCookieName, expiredCookieTime);
					jest.advanceTimersByTime(5000);
					expect(fakeApiService.refreshPamsToken).not.toBeCalled();
				});
			});
		});

		describe('Active User', () => {
			describe('PAMS cookie is expired', () => {
				it('should logout refresh cookie', () => {
					Cookies.set(pamsLastRefreshCookieName, expiredCookieTime);
					Cookies.set(eportalLastUserActivityCookieName, validCookieTime);
					jest.advanceTimersByTime(5000);
					expect(fakeApiService.refreshPamsToken).toBeCalledWith(fakeRootUrl);
				});
			});
		});

		describe('setCookieDetector()', () => {
			describe('logout cookie appear', () => {
				beforeEach(() => {
					jest.advanceTimersByTime(1000);
					Cookies.set(logoutCookieName, '');
					jest.advanceTimersByTime(1000);
				});

				it('should redirect only once', () => {
					expect(fakeRedirectorService.redirectOrEmit).toBeCalledTimes(1);
				});
				it('should redirect with timeout', () => {
					expect(fakeRedirectorService.redirectOrEmit.mock.calls[0][0]).toContain('logout=true');
				});
			});

			describe('timeout cookie appear', () => {
				beforeEach(() => {
					jest.advanceTimersByTime(1000);
					Cookies.set(timeoutCookieName, '');
					jest.advanceTimersByTime(1000);
				});

				it('should redirect only once', () => {
					expect(fakeRedirectorService.redirectOrEmit).toBeCalledTimes(1);
				});
				it('should redirect with timeout', () => {
					expect(fakeRedirectorService.redirectOrEmit.mock.calls[0][0]).toContain('timeout=true');
				});
			});
		});
	});

	// Cookies.get works only if we set the cookies before the service instantiation.
	describe('redirectAfterLogout', () => {
		it('should redirect when the eportal-logout-reminder cookie exist', () => {
			const newUrl = 'https://eportal.admin.ch';
			Cookies.set(logoutReminderCookieName, newUrl);
			service = TestBed.inject(ObServiceNavigationTimeoutService);
			service.loginState = 'S3OK';

			jest.advanceTimersByTime(10000);

			expect(fakeWindow.location.href).toBe(newUrl);
		});
	});
});
