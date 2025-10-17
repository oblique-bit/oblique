import {EnvironmentProviders, Injectable, importProvidersFrom} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {Observable, forkJoin, map} from 'rxjs';

export interface ObITranslationFile {
	prefix: string;
	suffix?: string;
}

@Injectable({
	providedIn: 'root'
})
export class ObtTourTranslationFactoryService implements TranslateLoader {
	private sources: ObITranslationFile[];

	constructor(private readonly http: HttpClient) {
		this.sources = [
			{prefix: './assets/i18n/oblique-', suffix: '.json'},
			{prefix: './assets/i18n/ob-tour-', suffix: '.json'}
		];
	}

	setSources(sources: ObITranslationFile[]): void {
		if (sources?.length) {
			this.sources = sources;
		}
	}

	getTranslation(lang: string): Observable<Record<string, unknown>> {
		const requests = this.sources.map(src => this.http.get<Record<string, unknown>>(`${src.prefix}${lang}${src.suffix ?? '.json'}`));

		return forkJoin(requests).pipe(map(parts => parts.reduce((merged, current) => ({...merged, ...current}), {})));
	}
}

/**
 * Provider with custom translation file support
 */
export function provideTourTranslations(defaultLanguage = 'en', customSources?: ObITranslationFile[]): EnvironmentProviders {
	return importProvidersFrom(
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: (http: HttpClient) => {
					const loader = new ObtTourTranslationFactoryService(http);
					if (customSources?.length) {
						loader.setSources(customSources);
					}
					return loader;
				},
				deps: [HttpClient]
			},
			defaultLanguage
		})
	);
}
