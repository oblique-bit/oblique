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
import {OB_BANNER, WINDOW} from '../../utilities';
import {ObIBanner} from '../../utilities.model';
import {ObEMasterLayoutEventValues, ObILocaleObject, ObIMasterLayoutEvent, ObINavigationLink} from '../master-layout.model';
import {ObScrollingEvents} from '../../scrolling/scrolling-events';
import {ObGlobalEventsService} from '../../global-events/global-events.service';

@Component({
	selector: 'ob-master-layout-header',
	templateUrl: './master-layout-header.component.html',
	styleUrls: ['./master-layout-header.component.scss', './master-layout-header.component-controls.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-master-layout-header'}
})
export class ObMasterLayoutHeaderComponent implements AfterViewInit, OnDestroy {
	home$: Observable<string>;
	languages: {code: string; id?: string}[];
	isCustom = this.masterLayout.header.isCustom;
	banner: ObIBanner;
	@Input() navigation: ObINavigationLink[];
	@HostBinding('class.ob-master-layout-header-small') isSmall = this.masterLayout.header.isSmall;
	@ContentChild('obHeaderLogo') readonly obLogo: TemplateRef<any>;
	@ContentChildren('obHeaderControl') readonly templates: QueryList<TemplateRef<any>>;
	@ContentChildren('obHeaderMobileControl') readonly mobileTemplates: QueryList<TemplateRef<any>>;
	@ViewChildren('headerControl') readonly headerControl: QueryList<ElementRef>;
	@ViewChildren('headerMobileControl') readonly headerMobileControl: QueryList<ElementRef>;
	private readonly unsubscribe = new Subject();

	constructor(
		private readonly masterLayout: ObMasterLayoutService,
		private readonly translate: TranslateService,
		private readonly config: ObMasterLayoutConfig,
		private readonly scrollEvents: ObScrollingEvents,
		private readonly el: ElementRef,
		private readonly renderer: Renderer2,
		private readonly globalEventsService: ObGlobalEventsService,
		@Inject(WINDOW) private readonly window: Window,
		@Inject(OB_BANNER) @Optional() bannerToken
	) {
		this.languages = this.formatLanguages();
		this.customChange();
		this.smallChange();
		this.reduceOnScroll();
		this.banner = {color: '#000', bgColor: '#0f0', ...bannerToken};
		this.home$ = this.masterLayout.homePageRouteChange$;
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
		elt.nativeElement.querySelectorAll('.ob-control-link .fa, .ob-control-link .fas, .ob-control-link .fab').forEach((item: HTMLElement) => {
			this.renderer.addClass(item, 'ob-control-icon');
		});
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

	private formatLanguages(): {code: string; id?: string}[] {
		return this.config.locale.disabled || !this.config.locale.display
			? []
			: this.config.locale.locales.map(locale => ({
					code: ((locale as ObILocaleObject).locale || (locale as string)).split('-')[0],
					id: (locale as ObILocaleObject).id
			  }));
	}

	private setFocusable(isMenuOpened: boolean): void {
		// these elements must not be focusable during the closing animation. Otherwise, the focused element will be scrolled into view
		// and the header will appear empty.
		const isFocusable = this.window.innerWidth > 991 || !isMenuOpened;
		this.el.nativeElement.querySelectorAll('.ob-master-layout-header-controls a.ob-control-link').forEach(el => {
			this.renderer.setAttribute(el, 'tabindex', isFocusable ? '0' : '-1');
		});
	}
}
