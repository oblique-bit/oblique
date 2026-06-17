import {ChangeDetectorRef, ElementRef, Renderer2, inject} from '@angular/core';
import {filter, takeUntil} from 'rxjs/operators';
import {ObEMasterLayoutEventValues, ObEScrollMode, ObIMasterLayoutEvent} from '../master-layout.model';
import {ObMasterLayoutService} from '../master-layout.service';
import {Subject} from 'rxjs';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObGlobalEventsService} from '../../global-events/global-events.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

export class MasterLayoutNavigationComponentBase {
	isFullWidth: boolean;
	activeClass: string;

	protected readonly masterLayout = inject(ObMasterLayoutService);
	protected readonly unsubscribe: Subject<void> = new Subject<void>();
	protected isScrollable: boolean;
	protected readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

	protected currentScroll = 0;
	protected maxScroll = 0;

	private static readonly buttonWidth = 40; // $ob-navigation-scrollable-padding
	private readonly globalEventsService = inject(ObGlobalEventsService);
	private readonly config = inject(ObMasterLayoutConfig);
	private readonly renderer = inject(Renderer2);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	constructor() {
		this.isFullWidth = this.masterLayout.navigation.isFullWidth;
		this.activeClass = this.config.navigation.activeClass;

		this.masterLayout.navigation.refreshed.pipe(takeUntil(this.unsubscribe)).subscribe(this.refresh.bind(this));

		this.scrollModeChange();
		this.fullWidthChange();

		this.preventBrowserFocusOnLastItem();
	}

	close(): void {
		this.masterLayout.layout.isMenuOpened = false;
	}

	scrollLeft(): void {
		this.masterLayout.navigation.scrollLeft();
	}

	scrollRight(): void {
		this.masterLayout.navigation.scrollRight();
	}

	protected closeOnEscape(): void {
		this.globalEventsService.keyUp$
			.pipe(
				filter(event => event.key === 'Escape'),
				takeUntil(this.unsubscribe)
			)
			.subscribe(() => this.close());
	}

	protected getNav(): Element {
		return this.el.nativeElement.querySelector('.ob-main-nav:not(.ob-sub-nav)');
	}

	protected updateScroll(delta: number): void {
		const nav = this.getNav();
		this.currentScroll += delta;
		this.currentScroll = Math.max(0, this.currentScroll);
		this.currentScroll = Math.min(this.currentScroll, this.maxScroll);
		this.renderer.setStyle(nav.children[0], 'margin-left', `-${this.currentScroll}px`);
	}

	private scrollModeChange(): void {
		this.masterLayout.navigation.configEvents$
			.pipe(filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.NAVIGATION_SCROLL_MODE))
			.subscribe(() => this.masterLayout.navigation.refresh());
	}

	private fullWidthChange(): void {
		this.masterLayout.navigation.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.NAVIGATION_IS_FULL_WIDTH),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => {
				this.isFullWidth = event.value;
			});
	}

	private refresh(): void {
		const nav = this.getNav();
		if (nav) {
			const {scrollMode} = this.masterLayout.navigation;
			if (scrollMode === ObEScrollMode.DISABLED) {
				this.isScrollable = false;
			} else {
				const childWidth = Array.from(nav.children).reduce((total, el: HTMLElement) => total + el.clientWidth, 0);
				this.maxScroll = Math.max(
					0,
					-(nav.clientWidth - childWidth - 2 * MasterLayoutNavigationComponentBase.buttonWidth)
				);
				this.isScrollable = scrollMode === ObEScrollMode.ENABLED ? true : childWidth > nav.clientWidth;
			}
			this.updateScroll(this.isScrollable ? 0 : -this.currentScroll);
			this.changeDetectorRef.markForCheck();
		}
	}

	/**
	 * Prevents the browser from automatically scrolling the last navigation item into view
	 * when focus moves back from an element after the navigation using Shift+Tab.
	 *
	 * By default, the browser pulls the last item into view, breaking the scrollable
	 * navigation's position. This function prevents the default browser behavior, and manually focuses
	 * the last navigation item without triggering any native scroll.
	 *
	 * The actual scroll animation is triggered separately by `toggleFocus`
	 */
	private preventBrowserFocusOnLastItem(): void {
		inject(ObGlobalEventsService)
			.keyDown$.pipe(
				takeUntilDestroyed(),
				filter(
					event =>
						event.code === 'Tab' &&
						event.shiftKey === true &&
						(event.target as HTMLElement).id === 'ob-navigation-scrollable-control-right'
				)
			)
			.subscribe(event => {
				event.preventDefault();
				// If there is no nav or the nav is empty, then no event is triggered
				(this.getNav().lastElementChild.firstElementChild as HTMLElement).focus({preventScroll: true});
			});
	}
}
