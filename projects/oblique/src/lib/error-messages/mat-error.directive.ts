import {Directive, ElementRef, OnInit, Optional} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {filter} from 'rxjs/operators';
import {TranslateParamsPipe} from '../translate-params/translate-params.module';
import {ErrorMessagesDirective} from './error-messages.directive';

@Directive({
	selector: 'mat-error'
})
export class MatErrorDirective implements OnInit {
	private readonly pipe: TranslateParamsPipe;

	constructor(@Optional() private readonly control: ErrorMessagesDirective, private readonly el: ElementRef, translate: TranslateService) {
		this.pipe = new TranslateParamsPipe(translate);
	}

	ngOnInit() {
		if (this.control) {
			this.control.errors$.pipe(filter(evt => !!evt)).subscribe(evt => {
				this.el.nativeElement.innerText = Object.keys(evt).map(key =>
					this.pipe.transform(`i18n.validation.${key}`, evt[key])
				).join('\n');
			});
		}
	}
}
