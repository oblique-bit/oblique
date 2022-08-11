import {Injectable} from '@angular/core';
import {Observable, ReplaySubject, switchMap} from 'rxjs';
import {map} from 'rxjs/operators';
import {ObEPamsEnvironment} from './service-navigation.model';
import {ObServiceNavigationConfigApiService} from './api/service-navigation-config-api.service';

@Injectable()
export class ObServiceNavigationService {
	private readonly rootUrl$ = new ReplaySubject<string>(1);
	private readonly config$ = this.rootUrl$.pipe(switchMap(rootUrl => this.configService.fetchUrls(rootUrl)));

	constructor(private readonly configService: ObServiceNavigationConfigApiService) {}

	setUpRootUrls(environment: ObEPamsEnvironment, rootUrl?: string): void {
		// can't use !environment as ObEPamsEnvironment.PROD is an empty string
		if (environment !== null && environment !== undefined) {
			this.rootUrl$.next(rootUrl ?? `https://pams-api.eportal${environment}.admin.ch/`);
			this.rootUrl$.complete();
		}
	}

	getLoginUrl$(): Observable<string> {
		return this.config$.pipe(
			map(config => config.login),
			map(loginData => loginData.url + loginData.params)
		);
	}
}
