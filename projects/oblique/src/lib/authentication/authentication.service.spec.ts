import {TestBed} from '@angular/core/testing';
import {OAuthService} from 'angular-oauth2-oidc';
import {ObAuthenticationService} from './authentication.service';

describe('ObAuthenticationService', () => {
	let service: ObAuthenticationService;

	const mockOAuthService = {
		initLoginFlow: jest.fn(),
		logOut: jest.fn(),
		getIdentityClaims: jest.fn(),
		getAccessToken: jest
			.fn()
			.mockImplementation(
				() =>
					'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ4VmVKOGxMcHNvSkRSS3hKV21ZbXlnVFJIWEVZT1JLRmdaMFkwRE5lZmt3In0.eyJleHAiOjE2NDAwODkwNjMsImlhdCI6MTY0MDA4ODc2MywiYXV0aF90aW1lIjoxNjQwMDg4NzYyLCJqdGkiOiI0MGMyZDUwNy1kNTE4LTQ0OTItYTYyNS02NzBjMzg3ZTY2MDgiLCJpc3MiOiJodHRwczovL2lkZW50aXR5LXIuYml0LmFkbWluLmNoL3JlYWxtcy9hc3RyYS1nZW9zaS1kIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjQ2MDdkOTYzLTcwZTgtNDQ5Zi1hMDFmLTFmMmQzYWUwZGExYyIsInR5cCI6IkJlYXJlciIsImF6cCI6InJpbWEtZ2Vvc2ktd2ViY2xpZW50Iiwibm9uY2UiOiJSRlZNWXpFMVduazFkRVpmYkd4YVFWaExUMGRNYjA5dVMwOHVORmRHZFd0R1praDVTelZmWkdjdVNIazAiLCJzZXNzaW9uX3N0YXRlIjoiMzFlNDRjNjUtYmE5NS00N2IzLThkMjEtNjE3YjU5MzYwMGMxIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL2dlb3NpLmRldi5hcHAuY2ZhcDAyLmF0bGFudGljYS5hZG1pbi5jaCIsImh0dHBzOi8vZ2Vvc2ktZ2F0ZXdheS5kZXYuYXBwLmNmYXAwMi5hdGxhbnRpY2EuYWRtaW4uY2giXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJ1c2VyIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCBvZmZsaW5lX2FjY2VzcyIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6IlJlYW51IEtlYXZlcyIsInByZWZlcnJlZF91c2VybmFtZSI6InZpZXdlciIsImdpdmVuX25hbWUiOiJSZWFudSIsImZhbWlseV9uYW1lIjoiS2VhdmVzIiwiZW1haWwiOiJ2aWV3ZXJAYml0LmFkbWluLmNoIn0.V5TeTwWMJ2em9MdCoSlV_AYs-XHUccUn0If-fN86pCQtoOfCuYvZsWyMdB3mMegutO7nDtr_ygThcWD2u2R8wvrXeyYsls3Lp7jD23oXdi_DPssx8h7DvIQbnPLkS1JlLjqtiy-iNlg4UDH7QYUGlPCw7n8-YjwPkPkmTIetpBi3dTvId23J8sT8_2hgUOzTbrsrzWCnxC-gW-CKBj4D-tq3rrvr_VMsGJT1Pamo3606I4rVS8rEzhaO-pnwG8bT-7in-ZaSg3oBEeG9W_g96N37ol0SXhWR6aW0_srnRxmtYWgLFuphh6oOZVPnRBaTik2qrBf6zHgn5BuiEQm8dg'
			)
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ObAuthenticationService, {provide: OAuthService, useValue: mockOAuthService}]
		});
		service = TestBed.inject(ObAuthenticationService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('performLogin', () => {
		it('should call the initLoginFlow method of the OAuthService when performLogin() is called', () => {
			service.performLogin();
			expect(mockOAuthService.initLoginFlow).toHaveBeenCalledTimes(1);
		});

		it('should pass the additionalState to the OAuthService if present', () => {
			service.performLogin('test-additionalState');
			expect(mockOAuthService.initLoginFlow).toHaveBeenCalledWith('test-additionalState', undefined);
		});

		it('should pass the additionalState & params to the OAuthService if present', () => {
			service.performLogin('test-additionalState', {flag: 'test'});
			expect(mockOAuthService.initLoginFlow).toHaveBeenCalledWith('test-additionalState', {flag: 'test'});
		});
	});

	describe('performLogout', () => {
		it('should call the logOut method of the OAuthService when performLogout() is called', () => {
			service.performLogout();
			expect(mockOAuthService.logOut).toHaveBeenCalledTimes(1);
		});
	});

	describe('getIdentityClaims', () => {
		it('should call the getIdentityClaims method of the OAuthService when getIdentityClaims() is called', () => {
			service.getIdentityClaims();
			expect(mockOAuthService.getIdentityClaims).toHaveBeenCalledTimes(1);
		});
	});

	describe('getAllResourceAccessRoles', () => {
		it('should call the getAccessToken method of the OAuthService when getAllResourceAccessRoles() is called', () => {
			service.getAllResourceAccessRoles();
			expect(mockOAuthService.getAccessToken).toHaveBeenCalledTimes(1);
		});

		it('should return the correct IResourceAccessRoles', () => {
			expect(service.getAllResourceAccessRoles()).toEqual([
				{name: 'account', roles: ['manage-account', 'manage-account-links', 'view-profile']}
			]);
		});
	});
});
