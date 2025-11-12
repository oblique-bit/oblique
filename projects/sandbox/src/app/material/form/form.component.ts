import {Component} from '@angular/core';

@Component({
	selector: 'sb-form',
	standalone: false,
	templateUrl: './form.component.html',
})
export class FormComponent {
	size = '';
	inline = false;
	disabled = false;
	longLabels = false;
	labelText = 'Some text for the label ';
	labelRepeater = 1;
	longLabelsForm = {
		field1: '',
		field2: '',
		field3: '',
		field4: '',
		field5: '',
		field6: '',
		field7: '',
		field8: '',
		field9: '',
		field10: '',
	};
	toggleLabelsRepeater(): void {
		this.labelRepeater = this.labelRepeater === 1 ? 8 : 1;
	}
}
