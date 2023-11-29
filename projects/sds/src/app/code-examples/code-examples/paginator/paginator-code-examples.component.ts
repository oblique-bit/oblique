import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {PaginatorExampleCommonOptionsPreviewComponent} from './previews/common-options/paginator-example-common-options-preview.component';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {CommonModule} from '@angular/common';
import {PaginatorExampleOtherOptionsPreviewComponent} from './previews/other-options/paginator-example-other-options-preview.component';

@Component({
	selector: 'app-paginator-code-examples',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, CodeExampleComponent, IdPipe]
})
export class PaginatorCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'button-examples';
	readonly previews: CodeExample[] = [
		{
			component: PaginatorExampleCommonOptionsPreviewComponent,
			idParts: ['common', 'options'],
			title: 'Common options',
			snippets: [
				this.getSnippet('paginator', 'common-options/paginator-example-common-options-preview.component.html', 'HTML'),
				this.getSnippet('paginator', 'common-options/paginator-example-common-options-preview.component.ts', 'TS')
			]
		},
		{
			component: PaginatorExampleOtherOptionsPreviewComponent,
			idParts: ['other', 'options'],
			title: 'Other options',
			snippets: [
				this.getSnippet('paginator', 'other-options/paginator-example-other-options-preview.component.html', 'HTML'),
				this.getSnippet('paginator', 'other-options/paginator-example-other-options-preview.component.ts', 'TS')
			]
		}
	];
}
