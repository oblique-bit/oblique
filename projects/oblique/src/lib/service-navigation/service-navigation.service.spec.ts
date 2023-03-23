import {TestBed, fakeAsync, tick} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subject, count, firstValueFrom, of} from 'rxjs';
import {skip} from 'rxjs/operators';
import {ObServiceNavigationConfigApiService} from './api/service-navigation-config-api.service';
import {ObServiceNavigationPollingService} from './api/service-navigation-polling.service';
import {ObEPamsEnvironment} from './service-navigation.model';
import {ObIServiceNavigationState} from './api/service-navigation.api.model';
import {ObServiceNavigationService} from './service-navigation.service';

describe('ObServiceNavigationService', () => {
	let service: ObServiceNavigationService;
	let configService: ObServiceNavigationConfigApiService;
	const mockUrls = {
		pollingInterval: 10,
		login: {
			url: 'http://login',
			params: '?returnURL=<yourReturnlURL>&language=<yourLanguageID>',
			method: ''
		},
		logout: {url: 'http://logout'},
		settings: {url: 'http://settings'}
	};
	const mockLangChange = new Subject<{lang: string}>();
	const mockStateChange = new Subject<ObIServiceNavigationState>();

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ObServiceNavigationService,
				{
					provide: ObServiceNavigationConfigApiService,
					useValue: {fetchUrls: jest.fn().mockReturnValue(of(mockUrls))}
				},
				{
					provide: ObServiceNavigationPollingService,
					useValue: {initializeStateUpdate: jest.fn(), state$: mockStateChange.asObservable()}
				},
				{
					provide: TranslateService,
					useValue: {
						onLangChange: mockLangChange.asObservable(),
						currentLang: 'en'
					}
				}
			]
		});
	});

	describe('fetch a single state', () => {
		beforeEach(() => {
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
				{
					desc: 'only "setUpRootUrls" called with "null" as "environment',
					callSetupRootUrl: true,
					environment: null,
					callSetReturnUrl: false
				},
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

				describe.each(['getLoginUrl$', 'getLogoutUrl$', 'getUserName$', 'getSettingsUrl$'])('%s', method => {
					it('should return an observable', () => {
						expect(service.getLoginUrl$() instanceof Observable).toBe(true);
					});

					it('should not emit', fakeAsync(() => {
						let hasEmitted = false;
						service[method]().subscribe(() => {
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

				describe('getLoginState$', () => {
					it('should return an observable', () => {
						expect(service.getLoginState$() instanceof Observable).toBe(true);
					});

					it(`should emit "SA"`, () => {
						expect(firstValueFrom(service.getLoginState$())).resolves.toBe('SA');
					});

					describe('ObServiceNavigationConfigService.fetchUrls', () => {
						it('should not have been called', () => {
							expect(configService.fetchUrls).not.toHaveBeenCalled();
						});
					});
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
						beforeEach(() => {
							service.setUpRootUrls(environment, rootUrl);
							service.setReturnUrl('http://localhost');
						});

						describe.each(['getLoginUrl$', 'getLogoutUrl$', 'getLoginState$', 'getUserName$', 'getSettingsUrl$'])('%s', method => {
							it('should return an observable', () => {
								expect(service[method]() instanceof Observable).toBe(true);
							});

							describe('ObServiceNavigationConfigService.fetchUrls', () => {
								beforeEach(() => {
									service[method]().subscribe();
								});

								it('should have been called once', () => {
									expect(configService.fetchUrls).toHaveBeenCalledTimes(1);
								});

								it(`should have been called with "${calledPamsUrl}"`, () => {
									expect(configService.fetchUrls).toHaveBeenCalledWith(calledPamsUrl);
								});
							});
						});

						describe('getLoginUrl$', () => {
							describe.each(['de', 'fr', 'it', 'en', 'es'])('with "%s" as language', language => {
								it(`should emit "http://login?returnURL=http://localhost&language=${language}"`, () => {
									const promise = firstValueFrom(service.getLoginUrl$().pipe(skip(1)));
									mockLangChange.next({lang: language});
									expect(promise).resolves.toBe(`http://login?returnURL=http://localhost&language=${language}`);
								});
							});
						});

						describe.each([
							{method: 'getLogoutUrl$', url: 'http://logout'},
							{method: 'getSettingsUrl$', url: 'http://settings'}
						])('$method', ({method, url}) => {
							it(`should emit "${url}"`, () => {
								expect(firstValueFrom(service[method]())).resolves.toBe(url);
							});
						});

						describe('getLoginState$', () => {
							describe.each(['S1', 'S2OK', 'S2+OK', 'S3OK', 'S3+OK'])('with "%s"', loginState => {
								it(`should emit "${loginState}"`, () => {
									const promise = firstValueFrom(service.getLoginState$().pipe(skip(1)));
									mockStateChange.next({loginState} as ObIServiceNavigationState);
									expect(promise).resolves.toEqual(loginState);
								});
							});
						});

						describe('getUserName$', () => {
							it(`should emit "John Doe"`, () => {
								const promise = firstValueFrom(service.getUserName$());
								mockStateChange.next({profile: {fullname: 'John Doe'}} as ObIServiceNavigationState);
								expect(promise).resolves.toEqual('John Doe');
							});
						});
					});
				}
			);
		});
	});

	describe('fetch multiple states', () => {
		describe.each([
			{inputs: ['SA', 'SA'], emitTimes: 1},
			{inputs: ['SA', 'S2OK'], emitTimes: 2},
			{inputs: ['SA', 'S2OK', 'S2OK'], emitTimes: 2},
			{inputs: ['S2OK'], emitTimes: 2},
			{inputs: ['S2OK', 'SA'], emitTimes: 3}
		])('getLoginState$', ({inputs, emitTimes}) => {
			const mockStateChangeDuplicate = new Subject();
			beforeEach(() => {
				TestBed.overrideProvider(ObServiceNavigationPollingService, {
					useValue: {
						initializeStateUpdate: jest.fn(),
						state$: mockStateChangeDuplicate.asObservable()
					}
				});
				service = TestBed.inject(ObServiceNavigationService);
			});

			it(`should emit ${emitTimes} times`, () => {
				service.setUpRootUrls(ObEPamsEnvironment.TEST);
				const promise = firstValueFrom(service.getLoginState$().pipe(count()));
				inputs.forEach(input => mockStateChangeDuplicate.next({loginState: input}));
				mockStateChangeDuplicate.complete();
				expect(promise).resolves.toBe(emitTimes);
			});
		});
	});
});
