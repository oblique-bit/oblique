import {Directive, ElementRef, OnDestroy, OnInit, inject} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {ObTranslateParamsPipe} from '../translate-params/translate-params.module';
import {ObErrorMessagesDirective} from './error-messages.directive';
import {Subject} from 'rxjs';
import {OB_MAT_ERROR_PREFIX} from '../utilities';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'mat-error',
})
export class ObMatErrorDirective implements OnInit, OnDestroy {
	private readonly control = inject(ObErrorMessagesDirective, {optional: true});
	private readonly el = inject(ElementRef);
	private readonly pipe: ObTranslateParamsPipe;
	private errors: ValidationErrors = {};
	private readonly unsubscribe = new Subject<void>();
	private readonly obMatErrorPrefix = inject(OB_MAT_ERROR_PREFIX, {optional: true});

	constructor() {
		const translate = inject(TranslateService);
		// yay

		if (this.control) {
			this.pipe = new ObTranslateParamsPipe();
			translate.onLangChange.subscribe(() => {
				this.showErrors(this.errors);
			});
		}
	}

	ngOnInit(): void {
		if (this.control) {
			this.control.errors$
				.pipe(
					filter(errors => !!errors),
					tap(errors => {
						this.errors = errors;
					}),
					takeUntil(this.unsubscribe)
				)
				.subscribe(errors => {
					this.showErrors(errors);
				});
		}
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	private showErrors(errors: ValidationErrors): void {
		this.el.nativeElement.innerText = Object.keys(errors)
			.map(key => this.getErrorTranslation(key, errors))
			.join('\n');
	}

	private getErrorTranslation(key: string, errors: ValidationErrors): string {
		const obliqueKey = `i18n.validation.${key}`;
		const obliqueTranslation = this.pipe.transform(obliqueKey, errors[key]);
		const customPrefix = this.control.prefix ?? this.obMatErrorPrefix ?? null;
		return customPrefix === null || obliqueTranslation !== obliqueKey
			? obliqueTranslation
			: this.pipe.transform(`${customPrefix}${key}`, errors[key]);
	}
}
