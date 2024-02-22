import {Component} from '@angular/core';
import {DateAdapter} from '@angular/material/core';
import {ObLanguageService} from '@oblique/language/language.service';

@Component({
	selector: 'sb-language-sample',
	templateUrl: './language-sample.component.html'
})
export class LanguageSampleComponent {
	today = new Date();
	format = 'datetime';
	timezone: string;

	constructor(adapter: DateAdapter<any>, language: ObLanguageService) {
		language.setLocaleOnAdapter(adapter);
	}
}
