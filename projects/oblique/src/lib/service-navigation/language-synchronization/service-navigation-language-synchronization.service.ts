import {Injectable, inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ObServiceNavigationLanguageSynchronizationApiService} from '../api/service-navigation-language-synchronization-api.service';
import {filter, switchMap} from 'rxjs';

@Injectable()
export class ObServiceNavigationLanguageSynchronizationService {
	public shouldSynchronize = false;

	private readonly translateService = inject(TranslateService);
	private readonly languageSynchronizationApiService = inject(ObServiceNavigationLanguageSynchronizationApiService);

	public initialize(rootUrl: string): void {
		this.translateService.onLangChange
			.pipe(
				filter(() => this.shouldSynchronize),
				switchMap(() => this.languageSynchronizationApiService.synchronizeLanguage(rootUrl))
			)
			.subscribe();
	}
}
