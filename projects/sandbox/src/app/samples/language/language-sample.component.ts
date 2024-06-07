import {Component} from '@angular/core';

@Component({
	selector: 'sb-language-sample',
	templateUrl: './language-sample.component.html'
})
export class LanguageSampleComponent {
	today = new Date();
	format = 'datetime';
	timezone: string;
}
