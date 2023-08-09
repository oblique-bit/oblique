import {TestBed} from '@angular/core/testing';
import {WINDOW} from '../../utilities';
import Cookies from 'js-cookie';
import {CookiesMock} from './mocks/js-cookie.mock';
import {ObServiceNavigationTimeoutReturnUrlService} from './service-navigation-timeout-return-url.service';

describe('ServiceNavigationTimeoutReturnUrlService', () => {
	let service: ObServiceNavigationTimeoutReturnUrlService;
	const eportalUrl = 'http://eportal.admin.ch';
	const fakeWindow = {location: {href: eportalUrl}};

	Cookies.set = CookiesMock.set;
	Cookies.remove = CookiesMock.remove;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ObServiceNavigationTimeoutReturnUrlService, {provide: WINDOW, useValue: fakeWindow}]
		});
		service = TestBed.inject(ObServiceNavigationTimeoutReturnUrlService);
		fakeWindow.location.href = eportalUrl;
	});

	it('create an instance', () => {
		expect(service).toBeTruthy();
	});

	describe('logout url', () => {
		it('should contain logout parameter to true', () => {
			const result = service.getRedirectUrl('logout', eportalUrl);
			expect(result).toContain('logout=true');
		});
	});

	describe('timeout url', () => {
		it('should contain timeout parameter to true', () => {
			const result = service.getRedirectUrl('timeout', eportalUrl);
			expect(result).toContain('timeout=true');
		});
	});

	describe('existing parameters in the url', () => {
		const parametersToBeCleared = ['logout', 'timeout', 'returnUrl'];
		it.each(parametersToBeCleared)('should clear %s parameter in the url', parameter => {
			fakeWindow.location.href = `${eportalUrl}?${parameter}=true`;
			const result = service.getRedirectUrl('logout', eportalUrl);
			const returnUrlString = result.split('returnUrl')[1];
			expect(returnUrlString).not.toContain(parameter);
		});
	});

	it('should keep URL path', () => {
		const randomPath = '/random/path';
		fakeWindow.location.href = `${eportalUrl}${randomPath}`;
		const result = service.getRedirectUrl('logout', eportalUrl);
		const returnUrlString = result.split('returnUrl')[1];
		expect(returnUrlString).toContain('%2Frandom%2Fpath');
	});

	it('should keep URL parameters', () => {
		fakeWindow.location.href = `${eportalUrl}/random/path?randomParameter=true`;
		const result = service.getRedirectUrl('logout', eportalUrl);
		const returnUrlString = result.split('returnUrl')[1];
		expect(returnUrlString).toContain('randomParameter%3Dtrue');
	});

	it('should not keep question mark at the end of the return url', () => {
		const result = service.getRedirectUrl('logout', eportalUrl);
		const returnUrlString = result.split('returnUrl')[1];
		// get last 3 chars %3F
		expect(returnUrlString).not.toMatch(/%3F$/);
	});
});
