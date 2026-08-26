import {ChangeDetectorRef, DestroyRef, ElementRef, Renderer2, WritableSignal, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {filter} from 'rxjs/operators';
import {ObEMasterLayoutEventValues, ObEScrollMode, ObIMasterLayoutEvent} from '../master-layout.model';
import {ObMasterLayoutService} from '../master-layout.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObGlobalEventsService} from '../../global-events/global-events.service';

export class MasterLayoutNavigationComponentBase {
	readonly isFullWidth: WritableSignal<boolean>;
	activeClass: string;

	protected readonly masterLayout = inject(ObMasterLayoutService);
	protected readonly destroyRef = inject(DestroyRef);
	protected readonly isScrollable = signal(false);
	protected readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

	protected readonly currentScroll = signal(0);
	protected readonly maxScroll = signal(0);

	private static readonly buttonWidth = 40; // $ob-navigation-scrollable-padding
	private readonly globalEventsService = inject(ObGlobalEventsService);
	private readonly config = inject(ObMasterLayoutConfig);
	private readonly renderer = inject(Renderer2);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	constructor() {
		this.isFullWidth = signal(this.masterLayout.navigation.isFullWidth);
		this.activeClass = this.config.navigation.activeClass;

		this.masterLayout.navigation.refreshed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(this.refresh.bind(this));

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
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe(() => this.close());
	}

	protected getNav(): HTMLElement | null {
		return this.el.nativeElement.querySelector<HTMLElement>('.ob-main-nav:not(.ob-sub-nav)');
	}

	protected updateScroll(delta: number): void {
		const nav = this.getNav();
		const firstChild = nav?.firstElementChild;
		if (!firstChild) {
			return;
		}
		this.currentScroll.update(scroll => Math.min(Math.max(0, scroll + delta), this.maxScroll()));
		this.renderer.setStyle(firstChild, 'margin-left', `-${this.currentScroll()}px`);
	}

	private scrollModeChange(): void {
		this.masterLayout.navigation.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.NAVIGATION_SCROLL_MODE),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe(() => this.masterLayout.navigation.refresh());
	}

	private fullWidthChange(): void {
		this.masterLayout.navigation.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.NAVIGATION_IS_FULL_WIDTH),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe(event => {
				if (event.value !== undefined) {
					this.isFullWidth.set(event.value);
				}
			});
	}

	private refresh(): void {
		const nav = this.getNav();
		if (nav) {
			const {scrollMode} = this.masterLayout.navigation;
			if (scrollMode === ObEScrollMode.DISABLED) {
				this.isScrollable.set(false);
			} else {
				const childWidth = Array.from(nav.children).reduce(
					(total, element) => total + (element as HTMLElement).clientWidth,
					0
				);
				this.maxScroll.set(
					Math.max(0, -(nav.clientWidth - childWidth - 2 * MasterLayoutNavigationComponentBase.buttonWidth))
				);
				this.isScrollable.set(scrollMode === ObEScrollMode.ENABLED ? true : childWidth > nav.clientWidth);
			}
			this.updateScroll(this.isScrollable() ? 0 : -this.currentScroll());
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
				takeUntilDestroyed(this.destroyRef),
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
				const lastNavigationLink = this.getNav()?.lastElementChild?.firstElementChild;
				if (lastNavigationLink instanceof HTMLElement) {
					lastNavigationLink.focus({preventScroll: true});
				}
			});
	}
}
