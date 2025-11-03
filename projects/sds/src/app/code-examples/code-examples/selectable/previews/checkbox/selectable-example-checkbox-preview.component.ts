import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {ObSelectableModule} from '@oblique/oblique';

@Component({
	selector: 'app-selectable-example-checkbox-preview',
	imports: [CommonModule, ObSelectableModule],
	templateUrl: './selectable-example-checkbox-preview.component.html',
	styleUrl: '../selectable-example-preview.component.scss'
})
export class SelectableExampleCheckboxPreviewComponent {}
