import {Injectable, inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ObServiceNavigationLanguageSynchronizationApiService} from '../api/service-navigation-language-synchronization-api.service';
import {filter, switchMap} from 'rxjs';
import {ObLoginState} from '../service-navigation.model';

@Injectable()
export class ObServiceNavigationLanguageSynchronizationService {
	public shouldSynchronize = false;
	public loginLevel: ObLoginState = 'SA';
	private enableOnLangChange = true;

	private readonly translateService = inject(TranslateService);
	private readonly languageSynchronizationApiService = inject(ObServiceNavigationLanguageSynchronizationApiService);

	public initialize(rootUrl: string): void {
		this.translateService.onLangChange
			.pipe(
				filter(() => this.shouldSynchronize),
				filter(() => this.loginLevel !== 'SA' && this.loginLevel !== 'S1'),
				filter(() => this.enableOnLangChange),
				switchMap(() => this.languageSynchronizationApiService.synchronizeLanguage(rootUrl))
			)
			.subscribe();
	}

	public setLanguage(language: string | undefined): void {
		const currentLanguageIsDifferent = this.translateService.currentLang !== language;
		const isLanguageSupported = this.translateService.langs.includes(language);
		if (this.shouldSynchronize && currentLanguageIsDifferent && isLanguageSupported) {
			// as language is provided by the backend, there is no need to send it back
			this.enableOnLangChange = false;
			this.translateService.use(language);
			this.enableOnLangChange = true;
		}
	}
}
