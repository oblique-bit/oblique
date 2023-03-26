import {Injectable} from '@angular/core';
import {Observable, filter, switchMap} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {ObServiceNavigationApplicationsApiService} from '../api/service-navigation-applications-api.service';
import {ObIServiceNavigationApplicationIdentifier, ObIServiceNavigationRawApplication} from '../api/service-navigation.api.model';
import {ObIServiceNavigationApplication} from '../service-navigation.model';

@Injectable()
export class ObServiceNavigationApplicationsService {
	constructor(private readonly applicationsService: ObServiceNavigationApplicationsApiService) {}

	getApplications(
		rootUrl: string
	): (source$: Observable<ObIServiceNavigationRawApplication[]>) => Observable<ObIServiceNavigationApplication[]> {
		return source$ =>
			source$.pipe(
				filter(applications => applications?.length > 0),
				this.distinctUntilAppIDChange(),
				switchMap(rawApplications =>
					this.applicationsService.fetchApplicationsInfo(rootUrl, this.getApplicationsIdentifiers(rawApplications))
				),
				map(applications =>
					applications.map(application => ({
						name: application.name.en
					}))
				)
			);
	}

	private distinctUntilAppIDChange(): (
		source$: Observable<ObIServiceNavigationRawApplication[]>
	) => Observable<ObIServiceNavigationRawApplication[]> {
		return source$ =>
			source$.pipe(
				distinctUntilChanged((previousState: ObIServiceNavigationRawApplication[], newState: ObIServiceNavigationRawApplication[]) => {
					const newStateIds = newState.map(application => application.appID);
					return !(previousState.length !== newState.length || previousState.map(app => app.appID).some(id => !newStateIds.includes(id)));
				})
			);
	}

	private getApplicationsIdentifiers(applications: ObIServiceNavigationRawApplication[]): ObIServiceNavigationApplicationIdentifier[] {
		return applications.map(application => ({
			applicationID: application.appID,
			childApplicationID: application.childAppID
		}));
	}
}
