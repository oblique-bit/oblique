import {Component, Inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
	selector: 'layout-controls',
	templateUrl: './controls.component.html',
	styleUrls: ['./controls.component.css']
})
export class LayoutControlsComponent {

	public locales = ['en'];
	public context = { // TODO: mock only, remove this
		user: {
			firstname: 'Oblique',
			lastname: 'Reactive'
		},
		isAuthenticated: false
	};

	constructor(private translate: TranslateService,
	            @Inject('ObliqueReactive.CONFIG') private config: any) {
		this.locales = config.locales || this.locales;
	}

	public isLangActive(lang: string): boolean {
		return this.translate.currentLang === lang;
	}

	public changeLang($event: Event, lang: string) {
		event.preventDefault();
		this.translate.use(lang);
	}

	public logout() {
	}
}
