import {Component, Inject} from '@angular/core';
import {LayoutManagerService} from '../../../../lib';

@Component({
	selector: 'layout-controls',
	templateUrl: './controls.component.html',
	styleUrls: ['./controls.component.css']
})
export class LayoutControlsComponent {

	public locales = ['en'];

	constructor(private layoutManager: LayoutManagerService,
				@Inject('ObliqueReactive.CONFIG') private config: any) {
		this.locales = config.locales || this.locales;
	}

	public isLangActive(lang: string): boolean {
		return this.layoutManager.userLang === lang;
	}

	public changeLang($event: Event, lang: string) {
		$event.preventDefault();
		this.layoutManager.useLang(lang);
	}
}
