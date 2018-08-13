import {Injectable, Inject} from '@angular/core';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';
import {Unsubscribable} from '../unsubscribe';
import {MasterLayoutApplicationDirective} from './master-layout-application.directive';

/**
 * Service for controlling ObliqueUI application composite features.
 * @deprecated since version 2.1.0. Will be deleted in version 3.0.0. Use MasterLayoutComponent & MasterLayoutService instead
 */
@Injectable()
export class MasterLayoutApplicationService extends Unsubscribable {

	public userLang: string = localStorage.getItem('oblique:lang');

	public applicationDirective: MasterLayoutApplicationDirective;

	constructor(private readonly translate: TranslateService,
				@Inject('ObliqueReactive.CONFIG') private readonly config: any) {
		super();
		console.warn('@deprecated since version 2.1.0. Will be deleted in version 3.0.0. Use MasterLayoutComponent & MasterLayoutService instead');

		// User lang handling:
		// --------------------
		this.translate.onLangChange
			.pipe(takeUntil(this.unsubscribe))
			.subscribe((event: LangChangeEvent) => {
				// Ensure local value remains in sync:
				this.userLang = event.lang;
				localStorage.setItem('oblique:lang', this.userLang);
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
