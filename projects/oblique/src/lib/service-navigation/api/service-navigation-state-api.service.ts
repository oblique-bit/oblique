import {HttpClient} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Observable} from 'rxjs';
import {ObIServiceNavigationResponse, ObIServiceNavigationState} from './service-navigation.api.model';
import {obGetDataOrThrowStatus500} from './service-navigation.api.utils';

@Injectable({providedIn: 'root'})
export class ObServiceNavigationStateApiService {
	private readonly resourceUrl = 'api/widget/state';
	private readonly httpClient = inject(HttpClient);

	get(environmentUrl: string, favoriteLimit: number): Observable<ObIServiceNavigationState> {
		return this.httpClient
			.get<ObIServiceNavigationResponse<ObIServiceNavigationState>>(environmentUrl + this.resourceUrl, {
				withCredentials: true,
				params: {lastUsedLimit: 4, favoriteLimit},
			})
			.pipe(obGetDataOrThrowStatus500());
	}
}
