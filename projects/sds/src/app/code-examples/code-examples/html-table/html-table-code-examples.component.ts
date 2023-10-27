import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {HtmlTableExampleDefaultPreviewComponent} from './previews/default/html-table-example-default-preview.component';
import {HtmlTableExampleSizesPreviewComponent} from './previews/sizes/html-table-example-sizes-preview.component';
import {HtmlTableExampleStylesPreviewComponent} from './previews/styles/html-table-example-styles-preview.component';
import {HtmlTableExampleCollapsePreviewComponent} from './previews/collapse/html-table-example-collapse-preview.component';

@Component({
	selector: 'app-code-example-html-table',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class HtmlTableCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'html-table-examples';
	readonly previews: CodeExample[] = [
		{
			component: HtmlTableExampleDefaultPreviewComponent,
			idParts: ['default'],
			title: 'Default',
			snippets: [
				this.getSnippet('html-table', 'default/html-table-example-default-preview.component.html', 'HTML'),
				this.getSnippet('html-table', 'default/html-table-example-default-preview.component.ts', 'TS')
			]
		},
		{
			component: HtmlTableExampleStylesPreviewComponent,
			idParts: ['styles'],
			title: 'Styles',
			snippets: [
				this.getSnippet('html-table', 'styles/html-table-example-styles-preview.component.html', 'HTML'),
				this.getSnippet('html-table', 'styles/html-table-example-styles-preview.component.ts', 'TS'),
				this.getSnippet('html-table', 'styles/html-table-example-styles-preview.component.scss', 'SCSS')
			]
		},
		{
			component: HtmlTableExampleSizesPreviewComponent,
			idParts: ['sizes'],
			title: 'Sizes',
			snippets: [
				this.getSnippet('html-table', 'sizes/html-table-example-sizes-preview.component.html', 'HTML'),
				this.getSnippet('html-table', 'sizes/html-table-example-sizes-preview.component.ts', 'TS'),
				this.getSnippet('html-table', 'sizes/html-table-example-sizes-preview.component.scss', 'SCSS')
			]
		},
		{
			component: HtmlTableExampleCollapsePreviewComponent,
			idParts: ['collapse'],
			title: 'Collapse',
			snippets: [
				this.getSnippet('html-table', 'collapse/html-table-example-collapse-preview.component.html', 'HTML'),
				this.getSnippet('html-table', 'collapse/html-table-example-collapse-preview.component.ts', 'TS'),
				this.getSnippet('html-table', 'collapse/html-table-example-collapse-preview.component.scss', 'SCSS')
			]
		}
	];
}
