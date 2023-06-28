import {DatepickerExampleDefaultComponent} from './previews/default/datepicker-example-default.component';
import {CodeExample, CodeExamples} from './../../code-examples.model';
import {Component} from '@angular/core';

@Component({
	selector: 'app-datepicker-code-examples',
	templateUrl: '../../code-examples.component.html'
})
export class DatepickerCodeExamplesComponent extends CodeExamples {
	readonly previews: CodeExample[] = [
		{
			component: DatepickerExampleDefaultComponent,
			idParts: ['default'],
			title: 'Default',
			snippets: [
				this.getSnippet('datepicker', 'default/datepicker-example-default.component.ts', 'TS'),
				this.getSnippet('datepicker', 'default/datepicker-example-default.component.html', 'HTML')
			]
		}
	];
}
