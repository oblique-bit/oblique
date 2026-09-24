import {HttpClient} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Observable} from 'rxjs';
import {ObIServiceNavigationResponse} from './service-navigation.api.model';
import {obGetDataOrThrowStatus500} from './service-navigation.api.utils';

@Injectable({providedIn: 'root'})
export class ObServiceNavigationCountApiService {
	private readonly resourceUrl = 'api/widget/notifications/count';
	private readonly httpClient = inject(HttpClient);

	get(environmentUrl: string): Observable<number> {
		return this.httpClient
			.get<ObIServiceNavigationResponse<number>>(environmentUrl + this.resourceUrl, {withCredentials: true})
			.pipe(obGetDataOrThrowStatus500());
	}
}
