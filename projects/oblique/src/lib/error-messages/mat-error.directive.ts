import {Directive, ElementRef, OnInit, Optional} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {filter} from 'rxjs/operators';
import {ObTranslateParamsPipe} from '../translate-params/translate-params.module';
import {ObErrorMessagesDirective} from './error-messages.directive';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'mat-error'
})
export class ObMatErrorDirective implements OnInit {
	private readonly pipe: ObTranslateParamsPipe;

	constructor(@Optional() private readonly control: ObErrorMessagesDirective, private readonly el: ElementRef, translate: TranslateService) {
		this.pipe = new ObTranslateParamsPipe(translate);
	}

	ngOnInit() {
		if (this.control) {
			this.control.errors$.pipe(filter(evt => !!evt)).subscribe(evt => {
				this.el.nativeElement.innerText = Object.keys(evt)
					.map(key => this.pipe.transform(`i18n.validation.${key}`, evt[key]))
					.join('\n');
			});
		}
	}
}
