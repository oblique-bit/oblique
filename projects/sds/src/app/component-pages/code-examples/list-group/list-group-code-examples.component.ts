import {Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {ListGroupExampleDefaultComponent} from './previews/list-group-example-default/list-group-example-default.component';
import {ListGroupExampleCheckBoxComponent} from './previews/list-group-example-checkbox/list-group-example-checkbox.component';
import {ListGroupExampleIconComponent} from './previews/list-group-example-icon/list-group-example-icon.component';
import {ListGroupExampleIconCheckboxComponent} from './previews/list-group-example-icon-checkbox/list-group-example-icon-checkbox.component';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {CommonModule} from '@angular/common';

@Component({
	selector: 'app-list-group-code-examples',
	templateUrl: '../../code-examples.component.html',
	standalone: true,
	imports: [CommonModule, CodeExampleComponent, IdPipe]
})
export class ListGroupCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'list-group-examples';

	readonly previews: CodeExample[] = [
		{
			component: ListGroupExampleDefaultComponent,
			idParts: ['default'],
			title: 'Default list group',
			snippets: [
				this.getSnippet('list-group', 'list-group-example-default/list-group-example-default.component.html', 'HTML'),
				this.getSnippet('list-group', 'list-group-example-default/list-group-example-default.component.ts', 'TS')
			]
		},
		{
			component: ListGroupExampleCheckBoxComponent,
			idParts: ['list group', 'checkbox'],
			title: 'List group with checkbox',
			snippets: [
				this.getSnippet('list-group', 'list-group-example-checkbox/list-group-example-checkbox.component.html', 'HTML'),
				this.getSnippet('list-group', 'list-group-example-checkbox/list-group-example-checkbox.component.ts', 'TS')
			]
		},
		{
			component: ListGroupExampleIconComponent,
			idParts: ['list group', 'icon'],
			title: 'List group with icons',
			snippets: [
				this.getSnippet('list-group', 'list-group-example-icon/list-group-example-icon.component.html', 'HTML'),
				this.getSnippet('list-group', 'list-group-example-icon/list-group-example-icon.component.ts', 'TS')
			]
		},
		{
			component: ListGroupExampleIconCheckboxComponent,
			idParts: ['list group', 'icon', 'checkbox'],
			title: 'List group with icons and checkbox',
			snippets: [
				this.getSnippet('list-group', 'list-group-example-icon-checkbox/list-group-example-icon-checkbox.component.html', 'HTML'),
				this.getSnippet('list-group', 'list-group-example-icon-checkbox/list-group-example-icon-checkbox.component.ts', 'TS')
			]
		}
	];
}
