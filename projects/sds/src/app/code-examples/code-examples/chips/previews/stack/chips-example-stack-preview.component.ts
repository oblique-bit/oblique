import {Component} from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';
import {CommonModule} from '@angular/common';

export interface ChipColor {
	name: string;
	color: string;
}

@Component({
	selector: 'app-chips-example-stack-color-preview',
	imports: [CommonModule, MatChipsModule],
	templateUrl: './chips-example-stack-preview.component.html',
	styleUrl: './chips-example-stack-preview.component.scss',
})
export class ChipsExampleStackPreviewComponent {
	availableColors: ChipColor[] = [
		{name: 'Default', color: 'default'},
		{name: 'Info', color: 'info'},
		{name: 'Success', color: 'success'},
		{name: 'Error', color: 'error'},
		{name: 'Warning', color: 'warning'},
	];
}
