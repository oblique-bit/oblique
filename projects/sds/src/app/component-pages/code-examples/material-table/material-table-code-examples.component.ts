import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {MaterialTableExampleDefaultPreviewComponent} from '../material-table/previews/default/material-table-example-default-preview.component';
import {MaterialTableExampleStylesPreviewComponent} from '../material-table/previews/styles/material-table-example-styles-preview.component';
import {MaterialTableExampleSizesPreviewComponent} from '../material-table/previews/sizes/material-table-example-sizes-preview.component';
import {MaterialTableExampleEditablePreviewComponent} from '../material-table/previews/editable/material-table-example-editable-preview.component';

@Component({
	selector: 'app-code-example-material-table',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class MaterialTableCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'material-table-examples';
	readonly previews: CodeExample[] = [
		{
			component: MaterialTableExampleDefaultPreviewComponent,
			idParts: ['default'],
			title: 'Default',
			snippets: [
				this.getSnippet('material-table', 'default/material-table-example-default-preview.component.html', 'HTML'),
				this.getSnippet('material-table', 'default/material-table-example-default-preview.component.ts', 'TS')
			]
		},
		{
			component: MaterialTableExampleStylesPreviewComponent,
			idParts: ['styles'],
			title: 'Styles',
			snippets: [
				this.getSnippet('material-table', 'styles/material-table-example-styles-preview.component.html', 'HTML'),
				this.getSnippet('material-table', 'styles/material-table-example-styles-preview.component.ts', 'TS'),
				this.getSnippet('material-table', 'styles/material-table-example-styles-preview.component.scss', 'SCSS')
			]
		},
		{
			component: MaterialTableExampleSizesPreviewComponent,
			idParts: ['sizes'],
			title: 'Sizes',
			snippets: [
				this.getSnippet('material-table', 'sizes/material-table-example-sizes-preview.component.html', 'HTML'),
				this.getSnippet('material-table', 'sizes/material-table-example-sizes-preview.component.ts', 'TS'),
				this.getSnippet('material-table', 'sizes/material-table-example-sizes-preview.component.scss', 'SCSS')
			]
		},
		{
			component: MaterialTableExampleEditablePreviewComponent,
			idParts: ['editable'],
			title: 'Editable table',
			snippets: [
				this.getSnippet('material-table', 'editable/material-table-example-editable-preview.component.html', 'HTML'),
				this.getSnippet('material-table', 'editable/material-table-example-editable-preview.component.ts', 'TS'),
				this.getSnippet('material-table', 'editable/material-table-example-editable-preview.component.scss', 'SCSS'),
				this.getSnippet('material-table', 'editable/material-table-editable-dialog.component.html', 'HTML (Dialog)'),
				this.getSnippet('material-table', 'editable/material-table-editable-dialog.component.ts', 'TS (Dialog)'),
				this.getSnippet('material-table', 'editable/mock-backend.service.ts', 'TS (Mock Backend)')
			]
		}
	];
}
