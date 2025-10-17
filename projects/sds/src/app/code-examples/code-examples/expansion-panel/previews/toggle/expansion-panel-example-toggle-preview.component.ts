import {Component} from '@angular/core';
import {
	MatAccordion,
	MatExpansionPanel,
	MatExpansionPanelDescription,
	MatExpansionPanelHeader,
	MatExpansionPanelTitle
} from '@angular/material/expansion';

@Component({
	selector: 'app-expansion-panel-example-toggle-preview',
	imports: [MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle],
	templateUrl: './expansion-panel-example-toggle-preview.component.html'
})
export class ExpansionPanelExampleTogglePreviewComponent {}
