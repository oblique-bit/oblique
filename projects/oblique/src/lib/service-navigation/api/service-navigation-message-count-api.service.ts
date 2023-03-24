import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, map} from 'rxjs';
import {ObIServiceNavigationResponse} from './service-navigation.api.model';

@Injectable({providedIn: 'root'})
export class ObServiceNavigationCountApiService {
	private readonly resourceUrl = 'api/widget/notifications/count';

	constructor(private readonly httpClient: HttpClient) {}

	get(environmentUrl: string): Observable<number> {
		return this.httpClient
			.get<ObIServiceNavigationResponse & {data: number}>(environmentUrl + this.resourceUrl, {withCredentials: true})
			.pipe(map(res => res.data));
	}
}
