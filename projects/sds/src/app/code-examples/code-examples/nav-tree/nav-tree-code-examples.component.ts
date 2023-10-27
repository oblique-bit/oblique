import {NavTreeExampleDataFromServicePreviewComponent} from './previews/data-from-service/nav-tree-example-data-from-service-preview.component';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {NavTreeExampleDefaultPreviewComponent} from './previews/default/nav-tree-example-default-preview.component';
import {NavTreeExampleFilterPreviewComponent} from './previews/filter/nav-tree-example-filter-preview.component';
import {NavTreeExampleExpandCollapsePreviewComponent} from './previews/expand-collapse/nav-tree-example-expand-collapse-preview.component';

@Component({
	selector: 'app-code-example-nav-tree',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class NavTreeCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'nav-tree-examples';
	readonly previews: CodeExample[] = [
		{
			component: NavTreeExampleDefaultPreviewComponent,
			idParts: ['default'],
			title: 'Default',
			snippets: [
				this.getSnippet('nav-tree', 'default/nav-tree-example-default-preview.component.html', 'HTML'),
				this.getSnippet('nav-tree', 'default/nav-tree-example-default-preview.component.ts', 'TS')
			]
		},
		{
			component: NavTreeExampleFilterPreviewComponent,
			idParts: ['filter'],
			title: 'Filter',
			snippets: [
				this.getSnippet('nav-tree', 'filter/nav-tree-example-filter-preview.component.html', 'HTML'),
				this.getSnippet('nav-tree', 'filter/nav-tree-example-filter-preview.component.ts', 'TS')
			]
		},
		{
			component: NavTreeExampleExpandCollapsePreviewComponent,
			idParts: ['expand', 'collapse'],
			title: 'Expand / collapse',
			snippets: [
				this.getSnippet('nav-tree', 'expand-collapse/nav-tree-example-expand-collapse-preview.component.html', 'HTML'),
				this.getSnippet('nav-tree', 'expand-collapse/nav-tree-example-expand-collapse-preview.component.ts', 'TS'),
				this.getSnippet('nav-tree', 'expand-collapse/nav-tree-example-expand-collapse-preview.component.scss', 'SCSS')
			]
		},
		{
			component: NavTreeExampleDataFromServicePreviewComponent,
			idParts: ['data', 'from', 'service'],
			title: 'Data from a service',
			snippets: [
				this.getSnippet('nav-tree', 'data-from-service/nav-tree-example-data-from-service-preview.component.html', 'HTML'),
				this.getSnippet('nav-tree', 'data-from-service/nav-tree-example-data-from-service-preview.component.ts', 'TS'),
				this.getSnippet('nav-tree', 'data-from-service/nav-tree-data.service.ts', 'TS (Service)')
			]
		}
	];
}
