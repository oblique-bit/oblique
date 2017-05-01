import {Component, Input, OnInit, Optional} from '@angular/core';
import {NgControl, NgForm, FormGroupDirective} from '@angular/forms';
import {FormControlStateDirective} from '../form-control-state/form-control-state.directive';
import {ErrorMessagesService} from './error-messages.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/merge';

@Component({
	selector: 'or-error-messages',
	template: `<span class="help-block" *ngFor="let error of errors">{{error.key | translate:error.params}}</span>`
})
export class ErrorMessagesComponent implements OnInit {
	@Input() control: NgControl;

	errors: {key: string, params: {[param: string]: any}}[] = [];

	private form: NgForm | FormGroupDirective;

	constructor(private errorMessagesService: ErrorMessagesService,
				@Optional() private formGroup: FormControlStateDirective,
				@Optional() ngForm: NgForm,
				@Optional() formGroupDirective: FormGroupDirective) {
		this.form = ngForm || formGroupDirective;

		if (!this.form) {
			throw Error('You need ether a NgForm or a FormGroupDirective for the ErrorMessagesComponent');
		}

	}

	ngOnInit() {
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
