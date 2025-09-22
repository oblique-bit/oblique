import type {HttpClient} from '@angular/common/http';
import type {TranslateLoader} from '@ngx-translate/core';
import {catchError, map} from 'rxjs/operators';
import {type Observable, forkJoin, of} from 'rxjs';
import type {DeepString, ObITranslationFile} from './multi-translate-loader.model';

/**
 * Since Sandbox-SSR enforces stricter TypeScript rules than the Oblique library, it cannot import anything directly
 * from Oblique without causing numerous transpilation errors. Sandbox-SSR would apply its strict type checking to
 * Oblique’s code, which leads to these transpilation errors.
 * Therefore, the translation handling code must be duplicated within Sandbox-SSR to avoid these issues.
 */

export class ObMultiTranslateLoader implements TranslateLoader {
	constructor(
		private readonly http: HttpClient,
		private readonly resources: ObITranslationFile[]
	) {}

	public getTranslation(language: string): Observable<Record<string, string>> {
		const requests = this.resources
			.map(resource => `${resource.prefix}${language}${resource.suffix}`)
			.map(url =>
				this.http.get<DeepString>(url).pipe(
					map(translations => this.flatten(translations)),
					catchError(() => ObMultiTranslateLoader.handleError(url))
				)
			);
		return forkJoin(requests).pipe(
			map(response => response.reduce<Record<string, string>>((total, current) => ({...total, ...current}), {}))
		);
	}

	// if some files are flat while others are expanded, the flatten properties will be ignored. Therefore, all files are flatten to avoid conflicts
	private flatten(object: DeepString, parent = '', flatObject: Record<string, string> = {}): Record<string, string> {
		return Object.keys(object)
			.map(key => ({current: key, full: parent.length ? `${parent}.${key}` : key}))
			.reduce(
				(result, key) =>
					typeof object[key.current] === 'object'
						? this.flatten(object[key.current] as DeepString, key.full, result)
						: {...result, [key.full]: object[key.current] as string},
				flatObject
			);
	}

	private static handleError(url: string): Observable<Record<string, string>> {
		const language = this.getLanguage(url);
		const text = `The "${language.toUpperCase()}" language has been selected but ${
			/oblique-\w\w\.json$/.test(url)
				? `Oblique doesn't provide a translation file for that language. The file "oblique-${language}.json" needs to be created in the project's "assets/i18n" directory. Each project is responsible for providing the files to enable Oblique's translation of additional languages.`
				: `the project does not provide a translation file for that language. Please make sure that the "${language}.json" file exists in the project's "assets/i18n" directory. Each project is responsible for its own translations`
		}`;
		console.warn(text);
		return of({});
	}

	private static getLanguage(url: string): string {
		const groups = /(?<language>\w\w)\.json$/.exec(url)?.groups;
		return Array.isArray(groups) ? groups['language'] : '';
	}
}
