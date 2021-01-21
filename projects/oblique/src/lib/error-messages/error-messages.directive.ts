import {AfterViewInit, ContentChild, Directive, OnDestroy, Optional} from '@angular/core';
import {MatInput} from '@angular/material/input';
import {FormGroupDirective, NgForm, ValidationErrors} from '@angular/forms';
import {MatSelect} from '@angular/material/select';
import {merge, Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ObUnsubscribable} from '../unsubscribe.class';

@Directive({
	selector: '[obErrorMessages]',
	exportAs: 'obErrorMessages'
})
export class ObErrorMessagesDirective extends ObUnsubscribable implements AfterViewInit, OnDestroy {
	@ContentChild(MatInput) matInput;
	@ContentChild(MatSelect) matSelect;
	readonly errors$: Observable<ValidationErrors>;
	private readonly errors = new Subject<ValidationErrors>();
	private readonly form: NgForm | FormGroupDirective;

	constructor(@Optional() ngForm: NgForm, @Optional() formGroupDirective: FormGroupDirective) {
		super();
		this.errors$ = this.errors.asObservable();
		this.form = ngForm || formGroupDirective;

		if (!this.form) {
			throw new Error('The ErrorsDirective needs either a NgForm or a FormGroupDirective!');
		}
	}

	ngAfterViewInit() {
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
	}
}
