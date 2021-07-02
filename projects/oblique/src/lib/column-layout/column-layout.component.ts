import {
	AfterViewInit,
	Component,
	ElementRef,
	HostBinding,
	Inject,
	Input,
	Optional,
	QueryList,
	Renderer2,
	ViewChild,
	ViewChildren,
	ViewEncapsulation
} from '@angular/core';
import {delay, filter, map, startWith} from 'rxjs/operators';
import {merge, Observable} from 'rxjs';
import {ObColumnPanelDirective} from './column-panel.directive';
import {ObScrollingEvents} from '../scrolling/scrolling-events';
import {ObMasterLayoutService} from '../master-layout/master-layout.service';
import {WINDOW} from '../utilities';
import {ObEMasterLayoutEventValues} from '../master-layout/master-layout.model';
import {ObIToggleDirection} from './column-layout.model';
import {ObUseObliqueIcons} from '../icon/icon.model';

@Component({
	selector: 'ob-column-layout',
	exportAs: 'obColumnLayout',
	templateUrl: './column-layout.component.html',
	styleUrls: ['./column-layout.component.scss'],
	encapsulation: ViewEncapsulation.None,
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-column-layout'}
})
export class ObColumnLayoutComponent implements AfterViewInit {
	@Input() left = true;
	@Input() right = true;
	@Input() @HostBinding('class.ob-wider-columns') wider = false;
	@Input() @HostBinding('class.ob-no-layout') noLayout = false;
	toggleLeftIcon$: Observable<ObIToggleDirection>;
	toggleRightIcon$: Observable<ObIToggleDirection>;
	@ViewChild('columnLeft') private readonly columnLeft: ObColumnPanelDirective;
	@ViewChild('columnRight') private readonly columnRight: ObColumnPanelDirective;
	@ViewChildren('columnToggle') private readonly toggles: QueryList<ElementRef>;
	private readonly window: Window;

	@HostBinding('class.ob-font-awesome') useFontAwesomeIcon: boolean;

	constructor(
		private readonly el: ElementRef,
		private readonly renderer: Renderer2,
		private readonly scroll: ObScrollingEvents,
		private readonly master: ObMasterLayoutService,
		@Inject(WINDOW) window,
		@Optional() @Inject(ObUseObliqueIcons) useObliqueIcon
	) {
		this.window = window; // because AoT don't accept interfaces as DI
		this.useFontAwesomeIcon = !useObliqueIcon;
	}

	private static visibleHeight(dimension: ClientRect, window: Window): number {
		if (dimension.top < 0 && dimension.top + dimension.height > window.innerHeight) {
			return window.innerHeight;
		} else if (dimension.top < 0) {
			return dimension.height - dimension.top;
		} else {
			return window.innerHeight - dimension.top;
		}
	}

	ngAfterViewInit() {
		merge(
			this.scroll.scrolled.pipe(filter(() => !this.master.layout.isFixed)),
			this.master.layout.configEvents.pipe(filter(evt => evt.name === ObEMasterLayoutEventValues.FIXED))
		).subscribe(() => this.center());

		this.toggleLeftIcon$ = this.getToggleDirection(this.columnLeft, 'left', 'right');
		this.toggleRightIcon$ = this.getToggleDirection(this.columnRight, 'right', 'left');
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
		if (column?.toggled) {
			return column.toggled.pipe(
				startWith(false),
				delay(0),
				map(collapsed => (collapsed ? collapsedDirection : expandedDirection))
			);
		}
	}

	private center(): void {
		const dimension = this.el.nativeElement.getBoundingClientRect();
		const middle = ObColumnLayoutComponent.visibleHeight(dimension, this.window) / 2;
		const top = this.master.layout.isFixed || this.window.innerHeight > dimension.height ? '50%' : `${middle}px`;
		this.toggles.forEach(toggle => this.renderer.setStyle(toggle.nativeElement, 'top', top));
	}
}
