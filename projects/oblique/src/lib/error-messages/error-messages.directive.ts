import {AfterViewInit, ContentChild, Directive, OnDestroy, Optional} from '@angular/core';
import {MatLegacyInput as MatInput} from '@angular/material/legacy-input';
import {FormGroupDirective, NgForm, ValidationErrors} from '@angular/forms';
import {MatLegacySelect as MatSelect} from '@angular/material/legacy-select';
import {Observable, Subject, merge} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Directive({
	selector: '[obErrorMessages]',
	exportAs: 'obErrorMessages'
})
export class ObErrorMessagesDirective implements AfterViewInit, OnDestroy {
	@ContentChild(MatInput) matInput;
	@ContentChild(MatSelect) matSelect;
	readonly errors$: Observable<ValidationErrors>;
	private readonly errors = new Subject<ValidationErrors>();
	private readonly form: NgForm | FormGroupDirective;
	private readonly unsubscribe = new Subject<void>();

	constructor(@Optional() ngForm: NgForm, @Optional() formGroupDirective: FormGroupDirective) {
		this.errors$ = this.errors.asObservable();
		this.form = ngForm || formGroupDirective;

		if (!this.form) {
			throw new Error('The ErrorsDirective needs either a NgForm or a FormGroupDirective!');
		}
	}

	ngAfterViewInit(): void {
		const ctrl = this.matInput?.ngControl || this.matSelect?.ngControl;
		if (ctrl) {
			this.errors.next(ctrl.errors); // because 1st statusChange occurs before ngAfterViewInit
			merge(this.form.ngSubmit, ctrl.statusChanges)
				.pipe(takeUntil(this.unsubscribe))
				.subscribe(() => {
					this.errors.next(ctrl.errors);
				});
		}
	}

	ngOnDestroy(): void {
		this.errors.complete();
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}
