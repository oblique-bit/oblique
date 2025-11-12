import {Component} from '@angular/core';

@Component({
	selector: 'sb-language-sample',
	standalone: false,
	templateUrl: './language-sample.component.html',
})
export class LanguageSampleComponent {
	today = new Date();
	format = 'datetime';
	timezone: string;

	exampleDate = new Date('2025-05-12');
}
