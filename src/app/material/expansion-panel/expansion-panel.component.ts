import {Component} from '@angular/core';
import {MatAccordionDisplayMode, MatAccordionTogglePosition} from '@angular/material/expansion';

@Component({
	selector: 'or-expansion-panel',
	templateUrl: './expansion-panel.component.html'
})
export class ExpansionPanelComponent {
	panelOpenState = false;
	multi = false;
	actionRowVisible = false;
	toggleVisible = true;
	togglePositions: MatAccordionTogglePosition[];
	togglePosition: MatAccordionTogglePosition;
	displayModes: MatAccordionDisplayMode[];
	displayMode: MatAccordionDisplayMode;

	private readonly POSITION_BEFORE: MatAccordionTogglePosition = 'before';
	private readonly POSITION_AFTER: MatAccordionTogglePosition = 'after';
	private readonly DISPLAY_MODE_DEFAULT: MatAccordionDisplayMode = 'default';
	private readonly DISPLAY_MODE_FLAT: MatAccordionDisplayMode = 'flat';

	constructor() {
		this.togglePositions = [this.POSITION_AFTER, this.POSITION_BEFORE];
		this.togglePosition = this.togglePositions[0];
		this.displayModes = [this.DISPLAY_MODE_DEFAULT, this.DISPLAY_MODE_FLAT];
		this.displayMode = this.displayModes[0];
	}

	toggleAccordionMultiAttribute(): void {
		this.multi = !this.multi;
	}

	toggleActionRowVisibility(): void {
		this.actionRowVisible = !this.actionRowVisible;
	}

	toggleToggleVisibility(): void {
		this.toggleVisible = !this.toggleVisible;
	}
}
