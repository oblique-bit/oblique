import {TestBed} from '@angular/core/testing';
import {WINDOW} from '../../utilities';
import {ObServiceNavigationTimeoutRedirectorService} from './service-navigation-timeout-redirector.service';
import {ObServiceNavigationService} from '../service-navigation.service';
import {ObServiceNavigationTimeoutCookieService} from './service-navigation-timeout-cookie.service';
import {firstValueFrom, of} from 'rxjs';

describe('ServiceNavigationTimeoutRedirectorService', () => {
	let service: ObServiceNavigationTimeoutRedirectorService;
	const fakeSetCookie = jest.fn();
	const fakeSetShortCookie = jest.fn();
	const fakeCurrentUrl = 'fakeUrl';
	const fakeLogoutUrl = 'fakeLogoutUrl';
	const fakeWindow = {location: {href: fakeCurrentUrl}};
	const fakeSetLogoutTrigger = jest.fn();
	const mockLogoutUrl = jest.fn(() => of(fakeLogoutUrl));
	const fakeServiceNavigationService = {
		getLogoutUrl$: mockLogoutUrl,
		setLogoutTrigger: fakeSetLogoutTrigger
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ObServiceNavigationTimeoutRedirectorService,
				{provide: WINDOW, useValue: fakeWindow},
				{
					provide: ObServiceNavigationService,
					useValue: fakeServiceNavigationService
				},
				{provide: ObServiceNavigationTimeoutCookieService, useValue: {setCookie: fakeSetCookie, setShortCookie: fakeSetShortCookie}}
			]
		});
		fakeServiceNavigationService.getLogoutUrl$.mockClear();
		fakeServiceNavigationService.setLogoutTrigger.mockClear();
		fakeSetCookie.mockClear();
		fakeSetShortCookie.mockClear();

		service = TestBed.inject(ObServiceNavigationTimeoutRedirectorService);
		service.logoutUrl = fakeLogoutUrl;
		service.handleLogout = true;
	});

	it('create an instance', () => {
		expect(service).toBeTruthy();
	});

	describe('logout()', () => {
		it('should set a cookie with the current url', () => {
			service.logout();
			expect(fakeSetShortCookie).toBeCalledWith('eportal-logout', fakeCurrentUrl);
		});

		describe('handleLogout', () => {
			it('should redirect when handleLogout is true', () => {
				service.handleLogout = true;

				service.logout();
				expect(fakeWindow.location.href).toBe(fakeLogoutUrl);
			});

			it('should emit logoutUrl when handleLogout is false', async () => {
				service.handleLogout = false;
				service.logout();
				const emittedValue = await firstValueFrom(service.logoutTrigger$);
				expect(emittedValue).toBe(fakeLogoutUrl);
			});
		});
	});

	describe('emitLogoutUrl()', () => {
		it('should setLogoutTrigger with given url', async () => {
			const randomUrl = 'randomUrl';
			service.emitLogoutUrl(randomUrl);
			const emittedValue = await firstValueFrom(service.logoutTrigger$);
			expect(emittedValue).toBe(randomUrl);
		});

		it('should setLogoutTrigger be called only once', async () => {
			const randomUrl = 'randomUrl';
			const secondRandomUrl = 'secondRandomUrl';
			service.emitLogoutUrl(randomUrl);
			service.emitLogoutUrl(secondRandomUrl);
			const emittedValue = await firstValueFrom(service.logoutTrigger$);
			expect(emittedValue).toBe(randomUrl);
		});
	});

	describe('redirectOrEmit()', () => {
		it('should redirect when handleLogout is true', () => {
			service.handleLogout = true;
			service.logout();
			expect(fakeWindow.location.href).toBe(fakeLogoutUrl);
		});

		it('should emit logoutUrl when handleLogout is false', async () => {
			service.handleLogout = false;
			service.logout();
			const emittedValue = await firstValueFrom(service.logoutTrigger$);
			expect(emittedValue).toBe(fakeLogoutUrl);
		});
	});
});
