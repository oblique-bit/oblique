import {AfterViewInit, Component, ElementRef, Input, QueryList, Renderer2, ViewChild, ViewChildren, ViewEncapsulation} from '@angular/core';
import {filter} from 'rxjs/operators';
import {merge} from 'rxjs';
import {ColumnPanelDirective} from './column-panel.directive';
import {ScrollingEvents} from '../scrolling/scrolling-events';
import {MasterLayoutService} from '../master-layout/master-layout.service';
import {MasterLayoutEventValues} from '../master-layout/master-layout.utility';

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
	@ViewChild('columnLeft', {static: false}) private readonly columnLeft: ColumnPanelDirective;
	@ViewChild('columnRight', {static: false}) private readonly columnRight: ColumnPanelDirective;
	@ViewChildren('columnToggle') private readonly toggles: QueryList<ElementRef>;

	constructor(
		private readonly el: ElementRef,
		private readonly renderer: Renderer2,
		private readonly scroll: ScrollingEvents,
		private readonly master: MasterLayoutService
	) {
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

	private static visibleHeight(dimension: ClientRect): number {
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
		const middle = ColumnLayoutComponent.visibleHeight(dimension) / 2;
		const top = (this.master.layout.isFixed || window.innerHeight > dimension.height) ? '50%' : `${middle}px`;
		this.toggles.forEach(toggle => this.renderer.setStyle(toggle.nativeElement, 'top', top));
	}
}
