import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, map} from 'rxjs';
import {ObIServiceNavigationResponse, ObIServiceNavigationState} from './service-navigation.api.model';

@Injectable({providedIn: 'root'})
export class ObServiceNavigationStateApiService {
	private readonly resourceUrl = 'api/widget/state';

	constructor(private readonly httpClient: HttpClient) {}

	get(environmentUrl: string): Observable<ObIServiceNavigationState> {
		return this.httpClient
			.get<
				ObIServiceNavigationResponse<ObIServiceNavigationState>
			>(environmentUrl + this.resourceUrl, {withCredentials: true, params: {lastUsedLimit: '4'}})
			.pipe(map(res => res.data));
	}
}
