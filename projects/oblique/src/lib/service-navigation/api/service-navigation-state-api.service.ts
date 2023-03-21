import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, map} from 'rxjs';
import {ObIServiceNavigationState} from './service-navigation.api.model';
import {ObIServiceNavigationResponse} from './service-navigation.api.model';

@Injectable({providedIn: 'root'})
export class ObServiceNavigationStateApiService {
	private readonly resourceUrl = 'api/widget/state';

	constructor(private readonly httpClient: HttpClient) {}

	get(environmentUrl: string): Observable<ObIServiceNavigationState> {
		return this.httpClient
			.get<ObIServiceNavigationResponse & {data: ObIServiceNavigationState}>(environmentUrl + this.resourceUrl, {withCredentials: true})
			.pipe(map(res => res.data));
	}
}
