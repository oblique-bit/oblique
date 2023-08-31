import {HttpClient} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Observable, map} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ObServiceNavigationTimeoutApiService {
	private readonly resourceUrl = 'api/authentication/refresh';
	private readonly httpClient = inject(HttpClient);

	refreshPamsToken(environmentUrl: string): Observable<void> {
		return this.httpClient
			.get(environmentUrl + this.resourceUrl, {
				withCredentials: true
			})
			.pipe(map(() => undefined));
	}
}
