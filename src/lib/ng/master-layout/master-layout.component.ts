import {Component, Input} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Unsubscribable} from '../unsubscribe';
import {MasterLayoutService} from './master-layout.service';
import {ORFooterLink} from './master-layout-footer.component';
import {ScrollingConfig} from '../scrolling';

@Component({
	selector: 'or-master-layout',
	template: `
		<div class="application" orScrollDetection aria-hidden="false"
			[ngClass]="{'application-fixed': applicationFixed, 'no-navigation': navigationNone, 'has-cover': coverLayout}">
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
			<header class="application-header application-header-sticky application-header-animate"
					[ngClass]="{'application-header-animate': headerAnimate, 'application-header-sticky': headerSticky, 'application-header-md': headerMedium}">
				<div class="navbar">
					<div class="navbar-header">
						<div class="application-brand">
							<a class="application-brand-logo" [routerLink]="home" tabindex="-1">
								<img alt="Back to home" src="assets/oblique-ui/images/logo.svg"/>
							</a>
							<span class="application-brand-app-title">
								<a [routerLink]="home" class="application-brand-link">
									<ng-content select="[orHeaderTitle]"></ng-content>
								</a>
							</span>
						</div>
						<ul class="nav navbar-nav navbar-controls navbar-toggler">
							<li class="nav-item">
								<a role="button" tabindex="0" title="Toggle application header" class="nav-link control-link or-collapse-toggle">
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
						<ul class="navbar-nav navbar-controls navbar-locale" role="menu">
							<li class="nav-item" role="menuitem"
								*ngFor="let locale of locales">
								<a class="btn btn-link nav-link control-link" tabindex="0" role="button"
								   (click)="changeLang(locale)"
								   [class.active]="isLangActive(locale)">
									<span class="control-label">{{locale}}</span>
								</a>
							</li>
						</ul>
						<ng-content select="[orHeaderControls]"></ng-content>
					</div>
				</div>
				<div class="application-navigation navigation-scrollable">
					<h2 class="sr-only">Global navigation menu</h2>
					<button class="navigation-scrollable-control navigation-scrollable-control-left" type="button">
						<span class="fa fa-angle-left"></span>
					</button>
					<ng-content select="[orNavigation]"></ng-content>
					<button class="navigation-scrollable-control navigation-scrollable-control-right" type="button">
						<span class="fa fa-angle-right"></span>
					</button>
				</div>
			</header>
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
			</or-master-layout-footer>
		</div>
	`,
	styles: [`
		.application-header-controls {
			display: flex;
			align-items: center;
		}
	`]
})
export class MasterLayoutComponent extends Unsubscribable {
	@Input() home = '/home';
	@Input() applicationFixed = false;
	@Input() headerAnimate = true;
	@Input() headerSticky = true;
	@Input() headerMedium = false;
	@Input() footerSmall = true;
	@Input() navigationNone = false;
	@Input() navigationFullWidth = false;
	@Input() coverLayout = false;
	@Input() footerLinks: ORFooterLink[];
	@Input() locales: string[] = [];

	constructor(private readonly masterLayout: MasterLayoutService, private readonly scroll: ScrollingConfig) {
		super();
		this.updateApplicationFixed();
		this.updateFooterSmall();
		this.updateHeaderMedium();
		this.updateHeaderSticky();
		this.updateHeaderAnimate();
		this.updateNoNavigation();
		this.updateCoverLayout();

		if (scroll.transitions.header || scroll.transitions.footer) {
			scroll.onScroll.pipe(takeUntil(this.unsubscribe))
				.subscribe((isScrolling) => {
					if (scroll.transitions.header) {
						this.headerMedium = isScrolling;
					}
					if (scroll.transitions.footer) {
						this.footerSmall = !isScrolling;
					}
				});
		}
	}

	isLangActive(lang: string): boolean {
		return this.masterLayout.userLang === lang;
	}

	changeLang(lang: string) {
		this.masterLayout.userLang = lang;
	}

	private updateApplicationFixed() {
		this.masterLayout.applicationFixed = this.applicationFixed;
		this.masterLayout.applicationFixedChange.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.applicationFixed = value;
		});
	}

	private updateFooterSmall() {
		this.masterLayout.smallFooter = this.footerSmall;
		this.masterLayout.footerSmallChange.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.footerSmall = value;
		});
	}

	private updateHeaderMedium() {
		this.masterLayout.mediumHeader = this.headerMedium;
		this.masterLayout.headerMediumChange.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.headerMedium = value;
		});
	}

	private updateHeaderAnimate() {
		this.masterLayout.animateHeader = this.headerAnimate;
		this.masterLayout.headerAnimateChange.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.headerAnimate = value;
		});
	}

	private updateHeaderSticky() {
		this.masterLayout.stickyHeader = this.headerSticky;
		this.masterLayout.headerStickyChange.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.headerSticky = value;
		});
	}

	private updateNoNavigation() {
		this.masterLayout.noNavigation = this.navigationNone;
		this.masterLayout.noNavigationChange.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.navigationNone = value;
		});
	}

	private updateCoverLayout() {
		this.masterLayout.coverLayout = this.coverLayout;
		this.masterLayout.coverLayoutChange.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.coverLayout = value;
		});
	}
}
