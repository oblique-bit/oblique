import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {ObThemeService} from 'oblique';
import {map} from 'rxjs/operators';
import {DateAdapter} from '@angular/material/core';
import {ObLanguageService} from '../../../../projects/oblique/src/lib/language/language.service';

@Component({
	selector: 'ob-language',
	templateUrl: './language.component.html'
})
export class LanguageComponent {
	material: Observable<boolean>;
	today = new Date();
	format = 'datetime';
	timezone: string;

	constructor(theme: ObThemeService, adapter: DateAdapter<any>, language: ObLanguageService) {
		language.setLocaleOnAdapter(adapter);
		this.material = theme.theme$.pipe(map(() => theme.isMaterial()));
	}
}
