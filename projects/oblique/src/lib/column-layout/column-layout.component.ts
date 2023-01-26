import {
	AfterViewInit,
	Component,
	ElementRef,
	HostBinding,
	Inject,
	Input,
	OnDestroy,
	QueryList,
	Renderer2,
	ViewChild,
	ViewChildren,
	ViewEncapsulation
} from '@angular/core';
import {combineLatestWith, delay, map, startWith, takeUntil} from 'rxjs/operators';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {ObColumnPanelDirective} from './column-panel.directive';
import {ObScrollingEvents} from '../scrolling/scrolling-events';
import {WINDOW} from '../utilities';
import {ObIToggleDirection} from './column-layout.model';

@Component({
	selector: 'ob-column-layout',
	exportAs: 'obColumnLayout',
	templateUrl: './column-layout.component.html',
	styleUrls: ['./column-layout.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-column-layout'}
})
export class ObColumnLayoutComponent implements AfterViewInit, OnDestroy {
	@Input() left = true;
	@Input() right = true;
	@Input() @HostBinding('class.ob-wider-columns') wider = false;
	@Input() @HostBinding('class.ob-no-layout') noLayout = false;
	toggleLeftIcon$: Observable<ObIToggleDirection>;
	toggleRightIcon$: Observable<ObIToggleDirection>;
	@ViewChild('columnLeft') private readonly columnLeft: ObColumnPanelDirective;
	@ViewChild('columnRight') private readonly columnRight: ObColumnPanelDirective;
	@ViewChildren('columnToggle') private readonly toggles: QueryList<ElementRef>;

	private readonly unsubscribe = new Subject<void>();
	private observer: ResizeObserver;

	constructor(
		private readonly el: ElementRef<HTMLElement>,
		private readonly renderer: Renderer2,
		private readonly scroll: ObScrollingEvents,
		@Inject(WINDOW) private readonly window: Window
	) {}

	ngAfterViewInit(): void {
		this.scroll.scrolled
			.pipe(
				map(() => this.el.nativeElement.getBoundingClientRect()),
				combineLatestWith(this.getHeaderHeightObservable()),
				map(([dimension, headerHeight]) => ({
					top: dimension.top,
					height: dimension.height,
					windowHeight: this.window.innerHeight,
					headerHeight
				})),
				takeUntil(this.unsubscribe)
			)
			.subscribe(dimension => this.center(dimension));
		this.toggleLeftIcon$ = this.getToggleDirection(this.columnLeft, 'left', 'right');
		this.toggleRightIcon$ = this.getToggleDirection(this.columnRight, 'right', 'left');
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.observer.disconnect();
	}

	toggleLeft(): void {
		if (this.columnLeft) {
			this.columnLeft.toggle();
		}
	}

	toggleRight(): void {
		if (this.columnRight) {
			this.columnRight.toggle();
		}
	}

	private getToggleDirection(
		column: ObColumnPanelDirective,
		expandedDirection: ObIToggleDirection,
		collapsedDirection: ObIToggleDirection
	): Observable<ObIToggleDirection> {
		return column?.toggled?.pipe(
			startWith(false),
			delay(0),
			map(collapsed => (collapsed ? collapsedDirection : expandedDirection))
		);
	}

	// this is hacky, the correct way would be that the master layout exposes an observable with the header height
	private getHeaderHeightObservable(): Observable<number> {
		// this ensures a value is emitted even when the master layout isn't there
		const headerHeight$ = new BehaviorSubject<number>(0);
		this.observer = new ResizeObserver(entries => headerHeight$.next(entries[0].contentRect.height));
		this.observer.observe(this.getMasterLayout(this.el.nativeElement.parentElement).querySelector('.ob-master-layout-header'));

		return headerHeight$;
	}

	private getMasterLayout(element: HTMLElement): HTMLElement {
		if (element.nodeName !== 'OB-MASTER-LAYOUT' && element.parentElement) {
			return this.getMasterLayout(element.parentElement);
		}

		return element;
	}

	private center(dimension: {top: number; height: number; windowHeight: number; headerHeight: number}): void {
		// Math.min(Math.max(...)) simply contains the computation between 2 values
		const top = Math.min(Math.max(0, dimension.headerHeight - dimension.top), dimension.windowHeight - dimension.top);
		const bottom = Math.min(dimension.windowHeight - dimension.top, dimension.height);
		if (bottom > top) {
			this.toggles.forEach(toggle => this.renderer.setStyle(toggle.nativeElement, 'top', `${(bottom + top) / 2}px`));
		}
	}
}
