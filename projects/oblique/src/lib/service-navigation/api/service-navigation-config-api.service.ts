import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ObIServiceNavigationConfig, ObIServiceNavigationResponse} from './service-navigation.api.model';

@Injectable({providedIn: 'root'})
export class ObServiceNavigationConfigApiService {
	private readonly resourceUrl = 'api/v2/widget/config';

	constructor(private readonly httpClient: HttpClient) {}

	fetchUrls(rootUrl: string): Observable<ObIServiceNavigationConfig> {
		return this.httpClient
			.get<ObIServiceNavigationResponse<ObIServiceNavigationConfig>>(rootUrl + this.resourceUrl, {withCredentials: true})
			.pipe(map(response => response.data));
	}
}
