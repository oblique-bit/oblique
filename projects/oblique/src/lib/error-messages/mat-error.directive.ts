import {Directive, ElementRef, OnInit, Optional} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {ObTranslateParamsPipe} from '../translate-params/translate-params.module';
import {ObUnsubscribable} from '../unsubscribe.class';
import {ObErrorMessagesDirective} from './error-messages.directive';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'mat-error'
})
export class ObMatErrorDirective extends ObUnsubscribable implements OnInit {
	private readonly pipe: ObTranslateParamsPipe;
	private errors: ValidationErrors = {};

	constructor(@Optional() private readonly control: ObErrorMessagesDirective, private readonly el: ElementRef, translate: TranslateService) {
		super();
		if (this.control) {
			this.pipe = new ObTranslateParamsPipe(translate);
			translate.onLangChange.subscribe(() => this.showErrors(this.errors || {}));
		}
	}

	ngOnInit() {
		if (this.control) {
			this.control.errors$
				.pipe(
					filter(errors => !!errors),
					tap(errors => (this.errors = errors)),
					takeUntil(this.unsubscribe)
				)
				.subscribe(errors => this.showErrors(errors));
		}
	}

	private showErrors(errors: ValidationErrors): void {
		this.el.nativeElement.innerText = Object.keys(errors)
			.map(key => this.pipe.transform(`i18n.validation.${key}`, errors[key]))
			.join('\n');
	}
}
