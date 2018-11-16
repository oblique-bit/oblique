import {Component, HostBinding, HostListener, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';

import {Unsubscribable} from '../unsubscribe';
import {MasterLayoutService} from './master-layout.service';
import {MasterLayoutConfig} from './master-layout.config';

export interface ORNavigationLink {
	label: string;
	url: string;
	children?: ORNavigationLink[];
	id?: string;
}

@Component({
	selector: 'or-master-layout-navigation',
	template: `
		<h2 class="sr-only" *ngIf="links.length">{{'i18n.accessible.globalNavigationMenu' | translate}}</h2>
		<button class="navigation-scrollable-control navigation-scrollable-control-left" type="button" (click)="scrollLeft()" *ngIf="scrollable"
				[disabled]="!currentScroll">
			<span class="fa fa-angle-left"></span>
		</button>
		<ng-content *ngIf="!links.length"></ng-content>
		<ul id="navigation" role="menubar" *ngIf="links.length"
			class="nav navbar-nav navbar-primary" [class.navigation-scrollable-content]="scrollable" [class.navbar-fw]="fullWidth" tabindex="-1" #container>
			<li class="nav-item" role="presentation" orMasterLayoutNavigationItem *ngFor="let link of links">
				<a [attr.id]="link.id" class="nav-link" role="menuitem" [routerLink]="link.url" [routerLinkActive]="activeClass"
				   orMasterLayoutNavigationToggle *ngIf="!link.children">
					{{link.label | translate}}
				</a>
				<ng-container *ngIf="link.children">
					<a [attr.id]="link.id" class="nav-link" role="button" tabindex="0" [class.active]="isActive('/samples')" orMasterLayoutNavigationToggle>
						<span>{{link.label | translate}}</span>
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
								<a class="nav-link" role="menuitem" [attr.id]="child.id" [routerLink]="link.url + '/' + child.url"
								   [routerLinkActive]="activeClass" orMasterLayoutNavigationToggle>
									{{child.label | translate}}
								</a>
							</li>
						</ul>
					</div>
				</ng-container>
			</li>
		</ul>
		<button class="navigation-scrollable-control navigation-scrollable-control-right" (click)="scrollRight()" type="button" *ngIf="scrollable"
				[disabled]="currentScroll === maxScroll">
			<span class="fa fa-angle-right"></span>
		</button>
	`,
	styles: [`:host {
		display: block;
	}

	button[disabled] {
		cursor: not-allowed !important;
	}
	`],
	/* tslint:disable:use-host-property-decorator */
	host: {class: 'application-navigation'}
})
export class MasterLayoutNavigationComponent extends Unsubscribable implements OnInit {
	fullWidth: boolean;
	activeClass: string;
	currentScroll = 0;
	maxScroll = 0;
	@Input() links: ORNavigationLink[] = [];
	@HostBinding('class.navigation-scrollable') @HostBinding('class.navigation-scrollable-active') scrollable: boolean;
	@ViewChild('container') container;
	private static readonly buttonWidth = 30;

	constructor(private readonly router: Router,
				private readonly masterLayout: MasterLayoutService,
				private readonly config: MasterLayoutConfig,
				private readonly renderer: Renderer2,
				private readonly translate: TranslateService) {
		super();

		this.activeClass = this.config.navigation.activeClass;
		this.fullWidth = this.config.navigation.fullWidth;
		this.scrollable = this.config.navigation.scrollable;
		this.updateNavigationFullWidth();
		this.updateNavigationScrollable();
	}

	@HostListener('window:resize')
	onResize() {
		if (this.container) {
			let childWidth = 0;
			Array.from(this.container.nativeElement.children).forEach((el: HTMLElement) => {
				childWidth += el.clientWidth;
			});
			this.maxScroll = Math.max(0, -(this.container.nativeElement.clientWidth - childWidth - 2 * MasterLayoutNavigationComponent.buttonWidth));
		}
	}

	ngOnInit() {
		this.links = this.links.length ? this.links : this.config.navigation.links;
		this.translate.getTranslation(this.translate.defaultLang).subscribe(() => this.onResize());
	}

	isActive(url: string): boolean {
		return this.router.isActive(url, false);
	}

	scrollLeft(): void {
		this.updateScroll(-this.config.navigation.scrollDelta);
	}

	scrollRight(): void {
		this.updateScroll(this.config.navigation.scrollDelta);
	}

	private updateScroll(delta: number): void {
		this.currentScroll += delta;
		this.currentScroll = Math.max(0, this.currentScroll);
		this.currentScroll = Math.min(this.currentScroll, this.maxScroll);
		this.renderer.setStyle(this.container.nativeElement.children[0], 'margin-left', `-${this.currentScroll}px`);
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
