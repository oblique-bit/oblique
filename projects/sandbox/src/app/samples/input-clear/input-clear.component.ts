import {Component, type OnInit, inject} from '@angular/core';
import {type FormControl, type FormGroup, UntypedFormBuilder, type UntypedFormGroup} from '@angular/forms';

@Component({
	selector: 'sb-input-clear',
	standalone: false,
	templateUrl: './input-clear.component.html'
})
export class InputClearSampleComponent implements OnInit {
	mandatoryModel: string;
	minlengthModel: string;
	minlengthPrefixSuffixModel: string;
	mandatoryLgModel: string;
	mandatorySmModel: string;
	datepickerModel: string;
	untypedForm: UntypedFormGroup;
	stronglyTypedForm: FormGroup<{stronglyTypedFormField: FormControl<string>}>;

	private readonly formBuilder = inject(UntypedFormBuilder);

	ngOnInit(): void {
		this.untypedForm = this.formBuilder.group({
			untypedFormField: ['']
		});

		this.stronglyTypedForm = this.formBuilder.group({
			stronglyTypedFormField: ['']
		});
	}
}
