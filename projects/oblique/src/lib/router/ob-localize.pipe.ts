import {Pipe, PipeTransform, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {TranslateService} from '@ngx-translate/core';
import {map, startWith} from 'rxjs/operators';
import {OB_HAS_LANGUAGE_IN_URL} from '../utilities';

@Pipe({
	name: 'obLocalize',
	pure: false, // eslint-disable-line @angular-eslint/no-pipe-impure
})
export class ObLocalizePipe implements PipeTransform {
	private readonly hasLanguageInUrl = inject(OB_HAS_LANGUAGE_IN_URL);
	private readonly translate = inject(TranslateService);
	private readonly currentLang = toSignal(
		this.translate.onLangChange.pipe(
			map(evt => evt.lang),
			startWith(this.translate.currentLang)
		)
	);

	transform(route: string): string {
		return this.hasLanguageInUrl ? `${this.currentLang()}/${route}` : route;
	}
}
