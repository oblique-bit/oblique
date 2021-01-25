import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'ob-error-messages-sample',
	templateUrl: './error-messages-sample.component.html'
})
export class ObErrorMessagesSampleComponent {
	select = new FormControl('', [Validators.required]);
	checkbox = new FormControl('', [Validators.required]);
	radio = new FormControl('', [Validators.required]);
	email = new FormControl('', [Validators.required, Validators.email, Validators.minLength(5)]);
	form = new FormGroup({email: this.email, select: this.select});
}
