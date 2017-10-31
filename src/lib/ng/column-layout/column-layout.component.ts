import {Component, Input, ViewChild} from '@angular/core';
import {ColumnPanelDirective} from "./column-panel.directive";

@Component({
	selector: 'or-column-layout',
	exportAs: 'orColumnLayout',
	template: `
		<div class="column-layout">
			<div class="column-left hidden-print" role="complementary"
				 #columnLeft="orColumnPanel" orColumnPanel *ngIf="left">
				<button type="button" class="column-toggle-left" orColumnToggle>
					<span class="sr-only">{{'i18n.oblique.column.left.toggle' | translate}}</span>
				</button>
				<div class="column-content">
					<ng-content select="[column-left-content]"></ng-content>
				</div>
			</div>
			<div class="column-main">
				<ng-content select="[column-main-content]"></ng-content>
			</div>
			<div class="column-right" role="complementary"
				 #columnRight="orColumnPanel" orColumnPanel *ngIf="right">
				<button type="button" class="column-toggle-right" orColumnToggle>
					<span class="sr-only">{{'i18n.oblique.column.right.toggle' | translate}}</span>
				</button>
				<div class="column-content">
					<ng-content select="[column-right-content]"></ng-content>
				</div>
			</div>
		</div>
	`
})
export class ColumnLayoutComponent {

	@ViewChild('columnLeft')
	private columnLeft: ColumnPanelDirective;

	@ViewChild('columnRight')
	private columnRight: ColumnPanelDirective;

	@Input()
	left = true;

	@Input()
	right = true;

	toggleLeft() {
		if (this.columnLeft) {
			this.columnLeft.toggle();
		}
	}

	toggleRight() {
		if(this.columnRight) {
			this.columnRight.toggle();
		}
	}
}
