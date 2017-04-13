import {Directive, HostBinding, ContentChild, AfterViewInit, Input, Optional} from '@angular/core';
import {NgControl, NgForm, FormGroupDirective} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/merge';

@Directive({
	selector: '[obliqueFormGroup]'
})
export class ObliqueFormGroupDirective implements AfterViewInit {

	@Input() obliqueFormGroupPristineValidation = false;

	@HostBinding('class.form-group') formGroupClass = true;
	@HostBinding('class.has-error') hasErrorClass = false;

	@ContentChild(NgControl) ngControl: NgControl;

	private form: NgForm | FormGroupDirective;

	constructor(@Optional() ngForm: NgForm,
				@Optional() formGroupDirective: FormGroupDirective) {
		this.form = ngForm || formGroupDirective;

		if (!this.form) {
			console.error('You need ether a NgForm or a FormGroupDirective for the ObliqueFormGroupDirective');
		}

	}

	ngAfterViewInit() {
		Observable.merge(
			this.form.ngSubmit,
			this.ngControl.statusChanges
		).subscribe(() => this.setErrorClass());
	}

	private setErrorClass() {
		if (this.form.submitted || !this.ngControl.pristine || this.obliqueFormGroupPristineValidation) {
			this.hasErrorClass = this.ngControl.invalid;
		}
	}
}
