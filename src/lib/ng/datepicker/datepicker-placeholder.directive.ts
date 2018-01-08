import {Directive, HostBinding, OnInit, OnDestroy, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/takeUntil';
import {Unsubscribable} from '../unsubscribe';

const I18N_PLACEHOLDERS = {
	en: 'dd.mm.yyyy',
	fr: 'jj.mm.aaaa',
	de: 'TT.MM.JJJJ',
	it: 'gg.mm.aaaa'
};

@Directive({
	selector: 'input[ngbDatepicker]'
})
export class DatepickerPlaceholderDirective extends Unsubscribable implements OnInit, OnDestroy {
	@Input()
	@HostBinding()
	placeholder;

	constructor(private translateService: TranslateService) {
		super();
	}

	ngOnInit() {
		if (!this.placeholder) {
			this.setPlaceholder(this.translateService.currentLang);

			this.translateService.onLangChange
				.takeUntil(this.unsubscribe)
				.subscribe(({lang}) => {
					this.setPlaceholder(lang);
			});
		}
	}

	private setPlaceholder(lang: string) {
		this.placeholder = I18N_PLACEHOLDERS[lang];
	}
}
