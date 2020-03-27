import {Directive, HostBinding, OnInit, OnDestroy, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';
import {ObUnsubscribable} from '../unsubscribe.class';

const I18N_PLACEHOLDERS = {
	en: 'dd.mm.yyyy',
	fr: 'jj.mm.aaaa',
	de: 'TT.MM.JJJJ',
	it: 'gg.mm.aaaa'
};

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'input[ngbDatepicker]'
})
export class ObDatepickerPlaceholderDirective extends ObUnsubscribable implements OnInit, OnDestroy {
	@Input()
	@HostBinding()
	placeholder;

	constructor(private readonly translateService: TranslateService) {
		super();
	}

	ngOnInit() {
		if (!this.placeholder) {
			this.setPlaceholder(this.translateService.currentLang);

			this.translateService.onLangChange.pipe(takeUntil(this.unsubscribe)).subscribe(({lang}) => {
				this.setPlaceholder(lang);
			});
		}
	}

	private setPlaceholder(lang: string) {
		this.placeholder = I18N_PLACEHOLDERS[lang];
	}
}
