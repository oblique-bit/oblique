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
	templateUrl: './expansion-panel-example-toggle-preview.component.html',
	imports: [MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle]
})
export class ExpansionPanelExampleTogglePreviewComponent {}
