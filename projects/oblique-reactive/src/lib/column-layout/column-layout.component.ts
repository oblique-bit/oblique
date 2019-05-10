import {Component, Input, ViewChild} from '@angular/core';
import {ColumnPanelDirective} from './column-panel.directive';

@Component({
	selector: 'or-column-layout',
	exportAs: 'orColumnLayout',
	templateUrl: './column-layout.component.html',
	styleUrls: ['./column-layout.component.scss']
})
export class ColumnLayoutComponent {

	@Input()
	left = true;

	@Input()
	right = true;

	@ViewChild('columnLeft', { static: false })
	private readonly columnLeft: ColumnPanelDirective;

	@ViewChild('columnRight', { static: false })
	private readonly columnRight: ColumnPanelDirective;

	toggleLeft() {
		if (this.columnLeft) {
			this.columnLeft.toggle();
		}
	}

	toggleRight() {
		if (this.columnRight) {
			this.columnRight.toggle();
		}
	}
}
