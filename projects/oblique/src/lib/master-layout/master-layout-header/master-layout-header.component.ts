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
import {filter, takeUntil} from 'rxjs/operators';

import {ScrollingEvents} from '../../scrolling/scrolling.module';
import {Unsubscribable} from '../../unsubscribe.class';
import {MasterLayoutService} from '../master-layout.service';
import {LocaleObject, MasterLayoutConfig} from '../master-layout.config';
import {ORNavigationLink} from '../master-layout-navigation/master-layout-navigation.component';
import {MasterLayoutEvent, MasterLayoutEventValues, scrollEnabled} from '../master-layout.utility';

@Component({
	selector: 'or-master-layout-header',
	templateUrl: './master-layout-header.component.html',
	styleUrls: ['./master-layout-header.component.scss', './master-layout-header.component-controls.scss', './master-layout-header.component-dropdown.scss'],
	encapsulation: ViewEncapsulation.None,
	// tslint:disable-next-line:no-host-metadata-property
	host: {class: 'application-header'}
})
export class MasterLayoutHeaderComponent extends Unsubscribable implements AfterViewInit {
	home = this.config.homePageRoute;
	locales: LocaleObject[];
	isCustom = this.masterLayout.header.isCustom;
	disabledLang = this.config.locale.disabled;
	@Input() navigation: ORNavigationLink[];
	@HostBinding('class.application-header-animate') isAnimated = this.masterLayout.header.isAnimated;
	@HostBinding('class.application-header-sticky') isSticky = this.masterLayout.header.isSticky;
	@HostBinding('class.application-header-md') isMedium = this.masterLayout.header.isMedium;
	@ContentChildren('orHeaderControl') readonly templates: QueryList<TemplateRef<any>>;
	@ViewChildren('headerControl') readonly headerControl: QueryList<ElementRef>;

	constructor(private readonly masterLayout: MasterLayoutService,
				private readonly translate: TranslateService,
				private readonly config: MasterLayoutConfig,
				private readonly scrollEvents: ScrollingEvents,
				private readonly el: ElementRef,
				private readonly renderer: Renderer2) {
		super();

		this.locales = this.formatLocales();
		this.propertyChanges();
		this.reduceOnScroll();
	}

	ngAfterViewInit() {
		this.setFocusable(this.masterLayout.layout.isMenuOpened);
		this.masterLayout.layout.configEvents.pipe(filter(evt => evt.name === MasterLayoutEventValues.COLLAPSE)).subscribe(value => this.setFocusable(!value));

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
		this.setFocusable(this.masterLayout.layout.isMenuOpened);
	}

	isLangActive(lang: string): boolean {
		return this.translate.currentLang === lang;
	}

	changeLang(lang: string): void {
		this.translate.use(lang);
	}

	private reduceOnScroll() {
		this.scrollEvents.isScrolled.pipe(takeUntil(this.unsubscribe), scrollEnabled(this.masterLayout.header.configEvents))
			.subscribe((isScrolling) => {
				this.isMedium = isScrolling;
			});
	}

	private propertyChanges() {
		const events = [MasterLayoutEventValues.ANIMATE, MasterLayoutEventValues.CUSTOM, MasterLayoutEventValues.MEDIUM, MasterLayoutEventValues.STICKY];
		this.masterLayout.header.configEvents.pipe(
			filter((evt: MasterLayoutEvent) => events.includes(evt.name)),
			takeUntil(this.unsubscribe)
		).subscribe((event) => {
			switch (event.name) {
				case MasterLayoutEventValues.ANIMATE:
					this.isAnimated = event.value;
					break;
				case MasterLayoutEventValues.CUSTOM:
					this.isCustom = event.value;
					break;
				case MasterLayoutEventValues.MEDIUM:
					this.isMedium = event.value;
					break;
				case MasterLayoutEventValues.STICKY:
					this.isSticky = event.value;
					break;
			}
		});
	}

	private formatLocales(): LocaleObject[] {
		const locales: LocaleObject[] = [];
		if (!this.config.locale.disabled) {
			this.config.locale.locales.forEach((loc) => {
				const locale: LocaleObject = {
					locale: (loc as LocaleObject).locale || (loc as string)
				};
				if ((loc as LocaleObject).id) {
					locale.id = (loc as LocaleObject).id;
				}
				locales.push(locale);
			});
		}

		return locales;
	}

	private setFocusable(isMenuOpened: boolean): void {
		// these elements must not be focusable during the closing animation. Otherwise, the focused element will be scrolled into view
		// and the header will appear empty.
		const isFocusable = window.innerWidth > 991 || !isMenuOpened;
		Array.from(this.el.nativeElement.querySelectorAll('.application-header-controls a.control-link'))
			.forEach(el => {
				this.renderer.setAttribute(el, 'tabindex', isFocusable ? '0' : '-1');
			});
	}
}
