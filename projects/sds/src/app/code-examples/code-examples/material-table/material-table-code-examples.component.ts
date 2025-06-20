import {ChangeDetectionStrategy, Component} from '@angular/core';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {MaterialTableExampleDefaultPreviewComponent} from './previews/default/material-table-example-default-preview.component';
import {MaterialTableExampleStylesPreviewComponent} from './previews/styles/material-table-example-styles-preview.component';
import {MaterialTableExampleSizesPreviewComponent} from './previews/sizes/material-table-example-sizes-preview.component';
import {MaterialTableExampleEditablePreviewComponent} from './previews/editable/material-table-example-editable-preview.component';
import {MaterialTableExampleSelectablePreviewComponent} from './previews/selectable/material-table-example-selectable-preview.component';
import {MaterialTableExampleSortablePreviewComponent} from './previews/sortable/material-table-example-sortable-preview.component';

@Component({
	selector: 'app-code-example-material-table',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
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
				this.getSnippet('material-table', 'styles/material-table-example-styles-preview.component.ts', 'TS')
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
		},
		{
			component: MaterialTableExampleSelectablePreviewComponent,
			idParts: ['selectable'],
			title: 'Selectable',
			snippets: [
				this.getSnippet('material-table', 'selectable/material-table-example-selectable-preview.component.html', 'HTML'),
				this.getSnippet('material-table', 'selectable/material-table-example-selectable-preview.component.ts', 'TS'),
				this.getSnippet('material-table', 'selectable/material-table-example-selectable-preview.component.scss', 'SCSS')
			]
		},
		{
			component: MaterialTableExampleSortablePreviewComponent,
			idParts: ['sortable'],
			title: 'Sortable',
			snippets: [
				this.getSnippet('material-table', 'sortable/material-table-example-sortable-preview.component.html', 'HTML'),
				this.getSnippet('material-table', 'sortable/material-table-example-sortable-preview.component.ts', 'TS')
			]
		}
	];
}
