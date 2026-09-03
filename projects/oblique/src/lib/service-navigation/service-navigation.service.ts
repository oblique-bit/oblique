/* eslint-disable max-lines */
// The public signal fields (loginUrl, profileUrls, ...) reference the private injected services at
// field-initialization time, so those private fields must be declared before the public ones. This
// violates the public-before-private member ordering. Extracting the defaults to module-level
// factories was considered but rejected because it would complicate a future migration to standalone
// components.
/* eslint-disable @typescript-eslint/member-ordering */
import {Injectable, Signal, computed, inject, isDevMode, signal} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {TranslateService} from '@ngx-translate/core';
import {Observable, ReplaySubject, combineLatest, of, share, switchMap, throwError} from 'rxjs';
import {
	catchError,
	combineLatestWith,
	distinctUntilChanged,
	filter,
	map,
	shareReplay,
	startWith,
	tap,
} from 'rxjs/operators';
import {ObServiceNavigationConfigApiService} from './api/service-navigation-config-api.service';
import {ObServiceNavigationPollingService} from './api/service-navigation-polling.service';
import {
	ObIServiceNavigationApplicationParsedInfo,
	ObIServiceNavigationBackendInfo,
} from './api/service-navigation.api.model';
import {ObServiceNavigationApplicationsService} from './applications/service-navigation-applications.service';
import {ObConsoleService} from '../console/ob-console.service';
import {ObEPamsEnvironment, ObISectionLink, ObIServiceNavigationApplication} from './service-navigation.model';
import {ObServiceNavigationTimeoutRedirectorService} from './timeout/service-navigation-timeout-redirector.service';
import {ObServiceNavigationTimeoutService} from './timeout/service-navigation-timeout.service';
import {ObNotificationService} from '../notification/notification.service';
import {ObHttpApiInterceptorEvents} from '../http-api-interceptor/http-api-interceptor.events';
import {ObServiceNavigationInfoApiService} from './api/service-navigation-info-api.service';
import {ObServiceNavigationLanguageSynchronizationService} from './language-synchronization/service-navigation-language-synchronization.service';
import {WINDOW} from '../window/window.provider';
import {ObGlobalEventsService} from '../global-events/global-events.service';

@Injectable()
export class ObServiceNavigationService {
	private static readonly languageLabels = {
		de: 'Deutsch',
		fr: 'Français',
		it: 'Italiano',
		en: 'English',
	};
	private readonly rootUrl = signal<string | undefined>(undefined);
	private readonly rootUrl$ = toObservable(this.rootUrl).pipe(filter((rootUrl): rootUrl is string => !!rootUrl));
	private readonly returnUrlSource = signal<Signal<string | undefined> | null>(null);
	private readonly returnUrl = computed(() => this.returnUrlSource()?.() ?? undefined);
	private readonly pamsAppId = signal<string | undefined>(undefined);
	private readonly favoriteApplicationsCount = signal(8);
	private readonly returnAppIdUrlParameter$ = toObservable(this.pamsAppId).pipe(
		map(pamsAppId => `?returnApplicationId=${pamsAppId}`)
	);

	private readonly config$ = this.rootUrl$.pipe(
		combineLatestWith(toObservable(this.favoriteApplicationsCount)),
		switchMap(([rootUrl, favoriteApplicationsCount]) => {
			this.httpApiInterceptorEvents.deactivateNotificationOnNextAPICalls(1);
			return this.configService.fetchUrls(rootUrl).pipe(
				catchError(() => {
					this.notification.error({
						message: 'i18n.oblique.service-navigation.config.error.message',
						title: 'i18n.oblique.service-navigation.config.error.title',
					});
					return throwError(() => new Error('Cannot load service navigation config'));
				}),
				tap(data =>
					this.pollingService.initializeStateUpdate(
						data.pollingInterval,
						data.pollingNotificationsInterval,
						rootUrl,
						favoriteApplicationsCount
					)
				),
				tap(() => {
					this.languageSynchronizationService.initialize(rootUrl);
				}),
				tap(() => {
					this.timeoutService.rootUrl = rootUrl;
				}),
				tap(data => {
					this.timeoutService.logoutUrl = data.logout.url;
				}),
				tap(data => {
					this.redirectorService.logoutUrl = data.logout.url;
				})
			);
		}),
		// the http request should not be fired again, hence the deactivation of both resets
		share({connector: () => new ReplaySubject(1), resetOnComplete: false, resetOnRefCountZero: false})
	);

	private readonly configService = inject(ObServiceNavigationConfigApiService);
	private readonly infoService = inject(ObServiceNavigationInfoApiService);
	private readonly pollingService = inject(ObServiceNavigationPollingService);
	private readonly applicationsService = inject(ObServiceNavigationApplicationsService);
	private readonly translateService = inject(TranslateService);
	private readonly redirectorService = inject(ObServiceNavigationTimeoutRedirectorService);
	private readonly timeoutService = inject(ObServiceNavigationTimeoutService);
	private readonly languageSynchronizationService = inject(ObServiceNavigationLanguageSynchronizationService);
	private readonly notification = inject(ObNotificationService);
	private readonly httpApiInterceptorEvents = inject(ObHttpApiInterceptorEvents);
	private readonly window = inject(WINDOW);
	private readonly globalEvents = inject(ObGlobalEventsService);
	private readonly obConsole = inject(ObConsoleService);

	private readonly navigationChanged$ = this.globalEvents.navigate$.pipe(
		map(navigate => navigate.destination.url),
		startWith(this.window.location.href)
	);

	private readonly state$ = this.pollingService.state$.pipe(
		tap(state => {
			this.timeoutService.loginState = state.loginState;
		}),
		tap(state => {
			this.languageSynchronizationService.setLanguage(state.profile.language);
			this.languageSynchronizationService.loginLevel = state.loginState;
		}),
		shareReplay({bufferSize: 1, refCount: true})
	);

	/**
	 * Initializes the root URL from the given environment and optional explicit root URL.
	 * @param environment the ePortal environment to use; when undefined, the root URL is left untouched
	 * @param rootUrl an optional explicit root URL that overrides the environment-derived one
	 */
	setUpRootUrls(environment: ObEPamsEnvironment | undefined, rootUrl?: string): void {
		// can't use !environment as ObEPamsEnvironment.PROD is an empty string
		if (environment !== null && environment !== undefined) {
			this.timeoutService.initialize(environment);
			this.rootUrl.set(rootUrl ?? `https://pams-api.eportal${environment}.admin.ch/`);
		}
	}

	/**
	 * Connects the return URL signal so the login URL can substitute the user's return address.
	 * @param source the signal providing the current return URL
	 */
	connectReturnUrl(source: Signal<string | undefined>): void {
		this.returnUrlSource.set(source);
	}

	/**
	 * Sets the ePortal application id used to build the login URL.
	 * @param appId the ePortal application id
	 */
	setPamsAppId(appId: string | undefined): void {
		this.pamsAppId.set(appId);
	}

	/**
	 * Sets the maximum number of favorite applications to display.
	 * @param count the maximum number of favorite applications
	 */
	setFavoriteApplicationsCount(count: number): void {
		this.favoriteApplicationsCount.set(count);
	}

	/**
	 * Sets whether logout should be handled by the service navigation.
	 * @param handleLogout whether logout is handled by the service navigation
	 */
	setHandleLogout(handleLogout: boolean): void {
		this.redirectorService.handleLogout = handleLogout;
	}

	/**
	 * Returns an observable that emits whenever a logout is triggered.
	 * @returns an observable emitting the logout URL
	 */
	getLogoutTrigger$(): Observable<string> {
		return this.redirectorService.logoutTrigger$;
	}

	/**
	 * Sets whether the language should be synchronized with ePortal.
	 * @param synchronization whether the language is synchronized with ePortal
	 */
	setEportalLanguageSynchronization(synchronization: boolean): void {
		this.languageSynchronizationService.shouldSynchronize = synchronization;
	}

	/**
	 * Sets the current language.
	 * @param language the language code to switch to
	 */
	setLanguage(language: string): void {
		this.translateService.use(language);
	}

	/**
	 * Triggers a logout through the service navigation.
	 */
	logout(): void {
		this.redirectorService.logout();
	}

	/** The login URL for the current user, including the return URL and language placeholders. */
	readonly loginUrl = this.toSignalWithFallback(
		this.config$.pipe(
			map(config => config.login),
			map(loginData => loginData.url + loginData.params),
			combineLatestWith(toObservable(this.returnUrl), this.navigationChanged$),
			map(([loginUrl, returnUrl, navigateUrl]) => loginUrl.replace('<yourReturnURL>', returnUrl ?? navigateUrl)),
			this.combineWithLanguage<string>(),
			map(([url, lang]) => url.replace('<yourLanguageID>', lang)),
			combineLatestWith(toObservable(this.pamsAppId)),
			tap(([, pamsAppId]) => {
				if (!pamsAppId && isDevMode()) {
					this.obConsole.error(
						'ObServiceNavigationService loginUrl()',
						'Service Navigation requires an appId for step-up logins to work. The appId can be found on the application configuration page on ePortal.'
					);
				}
			}),
			filter(([, pamsAppId]) => !!pamsAppId),
			map(([url, pamsAppId]) => this.addAppId(url, pamsAppId))
		),
		''
	);
	/** The profile section links for the current user. */
	readonly profileUrls = this.toSignalWithFallback(
		this.config$.pipe(
			combineLatestWith(this.state$, this.returnAppIdUrlParameter$),
			map(([config, state, returnAppId]): ObISectionLink[] => {
				if (state.loginState === 'SA' || state.loginState === 'S1') {
					return [];
				}

				const base = config.allServices.url;

				return [
					{
						url: `${base}/profile/details${returnAppId}`,
						label: 'i18n.oblique.service-navigation.profile.my-profile',
						isInternalLink: true,
					},
					{
						url: `${base}/profile/permissions${returnAppId}`,
						label: 'i18n.oblique.service-navigation.profile.my-permissions',
						isInternalLink: true,
					},
					{
						url: `${base}/profile/push-notifications${returnAppId}`,
						label: 'i18n.oblique.service-navigation.profile.my-email-sms-notifications',
						isInternalLink: true,
					},
					{
						url: `${base}/redeem${returnAppId}`,
						label: 'i18n.oblique.service-navigation.profile.redeem-code',
						isInternalLink: true,
					},
				];
			})
		),
		[]
	);
	/** The inbox mail URL for the current user. */
	readonly inboxMailUrl = this.toSignalWithFallback(
		this.config$.pipe(
			combineLatestWith(this.returnAppIdUrlParameter$),
			map(([config, returnAppId]) => `${config.inboxMail.url}${returnAppId}`)
		),
		''
	);
	/** The URL of the applications overview page. */
	readonly applicationsUrl = this.toSignalWithFallback(this.config$.pipe(map(config => config.allServices.url)), '');
	/** The current login state of the user. */
	readonly loginState = toSignal(
		this.config$.pipe(
			switchMap(() => this.state$),
			catchError(() => of({loginState: undefined})),
			map(state => state.loginState),
			distinctUntilChanged((previousState, newState) => previousState === newState)
		),
		{initialValue: undefined}
	);
	/** The full name of the current user. */
	readonly userName = this.toSignalWithFallback(
		this.state$.pipe(
			map(state => state.profile.fullname),
			distinctUntilChanged((previousState, newState) => previousState === newState)
		),
		''
	);
	/** The number of unread messages of the current user. */
	readonly messageCount = this.toSignalWithFallback(
		this.state$.pipe(
			map(state => state.messageCount),
			distinctUntilChanged((previousState, newState) => previousState === newState)
		),
		0
	);
	/** The applications the current user used last. */
	readonly lastUsedApplications = this.toSignalWithFallback(this.getApplications$('lastUsedApps'), []);
	/** The favorite applications of the current user. */
	readonly favoriteApplications = this.toSignalWithFallback(this.getApplications$('favoriteApps'), []);
	/** The info content provided by the backend. */
	readonly infoBackend = this.toSignalWithFallback(this.getInfoBackend$(), {} as ObIServiceNavigationBackendInfo);
	/** The current language code. */
	readonly language = toSignal(
		this.translateService.onLangChange.pipe(
			map(event => event.lang),
			startWith(this.translateService.currentLang())
		),
		{initialValue: this.translateService.currentLang()}
	);
	/** The available languages with their display labels. */
	readonly languages = computed(() =>
		this.translateService
			.getLangs()
			.map(language => ({code: language, label: ObServiceNavigationService.languageLabels[language]}))
	);

	private toSignalWithFallback<T>(source$: Observable<T>, initialValue: T): Signal<T> {
		return toSignal(source$.pipe(catchError(() => of(initialValue))), {initialValue});
	}

	private getApplications$(
		applicationListName: 'favoriteApps' | 'lastUsedApps'
	): Observable<ObIServiceNavigationApplication[]> {
		return this.rootUrl$.pipe(
			switchMap(rootUrl =>
				this.state$.pipe(
					map(state => state[applicationListName]),
					this.applicationsService.getApplications(rootUrl),
					this.combineWithLanguage<ObIServiceNavigationApplicationParsedInfo[]>(),
					map(([applicationsInfo, lang]) =>
						applicationsInfo.map(applicationInfo => ({
							...applicationInfo,
							name: applicationInfo.name[lang] ?? applicationInfo.name[Object.keys(applicationInfo.name)[0]],
						}))
					)
				)
			)
		);
	}

	private getInfoBackend$(): Observable<ObIServiceNavigationBackendInfo> {
		const onLanguageChange$ = this.translateService.onLangChange.pipe(
			startWith({lang: this.translateService.currentLang()})
		);
		return combineLatest([toObservable(this.rootUrl), toObservable(this.pamsAppId), onLanguageChange$]).pipe(
			filter(([rootUrl, pamsId]) => !!rootUrl && !!pamsId),
			switchMap(([rootUrl, pamsId, onLangChange]) => {
				return this.infoService.get(rootUrl!, pamsId!, onLangChange.lang);
			}),
			startWith({} as ObIServiceNavigationBackendInfo)
		);
	}

	private combineWithLanguage<T>(): (source$: Observable<T>) => Observable<[T, string]> {
		return source$ =>
			source$.pipe(
				combineLatestWith(
					this.translateService.onLangChange.pipe(
						map(event => event.lang),
						startWith(this.translateService.currentLang())
					)
				)
			);
	}

	private addAppId(url: string, pamsAppId?: string): string {
		if (!pamsAppId) {
			throw new Error(
				'Service Navigation requires an appId for step-up logins to work. The appId can be found on the application configuration page on ePortal.'
			);
		}
		return `${url}&appid=${pamsAppId}`;
	}
}
