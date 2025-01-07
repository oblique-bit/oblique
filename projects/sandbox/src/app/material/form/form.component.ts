import {Component} from '@angular/core';

@Component({
	selector: 'sb-form',
	templateUrl: './form.component.html',
	standalone: false
})
export class FormComponent {
	size = '';
	inline = false;
	disabled = false;
}
