import {
	AfterViewInit,
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
	Renderer2,
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
import {OB_ACTIVATE_SERVICE_NAVIGATION, OB_BANNER, OB_PAMS_CONFIGURATION, WINDOW} from '../../utilities';
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
import {ObGlobalEventsService} from '../../global-events/global-events.service';
import {ObEColor} from '../../style/colors.model';

@Component({
	selector: 'ob-master-layout-header',
	templateUrl: './master-layout-header.component.html',
	styleUrls: ['./master-layout-header.component.scss', './master-layout-header.component-controls.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-master-layout-header'}
})
export class ObMasterLayoutHeaderComponent implements AfterViewInit, OnDestroy {
	home$: Observable<string>;
	languages: ObILanguage[];
	isCustom = this.masterLayout.header.isCustom;
	banner: ObIBanner;
	useServiceNavigation = false;
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
		private readonly renderer: Renderer2,
		private readonly globalEventsService: ObGlobalEventsService,
		@Inject(WINDOW) private readonly window: Window,
		@Inject(OB_BANNER) @Optional() bannerToken: ObIBanner,
		@Inject(OB_PAMS_CONFIGURATION) @Optional() public readonly pamsConfiguration: ObIPamsConfiguration,
		@Inject(OB_ACTIVATE_SERVICE_NAVIGATION) @Optional() useServiceNavigation: boolean
	) {
		this.languages = this.formatLanguages(this.config.locale.languages);
		this.customChange();
		this.smallChange();
		this.serviceNavigationConfiguration();
		this.reduceOnScroll();
		this.banner = this.initializeBanner(bannerToken);
		this.home$ = this.masterLayout.homePageRouteChange$;
		this.useServiceNavigation = useServiceNavigation ?? false;
		this.serviceNavigationConfig = this.config.header.serviceNavigation;
	}

	ngAfterViewInit(): void {
		this.globalEventsService.resize$.pipe(takeUntil(this.unsubscribe)).subscribe(() => this.onResize());
		this.setFocusable(this.masterLayout.layout.isMenuOpened);
		this.masterLayout.layout.configEvents$
			.pipe(filter(evt => evt.name === ObEMasterLayoutEventValues.IS_MENU_OPENED))
			.subscribe(value => this.setFocusable(!value));
		this.headerControl
			.toArray()
			.concat(this.headerMobileControl.toArray())
			.forEach(elt => this.addActionClass(elt));
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	onResize(): void {
		this.setFocusable(this.masterLayout.layout.isMenuOpened);
	}

	isLangActive(lang: string): boolean {
		return this.translate.currentLang === lang;
	}

	changeLang(lang: string): void {
		this.translate.use(lang);
	}

	private addActionClass(elt: ElementRef): void {
		const actionable = ['a', 'button'];
		if (actionable.includes(elt.nativeElement.nodeName.toLowerCase())) {
			this.renderer.addClass(elt.nativeElement, 'ob-control-link');
		} else {
			const el = elt.nativeElement.querySelector('a, button');
			if (el) {
				this.renderer.addClass(el, 'ob-control-link');
			}
		}
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

	private setFocusable(isMenuOpened: boolean): void {
		// these elements must not be focusable during the closing animation. Otherwise, the focused element will be scrolled into view
		// and the header will appear empty.
		const isFocusable = this.window.innerWidth > 991 || !isMenuOpened;
		this.el.nativeElement.querySelectorAll('.ob-master-layout-header-controls a.ob-control-link').forEach(el => {
			this.renderer.setAttribute(el, 'tabindex', isFocusable ? '0' : '-1');
		});
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
