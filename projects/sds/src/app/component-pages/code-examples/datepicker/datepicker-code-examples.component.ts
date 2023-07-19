import {Component} from '@angular/core';
import {DatepickerExampleDefaultComponent} from './previews/default/datepicker-example-default.component';
import {CodeExample, CodeExamples} from './../../code-examples.model';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';

@Component({
	selector: 'app-datepicker-code-examples',
	templateUrl: '../../code-examples.component.html',
	standalone: true,
	imports: [CodeExampleComponent, CommonModule, IdPipe]
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
