import {ChangeDetectionStrategy, Component} from '@angular/core';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {DateExampleDefaultPreviewComponent} from '../date/previews/default/date-example-default-preview.component';

@Component({
	selector: 'app-code-example-date',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
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
				this.getSnippet('date', 'default/date-example-default-preview.component.ts', 'TS')
			]
		}
	];
}
