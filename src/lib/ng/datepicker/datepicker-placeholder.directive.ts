import {Directive, HostBinding, OnInit, OnDestroy, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

const I18N_PLACEHOLDERS = {
	en: 'dd.mm.yyyy',
	fr: 'jj.mm.aaaa',
	de: 'TT.MM.JJJJ',
	it: 'gg.mm.aaaa'
};

@Directive({
	selector: 'input[ngbDatepicker]'
})
export class DatepickerPlaceholderDirective implements OnInit, OnDestroy {
	@Input()
	@HostBinding()
	placeholder;

	// http://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription
	private ngUnsubscribe: Subject<void> = new Subject<void>();

	constructor(private translateService: TranslateService) {
	}

	ngOnInit() {
		if (!this.placeholder) {
			this.setPlaceholder(this.translateService.currentLang);

			this.translateService.onLangChange
				.takeUntil(this.ngUnsubscribe)
				.subscribe(({lang}) => {
					this.setPlaceholder(lang);
			});
		}
	}

	ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	private setPlaceholder(lang: string) {
		this.placeholder = I18N_PLACEHOLDERS[lang];
	}
}
