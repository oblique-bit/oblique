import {Component} from '@angular/core';

@Component({
	selector: 'sb-button-sample',
	standalone: false,
	templateUrl: './button.component.html',
})
export class ButtonSampleComponent {
	obButton: 'primary' | 'secondary' | 'tertiary' = 'primary';
}
