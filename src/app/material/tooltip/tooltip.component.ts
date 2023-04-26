import {Component} from '@angular/core';
import {TooltipPosition} from '@angular/material/tooltip';

@Component({
	selector: 'sc-tooltip',
	templateUrl: './tooltip.component.html',
	styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {
	message = 'Tooltip information text';
	positionOptions: TooltipPosition[];
	position: TooltipPosition;
	disabled = false;
	showDelay = 0;
	hideDelay = 0;

	private readonly TOOLTIP_POSITION_AFTER: TooltipPosition = 'after';
	private readonly TOOLTIP_POSITION_BEFORE: TooltipPosition = 'before';
	private readonly TOOLTIP_POSITION_ABOVE: TooltipPosition = 'above';
	private readonly TOOLTIP_POSITION_BELOW: TooltipPosition = 'below';
	private readonly TOOLTIP_POSITION_LEFT: TooltipPosition = 'left';
	private readonly TOOLTIP_POSITION_RIGHT: TooltipPosition = 'right';

	constructor() {
		this.positionOptions = [
			this.TOOLTIP_POSITION_AFTER,
			this.TOOLTIP_POSITION_BEFORE,
			this.TOOLTIP_POSITION_ABOVE,
			this.TOOLTIP_POSITION_BELOW,
			this.TOOLTIP_POSITION_LEFT,
			this.TOOLTIP_POSITION_RIGHT
		];
		this.position = this.positionOptions[0];
	}

	toggleDisabled(): void {
		this.disabled = !this.disabled;
	}

	toggleTooltip(tooltip): void {
		tooltip.toggle();
	}

	toggleShowDelay(): void {
		if (this.showDelay === 0) {
			this.showDelay = 1000;
		} else {
			this.showDelay = 0;
		}
	}

	toggleHideDelay(): void {
		if (this.hideDelay === 0) {
			this.hideDelay = 1000;
		} else {
			this.hideDelay = 0;
		}
	}
}
