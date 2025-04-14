import {Component, computed, inject, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {toSignal} from '@angular/core/rxjs-interop';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {map} from 'rxjs/operators';

@Component({
	selector: 'ob-available-in',
	imports: [TranslatePipe, CommonModule],
	templateUrl: './available-in.component.html'
})
export class ObAvailableInComponent {
	languages = input<string[]>([], {transform: this.nonNullArray.bind(this)});
	parsedLanguages = computed(() => this.languages().map(language => this.mapLangCodeToTranslationKey(language)));
	lang = toSignal(inject(TranslateService).onLangChange.pipe(map(event => event.lang)));
	show = computed(() => !this.languages().includes(this.lang()) && this.languages().length);

	private nonNullArray(array: string[]): string[] {
		return array ?? [];
	}

	private mapLangCodeToTranslationKey(language: string): string {
		switch (language) {
			case 'en':
				return 'i18n.common.english';
			case 'de':
				return 'i18n.common.german';
			case 'fr':
				return 'i18n.common.french';
			case 'it':
				return 'i18n.common.italian';
			default:
				return `i18n.common.${language}`;
		}
	}
}
