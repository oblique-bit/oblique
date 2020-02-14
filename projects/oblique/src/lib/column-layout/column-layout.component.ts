import {
	AfterViewInit,
	Component,
	ElementRef,
	HostBinding,
	Inject,
	Input,
	QueryList,
	Renderer2,
	ViewChild,
	ViewChildren,
	ViewEncapsulation
} from '@angular/core';
import {filter} from 'rxjs/operators';
import {merge} from 'rxjs';
import {ColumnPanelDirective} from './column-panel.directive';
import {ScrollingEvents} from '../scrolling/scrolling-events';
import {MasterLayoutService} from '../master-layout/master-layout.service';
import {MasterLayoutEventValues} from '../master-layout/master-layout.utility';
import {WINDOW} from '../utilities';

@Component({
	selector: 'or-column-layout',
	exportAs: 'orColumnLayout',
	templateUrl: './column-layout.component.html',
	styleUrls: ['./column-layout.component.scss'],
	encapsulation: ViewEncapsulation.None,
	// tslint:disable-next-line:no-host-metadata-property
	host: {class: 'column-layout'}
})
export class ColumnLayoutComponent implements AfterViewInit {
	@Input() left = true;
	@Input() right = true;
	@Input() @HostBinding('class.no-layout') noLayout = false;
	@ViewChild('columnLeft') private readonly columnLeft: ColumnPanelDirective;
	@ViewChild('columnRight') private readonly columnRight: ColumnPanelDirective;
	@ViewChildren('columnToggle') private readonly toggles: QueryList<ElementRef>;
	private readonly window: Window;

	constructor(
		private readonly el: ElementRef,
		private readonly renderer: Renderer2,
		private readonly scroll: ScrollingEvents,
		private readonly master: MasterLayoutService,
		@Inject(WINDOW) window
	) {
		this.window = window; // because AoT don't accept interfaces as DI
	}

	ngAfterViewInit() {
		merge(
			this.scroll.scrolled.pipe(filter(() => !this.master.layout.isFixed)),
			this.master.layout.configEvents.pipe(filter(evt => evt.name === MasterLayoutEventValues.FIXED))
		).subscribe(() => this.center());
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

	private static visibleHeight(dimension: ClientRect, window: Window): number {
		if (dimension.top < 0 && dimension.top + dimension.height > window.innerHeight) {
			return window.innerHeight;
		} else if (dimension.top < 0) {
			return dimension.height - dimension.top;
		} else {
			return window.innerHeight - dimension.top;
		}
	}

	private center(): void {
		const dimension = this.el.nativeElement.getBoundingClientRect();
		const middle = ColumnLayoutComponent.visibleHeight(dimension, this.window) / 2;
		const top = (this.master.layout.isFixed || this.window.innerHeight > dimension.height) ? '50%' : `${middle}px`;
		this.toggles.forEach(toggle => this.renderer.setStyle(toggle.nativeElement, 'top', top));
	}
}
