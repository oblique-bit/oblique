import {ChangeDetectionStrategy, Component, EventEmitter, Output, ViewEncapsulation, input} from '@angular/core';
import {ObILanguage} from '../service-navigation.model';

@Component({
	selector: 'ob-service-navigation-languages',
	standalone: false,
	templateUrl: './service-navigation-languages.component.html',
	styleUrls: ['./service-navigation-languages.component.scss'],
	changeDetection: ChangeDetectionStrategy.Eager,
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation-languages'},
})
export class ObServiceNavigationLanguagesComponent {
	readonly language = input<string>(undefined);
	readonly languages = input<ObILanguage[]>([]);
	@Output() readonly languageChange = new EventEmitter<string>();

	chevron: 'chevron_down' | 'chevron_up' = 'chevron_down';

	changeChevron(): void {
		this.chevron = this.chevron === 'chevron_down' ? 'chevron_up' : 'chevron_down';
	}

	changeLanguage(language: string): void {
		this.languageChange.emit(language);
	}
}
