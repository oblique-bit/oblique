import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {ObILanguage} from '../service-navigation.model';

@Component({
	selector: 'ob-service-navigation-languages',
	templateUrl: './service-navigation-languages.component.html',
	styleUrls: ['./service-navigation-languages.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation-languages'},
	standalone: false
})
export class ObServiceNavigationLanguagesComponent {
	@Input() language: string;
	@Input() languages: ObILanguage[] = [];
	@Output() readonly languageChange = new EventEmitter<string>();

	chevron: 'chevron_down' | 'chevron_up' = 'chevron_down';

	changeChevron(): void {
		this.chevron = this.chevron === 'chevron_down' ? 'chevron_up' : 'chevron_down';
	}

	changeLanguage(language: string): void {
		this.languageChange.emit(language);
	}
}
