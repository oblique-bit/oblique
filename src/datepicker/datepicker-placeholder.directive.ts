import {Directive, HostBinding, OnInit, ElementRef, OnDestroy} from '@angular/core';
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
	@HostBinding('placeholder') placeholder;

	private customPlaceholder: string;

	//http://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription
	private ngUnsubscribe: Subject<void> = new Subject<void>();

	constructor(private translateService: TranslateService, elementRef: ElementRef) {
		this.customPlaceholder = elementRef.nativeElement.getAttribute('placeholder');
	}

	ngOnInit() {
		if (!this.customPlaceholder) {
			this.setPlaceholder(this.translateService.currentLang);

			this.translateService.onLangChange
				.takeUntil(this.ngUnsubscribe)
				.subscribe(({lang}) => {
					this.setPlaceholder(lang);
				});
		} else {
			this.placeholder = this.customPlaceholder;
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
