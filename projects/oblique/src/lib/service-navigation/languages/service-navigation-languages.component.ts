import {ObLanguageSelectorType} from '../../master-layout/master-layout.model';
import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {ObILanguage} from '../service-navigation.model';

@Component({
	selector: 'ob-service-navigation-languages',
	templateUrl: './service-navigation-languages.component.html',
	styleUrls: ['./service-navigation-languages.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation-languages'}
})
export class ObServiceNavigationLanguagesComponent {
	@Input() language: string;
	@Input() languages: ObILanguage[] = [];
	@Input() languageSelectorStyle: ObLanguageSelectorType = 'dropdown';
	@Output() readonly languageChange = new EventEmitter<string>();

	chevron: 'chevron-down' | 'chevron-up' = 'chevron-down';

	changeChevron(): void {
		this.chevron = this.chevron === 'chevron-down' ? 'chevron-up' : 'chevron-down';
	}

	changeLanguage(language: string): void {
		this.languageChange.emit(language);
	}
}
