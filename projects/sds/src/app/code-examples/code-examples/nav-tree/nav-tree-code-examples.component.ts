import {NavTreeExampleDataFromServicePreviewComponent} from './previews/data-from-service/nav-tree-example-data-from-service-preview.component';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {NavTreeExampleDefaultPreviewComponent} from './previews/default/nav-tree-example-default-preview.component';
import {NavTreeExampleFilterPreviewComponent} from './previews/filter/nav-tree-example-filter-preview.component';
import {NavTreeExampleExpandCollapsePreviewComponent} from './previews/expand-collapse/nav-tree-example-expand-collapse-preview.component';
import {NavTreeExampleDisabledPreviewComponent} from './previews/disabled/nav-tree-example-disabled-preview.component';

@Component({
	selector: 'app-code-example-nav-tree',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class NavTreeCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'nav-tree-examples';
	readonly previews: CodeExample[] = [
		{
			component: NavTreeExampleDefaultPreviewComponent,
			idParts: ['default'],
			title: 'Default',
			snippets: []
		},
		{
			component: NavTreeExampleFilterPreviewComponent,
			idParts: ['filter'],
			title: 'Filter',
			snippets: []
		},
		{
			component: NavTreeExampleExpandCollapsePreviewComponent,
			idParts: ['expand', 'collapse'],
			title: 'Expand / collapse',
			snippets: []
		},
		{
			component: NavTreeExampleDataFromServicePreviewComponent,
			idParts: ['data', 'from', 'service'],
			title: 'Data from a service',
			snippets: []
		},
		{
			component: NavTreeExampleDisabledPreviewComponent,
			idParts: ['disabled'],
			title: 'Disabled',
			snippets: []
		}
	];
}
