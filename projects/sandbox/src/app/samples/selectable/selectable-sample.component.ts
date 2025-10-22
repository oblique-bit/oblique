import {Component} from '@angular/core';

@Component({
	selector: 'sb-selectable-sample',
	standalone: false,
	templateUrl: './selectable-sample.component.html',
	styleUrl: './selectable-sample.component.scss'
})
export class SelectableSampleComponent {
	mode = 'checkbox';
	isDisabled = false;
}
