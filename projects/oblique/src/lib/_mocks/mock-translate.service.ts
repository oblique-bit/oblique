import {EventEmitter, Injectable} from '@angular/core';
import {DefaultLangChangeEvent, LangChangeEvent, TranslationChangeEvent} from '@ngx-translate/core';
import {Observable, of} from 'rxjs';

@Injectable()
export class ObMockTranslateService {
	onLangChange = new EventEmitter<LangChangeEvent>();
	onTranslationChange = new EventEmitter<TranslationChangeEvent>();
	onDefaultLangChange = new EventEmitter<DefaultLangChangeEvent>();
	defaultLang = 'en';
	langs = ['en'];

	currentLang(): string {
		return 'en';
	}

	getBrowserLang(): string {
		return 'en';
	}

	getDefaultLang(): string {
		return 'en';
	}

	setDefaultLang(lang: string): void {
	}

	get(): Observable<string> {
		return of('');
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

	getLangs(): Array<string> {
		return this.langs;
	}

	addLangs(langs: Array<string>): void {
		this.langs = langs;
	}

	getParsedResult(translations: any, key: any, interpolateParams?: Object): any {
		return '';
	}

	set(key: string, value: string, lang?: string): void {
	}

	reloadLang(lang: string): Observable<any> {
		return of('');
	}

	resetLang(lang: string): void {

	}

	getBrowserCultureLang(): string {
		return 'en';
	}
}
