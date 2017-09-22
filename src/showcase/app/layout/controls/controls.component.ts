import {Component, Inject} from '@angular/core';
import {MasterLayoutApplicationService} from '../../../../lib';

@Component({
	selector: 'layout-controls',
	templateUrl: './controls.component.html',
	styleUrls: ['./controls.component.css']
})
export class LayoutControlsComponent {

	public locales = ['en'];

	constructor(private layoutApplicationService: MasterLayoutApplicationService,
				@Inject('ObliqueReactive.CONFIG') private config: any) {
		this.locales = config.locales || this.locales;
	}

	public isLangActive(lang: string): boolean {
		return this.layoutApplicationService.userLang === lang;
	}

	public changeLang(lang: string) {
		this.layoutApplicationService.useLang(lang);
	}
}
