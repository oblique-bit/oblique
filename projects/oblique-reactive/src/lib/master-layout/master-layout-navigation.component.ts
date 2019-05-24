import {AfterContentChecked, Component, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';

import {Unsubscribable} from '../unsubscribe.class';
import {MasterLayoutService} from './master-layout.service';
import {MasterLayoutConfig} from './master-layout.config';
import {MasterLayoutNavigationService} from './master-layout-navigation.service';

export interface ORNavigationLink {
	label: string;
	url: string;
	children?: ORNavigationLink[];
	id?: string;
}

@Component({
	selector: 'or-master-layout-navigation',
	templateUrl: './master-layout-navigation.component.html',
	styleUrls: ['./master-layout-navigation.component.scss'],
	/* tslint:disable:use-host-property-decorator */
	host: {class: 'application-navigation'}
})
export class MasterLayoutNavigationComponent extends Unsubscribable implements OnInit, AfterContentChecked {
	fullWidth: boolean;
	activeClass: string;
	currentScroll = 0;
	maxScroll = 0;
	@Input() links: ORNavigationLink[] = [];
	@HostBinding('class.navigation-scrollable') @HostBinding('class.navigation-scrollable-active') scrollable: boolean;
	private static readonly buttonWidth = 30;
	@ViewChild('container') private readonly container: ElementRef;
	private nav: HTMLElement;

	constructor(private readonly router: Router,
				private readonly masterLayout: MasterLayoutService,
				private readonly masterLayoutNavigation: MasterLayoutNavigationService,
				private readonly config: MasterLayoutConfig,
				private readonly renderer: Renderer2) {
		super();

		this.activeClass = this.config.navigation.activeClass;
		this.fullWidth = this.config.navigation.fullWidth;
		this.scrollable = this.config.navigation.scrollable;
		this.updateNavigationFullWidth();
		this.updateNavigationScrollable();
		this.masterLayoutNavigation.refreshed.pipe(takeUntil(this.unsubscribe)).subscribe(this.refresh.bind(this));
	}

	ngOnInit() {
		this.links = this.links.length ? this.links : this.config.navigation.links;
	}

	ngAfterContentChecked() {
		if (!this.nav) {
			this.nav = this.container.nativeElement.nextElementSibling;
		}
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

	@HostListener('window:resize')
	onResize() {
		this.masterLayoutNavigation.refresh();
	}

	private refresh() {
		if (this.nav) {
			let childWidth = 0;
			Array.from(this.nav.children).forEach((el: HTMLElement) => {
				childWidth += el.clientWidth;
			});
			this.maxScroll = Math.max(0, -(this.nav.clientWidth - childWidth - 2 * MasterLayoutNavigationComponent.buttonWidth));
		}
	}

	private updateScroll(delta: number): void {
		this.currentScroll += delta;
		this.currentScroll = Math.max(0, this.currentScroll);
		this.currentScroll = Math.min(this.currentScroll, this.maxScroll);
		this.renderer.setStyle(this.nav.children[0], 'margin-left', `-${this.currentScroll}px`);
	}

	private updateNavigationFullWidth(): void {
		this.masterLayout.navigationFullWidth = this.fullWidth;
		this.masterLayout.navigationFullWidthChanged.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.fullWidth = value;
		});
	}

	private updateNavigationScrollable(): void {
		this.masterLayout.navigationScrollable = this.scrollable;
		this.masterLayout.navigationScrollableChanged.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.scrollable = value;
			if (value) {
				this.masterLayoutNavigation.refresh();
			}
		});
	}
}
