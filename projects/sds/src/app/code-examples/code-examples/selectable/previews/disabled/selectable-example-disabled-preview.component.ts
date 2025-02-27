import {AsyncPipe, NgFor} from '@angular/common';
import {Component} from '@angular/core';
import {ObSelectableModule} from '@oblique/oblique';

@Component({
	selector: 'app-selectable-example-disabled-preview',
	templateUrl: './selectable-example-disabled-preview.component.html',
	styleUrls: ['../selectable-example-preview.component.scss'],
	imports: [AsyncPipe, NgFor, ObSelectableModule]
})
export class SelectableExampleDisabledPreviewComponent {}
