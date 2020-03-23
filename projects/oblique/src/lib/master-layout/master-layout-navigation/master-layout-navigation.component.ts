import {AfterViewInit, Component, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2, ViewChild, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {filter, takeUntil} from 'rxjs/operators';

import {ObUnsubscribable} from '../../unsubscribe.class';
import {ObMasterLayoutService} from '../master-layout.service';
import {ObMasterLayoutConfig, ObEScrollMode} from '../master-layout.config';
import {ObIMasterLayoutEvent, ObEMasterLayoutEventValues} from '../master-layout.utility';

export interface ObINavigationLink {
	label: string;
	url: string;
	children?: ObINavigationLink[];
	id?: string;
}

@Component({
	selector: 'ob-master-layout-navigation',
	templateUrl: './master-layout-navigation.component.html',
	styleUrls: ['./master-layout-navigation.component.scss', './master-layout-navigation.component-scrollable.scss'],
	encapsulation: ViewEncapsulation.None,
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'application-navigation'}
})
export class ObMasterLayoutNavigationComponent extends ObUnsubscribable implements OnInit, AfterViewInit {
	isFullWidth = this.masterLayout.navigation.isFullWidth;
	activeClass = this.config.navigation.activeClass;
	currentScroll = 0;
	maxScroll = 0;
	@Input() links: ObINavigationLink[] = [];
	@HostBinding('class.navigation-scrollable') @HostBinding('class.navigation-scrollable-active') isScrollable: boolean;
	private static readonly buttonWidth = 30;
	private nav: HTMLElement;

	constructor(
		private readonly router: Router,
		private readonly masterLayout: ObMasterLayoutService,
		private readonly config: ObMasterLayoutConfig,
		private readonly renderer: Renderer2,
		private readonly el: ElementRef
	) {
		super();

		this.masterLayout.navigation.refreshed.pipe(takeUntil(this.unsubscribe)).subscribe(this.refresh.bind(this));
		this.propertyChanges();
	}

	ngOnInit() {
		this.links = this.links.length ? this.links : this.config.navigation.links;
	}

	ngAfterViewInit() {
		this.nav = this.el.nativeElement.querySelector('.main-nav:not(.sub-nav)');
		this.masterLayout.navigation.scrolled.pipe(takeUntil(this.unsubscribe)).subscribe((offset) => this.updateScroll(offset));
	}

	isActive(url: string): boolean {
		return this.router.isActive(url, false);
	}

	@HostListener('window:resize')
	onResize() {
		this.masterLayout.navigation.refresh();
	}

	@HostListener('window:keydown.escape') close(): void {
		this.masterLayout.layout.isMenuOpened = false;
	}

	scrollLeft(): void {
		this.masterLayout.navigation.scrollLeft();
	}

	scrollRight(): void {
		this.masterLayout.navigation.scrollRight();
	}

	private propertyChanges() {
		const events = [ObEMasterLayoutEventValues.SCROLLABLE, ObEMasterLayoutEventValues.FULL_WIDTH];
		this.masterLayout.navigation.configEvents.pipe(
			filter((evt: ObIMasterLayoutEvent) => events.includes(evt.name)),
			takeUntil(this.unsubscribe)
		).subscribe((event) => {
			switch (event.name) {
				case ObEMasterLayoutEventValues.SCROLLABLE:
					this.masterLayout.navigation.refresh();
					break;
				case ObEMasterLayoutEventValues.FULL_WIDTH:
					this.isFullWidth = event.value;
					break;
			}
		});
	}

	private refresh(): void {
		if (this.nav) {
			const scrollMode = this.masterLayout.navigation.scrollMode;
			if (scrollMode !== ObEScrollMode.DISABLED) {
				const childWidth = Array.from(this.nav.children).reduce((total, el: HTMLElement) => total + el.clientWidth, 0);
				this.maxScroll = Math.max(0, -(this.nav.clientWidth - childWidth - 2 * ObMasterLayoutNavigationComponent.buttonWidth));
				this.isScrollable = scrollMode === ObEScrollMode.ENABLED ? true : childWidth > this.nav.clientWidth;
			} else {
				this.isScrollable = false;
			}
			this.updateScroll(this.isScrollable ? 0 : -this.currentScroll);
		}
	}

	private updateScroll(delta: number): void {
		this.currentScroll += delta;
		this.currentScroll = Math.max(0, this.currentScroll);
		this.currentScroll = Math.min(this.currentScroll, this.maxScroll);
		this.renderer.setStyle(this.nav.children[0], 'margin-left', `-${this.currentScroll}px`);
	}
}
