import {
	Component,
	ContentChild,
	ContentChildren,
	ElementRef,
	HostBinding,
	Inject,
	Input,
	OnDestroy,
	Optional,
	QueryList,
	TemplateRef,
	ViewChildren,
	ViewEncapsulation
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';

import {ObMasterLayoutService} from '../master-layout.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {scrollEnabled} from '../master-layout.utility';
import {OB_BANNER, OB_PAMS_CONFIGURATION, WINDOW} from '../../utilities';
import {ObIBanner, ObIPamsConfiguration} from '../../utilities.model';
import {
	ObEEnvironment,
	ObEMasterLayoutEventValues,
	ObILanguage,
	ObILocaleObject,
	ObIMasterLayoutEvent,
	ObINavigationLink,
	ObIServiceNavigationConfig
} from '../master-layout.model';
import {ObScrollingEvents} from '../../scrolling/scrolling-events';
import {ObEColor} from '../../style/colors.model';
import {ObLoginState} from '../../service-navigation/service-navigation.model';

@Component({
	selector: 'ob-master-layout-header',
	templateUrl: './master-layout-header.component.html',
	styleUrls: ['./master-layout-header.component.scss', './master-layout-header.component-controls.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-master-layout-header'}
})
export class ObMasterLayoutHeaderComponent implements OnDestroy {
	home$: Observable<string>;
	languages: ObILanguage[];
	isCustom = this.masterLayout.header.isCustom;
	banner: ObIBanner;
	serviceNavigationConfig: ObIServiceNavigationConfig;
	@Input() navigation: ObINavigationLink[];
	@HostBinding('class.ob-master-layout-header-small') isSmall = this.masterLayout.header.isSmall;
	@ContentChild('obHeaderLogo') readonly obLogo: TemplateRef<any>;
	@ContentChildren('obHeaderControl') readonly templates: QueryList<TemplateRef<any>>;
	@ContentChildren('obHeaderMobileControl') readonly mobileTemplates: QueryList<TemplateRef<any>>;
	@ViewChildren('headerControl') readonly headerControl: QueryList<ElementRef>;
	@ViewChildren('headerMobileControl') readonly headerMobileControl: QueryList<ElementRef>;
	private readonly unsubscribe = new Subject<void>();

	constructor(
		private readonly masterLayout: ObMasterLayoutService,
		private readonly translate: TranslateService,
		private readonly config: ObMasterLayoutConfig,
		private readonly scrollEvents: ObScrollingEvents,
		private readonly el: ElementRef,
		@Inject(WINDOW) private readonly window: Window,
		@Inject(OB_BANNER) @Optional() bannerToken: ObIBanner,
		@Inject(OB_PAMS_CONFIGURATION) @Optional() public readonly pamsConfiguration: ObIPamsConfiguration
	) {
		this.languages = this.formatLanguages(this.config.locale.languages);
		this.customChange();
		this.smallChange();
		this.serviceNavigationConfiguration();
		this.reduceOnScroll();
		this.banner = this.initializeBanner(bannerToken);
		this.home$ = this.masterLayout.homePageRouteChange$;
		this.serviceNavigationConfig = this.config.header.serviceNavigation;
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	isLangActive(lang: string): boolean {
		return this.translate.currentLang === lang;
	}

	changeLang(lang: string): void {
		this.translate.use(lang);
	}

	emitLoginState(loginState: ObLoginState): void {
		this.masterLayout.header.emitLoginState(loginState);
	}

	emitLogoutUrl(logoutUrl: string): void {
		this.masterLayout.header.emitLogoutUrl(logoutUrl);
	}

	private reduceOnScroll(): void {
		this.scrollEvents.isScrolled.pipe(takeUntil(this.unsubscribe), scrollEnabled(this.masterLayout.header)).subscribe(isScrolling => {
			this.isSmall = isScrolling;
		});
	}

	private customChange(): void {
		this.masterLayout.header.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.HEADER_IS_CUSTOM),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => (this.isCustom = event.value));
	}

	private smallChange(): void {
		this.masterLayout.header.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.HEADER_IS_SMALL),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => (this.isSmall = event.value));
	}

	private serviceNavigationConfiguration(): void {
		this.masterLayout.header.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.SERVICE_NAVIGATION_CONFIGURATION),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => (this.serviceNavigationConfig = event.config));
	}

	private formatLanguages(languages: Record<string, string>): ObILanguage[] {
		return this.config.locale.disabled || !this.config.locale.display
			? []
			: this.config.locale.locales
					.map(locale => this.getLocaleObject(locale))
					.map(locale => ({
						code: locale.locale.split('-')[0],
						id: locale.id
					}))
					.map(locale => ({...locale, label: languages[locale.code]}));
	}

	private getLocaleObject(locale: string | ObILocaleObject): ObILocaleObject {
		return (locale as ObILocaleObject).locale ? (locale as ObILocaleObject) : {locale: locale as string};
	}

	private initializeBanner(bannerToken): ObIBanner {
		switch (bannerToken?.text) {
			case ObEEnvironment.LOCAL:
				return {color: '#fff', bgColor: ObEColor.SUCCESS, ...bannerToken};
			case ObEEnvironment.DEV:
				return {color: ObEColor.DEFAULT, bgColor: '#ffd700', ...bannerToken};
			case ObEEnvironment.REF:
				return {color: ObEColor.DEFAULT, bgColor: ObEColor.WARNING, ...bannerToken};
			case ObEEnvironment.TEST:
				return {color: '#fff', bgColor: ObEColor.PRIMARY, ...bannerToken};
			case ObEEnvironment.ABN:
				return {color: '#fff', bgColor: ObEColor.ERROR, ...bannerToken};
			default:
				return {color: '#fff', bgColor: ObEColor.SUCCESS, ...bannerToken};
		}
	}
}
