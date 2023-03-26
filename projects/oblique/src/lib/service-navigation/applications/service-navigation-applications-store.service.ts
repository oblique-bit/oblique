import {Inject, Injectable, Optional} from '@angular/core';
import {Observable, of} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {WINDOW} from '../../utilities';
import {ObServiceNavigationApplicationsApiService} from '../api/service-navigation-applications-api.service';
import {ObIServiceNavigationApplicationIdentifier, ObIServiceNavigationApplicationInfo} from '../api/service-navigation.api.model';

@Injectable({
	providedIn: 'root'
})
export class ObServiceNavigationApplicationsStoreService {
	private readonly localStorageKey = 'ObliqueHeaderWidgetApplications';
	private cachedApplications = this.loadApplications();

	constructor(
		private readonly applicationInfoService: ObServiceNavigationApplicationsApiService,
		@Inject(WINDOW) @Optional() private readonly window: Window
	) {}

	fetchApplicationsInfo(
		rootUrl: string,
		applications: ObIServiceNavigationApplicationIdentifier[]
	): Observable<ObIServiceNavigationApplicationInfo[]> {
		const cachedApplicationIds = Object.keys(this.cachedApplications);
		const applicationsToFetch = applications.filter(application => !cachedApplicationIds.includes(application.applicationID.toString()));

		return applicationsToFetch.length
			? this.applicationInfoService.fetchApplicationsInfo(rootUrl, applicationsToFetch).pipe(
					tap(receivedApplications => this.storeApplications(receivedApplications, cachedApplicationIds)),
					map(() => applications.map(application => this.cachedApplications[application.applicationID]))
			  )
			: of(applications.map(application => application.applicationID).map(applicationId => this.cachedApplications[applicationId]));
	}

	private loadApplications(): {number: ObIServiceNavigationApplicationInfo} {
		if (this.window?.localStorage) {
			return JSON.parse(this.window.localStorage.getItem(this.localStorageKey) ?? '{}');
		}
		return {} as {number: ObIServiceNavigationApplicationInfo};
	}

	private storeApplications(applications: ObIServiceNavigationApplicationInfo[], applicationIds: string[]): void {
		this.cachedApplications = applications
			.filter(application => !applicationIds.includes(application.applicationID.toString()))
			.reduce(
				(cachedApplications, application) => ({...cachedApplications, [application.applicationID]: application}),
				this.cachedApplications
			);
		if (this.window?.localStorage) {
			this.window.localStorage.setItem(this.localStorageKey, JSON.stringify(this.cachedApplications));
		}
	}
}
