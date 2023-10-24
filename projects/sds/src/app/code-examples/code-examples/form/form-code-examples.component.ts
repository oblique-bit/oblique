import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {FormExampleSizesPreviewComponent} from '../form/previews/sizes/form-example-sizes-preview.component';
import {FormExampleUxPreviewComponent} from '../form/previews/ux/form-example-ux-preview.component';
import {FormExampleHorizontalPreviewComponent} from '../form/previews/horizontal/form-example-horizontal-preview.component';
import {FormExampleInputClearPreviewComponent} from '../form/previews/input-clear/form-example-input-clear-preview.component';

@Component({
	selector: 'app-code-example-form',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class FormCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'form-examples';
	readonly previews: CodeExample[] = [
		{
			component: FormExampleSizesPreviewComponent,
			idParts: ['sizes'],
			title: 'Sizes',
			snippets: [
				this.getSnippet('form', 'sizes/form-example-sizes-preview.component.html', 'HTML'),
				this.getSnippet('form', 'sizes/form-example-sizes-preview.component.ts', 'TS'),
				this.getSnippet('form', 'sizes/form-example-sizes-preview.component.scss', 'SCSS')
			]
		},
		{
			component: FormExampleUxPreviewComponent,
			idParts: ['ux'],
			title: 'UX',
			snippets: [
				this.getSnippet('form', 'ux/form-example-ux-preview.component.html', 'HTML'),
				this.getSnippet('form', 'ux/form-example-ux-preview.component.ts', 'TS'),
				this.getSnippet('form', 'ux/form-example-ux-preview.component.scss', 'SCSS')
			]
		},
		{
			component: FormExampleHorizontalPreviewComponent,
			idParts: ['horizontal'],
			title: 'Horizontal',
			snippets: [
				this.getSnippet('form', 'horizontal/form-example-horizontal-preview.component.html', 'HTML'),
				this.getSnippet('form', 'horizontal/form-example-horizontal-preview.component.ts', 'TS')
			]
		},
		{
			component: FormExampleInputClearPreviewComponent,
			idParts: ['input', 'clear'],
			title: 'Input clear',
			snippets: [
				this.getSnippet('form', 'input-clear/form-example-input-clear-preview.component.html', 'HTML'),
				this.getSnippet('form', 'input-clear/form-example-input-clear-preview.component.ts', 'TS'),
				this.getSnippet('component-pages', 'code-example-flex-layout.scss', 'SCSS')
			]
		}
	];
}
