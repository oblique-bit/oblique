import {Component} from '@angular/core';

@Component({
	selector: 'sc-button-sample',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss']
})
export class ButtonSampleComponent {
	obButton: 'primary' | 'secondary' | 'tertiary' = 'primary';
}
