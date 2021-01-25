import {Directive, HostBinding, OnInit, OnDestroy, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

const I18N_PLACEHOLDERS = {
	en: 'dd.mm.yyyy',
	fr: 'jj.mm.aaaa',
	de: 'TT.MM.JJJJ',
	it: 'gg.mm.aaaa'
};

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'input[ngbDatepicker]',
	exportAs: 'obDatepickerPlaceholder',
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-datepicker-placeholder'}
})
export class ObDatepickerPlaceholderDirective implements OnInit, OnDestroy {
	@Input()
	@HostBinding()
	placeholder;
	private readonly unsubscribe = new Subject();

	constructor(private readonly translateService: TranslateService) {}

	ngOnInit() {
		if (!this.placeholder) {
			this.setPlaceholder(this.translateService.currentLang);

			this.translateService.onLangChange.pipe(takeUntil(this.unsubscribe)).subscribe(({lang}) => {
				this.setPlaceholder(lang);
			});
		}
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	private setPlaceholder(lang: string) {
		this.placeholder = I18N_PLACEHOLDERS[lang];
	}
}
