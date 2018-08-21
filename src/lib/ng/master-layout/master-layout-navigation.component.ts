import {Component, HostBinding, Input} from '@angular/core';
import {Router} from '@angular/router';

export interface ORNavigationLink {
	label: string;
	url: string;
	children?: ORNavigationLink[];
}

@Component({
	selector: 'or-master-layout-navigation',
	template: `
		<h2 class="sr-only">Global navigation menu</h2>
		<button class="navigation-scrollable-control navigation-scrollable-control-left" type="button" *ngIf="navigationScrollable">
			<span class="fa fa-angle-left"></span>
		</button>
		<ng-content *ngIf="!navigation.length"></ng-content>
		<ul id="navigation" role="menubar" *ngIf="navigation.length"
			class="nav navbar-nav navbar-primary" [class.navigation-scrollable-content]="navigationScrollable"
			[class.navbar-fw]="navigationFullWidth">
			<li class="nav-item" role="presentation" orMasterLayoutNavigationItem *ngFor="let item of navigation">
				<a class="nav-link" role="menuitem" [routerLink]="item.url" [routerLinkActive]="navigationActiveClass"
				   orMasterLayoutNavigationToggle *ngIf="!item.children">
					{{item.label | translate}}
				</a>
				<ng-container *ngIf="item.children">
					<a class="nav-link" role="button" [class.active]="isActive('/samples')" orMasterLayoutNavigationToggle>
						<span [id]="'navbar-primary-title-' + item.label">{{item.label | translate}}</span>
						<span class="toggle"></span>
					</a>
					<div class="navbar-primary-menu" role="menu" attr.aria-labelledby="navbar-primary-title-{{item.label}}"
						 orMasterLayoutNavigationMenu>
						<ul class="nav nav-hover">
							<li class="nav-item nav-header" role="presentation">
								<a class="nav-header-title navbar-primary-back" role="button" orMasterLayoutNavigationToggle>
									<span class="toggle d-layout-collapsed"></span>
									<span>{{item.label | translate}}</span>
								</a>
							</li>
							<li class="nav-item" role="presentation" orMasterLayoutNavigationItem *ngFor="let child of item.children">
								<a class="nav-link" role="menuitem" [routerLink]="item.url + '/' + child.url"
								   [routerLinkActive]="navigationActiveClass" orMasterLayoutNavigationToggle>
									{{child.label | translate}}
								</a>
							</li>
						</ul>
					</div>
				</ng-container>
			</li>
		</ul>
		<button class="navigation-scrollable-control navigation-scrollable-control-right" type="button" *ngIf="navigationScrollable">
			<span class="fa fa-angle-right"></span>
		</button>
	`,
	styles: [`:host {display: block;}`]
})
export class MasterLayoutNavigationComponent {
	@Input() navigationFullWidth: boolean;
	@Input() @HostBinding('class.navigation-scrollable') @HostBinding('class.navigation-scrollable-active') navigationScrollable: boolean;
	@Input() navigation: ORNavigationLink[];
	@Input() navigationActiveClass: string;

	constructor(private readonly router: Router) {
	}

	isActive(url: string): boolean {
		return this.router.isActive(url, false);
	}
}
