import {TestBed, fakeAsync, tick} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subject, count, firstValueFrom, of} from 'rxjs';
import {map, skip} from 'rxjs/operators';
import {ObServiceNavigationConfigApiService} from './api/service-navigation-config-api.service';
import {ObServiceNavigationPollingService} from './api/service-navigation-polling.service';
import {ObServiceNavigationApplicationsService} from './applications/service-navigation-applications.service';
import {ObEPamsEnvironment, ObISectionLink} from './service-navigation.model';
import {ObIServiceNavigationBackendInfo, ObIServiceNavigationState} from './api/service-navigation.api.model';
import {ObServiceNavigationService} from './service-navigation.service';
import {ObServiceNavigationTimeoutService} from './timeout/service-navigation-timeout.service';
import {ObServiceNavigationTimeoutRedirectorService} from './timeout/service-navigation-timeout-redirector.service';
import {provideHttpClient} from '@angular/common/http';
import {ObServiceNavigationInfoApiService} from './api/service-navigation-info-api.service';

describe('ObServiceNavigationService', () => {
	let service: ObServiceNavigationService;
	let configService: ObServiceNavigationConfigApiService;
	let applicationsService: ObServiceNavigationApplicationsService;
	let redirectorService: ObServiceNavigationTimeoutRedirectorService;
	const mockUrls = {
		pollingInterval: 10,
		pollingNotificationsInterval: 30,
		login: {
			url: 'http://login',
			params: '?returnURL=<yourReturnURL>&language=<yourLanguageID>',
			method: ''
		},
		logout: {url: 'http://logout'},
		settings: {url: 'http://settings'},
		inboxMail: {url: 'http://inboxMail'},
		allServices: {url: 'http://applications'}
	};
	const mockLangChange = new Subject<{lang: string}>();
	const mockStateChange = new Subject<ObIServiceNavigationState>();
	const mockApplications = [{name: {en: 'name', fr: 'nom', de: 'Name', it: 'nome'}}];
	const mockGetLogoutTrigger$ = jest.fn();
	const mockRedirectorLogout = jest.fn();
	const fakeInfoBackend = {fakeInfoBackend: true};
	const mockGetInfoBackend$ = jest.fn(() => of(fakeInfoBackend));

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				provideHttpClient(),
				ObServiceNavigationService,
				{provide: ObServiceNavigationTimeoutService, useValue: {initialize: jest.fn(), logout: jest.fn()}},
				{
					provide: ObServiceNavigationConfigApiService,
					useValue: {fetchUrls: jest.fn().mockReturnValue(of(mockUrls))}
				},
				{
					provide: ObServiceNavigationPollingService,
					useValue: {initializeStateUpdate: jest.fn(), state$: mockStateChange.asObservable()}
				},
				{
					provide: ObServiceNavigationTimeoutRedirectorService,
					useValue: {logoutTrigger$: mockGetLogoutTrigger$, logout: mockRedirectorLogout}
				},
				{
					provide: ObServiceNavigationApplicationsService,
					useValue: {getApplications: jest.fn().mockReturnValue(source$ => source$.pipe(map(() => mockApplications)))}
				},
				{
					provide: ObServiceNavigationInfoApiService,
					useValue: {get: mockGetInfoBackend$}
				},
				{
					provide: TranslateService,
					useValue: {
						onLangChange: mockLangChange.asObservable(),
						currentLang: 'en',
						getLangs: jest.fn().mockReturnValue(['en', 'de', 'fr', 'it']),
						use: jest.fn()
					}
				}
			]
		});
	});

	describe('fetch a single state', () => {
		beforeEach(() => {
			service = TestBed.inject(ObServiceNavigationService);
			configService = TestBed.inject(ObServiceNavigationConfigApiService);
			applicationsService = TestBed.inject(ObServiceNavigationApplicationsService);
			redirectorService = TestBed.inject(ObServiceNavigationTimeoutRedirectorService);
		});

		afterEach(() => {
			jest.resetAllMocks();
		});

		describe('getInfoBackend$', () => {
			describe('With root url and app id', () => {
				const fakeAppId = 'appId';
				beforeEach(() => {
					service.setUpRootUrls(ObEPamsEnvironment.TEST);
					service.setPamsAppId(fakeAppId);
				});

				it('should return fakeInfoBackend', () => {
					let result: ObIServiceNavigationBackendInfo;
					service.getInfoBackend$().subscribe(infoBackend => {
						result = infoBackend;
					});

					expect(result).toBe(fakeInfoBackend);
				});

				it('should use fakeAppId has second parameter', () => {
					service.getInfoBackend$().subscribe();
					expect((mockGetInfoBackend$.mock.calls[0] as string[])[1]).toBe(fakeAppId);
				});

				it('should use "en" has third parameter', () => {
					service.getInfoBackend$().subscribe();
					expect((mockGetInfoBackend$.mock.calls[0] as string[])[2]).toBe('en');
				});

				it('should retrigger when language change', () => {
					const newLanguage = 'fr';
					service.getInfoBackend$().subscribe();
					mockLangChange.next({lang: newLanguage});
					expect((mockGetInfoBackend$.mock.calls[1] as string[])[2]).toBe(newLanguage);
				});
			});

			describe('Without root url and without app id', () => {
				it("should return an empty object when root url and app id didn't fired", () => {
					let result: ObIServiceNavigationBackendInfo;
					service.getInfoBackend$().subscribe(infoBackend => {
						result = infoBackend;
					});

					expect(result).toEqual({});
				});
			});
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

				describe.each([
					'getLoginUrl$',
					'getUserName$',
					'getProfileUrls$',
					'getAvatarUrl$',
					'getInboxMailUrl$',
					'getMessageCount$',
					'getApplicationsUrl$',
					'getLastUsedApplications$',
					'getFavoriteApplications$'
				])('%s', method => {
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

					it('should not emit', fakeAsync(() => {
						let hasEmitted = false;
						service.getLoginState$().subscribe(() => {
							hasEmitted = true;
						});
						tick(1000);
						expect(hasEmitted).toBe(false);
					}));

					describe('ObServiceNavigationConfigService.fetchUrls', () => {
						it('should not have been called', () => {
							expect(configService.fetchUrls).not.toHaveBeenCalled();
						});
					});
				});

				describe('getLanguage$', () => {
					it('should return an observable', () => {
						expect(service.getLanguage$() instanceof Observable).toBe(true);
					});

					describe.each(['de', 'fr', 'it', 'en', 'es'])('with "%s" as language', language => {
						it(`should emit "${language}"`, async () => {
							const promise = firstValueFrom(service.getLanguage$().pipe(skip(1)));
							mockLangChange.next({lang: language});
							await expect(promise).resolves.toBe(language);
						});
					});
				});

				describe('getLanguages', () => {
					it('should return an array containing "en" and "de"', () => {
						expect(service.getLanguages()).toEqual([
							{code: 'en', label: 'English'},
							{code: 'de', label: 'Deutsch'},
							{code: 'fr', label: 'Français'},
							{code: 'it', label: 'Italiano'}
						]);
					});
				});

				describe('setLanguage', () => {
					let translate: TranslateService;
					beforeEach(() => {
						service.setLanguage('fr');
						translate = TestBed.inject(TranslateService);
					});

					it('should call "use" once', () => {
						expect(translate.use).toHaveBeenCalledTimes(1);
					});

					it('should call "use" with "fr"', () => {
						expect(translate.use).toHaveBeenCalledWith('fr');
					});
				});

				describe('logout', () => {
					it('should call "logout" on redirector service', () => {
						service.logout();
						expect(mockRedirectorLogout).toHaveBeenCalledTimes(1);
					});
				});
			});

			describe.each([
				{environment: ObEPamsEnvironment.DEV, pamsRootUrl: 'https://pams-api.eportal-d.admin.ch/'}
				// {environment: ObEPamsEnvironment.REF, pamsRootUrl: 'https://pams-api.eportal-r.admin.ch/'},
				// {environment: ObEPamsEnvironment.TEST, pamsRootUrl: 'https://pams-api.eportal-t.admin.ch/'},
				// {environment: ObEPamsEnvironment.ABN, pamsRootUrl: 'https://pams-api.eportal-a.admin.ch/'},
				// {environment: ObEPamsEnvironment.PROD, pamsRootUrl: 'https://pams-api.eportal.admin.ch/'}
			])(
				'"setReturnUrl" called with "http://localhost" and "setUpRootUrls" called with "$environment" as "environment"',
				({environment, pamsRootUrl}) => {
					describe.each([
						// {desc: 'and no "rootUrl"', calledPamsUrl: pamsRootUrl},
						{desc: 'and "http://root-url" as "rootUrl"', rootUrl: 'http://root-url/', calledPamsUrl: 'http://root-url/'}
					])('$desc', ({rootUrl, calledPamsUrl}) => {
						beforeEach(() => {
							service.setUpRootUrls(environment, rootUrl);
							service.setReturnUrl('http://localhost');
						});

						describe.each([
							'getLoginUrl$',
							'getLoginState$',
							'getUserName$',
							'getProfileUrls$',
							'getAvatarUrl$',
							'getInboxMailUrl$',
							'getMessageCount$',
							'getApplicationsUrl$',
							'getLastUsedApplications$',
							'getFavoriteApplications$'
						])('%s', method => {
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
								describe('Without pamsAppId', () => {
									const error = new Error(
										'Service Navigation requires an appId for step-up logins to work. The appId can be found on the application configuration page on ePortal.'
									);

									it(`should throw an error`, async () => {
										service.setPamsAppId(undefined);
										const promise = firstValueFrom(service.getLoginUrl$());
										mockLangChange.next({lang: language});
										await expect(promise).rejects.toEqual(error);
									});
								});

								describe('With pamsAppId', () => {
									const randomPamsAppId = 'randomPamsAppId';

									beforeEach(() => {
										service.setPamsAppId(randomPamsAppId);
									});

									it(`should emit "http://login?returnURL=http://localhost&language=${language}&appid=${randomPamsAppId}"`, async () => {
										const promise = firstValueFrom(service.getLoginUrl$().pipe(skip(1)));
										mockLangChange.next({lang: language});
										expect(await promise).toBe(`http://login?returnURL=http://localhost&language=${language}&appid=${randomPamsAppId}`);
									});
								});
							});
						});

						describe.each([
							{method: 'getInboxMailUrl$', url: 'http://inboxMail'},
							{method: 'getApplicationsUrl$', url: 'http://applications'}
						])('$method', ({method, url}) => {
							it(`should emit "${JSON.stringify(url)}"`, async () => {
								await expect(firstValueFrom(service[method]())).resolves.toBe(url);
							});
						});

						describe('getProfileUrls$', () => {
							describe.each([
								{
									index: 0,
									url: `http://applications/profile/details`,
									label: 'i18n.oblique.service-navigation.profile.my-profile',
									isInternalLink: true
								},
								{
									index: 1,
									url: `http://applications/profile/permissions`,
									label: 'i18n.oblique.service-navigation.profile.my-permissions',
									isInternalLink: true
								},
								{
									index: 2,
									url: `http://applications/profile/push-notifications`,
									label: 'i18n.oblique.service-navigation.profile.my-email-sms-notifications',
									isInternalLink: true
								},
								{
									index: 3,
									url: `http://applications/profile/business-partnerships`,
									label: 'i18n.oblique.service-navigation.profile.my-business-partnerships',
									isInternalLink: true
								},
								{
									index: 4,
									url: `http://applications/redeem`,
									label: 'i18n.oblique.service-navigation.profile.redeem-code',
									isInternalLink: true
								}
							])('Url number $index', expectedUrl => {
								let urls: ObISectionLink[];
								beforeEach(async () => {
									const profileUrls = firstValueFrom(service.getProfileUrls$());
									mockStateChange.next({loginState: 'S3+OK'} as ObIServiceNavigationState);
									urls = await profileUrls;
								});

								it(`should contain url ${expectedUrl.url}`, () => {
									expect(urls[expectedUrl.index].url).toBe(expectedUrl.url);
								});

								it(`should contain label ${expectedUrl.label}`, () => {
									expect(urls[expectedUrl.index].label).toBe(expectedUrl.label);
								});

								it(`should  contain label ${expectedUrl.isInternalLink}`, () => {
									expect(urls[expectedUrl.index].isInternalLink).toBe(expectedUrl.isInternalLink);
								});
							});

							describe.each(['SA', 'S1'])('no enough rights with %s', rightLevel => {
								it(`should return empty array`, async () => {
									const profileUrls = firstValueFrom(service.getProfileUrls$());
									mockStateChange.next({loginState: rightLevel} as ObIServiceNavigationState);
									const urls = await profileUrls;
									expect(urls).toHaveLength(0);
								});
							});
						});

						describe('getAvatarUrl$', () => {
							it.each([
								{avatarId: 1, url: ''},
								{avatarId: 2, url: `https://eportal${environment}.admin.ch/assets/avatars/avatar_2.svg`},
								{avatarId: 13, url: `https://eportal${environment}.admin.ch/assets/avatars/avatar_13.svg`},
								{avatarId: 14, url: ''}
							])('should emit "$url" with "$avatarId" as "avatarId"', async ({avatarId, url}) => {
								const promise = firstValueFrom(service.getAvatarUrl$());
								mockStateChange.next({profile: {avatarID: avatarId}} as ObIServiceNavigationState);
								await expect(promise).resolves.toBe(url);
							});
						});

						describe('getLoginState$', () => {
							describe.each(['S1', 'S2OK', 'S2+OK', 'S3OK', 'S3+OK'])('with "%s"', loginState => {
								it(`should emit "${loginState}"`, async () => {
									const promise = firstValueFrom(service.getLoginState$());
									mockStateChange.next({loginState} as ObIServiceNavigationState);
									await expect(promise).resolves.toEqual(loginState);
								});
							});
						});

						describe('getUserName$', () => {
							it(`should emit "John Doe"`, async () => {
								const promise = firstValueFrom(service.getUserName$());
								mockStateChange.next({profile: {fullname: 'John Doe'}} as ObIServiceNavigationState);
								await expect(promise).resolves.toEqual('John Doe');
							});
						});

						describe('getMessageCount$', () => {
							it(`should emit "42"`, async () => {
								const promise = firstValueFrom(service.getMessageCount$());
								mockStateChange.next({messageCount: 42} as ObIServiceNavigationState);
								await expect(promise).resolves.toEqual(42);
							});
						});

						describe.each(['getLastUsedApplications$', 'getFavoriteApplications$'])('%s', method => {
							describe.each([
								{language: 'de', name: 'Name'},
								{language: 'fr', name: 'nom'},
								{language: 'it', name: 'nome'},
								{language: 'en', name: 'name'},
								{language: 'es', name: 'name'}
							])('with "$language" as language', ({language, name}) => {
								let promise: Promise<any>;
								beforeEach(() => {
									promise = firstValueFrom(service[method]());
									mockLangChange.next({lang: language});
									mockStateChange.next({lastUsedApps: [{appID: 42}]} as ObIServiceNavigationState);
								});

								it('should call getApplications once', () => {
									expect(applicationsService.getApplications).toHaveBeenCalledTimes(1);
								});

								it('should call getApplications with correct parameters', () => {
									expect(applicationsService.getApplications).toHaveBeenCalledWith(rootUrl ?? pamsRootUrl);
								});

								it(`should emit a list of applications`, async () => {
									await expect(promise).resolves.toEqual([{name}]);
								});
							});
						});

						describe('getLanguage$', () => {
							it('should return an observable', () => {
								expect(service.getLanguage$() instanceof Observable).toBe(true);
							});

							describe.each(['de', 'fr', 'it', 'en', 'es'])('with "%s" as language', language => {
								it(`should emit "${language}"`, async () => {
									const promise = firstValueFrom(service.getLanguage$().pipe(skip(1)));
									mockLangChange.next({lang: language});
									await expect(promise).resolves.toBe(language);
								});
							});
						});

						describe('getLanguages', () => {
							it('should return an array containing "en" and "de"', () => {
								expect(service.getLanguages()).toEqual([
									{code: 'en', label: 'English'},
									{code: 'de', label: 'Deutsch'},
									{code: 'fr', label: 'Français'},
									{code: 'it', label: 'Italiano'}
								]);
							});
						});

						describe('setLanguage', () => {
							let translate: TranslateService;
							beforeEach(() => {
								service.setLanguage('fr');
								translate = TestBed.inject(TranslateService);
							});

							it('should call "use" once', () => {
								expect(translate.use).toHaveBeenCalledTimes(1);
							});

							it('should call "use" with "fr"', () => {
								expect(translate.use).toHaveBeenCalledWith('fr');
							});
						});

						describe('HandleLogout', () => {
							it('should be settable', () => {
								const expected = false;
								service.setHandleLogout(expected);
								expect(redirectorService.handleLogout).toBe(expected);
							});
						});

						describe('LogoutTrigger', () => {
							it('should be gettable', () => {
								const result = service.getLogoutTrigger$();
								expect(result).toBe(mockGetLogoutTrigger$);
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
			{inputs: ['S2OK'], emitTimes: 1},
			{inputs: ['S2OK', 'SA'], emitTimes: 2}
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

			it(`should emit ${emitTimes} times`, async () => {
				service.setUpRootUrls(ObEPamsEnvironment.TEST);
				const promise = firstValueFrom(service.getLoginState$().pipe(count()));
				inputs.forEach(input => mockStateChangeDuplicate.next({loginState: input}));
				mockStateChangeDuplicate.complete();
				await expect(promise).resolves.toBe(emitTimes);
			});
		});
	});
});
