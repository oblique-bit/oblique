import {TestBed} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import {Subject, of, throwError} from 'rxjs';
import {map} from 'rxjs/operators';
import {ObServiceNavigationConfigApiService} from './api/service-navigation-config-api.service';
import {ObServiceNavigationPollingService} from './api/service-navigation-polling.service';
import {ObServiceNavigationApplicationsService} from './applications/service-navigation-applications.service';
import {ObEPamsEnvironment, ObISectionLink, ObLoginState} from './service-navigation.model';
import {ObIServiceNavigationState} from './api/service-navigation.api.model';
import {ObServiceNavigationService} from './service-navigation.service';
import {ObServiceNavigationTimeoutService} from './timeout/service-navigation-timeout.service';
import {ObServiceNavigationTimeoutRedirectorService} from './timeout/service-navigation-timeout-redirector.service';
import {provideHttpClient} from '@angular/common/http';
import {ObServiceNavigationInfoApiService} from './api/service-navigation-info-api.service';
import {ObNotificationService} from '../notification/notification.service';
import {ObServiceNavigationLanguageSynchronizationService} from './language-synchronization/service-navigation-language-synchronization.service';
import {WINDOW} from '../window/window.provider';
import {ObGlobalEventsService} from '../global-events/global-events.service';
import {NavigateEvent} from '../global-events/global-events.model';
import {signal} from '@angular/core';

describe('ObServiceNavigationService', () => {
	let service: ObServiceNavigationService;
	let configService: ObServiceNavigationConfigApiService;
	let applicationsService: ObServiceNavigationApplicationsService;
	let redirectorService: ObServiceNavigationTimeoutRedirectorService;
	let notification: ObNotificationService;
	let languageSynchronizationService: ObServiceNavigationLanguageSynchronizationService;

	const mockUrls = {
		pollingInterval: 10,
		pollingNotificationsInterval: 30,
		login: {
			url: 'http://login',
			params: '?returnURL=<yourReturnURL>&language=<yourLanguageID>',
			method: '',
		},
		logout: {url: 'http://logout'},
		settings: {url: 'http://settings'},
		inboxMail: {url: 'http://inboxMail'},
		allServices: {url: 'http://applications'},
	};
	let mockNavigate$: Subject<NavigateEvent>;
	const mockWindowHref = 'http://window-location-href';
	const mockLangChange = new Subject<{lang: string}>();
	const mockStateChange = new Subject<ObIServiceNavigationState>();
	const mockApplications = [{name: {en: 'name', fr: 'nom', de: 'Name', it: 'nome'}}];
	const mockGetLogoutTrigger$ = jest.fn();
	const mockRedirectorLogout = jest.fn();
	const fakeInfoBackend = {fakeInfoBackend: true};
	const mockGetInfoBackend$ = jest.fn(() => of(fakeInfoBackend));
	const mockLanguageSynchronizationInitialize = jest.fn();
	const mockLanguageSynchronizationSetLanguage = jest.fn();

	beforeEach(() => {
		mockNavigate$ = new Subject<NavigateEvent>();
		TestBed.configureTestingModule({
			providers: [
				provideHttpClient(),
				ObServiceNavigationService,
				{provide: ObServiceNavigationTimeoutService, useValue: {initialize: jest.fn(), logout: jest.fn()}},
				{
					provide: ObServiceNavigationConfigApiService,
					useValue: {fetchUrls: jest.fn().mockReturnValue(of(mockUrls))},
				},
				{
					provide: ObServiceNavigationPollingService,
					useValue: {initializeStateUpdate: jest.fn(), state$: mockStateChange.asObservable()},
				},
				{
					provide: ObServiceNavigationTimeoutRedirectorService,
					useValue: {logoutTrigger$: mockGetLogoutTrigger$, logout: mockRedirectorLogout},
				},
				{
					provide: ObServiceNavigationApplicationsService,
					useValue: {getApplications: jest.fn().mockReturnValue(source$ => source$.pipe(map(() => mockApplications)))},
				},
				{
					provide: ObServiceNavigationInfoApiService,
					useValue: {get: mockGetInfoBackend$},
				},
				{
					provide: ObServiceNavigationLanguageSynchronizationService,
					useValue: {
						initialize: mockLanguageSynchronizationInitialize,
						setLanguage: mockLanguageSynchronizationSetLanguage,
						loginLevel: 'SA',
					},
				},
				{provide: ObGlobalEventsService, useValue: {navigate$: mockNavigate$.asObservable()}},
				{provide: WINDOW, useValue: {location: {href: mockWindowHref}}},
				{
					provide: TranslateService,
					useValue: {
						onLangChange: mockLangChange.asObservable(),
						currentLang: signal('en'),
						getLangs: jest.fn().mockReturnValue(['en', 'de', 'fr', 'it']),
						use: jest.fn(),
					},
				},
			],
		});
	});

	describe('fetch a single state', () => {
		beforeEach(() => {
			languageSynchronizationService = TestBed.inject(ObServiceNavigationLanguageSynchronizationService);
			service = TestBed.inject(ObServiceNavigationService);
			configService = TestBed.inject(ObServiceNavigationConfigApiService);
			applicationsService = TestBed.inject(ObServiceNavigationApplicationsService);
			redirectorService = TestBed.inject(ObServiceNavigationTimeoutRedirectorService);
			service.setFavoriteApplicationsCount(1);
			languageSynchronizationService.loginLevel = 'SA';
			TestBed.flushEffects();
		});

		afterEach(() => {
			jest.resetAllMocks();
		});

		describe('infoBackend', () => {
			describe('With root url and app id', () => {
				const fakeAppId = 'appId';
				beforeEach(() => {
					mockGetInfoBackend$.mockImplementation(() => of(fakeInfoBackend));
					service.setUpRootUrls(ObEPamsEnvironment.TEST);
					service.setPamsAppId(fakeAppId);
					TestBed.flushEffects();
				});

				it('should return fakeInfoBackend', () => {
					expect(service.infoBackend()).toBe(fakeInfoBackend);
				});

				it('should use fakeAppId has second parameter', () => {
					expect((mockGetInfoBackend$.mock.calls[0] as string[])[1]).toBe(fakeAppId);
				});

				it('should use "en" has third parameter', () => {
					expect((mockGetInfoBackend$.mock.calls[0] as string[])[2]).toBe('en');
				});

				it('should retrigger when language change', () => {
					const newLanguage = 'fr';
					mockLangChange.next({lang: newLanguage});
					expect((mockGetInfoBackend$.mock.calls[1] as string[])[2]).toBe(newLanguage);
				});
			});

			describe('Without root url and without app id', () => {
				it('should return an empty object when root url and app id did not fire', () => {
					expect(service.infoBackend()).toEqual({});
				});
			});
		});

		it('should be created', () => {
			expect(service).toBeTruthy();
		});

		describe('with an error while fetching the config', () => {
			beforeEach(() => {
				service.setUpRootUrls(ObEPamsEnvironment.TEST);
				notification = TestBed.inject(ObNotificationService);
				jest.spyOn(configService, 'fetchUrls').mockReturnValue(throwError(() => new Error('test')));
				jest.spyOn(notification, 'error');
				TestBed.flushEffects();
			});

			it('should fall back to the initial value in loginUrl', () => {
				expect(service.loginUrl()).toBe('');
			});

			it('should emit undefined in loginState', () => {
				expect(service.loginState()).toBe(undefined);
			});

			it('should show a notification', () => {
				expect(notification.error).toHaveBeenCalledWith({
					message: 'i18n.oblique.service-navigation.config.error.message',
					title: 'i18n.oblique.service-navigation.config.error.title',
				});
			});
		});

		describe('setUpRootUrls and setReturnUrl', () => {
			describe.each([
				{desc: 'both not called', callSetupRootUrl: false, callSetReturnUrl: false},
				{desc: 'only "setReturnUrl" called with "http://localhost"', callSetupRootUrl: false, callSetReturnUrl: true},
				{
					desc: 'only "setUpRootUrls" called with "null" as "environment',
					callSetupRootUrl: true,
					environment: null,
					callSetReturnUrl: false,
				},
				{
					desc: 'only "setUpRootUrls" called with "undefined" as "environment',
					callSetupRootUrl: true,
					environment: undefined,
					callSetReturnUrl: false,
				},
			])('$desc', ({callSetupRootUrl, environment, callSetReturnUrl}) => {
				beforeEach(() => {
					if (callSetupRootUrl) {
						service.setUpRootUrls(environment);
					}
					if (callSetReturnUrl) {
						service.connectReturnUrl(signal('http://localhost'));
					}
					TestBed.flushEffects();
				});

				describe.each([
					'loginUrl',
					'userName',
					'profileUrls',
					'inboxMailUrl',
					'messageCount',
					'applicationsUrl',
					'lastUsedApplications',
					'favoriteApplications',
				])('%s', () => {
					it('should not call "ObServiceNavigationConfigApiService.fetchUrls()"', () => {
						expect(configService.fetchUrls).not.toHaveBeenCalled();
					});
				});

				describe('loginState', () => {
					it('should hold its initial value', () => {
						expect(service.loginState()).toBe(undefined);
					});

					describe('ObServiceNavigationConfigService.fetchUrls', () => {
						it('should not have been called', () => {
							expect(configService.fetchUrls).not.toHaveBeenCalled();
						});
					});
				});

				describe('language', () => {
					describe.each(['de', 'fr', 'it', 'en', 'es'])('with "%s" as language', language => {
						it(`should emit "${language}"`, () => {
							mockLangChange.next({lang: language});
							expect(service.language()).toBe(language);
						});
					});
				});

				describe('languages', () => {
					it('should return an array containing "en" and "de"', () => {
						expect(service.languages()).toEqual([
							{code: 'en', label: 'English'},
							{code: 'de', label: 'Deutsch'},
							{code: 'fr', label: 'Français'},
							{code: 'it', label: 'Italiano'},
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

			describe.each([{environment: ObEPamsEnvironment.DEV, pamsRootUrl: 'https://pams-api.eportal-d.admin.ch/'}])(
				'"setReturnUrl" called with "http://localhost" and "setUpRootUrls" called with "$environment" as "environment"',
				({environment, pamsRootUrl}) => {
					describe.each([
						{
							desc: 'and "http://root-url" as "rootUrl"',
							rootUrl: 'http://root-url/',
							calledPamsUrl: 'http://root-url/',
						},
					])('$desc', ({rootUrl, calledPamsUrl}) => {
						beforeEach(() => {
							service.setUpRootUrls(environment, rootUrl);
							service.connectReturnUrl(signal('http://localhost'));
							TestBed.flushEffects();
						});

						describe.each(['loginUrl', 'profileUrls', 'inboxMailUrl'])('%s', () => {
							describe('ObServiceNavigationConfigService.fetchUrls', () => {
								describe('languageSynchronizationService', () => {
									it('should initialized languageSynchronizationService with the correct rootUrl', () => {
										expect(mockLanguageSynchronizationInitialize).toHaveBeenNthCalledWith(1, calledPamsUrl);
									});
								});

								it('should have been called once', () => {
									expect(configService.fetchUrls).toHaveBeenCalledTimes(1);
								});

								it(`should have been called with "${calledPamsUrl}"`, () => {
									expect(configService.fetchUrls).toHaveBeenCalledWith(calledPamsUrl);
								});
							});
						});

						describe('loginUrl', () => {
							describe.each(['de', 'fr', 'it', 'en', 'es'])('with "%s" as language', language => {
								describe('With pamsAppId', () => {
									const randomPamsAppId = 'randomPamsAppId';

									beforeEach(() => {
										service.setPamsAppId(randomPamsAppId);
										TestBed.flushEffects();
									});

									it(`should emit "http://login?returnURL=http://localhost&language=${language}&appid=${randomPamsAppId}"`, () => {
										mockLangChange.next({lang: language});
										expect(service.loginUrl()).toBe(
											`http://login?returnURL=http://localhost&language=${language}&appid=${randomPamsAppId}`
										);
									});
								});
							});
						});

						const fakePamsAppId = '1';
						describe('inboxMailUrl', () => {
							it(`should emit "http://inboxMail?returnApplicationId=${fakePamsAppId}"`, () => {
								service.setPamsAppId(fakePamsAppId);
								TestBed.flushEffects();
								expect(service.inboxMailUrl()).toBe(`http://inboxMail?returnApplicationId=${fakePamsAppId}`);
							});
						});

						describe('applicationsUrl', () => {
							it('should emit "http://applications"', () => {
								expect(service.applicationsUrl()).toBe('http://applications');
							});
						});

						describe('profileUrls', () => {
							describe.each([
								{
									index: 0,
									url: `http://applications/profile/details?returnApplicationId=${fakePamsAppId}`,
									label: 'i18n.oblique.service-navigation.profile.my-profile',
									isInternalLink: true,
								},
								{
									index: 1,
									url: `http://applications/profile/permissions?returnApplicationId=${fakePamsAppId}`,
									label: 'i18n.oblique.service-navigation.profile.my-permissions',
									isInternalLink: true,
								},
								{
									index: 2,
									url: `http://applications/profile/push-notifications?returnApplicationId=${fakePamsAppId}`,
									label: 'i18n.oblique.service-navigation.profile.my-email-sms-notifications',
									isInternalLink: true,
								},
								{
									index: 3,
									url: `http://applications/redeem?returnApplicationId=${fakePamsAppId}`,
									label: 'i18n.oblique.service-navigation.profile.redeem-code',
									isInternalLink: true,
								},
							])('Url number $index', expectedUrl => {
								let urls: ObISectionLink[];
								beforeEach(() => {
									service.setPamsAppId(fakePamsAppId);
									TestBed.flushEffects();
									mockStateChange.next({loginState: 'S3+OK', profile: {}} as ObIServiceNavigationState);
									urls = service.profileUrls();
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
								it('should return empty array', () => {
									service.setPamsAppId(fakePamsAppId);
									TestBed.flushEffects();
									mockStateChange.next({loginState: rightLevel, profile: {}} as ObIServiceNavigationState);
									expect(service.profileUrls()).toHaveLength(0);
								});
							});
						});

						describe('loginState', () => {
							describe.each(['S1', 'S2OK', 'S2+OK', 'S3OK', 'S3+OK'])('with "%s"', loginState => {
								it(`should emit "${loginState}"`, () => {
									mockStateChange.next({loginState, profile: {}} as ObIServiceNavigationState);
									expect(service.loginState()).toEqual(loginState);
								});
							});
						});

						describe('userName', () => {
							it('should emit "John Doe"', () => {
								mockStateChange.next({profile: {fullname: 'John Doe'}} as ObIServiceNavigationState);
								expect(service.userName()).toEqual('John Doe');
							});
						});

						describe('messageCount', () => {
							it('should emit "42"', () => {
								mockStateChange.next({messageCount: 42, profile: {}} as ObIServiceNavigationState);
								expect(service.messageCount()).toEqual(42);
							});
						});

						describe.each(['lastUsedApplications', 'favoriteApplications'])('%s', signalName => {
							describe.each([
								{language: 'de', name: 'Name'},
								{language: 'fr', name: 'nom'},
								{language: 'it', name: 'nome'},
								{language: 'en', name: 'name'},
								{language: 'es', name: 'name'},
							])('with "$language" as language', ({language, name}) => {
								beforeEach(() => {
									mockLangChange.next({lang: language});
									mockStateChange.next({lastUsedApps: [{appID: 42}], profile: {}} as ObIServiceNavigationState);
								});

								it('should call getApplications with correct parameters', () => {
									expect(applicationsService.getApplications).toHaveBeenCalledWith(rootUrl ?? pamsRootUrl);
								});

								it('should emit a list of applications', () => {
									expect(service[signalName]()).toEqual([{name}]);
								});
							});
						});

						describe('language', () => {
							describe.each(['de', 'fr', 'it', 'en', 'es'])('with "%s" as language', language => {
								it(`should emit "${language}"`, () => {
									mockLangChange.next({lang: language});
									expect(service.language()).toBe(language);
								});
							});
						});

						describe('languages', () => {
							it('should return an array containing "en" and "de"', () => {
								expect(service.languages()).toEqual([
									{code: 'en', label: 'English'},
									{code: 'de', label: 'Deutsch'},
									{code: 'fr', label: 'Français'},
									{code: 'it', label: 'Italiano'},
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

						describe('setEportalLanguageSynchronization', () => {
							it('should be settable', () => {
								const expected = true;
								service.setEportalLanguageSynchronization(expected);
								expect(languageSynchronizationService.shouldSynchronize).toBe(expected);
							});
						});
					});
				}
			);
		});

		it('should set language synchronization', () => {
			const languageCode = 'en';
			mockStateChange.next({profile: {language: languageCode}} as ObIServiceNavigationState);

			expect(mockLanguageSynchronizationSetLanguage).toHaveBeenNthCalledWith(1, languageCode);
		});

		it('should set login state', () => {
			const loginLevel: ObLoginState = 'S2OK';

			service.setUpRootUrls(ObEPamsEnvironment.TEST);
			TestBed.flushEffects();
			mockStateChange.next({loginState: loginLevel, profile: {}} as ObIServiceNavigationState);

			expect(languageSynchronizationService.loginLevel).toBe(loginLevel);
		});
	});

	describe('loginUrl and navigationChanged', () => {
		const appId = 'appId';

		beforeEach(() => {
			service = TestBed.inject(ObServiceNavigationService);
			service.setUpRootUrls(ObEPamsEnvironment.DEV, 'http://root-url/');
			service.setFavoriteApplicationsCount(1);
			service.setPamsAppId(appId);
			service.connectReturnUrl(signal(undefined));
			TestBed.flushEffects();
		});

		it('should use window.location.href as the initial navigateUrl before any navigation event', () => {
			expect(service.loginUrl()).toBe(`http://login?returnURL=${mockWindowHref}&language=en&appid=${appId}`);
		});

		it('should use the navigateUrl emitted by navigate$ when returnUrl is not set', () => {
			const navigatedUrl = 'http://navigated-url';
			mockNavigate$.next({destination: {url: navigatedUrl}});
			expect(service.loginUrl()).toBe(`http://login?returnURL=${navigatedUrl}&language=en&appid=${appId}`);
		});

		it('should re-emit loginUrl each time navigate$ emits a new value', () => {
			const secondUrl = 'http://second-url';
			const initialUrl = service.loginUrl();

			mockNavigate$.next({destination: {url: 'http://first-url'}});
			const firstUrl = service.loginUrl();

			mockNavigate$.next({destination: {url: secondUrl}});
			const finalUrl = service.loginUrl();

			expect(initialUrl).toContain(mockWindowHref);
			expect(firstUrl).toContain('http://first-url');
			expect(finalUrl).toContain(secondUrl);
		});
	});

	describe('fetch multiple states', () => {
		describe.each([
			{inputs: ['SA', 'SA'], emitTimes: 1},
			{inputs: ['SA', 'S2OK'], emitTimes: 2},
			{inputs: ['SA', 'S2OK', 'S2OK'], emitTimes: 2},
			{inputs: ['S2OK'], emitTimes: 1},
			{inputs: ['S2OK', 'SA'], emitTimes: 2},
			{inputs: [undefined], emitTimes: 1},
		])('loginState', ({inputs, emitTimes}) => {
			const mockStateChangeDuplicate = new Subject();
			beforeEach(() => {
				TestBed.overrideProvider(ObServiceNavigationPollingService, {
					useValue: {
						initializeStateUpdate: jest.fn(),
						state$: mockStateChangeDuplicate.asObservable(),
					},
				});
				service = TestBed.inject(ObServiceNavigationService);
			});

			it(`should emit ${emitTimes} times`, () => {
				service.setUpRootUrls(ObEPamsEnvironment.TEST);
				service.setFavoriteApplicationsCount(1);
				TestBed.flushEffects();
				const emittedStates: ObLoginState[] = [];

				inputs.forEach(input => {
					mockStateChangeDuplicate.next({loginState: input, profile: {}});
					emittedStates.push(service.loginState());
				});

				expect(new Set(emittedStates).size).toBe(emitTimes);
			});
		});
	});
});
