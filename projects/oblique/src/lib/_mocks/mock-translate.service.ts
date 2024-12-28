import {EventEmitter, Injectable} from '@angular/core';
import {DefaultLangChangeEvent, LangChangeEvent, TranslationChangeEvent} from '@ngx-translate/core';
import {EMPTY, Observable, of} from 'rxjs';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Injectable()
export class ObMockTranslateService {
	translations: any;
	onLangChange = new EventEmitter<LangChangeEvent>();
	onTranslationChange = new EventEmitter<TranslationChangeEvent>();
	onDefaultLangChange = new EventEmitter<DefaultLangChangeEvent>();
	defaultLang = 'en';
	langs = ['en'];
	currentLang = 'en';

	setTranslation(lang: string, translations: object, shouldMerge = false): void {}

	getStreamOnTranslationChange(key: string | string[], interpolateParams?: object): Observable<any> {
		return EMPTY;
	}

	stream(key: string | string[], interpolateParams?: object): Observable<any> {
		return EMPTY;
	}

	getBrowserLang(): string {
		return 'en';
	}

	getDefaultLang(): string {
		return 'en';
	}

	setDefaultLang(lang: string): void {}

	get(key: string | string[], interpolateParams?: object): Observable<string | any> {
		return of(typeof key === 'string' ? key : key.map(str => ({[str]: str})));
	}

	use(lang: string): Observable<any> {
		return of('');
	}

	instant(string: string): string {
		return string;
	}

	getTranslation(lang: string): Observable<any> {
		return of('');
	}

	getLangs(): string[] {
		return this.langs;
	}

	addLangs(langs: string[]): void {
		this.langs = langs;
	}

	getParsedResult(translations: any, key: any, interpolateParams?: object): any {
		return '';
	}

	set(key: string, value: string, lang?: string): void {}

	reloadLang(lang: string): Observable<any> {
		return of('');
	}

	resetLang(lang: string): void {}

	getBrowserCultureLang(): string {
		return 'en';
	}
}
