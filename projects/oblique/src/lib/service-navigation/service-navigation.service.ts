import {Injectable, inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Observable, ReplaySubject, combineLatest, share, switchMap} from 'rxjs';
import {combineLatestWith, distinctUntilChanged, map, startWith, tap} from 'rxjs/operators';
import {ObServiceNavigationInfoApiService} from './api/service-navigation-info-api.service';
import {ObServiceNavigationConfigApiService} from './api/service-navigation-config-api.service';
import {ObServiceNavigationPollingService} from './api/service-navigation-polling.service';
import {
	ObIServiceNavigationApplicationParsedInfo,
	ObIServiceNavigationBackendInfo,
	ObIServiceNavigationState
} from './api/service-navigation.api.model';
import {ObServiceNavigationApplicationsService} from './applications/service-navigation-applications.service';
import {ObEPamsEnvironment, ObILanguage, ObISectionLink, ObIServiceNavigationApplication, ObLoginState} from './service-navigation.model';
import {ObServiceNavigationTimeoutRedirectorService} from './timeout/service-navigation-timeout-redirector.service';
import {ObServiceNavigationTimeoutService} from './timeout/service-navigation-timeout.service';

@Injectable()
export class ObServiceNavigationService {
	private static readonly languageLabels = {
		de: 'Deutsch',
		fr: 'Français',
		it: 'Italiano',
		en: 'English'
	};
	private readonly rootUrl$ = new ReplaySubject<string>(1);
	private readonly avatarRootUrl$ = new ReplaySubject<string>(1);
	private readonly returnUrl$ = new ReplaySubject<string>(1);
	private readonly pamsAppId$ = new ReplaySubject<string>(1);
	private readonly favoriteApplicationsCount$ = new ReplaySubject<number>(1);

	private readonly config$ = this.rootUrl$.pipe(
		combineLatestWith(this.favoriteApplicationsCount$),
		switchMap(([rootUrl, favoriteApplicationsCount]) =>
			this.configService.fetchUrls(rootUrl).pipe(
				tap(data =>
					this.pollingService.initializeStateUpdate(
						data.pollingInterval,
						data.pollingNotificationsInterval,
						rootUrl,
						favoriteApplicationsCount
					)
				),
				tap(() => (this.timeoutService.rootUrl = rootUrl)),
				tap(data => (this.timeoutService.logoutUrl = data.logout.url)),
				tap(data => (this.redirectorService.logoutUrl = data.logout.url))
			)
		),
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

	setUpRootUrls(environment: ObEPamsEnvironment, rootUrl?: string): void {
		// can't use !environment as ObEPamsEnvironment.PROD is an empty string
		if (environment !== null && environment !== undefined) {
			this.timeoutService.initialize(environment);
			this.rootUrl$.next(rootUrl ?? `https://pams-api.eportal${environment}.admin.ch/`);
			this.avatarRootUrl$.next(`https://eportal${environment}.admin.ch/assets/avatars/avatar_`);
			this.rootUrl$.complete();
			this.avatarRootUrl$.complete();
		}
	}

	setReturnUrl(returnUrl: string): void {
		this.returnUrl$.next(returnUrl);
	}

	setPamsAppId(appId: string): void {
		this.pamsAppId$.next(appId);
	}

	setFavoriteApplicationsCount(count: number): void {
		this.favoriteApplicationsCount$.next(count);
	}

	setHandleLogout(handleLogout: boolean): void {
		this.redirectorService.handleLogout = handleLogout;
	}

	getLogoutTrigger$(): Observable<string> {
		return this.redirectorService.logoutTrigger$;
	}

	getLoginUrl$(): Observable<string> {
		return this.config$.pipe(
			map(config => config.login),
			map(loginData => loginData.url + loginData.params),
			combineLatestWith(this.returnUrl$),
			map(([loginUrl, returnUrl]) => loginUrl.replace('<yourReturnURL>', returnUrl)),
			this.combineWithLanguage<string>(),
			map(([url, lang]) => url.replace('<yourLanguageID>', lang)),
			combineLatestWith(this.pamsAppId$),
			map(([url, pamsAppId]) => this.addAppId(url, pamsAppId))
		);
	}

	getProfileUrls$(): Observable<ObISectionLink[]> {
		return this.config$.pipe(
			combineLatestWith(this.pollingService.state$),
			map(([config, state]): ObISectionLink[] => {
				if (state.loginState === 'SA' || state.loginState === 'S1') {
					return [];
				}

				const base = config.allServices.url;
				return [
					{url: `${base}/profile/details`, label: 'i18n.oblique.service-navigation.profile.my-profile', isInternalLink: true},
					{url: `${base}/profile/permissions`, label: 'i18n.oblique.service-navigation.profile.my-permissions', isInternalLink: true},
					{
						url: `${base}/profile/push-notifications`,
						label: 'i18n.oblique.service-navigation.profile.my-email-sms-notifications',
						isInternalLink: true
					},
					{
						url: `${base}/profile/business-partnerships`,
						label: 'i18n.oblique.service-navigation.profile.my-business-partnerships',
						isInternalLink: true
					},
					{
						url: `${base}/redeem`,
						label: 'i18n.oblique.service-navigation.profile.redeem-code',
						isInternalLink: true
					}
				];
			})
		);
	}

	getAvatarUrl$(): Observable<string> {
		return this.getState$().pipe(
			map(state => state.profile?.avatarID),
			map(imageId => (imageId > 1 && imageId < 14 ? imageId.toString() : '')),
			combineLatestWith(this.avatarRootUrl$),
			map(([imageId, avatarRootUrl]) => (imageId ? `${avatarRootUrl + imageId}.svg` : imageId)),
			distinctUntilChanged((previousState, newState) => previousState === newState)
		);
	}

	getInboxMailUrl$(): Observable<string> {
		return this.config$.pipe(map(config => config.inboxMail.url));
	}

	getApplicationsUrl$(): Observable<string> {
		return this.config$.pipe(map(config => config.allServices.url));
	}

	getLoginState$(): Observable<ObLoginState> {
		return this.getState$().pipe(
			map(state => state.loginState),
			distinctUntilChanged((previousState, newState) => previousState === newState)
		);
	}

	getUserName$(): Observable<string> {
		return this.getState$().pipe(
			map(state => state.profile?.fullname),
			distinctUntilChanged((previousState, newState) => previousState === newState)
		);
	}

	getMessageCount$(): Observable<number> {
		return this.getState$().pipe(
			map(state => state.messageCount),
			distinctUntilChanged((previousState, newState) => previousState === newState)
		);
	}

	getLastUsedApplications$(): Observable<ObIServiceNavigationApplication[]> {
		return this.getApplications$('lastUsedApps');
	}

	getFavoriteApplications$(): Observable<ObIServiceNavigationApplication[]> {
		return this.getApplications$('favoriteApps');
	}

	getInfoBackend$(): Observable<ObIServiceNavigationBackendInfo> {
		const onLanguageChange$ = this.translateService.onLangChange.pipe(startWith({lang: this.translateService.currentLang}));
		return combineLatest([this.rootUrl$, this.pamsAppId$, onLanguageChange$]).pipe(
			switchMap(([rootUrl, pamsId, onLangChange]) => {
				return this.infoService.get(rootUrl, pamsId, onLangChange.lang);
			}),
			startWith({} as ObIServiceNavigationBackendInfo)
		);
	}

	getLanguage$(): Observable<string> {
		return this.translateService.onLangChange.pipe(
			map(event => event.lang),
			startWith(this.translateService.currentLang),
			share({connector: () => new ReplaySubject(1)})
		);
	}

	getLanguages(): ObILanguage[] {
		return this.translateService.getLangs().map(language => ({code: language, label: ObServiceNavigationService.languageLabels[language]}));
	}

	setLanguage(language: string): void {
		this.translateService.use(language);
	}

	logout(): void {
		this.redirectorService.logout();
	}

	private getApplications$(applicationListName: 'favoriteApps' | 'lastUsedApps'): Observable<ObIServiceNavigationApplication[]> {
		return this.rootUrl$.pipe(
			switchMap(rootUrl =>
				this.getState$().pipe(
					map(state => state[applicationListName]),
					this.applicationsService.getApplications(rootUrl),
					this.combineWithLanguage<ObIServiceNavigationApplicationParsedInfo[]>(),
					map(([applicationsInfo, lang]) =>
						applicationsInfo.map(applicationInfo => ({
							...applicationInfo,
							name: applicationInfo.name[lang] ?? applicationInfo.name[Object.keys(applicationInfo.name)[0]]
						}))
					)
				)
			)
		);
	}

	private combineWithLanguage<T>(): (source$: Observable<T>) => Observable<[T, string]> {
		return source$ =>
			source$.pipe(
				combineLatestWith(
					this.translateService.onLangChange.pipe(
						map(event => event.lang),
						startWith(this.translateService.currentLang)
					)
				)
			);
	}

	private getState$(): Observable<ObIServiceNavigationState> {
		return this.config$.pipe(
			combineLatestWith(this.pollingService.state$),
			map(values => values[1]),
			tap(values => (this.timeoutService.loginState = values.loginState))
		);
	}

	private addAppId(url: string, pamsAppId: string): string {
		if (!pamsAppId) {
			throw new Error(
				'Service Navigation requires an appId for step-up logins to work. The appId can be found on the application configuration page on ePortal.'
			);
		}
		return `${url}&appid=${pamsAppId}`;
	}
}
