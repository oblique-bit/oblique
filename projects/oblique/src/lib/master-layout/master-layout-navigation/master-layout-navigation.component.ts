import {AfterViewInit, Component, ElementRef, HostBinding, HostListener, Inject, Input, OnInit, Renderer2, ViewChild, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {filter, takeUntil} from 'rxjs/operators';

import {Unsubscribable} from '../../unsubscribe.class';
import {MasterLayoutService} from '../master-layout.service';
import {MasterLayoutConfig, ScrollMode} from '../master-layout.config';
import {MasterLayoutEvent, MasterLayoutEventValues} from '../master-layout.utility';

export interface ORNavigationLink {
	label: string;
	url: string;
	children?: ORNavigationLink[];
	id?: string;
}

@Component({
	selector: 'or-master-layout-navigation',
	templateUrl: './master-layout-navigation.component.html',
	styleUrls: ['./master-layout-navigation.component.scss', './master-layout-navigation.component-scrollable.scss'],
	encapsulation: ViewEncapsulation.None,
	// tslint:disable-next-line:no-host-metadata-property
	host: {class: 'application-navigation'}
})
export class MasterLayoutNavigationComponent extends Unsubscribable implements OnInit, AfterViewInit {
	isFullWidth = this.masterLayout.navigation.isFullWidth;
	activeClass = this.config.navigation.activeClass;
	currentScroll = 0;
	maxScroll = 0;
	@Input() links: ORNavigationLink[] = [];
	@HostBinding('class.navigation-scrollable') @HostBinding('class.navigation-scrollable-active') isScrollable: boolean;
	private static readonly buttonWidth = 30;
	@ViewChild('container') private readonly container: ElementRef;
	private nav: HTMLElement;

	constructor(private readonly router: Router,
				private readonly masterLayout: MasterLayoutService,
				private readonly config: MasterLayoutConfig,
				private readonly renderer: Renderer2
	) {
		super();

		this.masterLayout.navigation.refreshed.pipe(takeUntil(this.unsubscribe)).subscribe(this.refresh.bind(this));
		this.propertyChanges();
	}

	ngOnInit() {
		this.links = this.links.length ? this.links : this.config.navigation.links;
	}

	ngAfterViewInit() {
		if (!this.nav) {
			this.nav = this.container.nativeElement.previousElementSibling;
			this.masterLayout.navigation.scrolled.pipe(takeUntil(this.unsubscribe)).subscribe((offset) => this.updateScroll(offset));
		}
	}

	isActive(url: string): boolean {
		return this.router.isActive(url, false);
	}

	@HostListener('window:resize')
	onResize() {
		console.log('resize');
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
		const events = [MasterLayoutEventValues.SCROLLABLE, MasterLayoutEventValues.FULL_WIDTH];
		this.masterLayout.navigation.configEvents.pipe(
			filter((evt: MasterLayoutEvent) => events.includes(evt.name)),
			takeUntil(this.unsubscribe)
		).subscribe((event) => {
			switch (event.name) {
				case MasterLayoutEventValues.SCROLLABLE:
					this.masterLayout.navigation.refresh();
					break;
				case MasterLayoutEventValues.FULL_WIDTH:
					this.isFullWidth = event.value;
					break;
			}
		});
	}

	private refresh(): void {
		const scrollMode = this.masterLayout.navigation.scrollMode;
		if (this.nav && scrollMode !== ScrollMode.DISABLED) {
			const childWidth = Array.from(this.nav.children).reduce((total, el: HTMLElement) => total + el.clientWidth, 0);
			this.maxScroll = Math.max(0, -(this.nav.clientWidth - childWidth - 2 * MasterLayoutNavigationComponent.buttonWidth));
			this.isScrollable = scrollMode === ScrollMode.ENABLED ? true : childWidth > this.nav.clientWidth;
		} else {
			this.isScrollable = false;
		}
		this.updateScroll(this.isScrollable ? 0 : -this.currentScroll);
	}

	private updateScroll(delta: number): void {
		this.currentScroll += delta;
		this.currentScroll = Math.max(0, this.currentScroll);
		this.currentScroll = Math.min(this.currentScroll, this.maxScroll);
		this.renderer.setStyle(this.nav.children[0], 'margin-left', `-${this.currentScroll}px`);
	}
}
