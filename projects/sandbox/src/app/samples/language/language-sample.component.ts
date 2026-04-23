import {Component} from '@angular/core';

@Component({
	selector: 'sb-language-sample',
	standalone: false,
	templateUrl: './language-sample.component.html',
})
export class LanguageSampleComponent {
	readonly formatsComponent = ['shortDate', 'mediumDate', 'longDate', 'fullDate', 'isoDate'] as const;
	readonly formatsPipe = ['datetime', 'shortDate', 'mediumDate', 'longDate', 'fullDate'] as const;
	date = new Date();
	formatPipe: (typeof this.formatsPipe)[number] = 'datetime';
	formatComponent: (typeof this.formatsComponent)[number] = 'shortDate';
	timezone: string;
}
