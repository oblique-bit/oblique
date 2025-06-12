import {AsyncPipe} from '@angular/common';
import {Component} from '@angular/core';
import {ObSelectableModule} from '@oblique/oblique';

@Component({
	selector: 'app-selectable-example-disabled-preview',
	templateUrl: './selectable-example-disabled-preview.component.html',
	styleUrl: '../selectable-example-preview.component.scss',
	imports: [AsyncPipe, ObSelectableModule]
})
export class SelectableExampleDisabledPreviewComponent {}
