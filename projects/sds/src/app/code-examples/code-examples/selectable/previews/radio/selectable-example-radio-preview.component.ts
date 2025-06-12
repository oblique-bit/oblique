import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {ObSelectableModule} from '@oblique/oblique';

@Component({
	selector: 'app-selectable-example-radio-preview',
	templateUrl: './selectable-example-radio-preview.component.html',
	styleUrl: '../selectable-example-preview.component.scss',
	imports: [CommonModule, ObSelectableModule]
})
export class SelectableExampleRadioPreviewComponent {}
