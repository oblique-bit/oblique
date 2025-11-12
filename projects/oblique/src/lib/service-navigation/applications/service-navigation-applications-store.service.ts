import {Inject, Injectable, Optional} from '@angular/core';
import {Observable, of} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {ObGlobalEventsService} from '../../global-events/global-events.service';
import {WINDOW} from '../../utilities';
import {ObServiceNavigationApplicationsApiService} from '../api/service-navigation-applications-api.service';
import {
	ObIServiceNavigationApplicationIdentifier,
	ObIServiceNavigationApplicationInfo,
} from '../api/service-navigation.api.model';

@Injectable({
	providedIn: 'root',
})
export class ObServiceNavigationApplicationsStoreService {
	private readonly localStorageKey = 'ObliqueHeaderWidgetApplications';
	private cachedApplications = this.loadApplications();

	constructor(
		private readonly applicationInfoService: ObServiceNavigationApplicationsApiService,
		globalEvents: ObGlobalEventsService,
		@Inject(WINDOW) @Optional() private readonly window: Window
	) {
		globalEvents.beforeUnload$.subscribe(() => {
			if (this.window?.localStorage) {
				this.window.localStorage.removeItem(this.localStorageKey);
			}
		});
	}

	fetchApplicationsInfo(
		rootUrl: string,
		applications: ObIServiceNavigationApplicationIdentifier[]
	): Observable<ObIServiceNavigationApplicationInfo[]> {
		const cachedApplicationIds = Object.keys(this.cachedApplications);
		const applicationsToFetch = applications.filter(
			application => !cachedApplicationIds.includes(this.buildApplicationId(application))
		);

		return applicationsToFetch.length
			? this.applicationInfoService.fetchApplicationsInfo(rootUrl, applicationsToFetch).pipe(
					tap(receivedApplications => this.storeApplications(receivedApplications, cachedApplicationIds)),
					map(() => applications.map(application => this.cachedApplications[this.buildApplicationId(application)]))
				)
			: of(
					applications
						.map(application => this.buildApplicationId(application))
						.map(applicationId => this.cachedApplications[applicationId])
				);
	}

	private loadApplications(): {string: ObIServiceNavigationApplicationInfo} {
		if (this.window?.localStorage) {
			return JSON.parse(this.window.localStorage.getItem(this.localStorageKey) ?? '{}');
		}
		return {} as {string: ObIServiceNavigationApplicationInfo};
	}

	private storeApplications(applications: ObIServiceNavigationApplicationInfo[], applicationIds: string[]): void {
		this.cachedApplications = applications
			.filter(application => !applicationIds.includes(this.buildApplicationId(application)))
			.reduce(
				(cachedApplications, application) => ({
					...cachedApplications,
					[this.buildApplicationId(application)]: application,
				}),
				this.cachedApplications
			);
		if (this.window?.localStorage) {
			this.window.localStorage.setItem(this.localStorageKey, JSON.stringify(this.cachedApplications));
		}
	}

	private buildApplicationId(
		application: ObIServiceNavigationApplicationInfo | ObIServiceNavigationApplicationIdentifier
	): string {
		return `${application.applicationID}_${application.childApplicationID || 0}`;
	}
}
