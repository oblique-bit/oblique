import {EventEmitter, Injectable} from '@angular/core';
import {DefaultLangChangeEvent, LangChangeEvent, TranslationChangeEvent} from '@ngx-translate/core';
import {Observable, of} from 'rxjs';

@Injectable()
export class MockTranslateService {
	onLangChange = new EventEmitter<LangChangeEvent>();
	onTranslationChange = new EventEmitter<TranslationChangeEvent>();
	onDefaultLangChange = new EventEmitter<DefaultLangChangeEvent>();

	currentLang(): string {
		return 'en';
	}

	getBrowserLang(): string {
		return 'en';
	}

	getDefaultLang(): string {
		return 'en';
	}

	get(): Observable<string> {
		return of('');
	}

	use(lang: string): void {
	}

	instant(string: string): string {
		return string;
	}
}
