import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {ObSelectableModule} from '@oblique/oblique';

@Component({
	selector: 'app-selectable-example-windows-preview',
	templateUrl: './selectable-example-windows-preview.component.html',
	styleUrls: ['../selectable-example-preview.component.scss'],
	standalone: true,
	imports: [CommonModule, ObSelectableModule]
})
export class SelectableExampleWindowsPreviewComponent {}
