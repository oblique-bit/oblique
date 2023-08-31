import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
	ObIServiceNavigationApplicationIdentifier,
	ObIServiceNavigationApplicationInfo,
	ObIServiceNavigationResponse
} from './service-navigation.api.model';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class ObServiceNavigationApplicationsApiService {
	private readonly resourceUrl = 'api/widget/applications';

	constructor(private readonly httpClient: HttpClient) {}

	fetchApplicationsInfo(
		rootUrl: string,
		applications: ObIServiceNavigationApplicationIdentifier[]
	): Observable<ObIServiceNavigationApplicationInfo[]> {
		return this.httpClient
			.post<ObIServiceNavigationResponse<{applications: ObIServiceNavigationApplicationInfo[]}>>(
				rootUrl + this.resourceUrl,
				{applications},
				{withCredentials: true}
			)
			.pipe(map(response => response.data.applications));
	}
}
