import {TestBed, fakeAsync, tick} from '@angular/core/testing';
import {Observable, of} from 'rxjs';
import {ObServiceNavigationConfigApiService} from './api/service-navigation-config-api.service';
import {ObEPamsEnvironment} from './service-navigation.model';
import {ObServiceNavigationService} from './service-navigation.service';

describe('ObServiceNavigationService', () => {
	let service: ObServiceNavigationService;
	let configService: ObServiceNavigationConfigApiService;
	const mockUrls = {
		login: {
			url: 'http://login',
			params: '?returnURL=<yourReturnlURL>&language=<yourLanguageID>',
			method: ''
		}
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ObServiceNavigationService,
				{
					provide: ObServiceNavigationConfigApiService,
					useValue: {fetchUrls: jest.fn().mockReturnValue(of(mockUrls))}
				}
			]
		});

		service = TestBed.inject(ObServiceNavigationService);
		configService = TestBed.inject(ObServiceNavigationConfigApiService);
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('setUpRootUrls and setReturnUrl', () => {
		describe.each([
			{desc: 'both not called', callSetupRootUrl: false, callSetReturnUrl: false},
			{desc: 'only "setReturnUrl" called with "http://localhost"', callSetupRootUrl: false, callSetReturnUrl: true},
			{desc: 'only "setUpRootUrls" called with "null" as "environment', callSetupRootUrl: true, environment: null, callSetReturnUrl: false},
			{
				desc: 'only "setUpRootUrls" called with "undefined" as "environment',
				callSetupRootUrl: true,
				environment: undefined,
				callSetReturnUrl: false
			}
		])('$desc', ({callSetupRootUrl, environment, callSetReturnUrl}) => {
			beforeEach(() => {
				if (callSetupRootUrl) {
					service.setUpRootUrls(environment);
				}
				if (callSetReturnUrl) {
					service.setReturnUrl('http://localhost');
				}
			});

			describe('getLoginUrl$', () => {
				it('should return an observable', () => {
					expect(service.getLoginUrl$() instanceof Observable).toBe(true);
				});

				it('should not emit', fakeAsync(() => {
					let hasEmitted = false;
					service.getLoginUrl$().subscribe(() => {
						hasEmitted = true;
					});
					tick(1000);
					expect(hasEmitted).toBe(false);
				}));

				it('should not call "ObServiceNavigationConfigApiService.fetchUrls()"', fakeAsync(() => {
					service.getLoginUrl$().subscribe();
					tick(1000);
					expect(configService.fetchUrls).not.toHaveBeenCalled();
				}));
			});
		});

		describe.each([
			{environment: ObEPamsEnvironment.DEV, pamsRootUrl: 'https://pams-api.eportal-d.admin.ch/'},
			{environment: ObEPamsEnvironment.REF, pamsRootUrl: 'https://pams-api.eportal-r.admin.ch/'},
			{environment: ObEPamsEnvironment.TEST, pamsRootUrl: 'https://pams-api.eportal-t.admin.ch/'},
			{environment: ObEPamsEnvironment.ABN, pamsRootUrl: 'https://pams-api.eportal-a.admin.ch/'},
			{environment: ObEPamsEnvironment.PROD, pamsRootUrl: 'https://pams-api.eportal.admin.ch/'}
		])(
			'"setReturnUrl" called with "http://localhost" and "setUpRootUrls" called with "$environment" as "environment"',
			({environment, pamsRootUrl}) => {
				describe.each([
					{desc: 'and no "rootUrl"', calledPamsUrl: pamsRootUrl},
					{desc: 'and "http://root-url" as "rootUrl"', rootUrl: 'http://root-url/', calledPamsUrl: 'http://root-url/'}
				])('$desc', ({rootUrl, calledPamsUrl}) => {
					let result;
					beforeEach(() => {
						service.setUpRootUrls(environment, rootUrl);
						service.setReturnUrl('http://localhost');
					});

					describe('getLoginUrl$', () => {
						beforeEach(done => {
							service.getLoginUrl$().subscribe(data => {
								result = data;
								done();
							});
						});

						it('should return an observable', () => {
							expect(service.getLoginUrl$() instanceof Observable).toBe(true);
						});

						it('should emit "http://login?returnURL=http://localhost&language=<yourLanguageID>"', () => {
							expect(result).toBe('http://login?returnURL=http://localhost&language=<yourLanguageID>');
						});

						describe('ObServiceNavigationConfigService.fetchUrls', () => {
							it('should have been called once', () => {
								expect(configService.fetchUrls).toHaveBeenCalledTimes(1);
							});

							it(`should have been called with "${calledPamsUrl}"`, () => {
								expect(configService.fetchUrls).toHaveBeenCalledWith(calledPamsUrl);
							});
						});
					});
				});
			}
		);
	});
});
