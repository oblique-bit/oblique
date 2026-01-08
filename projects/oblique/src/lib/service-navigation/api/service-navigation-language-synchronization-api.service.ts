import {HttpClient} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Observable, map} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ObServiceNavigationLanguageSynchronizationApiService {
	private readonly resourceUrl = 'api/user/application';

	private readonly httpClient = inject(HttpClient);
	private readonly translate = inject(TranslateService);

	synchronizeLanguage(environmentUrl: string): Observable<void> {
		const eportalId = 48;
		return this.httpClient
			.put(
				environmentUrl + this.resourceUrl,
				{
					languageCode: this.translate.currentLang,
					applicationID: eportalId
				},
				{
					withCredentials: true
				}
			)
			.pipe(map(() => undefined));
	}
}
