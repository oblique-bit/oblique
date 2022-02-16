import {HttpClient} from '@angular/common/http';
import {TranslateLoader} from '@ngx-translate/core';
import {InjectionToken} from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {Observable, forkJoin, of} from 'rxjs';
import {DeepString, ObITranslationFile} from './multi-translate-loader.model';

export const TRANSLATION_FILES = new InjectionToken('TRANSLATION_FILES');

export class ObMultiTranslateLoader implements TranslateLoader {
	constructor(private readonly http: HttpClient, private readonly resources: ObITranslationFile[]) {}

	public getTranslation(language: string): Observable<Record<string, string>> {
		const requests = this.resources
			.map(resource => `${resource.prefix}${language}${resource.suffix}`)
			.map(url =>
				this.http.get<DeepString>(url).pipe(
					map(translations => this.flatten(translations)),
					catchError(() => ObMultiTranslateLoader.handleError(url))
				)
			);
		return forkJoin(requests).pipe(map(response => response.reduce<Record<string, string>>((total, current) => ({...total, ...current}), {})));
	}

	// if some files are flat while others are expanded, the flatten properties will be ignored. Therefore, all files are flatten to avoid conflicts
	private flatten(object: DeepString, parent?: string, flatObject: Record<string, string> = {}): Record<string, string> {
		return Object.keys(object)
			.map(key => ({current: key, full: parent ? `${parent}.${key}` : key}))
			.reduce(
				(result, key) =>
					typeof object[key.current] === 'object'
						? this.flatten(object[key.current] as DeepString, key.full, result)
						: {...result, [key.full]: object[key.current] as string},
				flatObject
			);
	}

	private static handleError(url: string): Observable<Record<string, string>> {
		console.error('Could not find translation file:', url);
		return of({});
	}
}
