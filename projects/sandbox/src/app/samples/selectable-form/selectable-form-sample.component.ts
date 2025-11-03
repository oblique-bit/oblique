import {Component, type OnInit, inject} from '@angular/core';
import {FormBuilder, type FormControl, type FormGroup} from '@angular/forms';

@Component({
	selector: 'sb-selectable-form-sample',
	standalone: false,
	templateUrl: './selectable-form-sample.component.html',
	styleUrl: './selectable-form-sample.component.scss'
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
