import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {ObSelectableModule} from '@oblique/oblique';

@Component({
	selector: 'app-selectable-example-windows-preview',
	templateUrl: './selectable-example-windows-preview.component.html',
	styleUrl: '../selectable-example-preview.component.scss',
	imports: [CommonModule, ObSelectableModule]
})
export class SelectableExampleWindowsPreviewComponent {}
