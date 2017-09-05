import {
	Directive, HostBinding, ContentChild, AfterViewInit, Input, Optional, ElementRef,
	Renderer2
} from '@angular/core';
import {NgControl, NgForm, FormGroupDirective} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/merge';

@Directive({
	selector: '[orFormControlState]'
})
export class FormControlStateDirective implements AfterViewInit {

	@Input() pristineValidation = false;
	@Input() mandatory;

	@HostBinding('class.has-error') hasErrorClass = false;

	@ContentChild(NgControl) ngControl: NgControl;

	private form: NgForm | FormGroupDirective;

	constructor(@Optional() ngForm: NgForm,
				@Optional() formGroupDirective: FormGroupDirective,
				private elementRef: ElementRef,
				private renderer: Renderer2) {
		this.form = ngForm || formGroupDirective;

		if (!this.form) {
			throw new Error('You need either a NgForm or a FormGroupDirective for the FormControlStateDirective!');
		}
	}

	ngAfterViewInit() {
		if (!this.ngControl) {
			throw new Error('You need to provide an NgControl for the FormControlStateDirective!');
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

		const element = this.elementRef.nativeElement.querySelector('[name]');
		if (element.hasAttribute('required') || this.mandatory) {
			if (this.ngControl.value) {
				this.renderer.removeClass(element.parentElement, 'control-mandatory');
			} else {
				this.renderer.addClass(element.parentElement, 'control-mandatory');
			}
		}
	}
}
