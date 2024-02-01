import {Component} from '@angular/core';
import {
	MatAccordion,
	MatExpansionPanel,
	MatExpansionPanelDescription,
	MatExpansionPanelHeader,
	MatExpansionPanelTitle
} from '@angular/material/expansion';

@Component({
	selector: 'app-expansion-panel-example-other-options-preview',
	templateUrl: './expansion-panel-example-other-options-preview.component.html',
	imports: [MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle],
	standalone: true
})
export class ExpansionPanelExampleOtherOptionsPreviewComponent {}
