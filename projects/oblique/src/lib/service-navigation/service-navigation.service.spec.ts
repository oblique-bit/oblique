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

	describe('setUpRootUrls', () => {
		describe.each([
			{desc: 'not called', call: false},
			{desc: 'called with "null" as "environment', call: true, environment: null},
			{desc: 'called with "undefined" as "environment', call: true, environment: undefined}
		])('$desc', ({call, environment}) => {
			beforeEach(() => {
				if (call) {
					service.setUpRootUrls(environment);
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
		])('called with "$environment" as "environment"', ({environment, pamsRootUrl}) => {
			describe.each([
				{desc: 'and no "rootUrl"', calledPamsUrl: pamsRootUrl},
				{desc: 'and "http://root-url" as "rootUrl"', rootUrl: 'http://root-url/', calledPamsUrl: 'http://root-url/'}
			])('$desc', ({rootUrl, calledPamsUrl}) => {
				let result;
				beforeEach(() => {
					service.setUpRootUrls(environment, rootUrl);
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

					it('should emit "http://login?returnURL=<yourReturnlURL>&language=<yourLanguageID>"', () => {
						expect(result).toBe('http://login?returnURL=<yourReturnlURL>&language=<yourLanguageID>');
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
		});
	});
});
