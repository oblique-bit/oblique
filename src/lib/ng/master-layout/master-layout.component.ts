import {Component, HostBinding, ContentChildren, TemplateRef, QueryList, Input} from '@angular/core';
import {takeUntil} from 'rxjs/operators';

import {Unsubscribable} from '../unsubscribe';
import {ScrollingConfig} from '../scrolling';
import {MasterLayoutService} from './master-layout.service';
import {MasterLayoutConfig} from './master-layout.config';
import {ORNavigationLink} from './master-layout-navigation.component';
import {ORFooterLink} from './master-layout-footer.component';

@Component({
	selector: 'or-master-layout',
	exportAs: 'orMasterLayout',
	styles: [`:host {display: block;}`],
	template: `
		<nav class="accesskeys" role="navigation" aria-label="Accesskeys">
			<ul class="list-unstyled">
				<li>
					<a class="accessible" href="#content">Skip to main content</a>
				</li>
				<li>
					<a class="accessible" accesskey="0" [routerLink]="home">Homepage [0]</a>
				</li>
				<li>
					<a class="accessible" accesskey="1" href="#navigation">Navigation [1]</a>
				</li>
				<li>
					<a class="accessible" accesskey="2" href="#content">Content [2]</a>
				</li>
			</ul>
		</nav>
		<or-master-layout-header [class.offcanvas-main]="offCanvas" [navigation]="navigation">
			<ng-content select="[orHeaderTitle]" orHeaderTitle></ng-content>
			<ng-content select="[orNavigation]" orNavigation></ng-content>
			<ng-content select="[orHeaderControls]" orHeaderControls></ng-content>
			<ng-container *ngFor="let template of templates">
				<ng-template #orHeaderControls>
					<ng-container [ngTemplateOutlet]="template"></ng-container>
				</ng-template>
			</ng-container>
		</or-master-layout-header>
		<div id="content" class="application-content" role="main" [class.offcanvas-main]="offCanvas">
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
		<or-master-layout-footer [class.offcanvas-main]="offCanvas" [footerLinks]="footerLinks">
			<ng-content select="[orFooterInfo]" orFooterInfo></ng-content>
			<ng-content select="[orFooterInfoSMCollapse]" orFooterInfoSMCollapse></ng-content>
			<ng-content select="[orFooterLinks]" orFooterLinks></ng-content>
		</or-master-layout-footer>
		<div class="offcanvas-sidebar inversed" *ngIf="offCanvas">
			<ng-content select="[orOffCanvas]"></ng-content>
		</div>
	`,
	/* tslint:disable:use-host-property-decorator */
	host: {class: 'application'}
})
export class MasterLayoutComponent extends Unsubscribable {
	home: string;
	@Input() navigation: ORNavigationLink[] = [];
	@Input() footerLinks: ORFooterLink[] = [];
	@HostBinding('class.application-fixed') applicationFixed: boolean;
	@HostBinding('class.has-cover') coverLayout: boolean;
	@HostBinding('class.header-open') menuCollapsed = false;
	@HostBinding('class.no-navigation') noNavigation = false;
	@HostBinding('class.offcanvas') offCanvas = false;
	@ContentChildren(TemplateRef) templates: QueryList<TemplateRef<any>>;

	constructor(private readonly masterLayout: MasterLayoutService, private readonly scroll: ScrollingConfig, private readonly config: MasterLayoutConfig) {
		super();

		this.home = this.config.homePageRoute;
		this.applicationFixed = this.config.layout.fixed;
		this.coverLayout = this.config.layout.cover;
		this.noNavigation = !this.config.layout.mainNavigation;
		this.offCanvas = this.config.layout.offCanvas;

		this.updateApplicationFixed();
		this.updateCoverLayout();
		this.updateNoNavigation();

		this.masterLayout.menuCollapsedEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.menuCollapsed = value;
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
