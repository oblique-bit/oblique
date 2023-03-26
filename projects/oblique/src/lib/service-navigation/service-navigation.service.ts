import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Observable, ReplaySubject, switchMap} from 'rxjs';
import {combineLatestWith, distinctUntilChanged, map, shareReplay, startWith, tap} from 'rxjs/operators';
import {ObEPamsEnvironment, ObIServiceNavigationApplication, ObLoginState} from './service-navigation.model';
import {ObServiceNavigationConfigApiService} from './api/service-navigation-config-api.service';
import {ObServiceNavigationPollingService} from './api/service-navigation-polling.service';
import {ObIServiceNavigationApplicationParsedInfo, ObIServiceNavigationState} from './api/service-navigation.api.model';
import {ObServiceNavigationApplicationsService} from './applications/service-navigation-applications.service';

@Injectable()
export class ObServiceNavigationService {
	private readonly rootUrl$ = new ReplaySubject<string>(1);
	private readonly avatarRootUrl$ = new ReplaySubject<string>(1);
	private readonly returnUrl$ = new ReplaySubject<string>(1);
	private readonly config$ = this.rootUrl$.pipe(
		switchMap(rootUrl =>
			this.configService
				.fetchUrls(rootUrl)
				.pipe(tap(data => this.pollingService.initializeStateUpdate(data.pollingInterval, data.pollingNotificationsInterval, rootUrl)))
		),
		shareReplay(1)
	);

	constructor(
		private readonly configService: ObServiceNavigationConfigApiService,
		private readonly pollingService: ObServiceNavigationPollingService,
		private readonly applicationsService: ObServiceNavigationApplicationsService,
		private readonly translateService: TranslateService
	) {}

	setUpRootUrls(environment: ObEPamsEnvironment, rootUrl?: string): void {
		// can't use !environment as ObEPamsEnvironment.PROD is an empty string
		if (environment !== null && environment !== undefined) {
			this.rootUrl$.next(rootUrl ?? `https://pams-api.eportal${environment}.admin.ch/`);
			this.avatarRootUrl$.next(`https://eportal${environment}.admin.ch/assets/avatars/avatar_`);
			this.rootUrl$.complete();
			this.avatarRootUrl$.complete();
		}
	}

	setReturnUrl(returnUrl: string): void {
		this.returnUrl$.next(returnUrl);
	}

	getLoginUrl$(): Observable<string> {
		return this.config$.pipe(
			map(config => config.login),
			map(loginData => loginData.url + loginData.params),
			combineLatestWith(this.returnUrl$),
			map(([loginUrl, returnUrl]) => loginUrl.replace('<yourReturnlURL>', returnUrl)),
			this.combineWithLanguage<string>(),
			map(([url, lang]) => url.replace('<yourLanguageID>', lang))
		);
	}

	getLogoutUrl$(): Observable<string> {
		return this.config$.pipe(map(config => config.logout.url));
	}

	getSettingsUrl$(): Observable<string> {
		return this.config$.pipe(map(config => config.settings.url));
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
			startWith('SA' as ObLoginState),
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
		return this.rootUrl$.pipe(
			switchMap(rootUrl =>
				this.getState$().pipe(
					map(state => state.lastUsedApps),
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
			map(values => values[1])
		);
	}
}
