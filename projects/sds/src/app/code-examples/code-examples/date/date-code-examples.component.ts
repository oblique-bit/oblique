import {ChangeDetectionStrategy, Component} from '@angular/core';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {DateExampleDefaultPreviewComponent} from '../date/previews/default/date-example-default-preview.component';
import {DateComponentExampleComponent} from './previews/date-component/date-component-example-preview.component';

@Component({
	selector: 'app-code-example-date',
	imports: [CommonModule, IdPipe, CodeExampleComponent],
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'date-examples';
	readonly previews: CodeExample[] = [
		{
			component: DateExampleDefaultPreviewComponent,
			idParts: ['default'],
			title: 'Link to Stackblitz Example',
			snippets: [
				this.getSnippet('date', 'default/date-example-default-preview.component.html', 'HTML'),
				this.getSnippet('date', 'default/date-example-default-preview.component.ts', 'TS'),
			],
		},
		{
			component: DateComponentExampleComponent,
			idParts: ['default'],
			title: 'Link to Stackblitz ObDateComponent Example',
			snippets: [
				this.getSnippet('date', 'date-component/date-component-example-preview.component.html', 'HTML'),
				this.getSnippet('date', 'date-component/date-component-example-preview.component.ts', 'TS'),
			],
		},
	];
}
