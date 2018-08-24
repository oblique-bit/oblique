import {Component, HostBinding, Input} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Unsubscribable} from '../unsubscribe';
import {MasterLayoutService} from './master-layout.service';
import {ORFooterLink} from './master-layout-footer.component';
import {ScrollingConfig} from '../scrolling';
import {ORNavigationLink} from './master-layout-navigation.component';
import {MasterLayoutConfig} from './master-layout.config';

@Component({
	selector: 'or-master-layout',
	styles: [`:host {display: block;}`],
	template: `
		<div class="offcanvas" orScrollDetection [ngClass]="{'no-navigation': navigationNone}">
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
			<or-master-layout-header class="offcanvas-main"
					[navigationFullWidth]="navigationFullWidth"
					[navigationScrollable]="navigationScrollable"
					[locales]="locales"
					[navigation]="navigation" [navigationActiveClass]="navigationActiveClass">
				<ng-content select="[orHeaderTitle]" orHeaderTitle></ng-content>
				<ng-content select="[orHeaderControls]" orHeaderControls></ng-content>
				<ng-content select="[orNavigation]" orNavigation></ng-content>
			</or-master-layout-header>
			<div id="content" class="application-content offcanvas-main" role="main">
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
					<div class="empty-layout" *ngIf="!coverLayout">
						<router-outlet></router-outlet>
					</div>
					<div class="cover-layout" *ngIf="coverLayout">
						<div class="cover-viewport">
							<div class="empty-layout">
								<router-outlet></router-outlet>
							</div>
						</div>
					</div>
					<or-spinner></or-spinner>
				</div>
			</div>
			<or-top-control></or-top-control>
			<or-master-layout-footer class="offcanvas-main">
				<ng-content select="[orFooterInfo]" orFooterInfo></ng-content>
				<ng-content select="[orFooterInfoSMCollapse]" orFooterInfoSMCollapse></ng-content>
				<ng-content select="[orFooterLinks]" orFooterLinks></ng-content>
			</or-master-layout-footer>
			<div class="offcanvas-sidebar inversed">
				<ng-content select="[orOffCanvas]"></ng-content>
			</div>
		</div>
	`
})
export class MasterLayoutComponent extends Unsubscribable {
	home: string;
	@Input() footerSmall = true;
	@Input() navigationNone = false;
	@Input() navigationFullWidth = true;
	@Input() navigationScrollable = false;
	@Input() navigation: ORNavigationLink[] = [];
	@Input() navigationActiveClass = 'active';
	@Input() locales: string[] = [];

	@HostBinding('class.application-fixed') applicationFixed: boolean;
	@HostBinding('class.has-cover') coverLayout: boolean;
	@HostBinding('class.header-open') menuCollapsed = false;
	@HostBinding('class.application') private app = true;

	constructor(private readonly masterLayout: MasterLayoutService, private readonly scroll: ScrollingConfig, private readonly config: MasterLayoutConfig) {
		super();

		this.home = this.config.homePageRoute;
		this.applicationFixed = this.config.layout.fixed;
		this.coverLayout = this.config.layout.cover;

		this.updateApplicationFixed();
		this.updateNoNavigation();
		this.updateNavigationFullWidth();
		this.updateNavigationScrollable();
		this.updateCoverLayout();

		this.masterLayout.menuCollapsedEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.menuCollapsed = value;
		});
	}

	private updateApplicationFixed() {
		this.masterLayout.applicationFixed = this.applicationFixed;
		this.masterLayout.applicationFixedEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.applicationFixed = value;
		});
	}

	private updateNoNavigation() {
		this.masterLayout.noNavigation = this.navigationNone;
		this.masterLayout.noNavigationEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.navigationNone = value;
		});
	}

	private updateNavigationFullWidth() {
		this.masterLayout.navigationFullWidth = this.navigationFullWidth;
		this.masterLayout.navigationFullWidthEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.navigationFullWidth = value;
		});
	}

	private updateNavigationScrollable() {
		this.masterLayout.navigationScrollable = this.navigationScrollable;
		this.masterLayout.navigationScrollableEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.navigationScrollable = value;
		});
	}

	private updateCoverLayout() {
		this.masterLayout.coverLayout = this.coverLayout;
		this.masterLayout.coverLayoutEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.coverLayout = value;
		});
	}
}
