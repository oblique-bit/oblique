import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {ObSelectableModule} from '@oblique/oblique';

@Component({
	selector: 'app-selectable-example-radio-preview',
	imports: [CommonModule, ObSelectableModule],
	templateUrl: './selectable-example-radio-preview.component.html',
	styleUrl: '../selectable-example-preview.component.scss',
})
export class SelectableExampleRadioPreviewComponent {}
