import {Component, ContentChildren, ElementRef, HostBinding, Input, QueryList, TemplateRef, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter, map, takeUntil} from 'rxjs/operators';

import {Unsubscribable} from '../unsubscribe.class';
import {ScrollingConfig} from '../scrolling/scrolling.module';
import {OffCanvasService} from '../off-canvas/off-canvas.module';
import {MasterLayoutService} from './master-layout.service';
import {MasterLayoutConfig} from './master-layout.config';
import {ORNavigationLink} from './master-layout-navigation.component';

@Component({
	selector: 'or-master-layout',
	exportAs: 'orMasterLayout',
	styles: [`:host {display: block;}`],
	template: `
		<nav class="accesskeys" role="navigation" aria-label="Accesskeys">
			<ul class="list-unstyled">
				<li>
					<a class="accessible" accesskey="0" [routerLink]="url" fragment="content">{{'i18n.accesskey.mainContent' | translate}}</a>
				</li>
				<li>
					<a class="accessible" accesskey="1" [routerLink]="home">{{'i18n.accesskey.homepage' | translate}}</a>
				</li>
				<li>
					<a class="accessible" accesskey="2" [routerLink]="url" fragment="navigation" *ngIf="!noNavigation && navigation.length">
					{{'i18n.accesskey.navigation' | translate}}</a>
				</li>
			</ul>
		</nav>
		<or-master-layout-header [class.offcanvas-main]="offCanvas" [navigation]="navigation">
			<ng-content select="[orHeader]" orHeader></ng-content>
			<ng-content select="[orLocales]" orLocales></ng-content>
			<ng-content select="[orHeaderTitle]" orHeaderTitle></ng-content>
			<ng-content select="[orNavigation]" orNavigation></ng-content>
			<ng-container *ngFor="let template of headerControlTemplates">
				<ng-template #orHeaderControl>
					<ng-container [ngTemplateOutlet]="template"></ng-container>
				</ng-template>
			</ng-container>
		</or-master-layout-header>
		<div id="content" class="application-content" role="main" [class.offcanvas-main]="offCanvas" tabindex="-1">
			<div class="alert-compatibility default-layout">
				<div class="callout callout-danger">
					<span class="sr-only">Error</span>
					<h4>Unsupported browser!</h4>
					<p class="lead">Please note that your browser, Internet Explorer 9 or earlier, is deprecated.</p>
					<p>We recommend upgrading to the <a href="https://www.microsoft.com/en-us/windows/microsoft-edge" target="_blank">latest
						version</a>.</p>
					<p>If you are using IE 10 or above, make sure you <a href="https://support.microsoft.com/en-us/help/17471" target="_blank">turn
						off "Compatibility View".</a></p>
				</div>
			</div>
			<div class="application-content-viewport">
				<or-notification></or-notification>
				<div class="cover-layout" *ngIf="coverLayout; else normalLayout">
					<div class="cover-viewport">
						<ng-container *ngTemplateOutlet="normalLayout"></ng-container>
					</div>
				</div>
				<ng-template #normalLayout>
					<div class="empty-layout">
						<router-outlet></router-outlet>
					</div>
				</ng-template>
				<or-spinner></or-spinner>
			</div>
		</div>
		<or-top-control></or-top-control>
		<or-master-layout-footer [class.offcanvas-main]="offCanvas">
			<ng-content select="[orFooter]" orFooter></ng-content>
			<ng-content select="[orFooterInfo]" orFooterInfo></ng-content>
			<ng-container *ngFor="let template of footerLinkTemplates">
				<ng-template #orFooterLink>
					<ng-container [ngTemplateOutlet]="template"></ng-container>
				</ng-template>
			</ng-container>
		</or-master-layout-footer>
		<div class="offcanvas-sidebar inversed" *ngIf="offCanvas">
			<header class="offcanvas-header default-layout">
				<h2><ng-content select="[orOffCanvasTitle]"></ng-content></h2>
				<a role="button" orOffCanvasToggle tabindex="0" class="close-button" #offCanvasClose>
					<span class="control-label fa fa-close"></span>
					<span class="sr-only">i18n.oblique.offCanvas.close</span>
				</a>
			</header>
			<div class="offcanvas-content default-layout">
				<ng-content select="[orOffCanvasContent]"></ng-content>
			</div>
		</div>
		<div class="modal-backdrop offcanvas-backdrop show" *ngIf="offCanvas"></div>
	`,
	/* tslint:disable:use-host-property-decorator */
	host: {class: 'application'}
})
export class MasterLayoutComponent extends Unsubscribable {
	home: string;
	url: string;
	@Input() navigation: ORNavigationLink[] = [];
	@HostBinding('class.application-fixed') applicationFixed: boolean;
	@HostBinding('class.has-cover') coverLayout: boolean;
	@HostBinding('class.header-open') headerOpen: boolean;
	@HostBinding('class.no-navigation') noNavigation: boolean;
	@HostBinding('class.offcanvas') offCanvas: boolean;
	@ContentChildren('orHeaderControl') readonly headerControlTemplates: QueryList<TemplateRef<any>>;
	@ContentChildren('orFooterLink') readonly footerLinkTemplates: QueryList<TemplateRef<any>>;
	@ViewChild('offCanvasClose') readonly offCanvasClose: ElementRef<HTMLElement>;

	constructor(private readonly masterLayout: MasterLayoutService,
				private readonly scroll: ScrollingConfig,
				private readonly config: MasterLayoutConfig,
				readonly offCanvasService: OffCanvasService,
				readonly router: Router
	) {
		super();

		router.events.pipe(
			filter(evt => evt instanceof NavigationEnd),
			map(() => router.url.split('#'))
		).subscribe((route) => {
			this.url = route[0];
			if (route[1] && this.config.focusableFragments.indexOf(route[1]) > -1) {
				const el = document.getElementById(route[1]);
				if (el) {
					el.focus();
				}
			}
		});
		this.home = this.config.homePageRoute;
		this.applicationFixed = this.config.layout.fixed;
		this.coverLayout = this.config.layout.cover;
		this.noNavigation = !this.config.layout.mainNavigation;
		this.offCanvas = this.config.layout.offCanvas;
		this.headerOpen = !this.masterLayout.menuCollapsed;

		this.updateApplicationFixed();
		this.updateCoverLayout();
		this.updateNoNavigation();

		this.masterLayout.menuCollapsedEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.headerOpen = !value;
		});

		offCanvasService.openEmitter.pipe(takeUntil(this.unsubscribe), filter(value => value)).subscribe(() => {
			setTimeout(() => this.offCanvasClose.nativeElement.focus(), 600);
		});
	}

	private updateApplicationFixed(): void {
		this.masterLayout.applicationFixed = this.applicationFixed;
		this.masterLayout.applicationFixedEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.applicationFixed = value;
		});
	}

	private updateCoverLayout(): void {
		this.masterLayout.coverLayout = this.coverLayout;
		this.masterLayout.coverLayoutEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.coverLayout = value;
		});
	}

	private updateNoNavigation(): void {
		this.masterLayout.noNavigation = this.noNavigation;
		this.masterLayout.noNavigationEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.noNavigation = value;
		});
	}
}
