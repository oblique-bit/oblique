import {Injectable} from '@angular/core';
import {Observable, filter, switchMap} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {ObServiceNavigationApplicationsApiService} from '../api/service-navigation-applications-api.service';
import {
	ObIServiceNavigationApplicationIdentifier,
	ObIServiceNavigationApplicationInfo,
	ObIServiceNavigationApplicationParsedInfo,
	ObIServiceNavigationRawApplication
} from '../api/service-navigation.api.model';
import {ObServiceNavigationApplicationStatus} from '../service-navigation.model';

@Injectable()
export class ObServiceNavigationApplicationsService {
	constructor(private readonly applicationsService: ObServiceNavigationApplicationsApiService) {}

	getApplications(
		rootUrl: string
	): (source$: Observable<ObIServiceNavigationRawApplication[]>) => Observable<ObIServiceNavigationApplicationParsedInfo[]> {
		return source$ =>
			source$.pipe(
				filter(applications => applications?.length > 0),
				this.distinctUntilAppIDChange(),
				switchMap(rawApplications =>
					this.applicationsService
						.fetchApplicationsInfo(rootUrl, this.getApplicationsIdentifiers(rawApplications))
						.pipe(map(applications => this.mergeApplicationInfo(applications, rawApplications)))
				),
				map(applications =>
					applications.map(application => ({
						name: application.name,
						url: application.url,
						image: application.image,
						status: this.getApplicationStatus(application)
					}))
				)
			);
	}

	private getApplicationStatus(
		application: ObIServiceNavigationApplicationInfo & ObIServiceNavigationRawApplication
	): ObServiceNavigationApplicationStatus {
		if (application.online && application.accessOK) {
			return 'online';
		}
		return application.online ? 'inaccessible' : 'offline';
	}

	private mergeApplicationInfo(
		applications: ObIServiceNavigationApplicationInfo[],
		rawApplications: ObIServiceNavigationRawApplication[]
	): (ObIServiceNavigationApplicationInfo & ObIServiceNavigationRawApplication)[] {
		return applications.map(application => ({
			...application,
			...rawApplications.find(rawApp => rawApp.appID === application.applicationID)
		}));
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
