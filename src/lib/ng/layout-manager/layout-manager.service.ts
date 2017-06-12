import {Injectable, Inject} from '@angular/core';
import {LocalStorage} from 'ngx-webstorage';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';

import {LayoutManagerDirective} from './layout-manager.directive';

/**
 * LayoutManagerService - Service for controlling ObliqueUI master layout features.
 */
@Injectable()
export class LayoutManagerService {

	@LocalStorage()
	public userLang: string;

	public layoutManagerDirective: LayoutManagerDirective;

	constructor(private translate: TranslateService,
				@Inject('ObliqueReactive.CONFIG') private config: any) {

		// User lang handling:
		// --------------------
		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
			// Ensure local value remains in sync:
			this.userLang = event.lang;
		});

		// Define default/fallback lang:
		translate.setDefaultLang((this.config.defaults && this.config.defaults.locale) || 'en');

		// Apply user or default lang:
		this.translate.use(this.userLang || translate.getDefaultLang());
	}

	useLang(locale: string) {
		this.translate.use(locale);
	}

	set cover(value) {
		this.layoutManagerDirective.hasCover = value;
	}

	get cover() {
		return this.layoutManagerDirective.hasCover;
	}

	set navigation(value) {
		this.layoutManagerDirective.noNavigation = !value;
	}

	get navigation() {
		return !this.layoutManagerDirective.noNavigation;
	}

	set applicationFixed(value) {
		this.layoutManagerDirective.applicationFixed = value;
	}

	get applicationFixed() {
		return this.layoutManagerDirective.applicationFixed;
	}
}
