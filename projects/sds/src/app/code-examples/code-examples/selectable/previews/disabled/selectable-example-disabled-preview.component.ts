import {AsyncPipe} from '@angular/common';
import {Component} from '@angular/core';
import {ObSelectableModule} from '@oblique/oblique';

@Component({
	selector: 'app-selectable-example-disabled-preview',
	imports: [AsyncPipe, ObSelectableModule],
	templateUrl: './selectable-example-disabled-preview.component.html',
	styleUrl: '../selectable-example-preview.component.scss',
})
export class SelectableExampleDisabledPreviewComponent {}
