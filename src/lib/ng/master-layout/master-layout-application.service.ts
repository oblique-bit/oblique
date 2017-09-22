import {Injectable, Inject} from '@angular/core';
import {LocalStorage} from 'ngx-webstorage';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';

import {MasterLayoutApplicationDirective} from './master-layout-application.directive';

/**
 * Service for controlling ObliqueUI application composite features.
 */
@Injectable()
export class MasterLayoutApplicationService {

	@LocalStorage()
	public userLang: string;

	public applicationDirective: MasterLayoutApplicationDirective;

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
		this.applicationDirective.hasCover = value;
	}

	get cover() {
		return this.applicationDirective.hasCover;
	}

	set navigation(value) {
		this.applicationDirective.noNavigation = !value;
	}

	get navigation() {
		return !this.applicationDirective.noNavigation;
	}

	set applicationFixed(value) {
		this.applicationDirective.applicationFixed = value;
	}

	get applicationFixed() {
		return this.applicationDirective.applicationFixed;
	}
}
