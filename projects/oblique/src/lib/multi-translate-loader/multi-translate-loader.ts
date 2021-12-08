import {HttpClient} from '@angular/common/http';
import {TranslateLoader} from '@ngx-translate/core';
import {InjectionToken} from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {Observable, forkJoin, of} from 'rxjs';
import {ObITranslationFile} from './multi-translate-loader.model';

export const TRANSLATION_FILES = new InjectionToken('TRANSLATION_FILES');

export class ObMultiTranslateLoader implements TranslateLoader {
	constructor(private readonly http: HttpClient, private readonly resources: ObITranslationFile[]) {}

	public getTranslation(lang: string): Observable<any> {
		const requests = this.resources.map(resource => {
			const path = resource.prefix + lang + resource.suffix;
			return this.http.get(path).pipe(
				// if some files are flat while others are expanded, the flatten properties will be ignored. Therefore, all files are flatten to avoid conflicts
				map(data => this.flatten(data)),
				catchError(() => {
					console.error('Could not find translation file:', path);
					return of({});
				})
			);
		});
		return forkJoin(requests).pipe(map(response => response.reduce((total, current) => ({...total, ...current}), {})));
	}

	private flatten(obj: Object, parent?: string, res = {}): Object {
		return Object.keys(obj).reduce((result, key) => {
			const propName = parent ? `${parent}.${key}` : key;
			if (typeof obj[key] === 'object') {
				this.flatten(obj[key], propName, result);
			} else {
				result[propName] = obj[key];
			}
			return result;
		}, res);
	}
}
