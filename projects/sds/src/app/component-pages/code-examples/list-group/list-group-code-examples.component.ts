import {Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {ListGroupExampleDefaultComponent} from './previews/default/list-group-example-default.component';
import {ListGroupExampleCheckBoxComponent} from './previews/checkbox/list-group-example-checkbox.component';
import {ListGroupExampleAvatarSubheaderComponent} from './previews/avatar-subheader/list-group-example-avatar-subheader.component';
import {ListGroupExampleIconCheckboxComponent} from './previews/icon-checkbox/list-group-example-icon-checkbox.component';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {CommonModule} from '@angular/common';
import {ListGroupExampleImagePreviewComponent} from '../list-group/previews/image/list-group-example-image-preview.component';

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
			idParts: ['list', 'group', 'default'],
			title: 'Default',
			snippets: [
				this.getSnippet('list-group', 'default/list-group-example-default.component.html', 'HTML'),
				this.getSnippet('list-group', 'default/list-group-example-default.component.ts', 'TS')
			]
		},
		{
			component: ListGroupExampleCheckBoxComponent,
			idParts: ['list', 'group', 'checkbox'],
			title: 'Checkbox',
			snippets: [
				this.getSnippet('list-group', 'checkbox/list-group-example-checkbox.component.html', 'HTML'),
				this.getSnippet('list-group', 'checkbox/list-group-example-checkbox.component.ts', 'TS')
			]
		},
		{
			component: ListGroupExampleAvatarSubheaderComponent,
			idParts: ['list', 'group', 'avatar', 'subheader'],
			title: 'Avatar & subheader',
			snippets: [
				this.getSnippet('list-group', 'avatar-subheader/list-group-example-avatar-subheader.component.html', 'HTML'),
				this.getSnippet('list-group', 'avatar-subheader/list-group-example-avatar-subheader.component.ts', 'TS')
			]
		},
		{
			component: ListGroupExampleIconCheckboxComponent,
			idParts: ['list', 'group', 'icon', 'checkbox'],
			title: 'Icons & checkbox',
			snippets: [
				this.getSnippet('list-group', 'icon-checkbox/list-group-example-icon-checkbox.component.html', 'HTML'),
				this.getSnippet('list-group', 'icon-checkbox/list-group-example-icon-checkbox.component.ts', 'TS')
			]
		},
		{
			component: ListGroupExampleImagePreviewComponent,
			idParts: ['image'],
			title: 'Image',
			snippets: [
				this.getSnippet('list-group', 'image/list-group-example-image-preview.component.html', 'HTML'),
				this.getSnippet('list-group', 'image/list-group-example-image-preview.component.ts', 'TS')
			]
		}
	];
}
