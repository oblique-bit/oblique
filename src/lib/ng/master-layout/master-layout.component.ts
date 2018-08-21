import {Component, Input} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Unsubscribable} from '../unsubscribe';
import {MasterLayoutService} from './master-layout.service';
import {ORFooterLink} from './master-layout-footer.component';
import {ScrollingConfig} from '../scrolling';
import {ORNavigationLink} from './master-layout-navigation.component';

@Component({
	selector: 'or-master-layout',
	template: `
		<div class="application" orScrollDetection aria-hidden="false"
			[ngClass]="{'application-fixed': applicationFixed, 'no-navigation': navigationNone, 'has-cover': coverLayout, 'header-open': menuCollapsed}">
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
			<or-master-layout-header class="application-header"
					[ngClass]="{'application-header-animate': headerAnimate, 'application-header-sticky': headerSticky, 'application-header-md': headerMedium}"
					[navigationFullWidth]="navigationFullWidth"
					[navigationScrollable]="navigationScrollable"
					[locales]="locales" [home]="home"
					[navigation]="navigation" [navigationActiveClass]="navigationActiveClass">
				<ng-content select="[orHeaderTitle]" orHeaderTitle></ng-content>
				<ng-content select="[orHeaderControls]" orHeaderControls></ng-content>
				<ng-content select="[orNavigation]" orNavigation></ng-content>
			</or-master-layout-header>
			<div id="content" class="application-content" role="main">
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
			<or-master-layout-footer class="application-footer" [ngClass]="{'application-footer-sm': footerSmall}" [footerLinks]="footerLinks">
				<ng-content select="[orFooterInfo]" orFooterInfo></ng-content>
				<ng-content select="[orFooterInfoSMCollapse]" orFooterInfoSMCollapse></ng-content>
				<ng-content select="[orFooterLinks]" orFooterLinks></ng-content>
			</or-master-layout-footer>
		</div>
	`
})
export class MasterLayoutComponent extends Unsubscribable {
	@Input() home = '/home';
	@Input() applicationFixed = false;
	@Input() headerAnimate = true;
	@Input() headerSticky = true;
	@Input() headerMedium = false;
	@Input() footerSmall = true;
	@Input() navigationNone = false;
	@Input() navigationFullWidth = true;
	@Input() navigationScrollable = false;
	@Input() coverLayout = false;
	@Input() footerLinks: ORFooterLink[] = [];
	@Input() navigation: ORNavigationLink[] = [];
	@Input() navigationActiveClass = 'active';
	@Input() locales: string[] = [];
	menuCollapsed = false;

	constructor(private readonly masterLayout: MasterLayoutService, private readonly scroll: ScrollingConfig) {
		super();
		this.updateApplicationFixed();
		this.updateFooterSmall();
		this.updateHeaderMedium();
		this.updateHeaderSticky();
		this.updateHeaderAnimate();
		this.updateNoNavigation();
		this.updateNavigationFullWidth();
		this.updateNavigationScrollable();
		this.updateCoverLayout();
		this.headerFooterTransitions();

		this.masterLayout.menuCollapsedEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.menuCollapsed = value;
		});
	}

	private headerFooterTransitions() {
		if (this.scroll.transitions.header || this.scroll.transitions.footer) {
			this.scroll.onScroll.pipe(takeUntil(this.unsubscribe))
				.subscribe((isScrolling) => {
					if (this.scroll.transitions.header) {
						this.headerMedium = isScrolling;
					}
					if (this.scroll.transitions.footer) {
						this.footerSmall = !isScrolling;
					}
				});
		}
	}

	private updateApplicationFixed() {
		this.masterLayout.applicationFixed = this.applicationFixed;
		this.masterLayout.applicationFixedEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.applicationFixed = value;
		});
	}

	private updateFooterSmall() {
		this.masterLayout.smallFooter = this.footerSmall;
		this.masterLayout.footerSmallEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.footerSmall = value;
		});
	}

	private updateHeaderMedium() {
		this.masterLayout.mediumHeader = this.headerMedium;
		this.masterLayout.headerMediumEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.headerMedium = value;
		});
	}

	private updateHeaderAnimate() {
		this.masterLayout.animateHeader = this.headerAnimate;
		this.masterLayout.headerAnimateEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.headerAnimate = value;
		});
	}

	private updateHeaderSticky() {
		this.masterLayout.stickyHeader = this.headerSticky;
		this.masterLayout.headerStickyEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.headerSticky = value;
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
