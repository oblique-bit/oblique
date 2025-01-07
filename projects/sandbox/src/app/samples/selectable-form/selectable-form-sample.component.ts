import {Component, OnInit, inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
	selector: 'sb-selectable-form-sample',
	templateUrl: './selectable-form-sample.component.html',
	styleUrls: ['./selectable-form-sample.component.scss'],
	standalone: false
})
export class SelectableFormSampleComponent implements OnInit {
	mode = 'checkbox';
	sampleForm: FormGroup<{sampleCreatures: FormControl<string[]>}>;
	private readonly formBuilder = inject(FormBuilder);

	ngOnInit(): void {
		this.sampleForm = this.formBuilder.group({
			sampleCreatures: [['cat', 'dog']]
		});
	}

	setDisabled(isDisabled: boolean): void {
		if (isDisabled) {
			this.sampleForm.get('sampleCreatures').disable();
		} else {
			this.sampleForm.get('sampleCreatures').enable();
		}
	}
}
