import {Component, inject} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';

@Component({
	selector: 'sb-number-format',
	templateUrl: './number-format-sample.component.html',
	standalone: false
})
export class NumberFormatSampleComponent {
	number1 = 5.236548;
	number2 = 5.236548;
	numberRequired = 5.236548;

	formData = inject(UntypedFormBuilder).group({
		number5: 5.236548,
		number6: 5.236548,
		numberRequired: [5.236548, Validators.required]
	});

	setNumber5(): void {
		this.formData.patchValue({number5: 6.2356487});
	}

	setNumber6(): void {
		this.formData.patchValue({number6: 6.2356487});
	}
}
