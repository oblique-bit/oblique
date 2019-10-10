import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
	selector: 'app-error-messages-sample',
	templateUrl: './error-messages-sample.component.html'
})
export class ErrorMessagesSampleComponent {
	email = new FormControl('', [Validators.required, Validators.email, Validators.minLength(5)]);
	form = new FormGroup({email: this.email});
}
