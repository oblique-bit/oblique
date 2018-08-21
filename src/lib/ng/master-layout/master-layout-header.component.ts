import {Component, Input} from '@angular/core';

import {MasterLayoutService} from './master-layout.service';
import {ORNavigationLink} from './master-layout-navigation.component';

@Component({
	selector: 'or-master-layout-header',
	template: `
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
				<ul class="navbar-nav navbar-controls navbar-locale" role="menu">
					<li class="nav-item" role="menuitem"
						*ngFor="let locale of locales">
						<a class="nav-link control-link" tabindex="0" role="button" orMasterLayoutHeaderToggle
						   (click)="changeLang(locale)"
						   [class.active]="isLangActive(locale)">
							<span class="control-label">{{locale}}</span>
						</a>
					</li>
				</ul>
				<ng-content select="[orHeaderControls]"></ng-content>
			</div>
		</div>
		<or-master-layout-navigation class="application-navigation" [navigationFullWidth]="navigationFullWidth"
		[navigationScrollable]="navigationScrollable" [navigation]="navigation" [navigationActiveClass]="navigationActiveClass">
			<ng-content select="[orNavigation]"></ng-content>
		</or-master-layout-navigation>
	`,
	styles: [`
		.application-header-controls {
			display: flex;
			align-items: center;
		}
	`]
})
export class MasterLayoutHeaderComponent {
	@Input() home: string;
	@Input() locales: string[] = [];
	@Input() navigationFullWidth: boolean;
	@Input() navigationScrollable: boolean;
	@Input() navigation: ORNavigationLink[];
	@Input() navigationActiveClass: string;

	constructor(private readonly masterLayout: MasterLayoutService) {
	}

	isLangActive(lang: string): boolean {
		return this.masterLayout.userLang === lang;
	}

	changeLang(lang: string) {
		this.masterLayout.userLang = lang;
	}
}
