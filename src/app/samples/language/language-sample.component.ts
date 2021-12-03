import {Component} from '@angular/core';
import {DateAdapter} from '@angular/material/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ObLanguageService} from '../../../../projects/oblique/src/lib/language/language.service';
import {ThemeService} from '../../common/theme.service';

@Component({
	selector: 'ob-language-sample',
	templateUrl: './language-sample.component.html'
})
export class ObLanguageSampleComponent {
	material: Observable<boolean>;
	today = new Date();
	format = 'datetime';
	timezone: string;

	constructor(theme: ThemeService, adapter: DateAdapter<any>, language: ObLanguageService) {
		language.setLocaleOnAdapter(adapter);
		this.material = theme.theme$.pipe(map(() => theme.isMaterial()));
	}
}
