import {AfterViewInit, Component, Inject, InjectionToken, Input, OnDestroy, Optional} from '@angular/core';
import {FormGroupDirective, NgControl, NgForm} from '@angular/forms';
import {Subject, merge as observableMerge} from 'rxjs';
import {delay, takeUntil} from 'rxjs/operators';

import {ObFormControlStateDirective} from '../form-control-state/form-control-state.directive';
import {ObErrorMessagesService} from './error-messages.service';
import {ObThemeService} from '../theme.service';
import {ObParentFormDirective} from '../nested-form/parent-form.directive';
import {WINDOW} from '../utilities';

export const DISABLE_NGB_ERRORS = new InjectionToken<boolean>('ENABLE_NGB_ERRORS');

/**
 * @deprecated with material theme since version 4.0.0. Use angular material mat-error instead.
 * Deprecated with bootstrap theme since version 8.0.0. Will be removed with version 10.0.0.
 */
@Component({
	selector: 'ob-error-messages',
	exportAs: 'obErrorMessages',
	templateUrl: './error-messages.component.html'
})
export class ObErrorMessagesComponent implements AfterViewInit, OnDestroy {
	@Input() control: NgControl;
	@Input() disableNgb: boolean;

	errors: {key: string; params: Record<string, any>}[] = [];

	private readonly form: NgForm | FormGroupDirective;
	private readonly unsubscribe = new Subject<void>();

	constructor(
		private readonly errorMessagesService: ObErrorMessagesService,
		theme: ObThemeService,
		@Optional() private readonly formGroup: ObFormControlStateDirective,
		@Optional() ngForm: NgForm,
		@Optional() formGroupDirective: FormGroupDirective,
		@Optional() private readonly parent: ObParentFormDirective,
		@Inject(WINDOW) private readonly window: Window,
		@Optional() @Inject(DISABLE_NGB_ERRORS) disableNgb: boolean
	) {
		this.disableNgb = this.disableNgb ?? disableNgb ?? false;
		theme.deprecated('error messages', 'form-field/overview#error-messages');
		this.form = ngForm || formGroupDirective;

		if (!this.form) {
			throw Error('You need either a NgForm or a FormGroupDirective for the ErrorMessagesComponent');
		}
	}

	ngAfterViewInit(): void {
		this.control = this.control ? this.control : this.formGroup.ngControl;

		observableMerge(this.control.statusChanges, this.form.ngSubmit)
			.pipe(takeUntil(this.unsubscribe), delay(0)) // delay event to let native submit and reset events be applied
			.subscribe(() => this.generateErrorMessages());

		// in case of nested forms, the root form is not accessible
		if (this.parent) {
			this.parent.submit$.subscribe(() => this.generateErrorMessages(true));
		}

		this.delayMessageGenerationForReactiveForms();
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	private generateErrorMessages(submitted = false): void {
		const pristineValidation = this.formGroup ? this.formGroup.pristineValidation : false;
		if (this.control.invalid && (submitted || this.form.submitted || !this.control.pristine || pristineValidation)) {
			this.errors = this.errorMessagesService.createMessages(this.control, this.disableNgb);
		} else {
			this.errors = [];
		}
	}

	private delayMessageGenerationForReactiveForms(): void {
		// Reactive forms instantiate the view only after the model is ready. Thus modifying this.errors in the same
		// tick as ngAfterViewInit will trigger an ExpressionChangedAfterItHasBeenCheckedError
		if (this.form instanceof FormGroupDirective) {
			this.window.setTimeout(() => this.generateErrorMessages(), 0);
		}
	}
}
