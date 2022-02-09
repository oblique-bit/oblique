import {TestBed} from '@angular/core/testing';
import {OAuthService} from 'angular-oauth2-oidc';
import {ObAuthenticationConfigService} from './authentication-config.service';

describe('ObAuthenticationConfigService', () => {
	let service: ObAuthenticationConfigService;

	const mockOAuthService = {
		configure: jest.fn(),
		loadDiscoveryDocumentAndTryLogin: jest.fn().mockImplementation(() => Promise.resolve({data: {}})),
		tryLogin: jest.fn().mockImplementation(() => Promise.resolve({data: {}})),
		setupAutomaticSilentRefresh: jest.fn().mockImplementation(() => Promise.resolve({data: {}}))
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ObAuthenticationConfigService, {provide: OAuthService, useValue: mockOAuthService}]
		});
		service = TestBed.inject(ObAuthenticationConfigService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('Default configuration', () => {
		it('should use a discovery document', () => {
			expect(service.useDiscoveryDocument).toBe(true);
		});

		it('should not setup up silent refreshing', () => {
			expect(service.setupAutomaticSilentRefresh).toBe(false);
		});
	});

	describe('Configuration with discovery document', () => {
		beforeEach(() => {
			service.useDiscoveryDocument = true;
			service.configureFlow(null).subscribe();
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		it('should call the configure method of the oAuthService', () => {
			expect(mockOAuthService.configure).toHaveBeenCalledTimes(1);
		});

		it('should call the loadDiscoveryDocumentAndTryLogin method of the oAuthService', () => {
			expect(mockOAuthService.loadDiscoveryDocumentAndTryLogin).toHaveBeenCalledTimes(1);
		});

		it('should not call the tryLogin method of the oAuthService', () => {
			expect(mockOAuthService.tryLogin).toHaveBeenCalledTimes(0);
		});

		describe('with silent refreshing', () => {
			it('should call the setupAutomaticSilentRefresh method of the oAuthService', () => {
				service.useDiscoveryDocument = false;
				service.setupAutomaticSilentRefresh = true;

				service.configureFlow(null).subscribe(() => expect(mockOAuthService.setupAutomaticSilentRefresh).toHaveBeenCalledTimes(1));

				jest.clearAllMocks();
			});
		});

		describe('without silent refreshing', () => {
			it('should not call the setupAutomaticSilentRefresh method of the oAuthService', () => {
				service.useDiscoveryDocument = false;
				service.setupAutomaticSilentRefresh = false;

				service.configureFlow(null).subscribe(() => expect(mockOAuthService.setupAutomaticSilentRefresh).toHaveBeenCalledTimes(0));

				jest.clearAllMocks();
			});
		});
	});

	describe('Configuration without discovery document', () => {
		beforeEach(() => {
			service.useDiscoveryDocument = false;
			service.configureFlow(null).subscribe();
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		it('should call the configure method of the oAuthService', () => {
			expect(mockOAuthService.configure).toHaveBeenCalledTimes(1);
		});

		it('should not call the loadDiscoveryDocumentAndTryLogin method of the oAuthService', () => {
			expect(mockOAuthService.loadDiscoveryDocumentAndTryLogin).toHaveBeenCalledTimes(0);
		});

		it('should call the tryLogin method of the oAuthService', () => {
			expect(mockOAuthService.tryLogin).toHaveBeenCalledTimes(1);
		});

		describe('with silent refreshing', () => {
			it('should call the setupAutomaticSilentRefresh method of the oAuthService', () => {
				service.useDiscoveryDocument = false;
				service.setupAutomaticSilentRefresh = true;

				service.configureFlow(null).subscribe(() => expect(mockOAuthService.setupAutomaticSilentRefresh).toHaveBeenCalledTimes(1));

				jest.clearAllMocks();
			});
		});

		describe('without silent refreshing', () => {
			it('should not call the setupAutomaticSilentRefresh method of the oAuthService', () => {
				service.useDiscoveryDocument = false;
				service.setupAutomaticSilentRefresh = false;

				service.configureFlow(null).subscribe(() => expect(mockOAuthService.setupAutomaticSilentRefresh).toHaveBeenCalledTimes(0));

				jest.clearAllMocks();
			});
		});
	});
});
