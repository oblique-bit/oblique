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
import {delay, map, mergeMap, startWith, takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
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

	constructor(
		private readonly el: ElementRef<HTMLElement>,
		private readonly renderer: Renderer2,
		private readonly scroll: ObScrollingEvents,
		@Inject(WINDOW) private readonly window: Window
	) {}

	ngAfterViewInit(): void {
		this.toggles.changes
			.pipe(
				mergeMap(() => this.scroll.scrolled),
				takeUntil(this.unsubscribe)
			)
			.subscribe(() => this.center());
		this.toggleLeftIcon$ = this.getToggleDirection(this.columnLeft, 'left', 'right');
		this.toggleRightIcon$ = this.getToggleDirection(this.columnRight, 'right', 'left');
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
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

	private static visibleHeight(dimension: DOMRect, window: Window): number {
		if (dimension.top < 0 && dimension.top + dimension.height > window.innerHeight) {
			return window.innerHeight;
		} else if (dimension.top < 0) {
			return dimension.height - dimension.top;
		}
		return window.innerHeight - dimension.top;
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

	private center(): void {
		const dimension: DOMRect = this.el.nativeElement.getBoundingClientRect();
		const middle = ObColumnLayoutComponent.visibleHeight(dimension, this.window) / 2;
		const top = this.window.innerHeight > dimension.height ? '50%' : `${middle}px`;
		this.toggles.forEach(toggle => this.renderer.setStyle(toggle.nativeElement, 'top', top));
	}
}
