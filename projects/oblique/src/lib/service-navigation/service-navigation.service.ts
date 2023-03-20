import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Observable, ReplaySubject, switchMap} from 'rxjs';
import {combineLatestWith, map, startWith} from 'rxjs/operators';
import {ObEPamsEnvironment} from './service-navigation.model';
import {ObServiceNavigationConfigApiService} from './api/service-navigation-config-api.service';

@Injectable()
export class ObServiceNavigationService {
	private readonly rootUrl$ = new ReplaySubject<string>(1);
	private readonly returnUrl$ = new ReplaySubject<string>(1);
	private readonly config$ = this.rootUrl$.pipe(switchMap(rootUrl => this.configService.fetchUrls(rootUrl)));

	constructor(private readonly configService: ObServiceNavigationConfigApiService, private readonly translateService: TranslateService) {}

	setUpRootUrls(environment: ObEPamsEnvironment, rootUrl?: string): void {
		// can't use !environment as ObEPamsEnvironment.PROD is an empty string
		if (environment !== null && environment !== undefined) {
			this.rootUrl$.next(rootUrl ?? `https://pams-api.eportal${environment}.admin.ch/`);
			this.rootUrl$.complete();
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
}
