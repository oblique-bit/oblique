import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {ObSelectableModule} from '@oblique/oblique';

@Component({
	selector: 'app-selectable-example-checkbox-preview',
	templateUrl: './selectable-example-checkbox-preview.component.html',
	styleUrls: ['../selectable-example-preview.component.scss'],
	imports: [CommonModule, ObSelectableModule]
})
export class SelectableExampleCheckboxPreviewComponent {}
