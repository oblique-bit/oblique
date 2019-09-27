import {Observable, of} from 'rxjs';
import {DefaultLangChangeEvent, LangChangeEvent, TranslationChangeEvent} from '@ngx-translate/core';
import {EventEmitter} from '@angular/core';

export class MockTranslateService {
	public onLangChange = new EventEmitter<LangChangeEvent>();
	public onTranslationChange = new EventEmitter<TranslationChangeEvent>();
	public onDefaultLangChange = new EventEmitter<DefaultLangChangeEvent>();

	public get(): Observable<string> {
		return of('');
	}

	public instant(): string {
		return '';
	}

	public get currentLang(): string {
		return 'en';
	}

	public get getBrowserLang(): string {
		return 'en';
	}
}
