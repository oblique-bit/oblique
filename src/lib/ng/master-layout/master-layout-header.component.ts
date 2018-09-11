import {Component, ContentChildren, HostBinding, Input, QueryList, TemplateRef} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';

import {MasterLayoutService} from './master-layout.service';
import {MasterLayoutConfig} from './master-layout.config';
import {Unsubscribable} from '../unsubscribe';
import {ScrollingConfig} from '../scrolling';
import {ORNavigationLink} from './master-layout-navigation.component';

@Component({
	selector: 'or-master-layout-header',
	template: `
		<div class="navbar">
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
						<a role="button" tabindex="0" title="Toggle application header" class="nav-link control-link or-collapse-toggle" orMasterLayoutHeaderToggle>
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
				<ul class="navbar-nav navbar-controls navbar-locale" role="menu" *ngIf="locales.length > 1">
					<li class="nav-item" role="menuitem"
						*ngFor="let locale of locales">
						<a class="nav-link control-link" tabindex="0" role="button" orMasterLayoutHeaderToggle
						   (click)="changeLang(locale)"
						   [class.active]="isLangActive(locale)">
							<span class="control-label">{{locale}}</span>
						</a>
					</li>
				</ul>
				<ul class="navbar-nav navbar-controls ml-sm-auto" role="menu" *ngIf="templates.length">
					<li class="nav-item" role="menuitem" *ngFor="let template of templates">
						<ng-container [ngTemplateOutlet]="template"></ng-container>
					</li>
				</ul>
				<ng-content select="[orHeaderControls]" *ngIf="!templates.length"></ng-content>
			</div>
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
	`],
	/* tslint:disable:use-host-property-decorator */
	host: {class: 'application-header'}
})
export class MasterLayoutHeaderComponent extends Unsubscribable {
	home: string;
	locales: string[];
	@Input() navigation: ORNavigationLink[];

	@HostBinding('class.application-header-animate') animate: boolean;
	@HostBinding('class.application-header-sticky') sticky: boolean;
	@HostBinding('class.application-header-md') medium: boolean;
	@ContentChildren('orHeaderControls') readonly templates: QueryList<TemplateRef<any>>;

	constructor(private readonly masterLayout: MasterLayoutService,
				private readonly translate: TranslateService,
				private readonly config: MasterLayoutConfig,
				private readonly scroll: ScrollingConfig) {
		super();

		this.home = this.config.homePageRoute;
		this.locales = this.config.locales;

		this.animate = this.config.header.animate;
		this.sticky = this.config.header.sticky;
		this.medium = this.config.header.medium;

		this.updateHeaderMedium();
		this.updateHeaderSticky();
		this.updateHeaderAnimate();
		this.headerTransitions();
	}

	isLangActive(lang: string): boolean {
		return this.translate.currentLang === lang;
	}

	changeLang(lang: string): void {
		this.translate.use(lang);
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

	private headerTransitions(): void {
		if (this.scroll.transitions.header) {
			this.scroll.onScroll.pipe(takeUntil(this.unsubscribe))
				.subscribe((isScrolling) => {
					this.medium = isScrolling;
				});
		}
	}
}
