import {Component} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';

@Component({
	selector: 'sb-error-messages-sample',
	templateUrl: './error-messages-sample.component.html',
	styleUrls: ['./error-messages-sample.component.scss']
})
export class ErrorMessagesSampleComponent {
	select = new UntypedFormControl('', [Validators.required]);
	checkbox = new UntypedFormControl('', [Validators.required]);
	radio = new UntypedFormControl('', [Validators.required]);
	numberInput = new UntypedFormControl('', [Validators.required, Validators.min(0), Validators.max(31)]);
	email = new UntypedFormControl('', [Validators.required, Validators.email, Validators.minLength(5)]);
	form = new UntypedFormGroup({email: this.email, select: this.select, numberInput: this.numberInput});
}
