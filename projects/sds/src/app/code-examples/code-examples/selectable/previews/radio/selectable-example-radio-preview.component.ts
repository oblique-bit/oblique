import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ObSelectableModule} from '@oblique/oblique';

@Component({
	selector: 'app-selectable-example-radio-preview',
	imports: [ObSelectableModule, AsyncPipe],
	templateUrl: './selectable-example-radio-preview.component.html',
	styleUrl: '../selectable-example-preview.component.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class SelectableExampleRadioPreviewComponent {}
