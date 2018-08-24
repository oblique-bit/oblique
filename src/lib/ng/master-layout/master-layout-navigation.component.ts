import {Component, HostBinding} from '@angular/core';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';

import {Unsubscribable} from '../unsubscribe';
import {MasterLayoutService} from './master-layout.service';
import {MasterLayoutConfig} from './master-layout.config';

export interface ORNavigationLink {
	label: string;
	url: string;
	children?: ORNavigationLink[];
}

@Component({
	selector: 'or-master-layout-navigation',
	template: `
		<h2 class="sr-only">Global navigation menu</h2>
		<button class="navigation-scrollable-control navigation-scrollable-control-left" type="button" *ngIf="scrollable">
			<span class="fa fa-angle-left"></span>
		</button>
		<ng-content *ngIf="!links.length"></ng-content>
		<ul id="navigation" role="menubar" *ngIf="links.length"
			class="nav navbar-nav navbar-primary" [class.navigation-scrollable-content]="scrollable"
			[class.navbar-fw]="fullWidth">
			<li class="nav-item" role="presentation" orMasterLayoutNavigationItem *ngFor="let link of links">
				<a class="nav-link" role="menuitem" [routerLink]="link.url" [routerLinkActive]="activeClass"
				   orMasterLayoutNavigationToggle *ngIf="!link.children">
					{{link.label | translate}}
				</a>
				<ng-container *ngIf="link.children">
					<a class="nav-link" role="button" [class.active]="isActive('/samples')" orMasterLayoutNavigationToggle>
						<span [id]="'navbar-primary-title-' + link.label">{{link.label | translate}}</span>
						<span class="toggle"></span>
					</a>
					<div class="navbar-primary-menu" role="menu" attr.aria-labelledby="navbar-primary-title-{{link.label}}"
						 orMasterLayoutNavigationMenu>
						<ul class="nav nav-hover">
							<li class="nav-item nav-header" role="presentation">
								<a class="nav-header-title navbar-primary-back" role="button" orMasterLayoutNavigationToggle>
									<span class="toggle d-layout-collapsed"></span>
									<span>{{link.label | translate}}</span>
								</a>
							</li>
							<li class="nav-item" role="presentation" orMasterLayoutNavigationItem *ngFor="let child of link.children">
								<a class="nav-link" role="menuitem" [routerLink]="link.url + '/' + child.url"
								   [routerLinkActive]="activeClass" orMasterLayoutNavigationToggle>
									{{child.label | translate}}
								</a>
							</li>
						</ul>
					</div>
				</ng-container>
			</li>
		</ul>
		<button class="navigation-scrollable-control navigation-scrollable-control-right" type="button" *ngIf="scrollable">
			<span class="fa fa-angle-right"></span>
		</button>
	`,
	styles: [`:host {display: block;}`]
})
export class MasterLayoutNavigationComponent extends Unsubscribable {
	fullWidth: boolean;
	activeClass: string;
	links: ORNavigationLink[];
	@HostBinding('class.navigation-scrollable') @HostBinding('class.navigation-scrollable-active') scrollable: boolean;
	@HostBinding('class.application-navigation') private app = true;

	constructor(private readonly router: Router, private readonly masterLayout: MasterLayoutService, private readonly config: MasterLayoutConfig) {
		super();

		this.activeClass = this.config.navigation.activeClass;
		this.links = this.config.navigation.links;
		this.fullWidth = this.config.navigation.fullWidth;
		this.scrollable= this.config.navigation.scrollable;
		this.updateNavigationFullWidth();
		this.updateNavigationScrollable();
	}

	isActive(url: string): boolean {
		return this.router.isActive(url, false);
	}

	private updateNavigationFullWidth(): void {
		this.masterLayout.navigationFullWidth = this.fullWidth;
		this.masterLayout.navigationFullWidthEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.fullWidth = value;
		});
	}

	private updateNavigationScrollable(): void {
		this.masterLayout.navigationScrollable = this.scrollable;
		this.masterLayout.navigationScrollableEmitter.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.scrollable = value;
		});
	}
}
