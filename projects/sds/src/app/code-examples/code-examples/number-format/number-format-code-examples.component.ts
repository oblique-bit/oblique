import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {NumberFormatExampleDefaultWithTemplateFromPreviewComponent} from '../number-format/previews/default-with-template-from/number-format-example-default-with-template-from-preview.component';
import {NumberFormatExampleDefaultWithReactiveFormPreviewComponent} from '../number-format/previews/default-with-reactive-form/number-format-example-default-with-reactive-form-preview.component';
import {NumberFormatExampleOtherOptionsPreviewComponent} from '../number-format/previews/other-options/number-format-example-other-options-preview.component';

@Component({
	selector: 'app-code-example-number-format',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class NumberFormatCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'number-format-examples';
	readonly previews: CodeExample[] = [
		{
			component: NumberFormatExampleDefaultWithReactiveFormPreviewComponent,
			idParts: ['default', 'with', 'reactive', 'form'],
			title: 'Reactive',
			snippets: [
				this.getSnippet(
					'number-format',
					'default-with-reactive-form/number-format-example-default-with-reactive-form-preview.component.html',
					'HTML'
				),
				this.getSnippet(
					'number-format',
					'default-with-reactive-form/number-format-example-default-with-reactive-form-preview.component.ts',
					'TS'
				),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'SCSS')
			]
		},
		{
			component: NumberFormatExampleDefaultWithTemplateFromPreviewComponent,
			idParts: ['default', 'with', 'template', 'from'],
			title: 'Template driven',
			snippets: [
				this.getSnippet(
					'number-format',
					'default-with-template-from/number-format-example-default-with-template-from-preview.component.html',
					'HTML'
				),
				this.getSnippet(
					'number-format',
					'default-with-template-from/number-format-example-default-with-template-from-preview.component.ts',
					'TS'
				),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'SCSS')
			]
		},
		{
			component: NumberFormatExampleOtherOptionsPreviewComponent,
			idParts: ['other', 'options'],
			title: 'Other options',
			snippets: [
				this.getSnippet('number-format', 'other-options/number-format-example-other-options-preview.component.html', 'HTML'),
				this.getSnippet('number-format', 'other-options/number-format-example-other-options-preview.component.ts', 'TS'),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'SCSS')
			]
		}
	];
}
