import {Component, Input, Optional, AfterViewInit} from '@angular/core';
import {NgControl, NgForm, FormGroupDirective} from '@angular/forms';
import {FormControlStateDirective} from '../form-control-state/form-control-state.directive';
import {ErrorMessagesService} from './error-messages.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/merge';

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
	}

	private generateErrorMessages() {
		let pristineValidation = this.formGroup ? this.formGroup.pristineValidation : false;
		if (this.control.invalid && (this.form.submitted || !this.control.pristine || pristineValidation)) {
			this.errors = this.errorMessagesService.createMessages(this.control);
		} else {
			this.errors = [];
		}
	}
}
