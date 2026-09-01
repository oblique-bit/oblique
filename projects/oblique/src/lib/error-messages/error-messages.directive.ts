import {AfterViewInit, DestroyRef, Directive, OnDestroy, contentChild, inject, input} from '@angular/core';
import {MatInput} from '@angular/material/input';
import {FormGroupDirective, NgForm, ValidationErrors} from '@angular/forms';
import {MatSelect} from '@angular/material/select';
import {Observable, Subject, merge} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Directive({
	selector: '[obErrorMessages]',
	exportAs: 'obErrorMessages',
})
export class ObErrorMessagesDirective implements AfterViewInit, OnDestroy {
	readonly matInput = contentChild(MatInput);
	readonly matSelect = contentChild(MatSelect);
	readonly prefix = input<string>(undefined);
	readonly errors$: Observable<ValidationErrors>;
	private readonly errors = new Subject<ValidationErrors>();
	private readonly form: NgForm | FormGroupDirective;
	private readonly destroyRef = inject(DestroyRef);

	constructor() {
		const ngForm = inject(NgForm, {optional: true});
		const formGroupDirective = inject(FormGroupDirective, {optional: true});

		this.errors$ = this.errors.asObservable();
		this.form = ngForm || formGroupDirective;

		if (!this.form) {
			throw new Error('The ErrorMessagesDirective needs to be either within a NgForm or a FormGroupDirective!');
		}
	}

	ngAfterViewInit(): void {
		const ctrl = this.matInput()?.ngControl || this.matSelect()?.ngControl;
		if (ctrl) {
			this.errors.next(ctrl.errors); // because 1st statusChange occurs before ngAfterViewInit
			merge(this.form.ngSubmit, ctrl.statusChanges)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe(() => {
					this.errors.next(ctrl.errors);
				});
		}
	}

	ngOnDestroy(): void {
		this.errors.complete();
	}
}
