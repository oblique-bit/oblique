import {Directive, HostBinding, ContentChild, AfterViewInit, Input, Optional, ElementRef} from '@angular/core';
import {NgControl, NgForm, FormGroupDirective} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/merge';

@Directive({
	selector: '[orFormControlState]'
})
export class FormControlStateDirective implements AfterViewInit {

	@Input() pristineValidation = false;
	@Input() mandatory = false;

	@HostBinding('class.has-error') hasErrorClass = false;

	@ContentChild(NgControl) ngControl: NgControl;

	private form: NgForm | FormGroupDirective;

	constructor(@Optional() ngForm: NgForm,
				@Optional() formGroupDirective: FormGroupDirective,
				private elementRef: ElementRef) {
		this.form = ngForm || formGroupDirective;

		if (!this.form) {
			throw new Error('You need ether a NgForm or a FormGroupDirective for the FormControlStateDirective');
		}
	}

	ngAfterViewInit() {
		if (this.mandatory) {
			this.elementRef.nativeElement.querySelector('[name]').parentElement.classList.add('control-mandatory');
		}
		Observable.merge(
			this.form.ngSubmit,
			this.ngControl.statusChanges
		).subscribe(() => this.generateState());
	}

	private generateState() {
		if (this.form.submitted || !this.ngControl.pristine || this.pristineValidation) {
			this.hasErrorClass = this.ngControl.invalid;
		}
	}
}
