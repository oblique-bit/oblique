import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {ObSelectableModule} from '@oblique/oblique';

@Component({
	selector: 'app-selectable-example-radio-preview',
	templateUrl: './selectable-example-radio-preview.component.html',
	styleUrls: ['../selectable-example-preview.component.scss'],
	standalone: true,
	imports: [CommonModule, ObSelectableModule]
})
export class SelectableExampleRadioPreviewComponent {}
