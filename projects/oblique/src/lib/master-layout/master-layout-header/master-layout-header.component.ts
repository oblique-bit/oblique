import {
	AfterViewInit,
	Component,
	ContentChildren,
	ElementRef,
	HostBinding,
	HostListener,
	Inject,
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
import {WINDOW} from '../../utilities';

@Component({
	selector: 'or-master-layout-header',
	templateUrl: './master-layout-header.component.html',
	styleUrls: ['./master-layout-header.component.scss', './master-layout-header.component-controls.scss'],
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
	private readonly window: Window;

	constructor(private readonly masterLayout: MasterLayoutService,
				private readonly translate: TranslateService,
				private readonly config: MasterLayoutConfig,
				private readonly scrollEvents: ScrollingEvents,
				private readonly el: ElementRef,
				private readonly renderer: Renderer2,
				@Inject(WINDOW) window) {
		super();
		this.window = window; // because AoT don't accept interfaces as DI
		this.locales = this.formatLocales();
		this.propertyChanges();
		this.reduceOnScroll();
	}

	ngAfterViewInit() {
		this.setFocusable(this.masterLayout.layout.isMenuOpened);
		this.masterLayout.layout.configEvents.pipe(filter(evt => evt.name === MasterLayoutEventValues.COLLAPSE)).subscribe(value => this.setFocusable(!value));
		this.addObliqueClasses();
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

	private addObliqueClasses() {
		const actionable = ['a', 'button'];
		this.headerControl.forEach((elt: ElementRef) => {
			if (actionable.indexOf(elt.nativeElement.nodeName.toLowerCase()) > -1) {
				this.renderer.addClass(elt.nativeElement, 'control-link');
			} else {
				const el = elt.nativeElement.querySelector('a, button');
				if (el) {
					this.renderer.addClass(el, 'control-link');
				}
			}
			Array.from(elt.nativeElement.querySelectorAll('.control-link .fa, .control-link .fab')).forEach((item: HTMLElement) => {
				this.renderer.addClass(item, 'control-icon');
			});
		});
	}

	private reduceOnScroll() {
		this.scrollEvents.isScrolled.pipe(takeUntil(this.unsubscribe), scrollEnabled(this.masterLayout.header))
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
		const isFocusable = this.window.innerWidth > 991 || !isMenuOpened;
		Array.from(this.el.nativeElement.querySelectorAll('.application-header-controls a.control-link'))
			.forEach(el => {
				this.renderer.setAttribute(el, 'tabindex', isFocusable ? '0' : '-1');
			});
	}
}
