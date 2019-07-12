import {
	AfterViewInit,
	Component,
	ContentChildren,
	ElementRef,
	HostBinding,
	HostListener,
	Input,
	QueryList,
	Renderer2,
	TemplateRef,
	ViewChildren,
	ViewEncapsulation
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';

import {ScrollingEvents} from '../scrolling/scrolling.module';
import {Unsubscribable} from '../unsubscribe.class';
import {MasterLayoutService} from './master-layout.service';
import {LocaleObject, MasterLayoutConfig} from './master-layout.config';
import {ORNavigationLink} from './master-layout-navigation.component';

@Component({
	selector: 'or-master-layout-header',
	templateUrl: './master-layout-header.component.html',
	styleUrls: ['./master-layout-header.component.scss', './master-layout-header.component-controls.scss', './master-layout-header.component-dropdown.scss'],
	encapsulation: ViewEncapsulation.None,
	// tslint:disable-next-line:no-host-metadata-property
	host: {class: 'application-header'}
})
export class MasterLayoutHeaderComponent extends Unsubscribable implements AfterViewInit {
	home: string;
	locales: LocaleObject[];
	custom: boolean;
	disabledLang: boolean;
	@Input() navigation: ORNavigationLink[];

	@HostBinding('class.application-header-animate') animate: boolean;
	@HostBinding('class.application-header-sticky') sticky: boolean;
	@HostBinding('class.application-header-md') medium: boolean;
	@ContentChildren('orHeaderControl') readonly templates: QueryList<TemplateRef<any>>;
	@ViewChildren('headerControl') readonly headerControl: QueryList<ElementRef>;

	constructor(private readonly masterLayout: MasterLayoutService,
				private readonly translate: TranslateService,
				private readonly config: MasterLayoutConfig,
				private readonly scrollEvents: ScrollingEvents,
				private readonly el: ElementRef,
				private readonly renderer: Renderer2) {
		super();

		this.locales = this.checkLocale();
		this.disabledLang = this.config.locale.disabled;
		this.home = this.config.homePageRoute;
		this.animate = this.config.header.animate;
		this.sticky = this.config.header.sticky;
		this.medium = this.config.header.medium;
		this.custom = this.config.header.custom;

		this.updateHeaderMedium();
		this.updateHeaderSticky();
		this.updateHeaderAnimate();
		this.updateHeaderCustom();
		this.headerTransitions();
	}

	ngAfterViewInit() {
		this.setFocusable(!this.masterLayout.menuCollapsed);
		this.masterLayout.menuCollapsedChanged.subscribe(value => this.setFocusable(!value));

		this.headerControl.forEach((elt: ElementRef) => {
			Array.from(elt.nativeElement.children).forEach((item: HTMLElement) => {
				this.renderer.addClass(item, 'control-link');
			});
			Array.from(elt.nativeElement.querySelectorAll('a')).forEach((item: HTMLElement) => {
				this.renderer.addClass(item, 'nav-link');
			});
			Array.from(elt.nativeElement.querySelectorAll('.nav-link .fa')).forEach((item: HTMLElement) => {
				this.renderer.addClass(item, 'control-icon');
			});
		});
	}

	@HostListener('window:resize')
	onResize() {
		this.setFocusable(!this.masterLayout.menuCollapsed);
	}

	isLangActive(lang: string): boolean {
		return this.translate.currentLang === lang;
	}

	changeLang(lang: string): void {
		this.translate.use(lang);
	}

	checkLocale(): LocaleObject[] {
		const locales: LocaleObject[] = [];
		this.config.locale.locales.forEach((loc) => {
			const locale: LocaleObject = {
				locale: (loc as LocaleObject).locale || (loc as string)
			};
			if ((loc as LocaleObject).id) {
				locale.id = (loc as LocaleObject).id;
			}
			locales.push(locale);
		});

		return locales;
	}

	private setFocusable(isMenuCollasped: boolean): void {
		// these elements must not be focusable during the closing animation. Otherwise, the focused element will be scrolled into view
		// and the header will appear empty.
		const isFocusable = window.innerWidth > 991 || isMenuCollasped;
		Array.from(this.el.nativeElement.querySelectorAll('.application-header-controls a.control-link'))
			.forEach(el => {
				this.renderer.setAttribute(el, 'tabindex', isFocusable ? '0' : '-1');
			});
	}

	private updateHeaderMedium(): void {
		this.masterLayout.mediumHeader = this.medium;
		this.masterLayout.headerMediumChanged.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.medium = value;
		});
	}

	private updateHeaderAnimate(): void {
		this.masterLayout.animateHeader = this.animate;
		this.masterLayout.headerAnimateChanged.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.animate = value;
		});
	}

	private updateHeaderSticky(): void {
		this.masterLayout.stickyHeader = this.sticky;
		this.masterLayout.headerStickyChanged.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.sticky = value;
		});
	}

	private updateHeaderCustom(): void {
		this.masterLayout.customHeader = this.custom;
		this.masterLayout.headerCustomChanged.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.custom = value;
		});
	}

	private headerTransitions(): void {
		if (this.config.header.scrollTransitions) {
			this.scrollEvents.scrolled.pipe(takeUntil(this.unsubscribe))
				.subscribe((isScrolling) => {
					this.medium = isScrolling;
				});
		}
	}
}
