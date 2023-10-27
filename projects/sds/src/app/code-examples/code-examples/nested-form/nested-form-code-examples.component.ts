import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {NestedFormExampleReactivePreviewComponent} from './previews/reactive/nested-form-example-reactive-preview.component';
import {NestedFormExampleTemplateDrivenPreviewComponent} from './previews/template-driven/nested-form-example-template-driven-preview.component';

@Component({
	selector: 'app-code-example-nested-form',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class NestedFormCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'nested-form-examples';
	readonly previews: CodeExample[] = [
		{
			component: NestedFormExampleReactivePreviewComponent,
			idParts: ['reactive'],
			title: 'Reactive',
			snippets: [
				this.getSnippet('nested-form', 'reactive/nested-form-example-reactive-preview.component.html', 'HTML'),
				this.getSnippet('nested-form', 'reactive/nested-form-example-reactive-preview.component.ts', 'TS'),
				this.getSnippet('nested-form', 'reactive/child/nested-form-example-reactive-preview-child.component.html', 'HTML (child)'),
				this.getSnippet('nested-form', 'reactive/child/nested-form-example-reactive-preview-child.component.ts', 'TS (child)'),
				this.getSnippet(
					'nested-form',
					'reactive/grandchild/nested-form-example-reactive-preview-grandchild.component.html',
					'HTML (grandchild)'
				),
				this.getSnippet(
					'nested-form',
					'reactive/grandchild/nested-form-example-reactive-preview-grandchild.component.ts',
					'TS (grandchild)'
				),
				this.getSnippet('nested-form', 'nested-form-example-preview.scss', 'SCSS')
			]
		},
		{
			component: NestedFormExampleTemplateDrivenPreviewComponent,
			idParts: ['template', 'driven'],
			title: 'Template driven',
			snippets: [
				this.getSnippet('nested-form', 'template-driven/nested-form-example-template-driven-preview.component.html', 'HTML'),
				this.getSnippet('nested-form', 'template-driven/nested-form-example-template-driven-preview.component.ts', 'TS'),
				this.getSnippet(
					'nested-form',
					'template-driven/child/nested-form-example-template-driven-preview-child.component.html',
					'HTML (child)'
				),
				this.getSnippet(
					'nested-form',
					'template-driven/child/nested-form-example-template-driven-preview-child.component.ts',
					'TS (child)'
				),
				this.getSnippet(
					'nested-form',
					'template-driven/grandchild/nested-form-example-template-driven-preview-grandchild.component.html',
					'HTML (grandchild)'
				),
				this.getSnippet(
					'nested-form',
					'template-driven/grandchild/nested-form-example-template-driven-preview-grandchild.component.ts',
					'TS (grandchild)'
				),
				this.getSnippet('nested-form', 'nested-form-example-preview.scss', 'SCSS')
			]
		}
	];
}
