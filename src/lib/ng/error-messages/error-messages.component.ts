import {Component, Input, Optional, AfterViewInit} from '@angular/core';
import {NgControl, NgForm, FormGroupDirective} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import {FormControlStateDirective} from '../form-control-state';
import {ErrorMessagesService} from './error-messages.service';

@Component({
	selector: 'or-error-messages',
	template: `<div class="form-control-feedback" *ngFor="let error of errors">{{error.key | translate:error.params}}</div>`
})
export class ErrorMessagesComponent implements AfterViewInit {
	@Input() control: NgControl;

	errors: { key: string, params: { [param: string]: any } }[] = [];

	private form: NgForm | FormGroupDirective;

	constructor(private errorMessagesService: ErrorMessagesService,
				@Optional() private formGroup: FormControlStateDirective,
				@Optional() ngForm: NgForm,
				@Optional() formGroupDirective: FormGroupDirective) {
		this.form = ngForm || formGroupDirective;

		if (!this.form) {
			throw Error('You need either a NgForm or a FormGroupDirective for the ErrorMessagesComponent');
		}
	}

	ngAfterViewInit() {
		this.control = this.control ? this.control : this.formGroup.ngControl;

		Observable.merge(
			this.control.statusChanges,
			this.form.ngSubmit
		).subscribe(() => this.generateErrorMessages());

		this.delayMessageGenerationForReactiveForms();
	}

	private generateErrorMessages() {
		let pristineValidation = this.formGroup ? this.formGroup.pristineValidation : false;
		if (this.control.invalid && (this.form.submitted || !this.control.pristine || pristineValidation)) {
			this.errors = this.errorMessagesService.createMessages(this.control);
		} else {
			this.errors = [];
		}
	}

	private delayMessageGenerationForReactiveForms() {
		// Reactive forms instantiate the view only after the model is ready. Thus modifying this.errors in the same
		// tick as ngAfterViewInit will trigger an ExpressionChangedAfterItHasBeenCheckedError
		if (this.form instanceof FormGroupDirective) {
			setTimeout(() => this.generateErrorMessages(), 0);
		}
	}
}
