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
	ViewChildren
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';

import {ScrollingConfig} from '../scrolling/scrolling.module';
import {Unsubscribable} from '../unsubscribe.class';
import {MasterLayoutService} from './master-layout.service';
import {LocaleObject, MasterLayoutConfig} from './master-layout.config';
import {ORNavigationLink} from './master-layout-navigation.component';

@Component({
	selector: 'or-master-layout-header',
	template: `
		<div class="navbar">
			<ng-content select="[orHeader]" *ngIf="custom"></ng-content>
			<ng-container *ngIf="!custom">
				<div class="navbar-header">
					<div class="application-brand">
						<a class="application-brand-logo" [routerLink]="home" tabindex="-1">
							<img alt="Back to home" src="assets/styles/images/logo.svg"/>
						</a>
						<span class="application-brand-app-title">
						<a [routerLink]="home" class="application-brand-link">
							<ng-content select="[orHeaderTitle]"></ng-content>
						</a>
					</span>
					</div>
					<ul class="nav navbar-nav navbar-controls navbar-toggler">
						<li class="nav-item">
							<a role="button" tabindex="0" title="Toggle application header" class="nav-link control-link or-collapse-toggle"
							   orMasterLayoutHeaderToggle>
								<div class="application-header-toggler">
									<span class="first-line"></span>
									<span class="second-line"></span>
									<span class="third-line"></span>
								</div>
								<span class="sr-only">Toggle header & navigation</span>
							</a>
						</li>
					</ul>
				</div>
				<div class="application-header-controls">
					<h2 class="sr-only">{{'i18n.oblique.controls.title' | translate}}</h2>
					<ng-content select="[orLocales]" *ngIf="disabledLang"></ng-content>
					<ul class="navbar-nav navbar-controls navbar-locale" role="menu" *ngIf="locales.length > 1 && !disabledLang">
						<li class="nav-item" role="menuitem" *ngFor="let locale of locales">
							<button class="btn btn-link" orMasterLayoutHeaderToggle
							   (click)="changeLang(locale.locale)" [class.active]="isLangActive(locale.locale)" [attr.id]="locale.id">
								<span class="control-label">{{locale.locale}}</span>
							</button>
						</li>
					</ul>
					<ul class="navbar-nav navbar-controls ml-sm-auto" role="menu" *ngIf="templates.length">
						<li class="nav-item" role="menuitem" *ngFor="let template of templates">
							<span #headerControl>
								<ng-container [ngTemplateOutlet]="template"></ng-container>
							</span>
						</li>
					</ul>
				</div>
			</ng-container>
		</div>
		<or-master-layout-navigation [links]="navigation">
			<ng-content select="[orNavigation]"></ng-content>
		</or-master-layout-navigation>
	`,
	styles: [`
		.application-header-controls {
			display: flex;
			align-items: center;
		}
		.navbar {
			background-color: inherit;
		}
		.navbar-locale {
			margin-right: 1rem;
		}
		.navbar-locale .btn-link {
			border: none;
			border-radius: 0;
			color: #171717;
		}
		.navbar-locale .btn-link:hover,
		 .navbar-locale .btn-link.active {
			background-color: #e5e5e5;
			box-shadow: none;
		}
	`],
	/* tslint:disable:use-host-property-decorator */
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
				private readonly scroll: ScrollingConfig,
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
		this.masterLayout.menuCollapsedEmitter.subscribe(value => this.setFocusable(!value));

		this.headerControl.forEach((elt: ElementRef) => {
			if (elt.nativeElement.children.length) {
				Array.from(elt.nativeElement.children).forEach((item: HTMLElement) => {
					this.renderer.addClass(item, 'control-link');
					if (item.nodeName === 'A') {
						this.renderer.addClass(item, 'nav-link');
					}
				});
			} else {
				this.renderer.addClass(elt.nativeElement, 'control-link');
			}
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
		this.masterLayout.headerMediumEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.medium = value;
		});
	}

	private updateHeaderAnimate(): void {
		this.masterLayout.animateHeader = this.animate;
		this.masterLayout.headerAnimateEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.animate = value;
		});
	}

	private updateHeaderSticky(): void {
		this.masterLayout.stickyHeader = this.sticky;
		this.masterLayout.headerStickyEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.sticky = value;
		});
	}

	private updateHeaderCustom(): void {
		this.masterLayout.customHeader = this.custom;
		this.masterLayout.headerCustomEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.custom = value;
		});
	}

	private headerTransitions(): void {
		if (this.config.header.scrollTransitions) {
			this.scroll.onScroll.pipe(takeUntil(this.unsubscribe))
				.subscribe((isScrolling) => {
					this.medium = isScrolling;
				});
		}
	}
}
