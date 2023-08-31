import {TestBed} from '@angular/core/testing';
import {ObServiceNavigationTimeoutCookieService} from './service-navigation-timeout-cookie.service';
import {WINDOW} from '../../utilities';
import Cookies from 'js-cookie';
import {CookiesMock} from './mocks/js-cookie.mock';

describe('ServiceNavigationTimeoutCookieService', () => {
	let service: ObServiceNavigationTimeoutCookieService;
	const fakeSetCookie = jest.fn();
	const fakeLocalhostUrl = 'http://localhost:anything';
	const fake127001Url = 'http://127.0.0.1:anything';
	const eportalUrl = 'https://eportal.admin.ch';
	const fakeWindow = {location: {href: fakeLocalhostUrl}};
	const fakeKey = 'fakeKey';
	const fakeValue = 'fakeValue';

	Cookies.set = CookiesMock.set;
	Cookies.remove = CookiesMock.remove;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ObServiceNavigationTimeoutCookieService, {provide: WINDOW, useValue: fakeWindow}]
		});
		service = TestBed.inject(ObServiceNavigationTimeoutCookieService);
		fakeSetCookie.mockReset();
		fakeWindow.location.href = fakeLocalhostUrl;
		jest.useFakeTimers();
	});

	it('create an instance', () => {
		expect(service).toBeTruthy();
	});

	describe('setCookie()', () => {
		let cookie;
		beforeEach(() => {
			service.setCookie(fakeKey, fakeValue);
			cookie = CookiesMock.getDetails(fakeKey);
		});

		it('should set cookie with expiration date the next hour', () => {
			const oneHourInMilliseconds = 3600000;
			const expectedOneHour = new Date(Date.now() + oneHourInMilliseconds);
			expect(cookie.options.expires).toEqual(expectedOneHour);
		});

		it('should set cookies with path on /', () => {
			expect(cookie.options.path).toBe('/');
		});

		it('should set cookies with strict sameSite', () => {
			expect(cookie.options.sameSite).toBe('Strict');
		});

		describe('Domain', () => {
			it.each([
				['localhost', fake127001Url],
				['localhost', fakeLocalhostUrl],
				['.admin.ch', eportalUrl]
			])('should be "%s" when the current url is %s', (expectedResult, url) => {
				fakeWindow.location.href = url;
				service.setCookie(fakeKey, fakeValue);
				cookie = CookiesMock.getDetails(fakeKey);

				expect(cookie.options.domain).toBe(expectedResult);
			});

			it('should be "error wrong url" when the current url is neither admin.ch nor localhost', () => {
				fakeWindow.location.href = 'http://example.com';
				expect(() => service.setCookie(fakeKey, fakeValue)).toThrowError();
			});
		});

		describe('secure', () => {
			it.each([
				[false, fakeLocalhostUrl],
				[false, fake127001Url],
				[true, eportalUrl]
			])('should be %s when the current url is %s', (expectedSecure, url) => {
				fakeWindow.location.href = url;
				service.setCookie(fakeKey, fakeValue);
				cookie = CookiesMock.getDetails(fakeKey);

				expect(cookie.options.secure).toBe(expectedSecure);
			});
		});
	});

	describe('setShortCookie()', () => {
		let cookie;
		beforeEach(() => {
			service.setShortCookie(fakeKey, fakeValue);
			cookie = CookiesMock.getDetails(fakeKey);
		});

		it('should set cookie with expiration date in the next 10 seconds', () => {
			const tenSecondsInMilliseconds = 10000;
			const expectedOneHour = new Date(Date.now() + tenSecondsInMilliseconds);
			expect(cookie.options.expires).toEqual(expectedOneHour);
		});
	});

	describe('deleteCookie()', () => {
		it('should remove a cookie', () => {
			service.setCookie(fakeKey, fakeValue);
			service.deleteCookie(fakeKey);
			const cookie = CookiesMock.getDetails(fakeKey);

			expect(cookie).toBeUndefined();
		});
	});
});
