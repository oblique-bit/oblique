import {Component, ViewEncapsulation, input, model, signal} from '@angular/core';
import {ObILanguage} from '../service-navigation.model';

@Component({
	selector: 'ob-service-navigation-languages',
	standalone: false,
	templateUrl: './service-navigation-languages.component.html',
	styleUrls: ['./service-navigation-languages.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation-languages'},
})
export class ObServiceNavigationLanguagesComponent {
	readonly language = model<string>();
	readonly languages = input<ObILanguage[]>([]);

	readonly chevron = signal<'chevron_down' | 'chevron_up'>('chevron_down');

	changeChevron(): void {
		this.chevron.update(chevron => (chevron === 'chevron_down' ? 'chevron_up' : 'chevron_down'));
	}

	changeLanguage(language: string): void {
		this.language.set(language);
	}
}
