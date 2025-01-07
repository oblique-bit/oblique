import {Component} from '@angular/core';

@Component({
	selector: 'sb-selectable-sample',
	templateUrl: './selectable-sample.component.html',
	styleUrls: ['./selectable-sample.component.scss'],
	standalone: false
})
export class SelectableSampleComponent {
	mode = 'checkbox';
	isDisabled = false;
}
