import {Component} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';
import {MatChipsModule} from '@angular/material/chips';
import {CommonModule} from '@angular/common';

export interface ChipColor {
	name: string;
	color: string;
}

@Component({
	standalone: true,
	selector: 'app-chips-example-stack-color-preview',
	imports: [CommonModule, MatChipsModule],
	templateUrl: './chips-example-stack-preview.component.html',
	styleUrls: ['./chips-example-stack-preview.component.scss']
})
export class ChipsExampleStackPreviewComponent implements PreviewComponent {
	availableColors: ChipColor[] = [
		{name: 'Default', color: 'default'},
		{name: 'Info', color: 'info'},
		{name: 'Success', color: 'success'},
		{name: 'Error', color: 'error'},
		{name: 'Warning', color: 'warning'}
	];
}
