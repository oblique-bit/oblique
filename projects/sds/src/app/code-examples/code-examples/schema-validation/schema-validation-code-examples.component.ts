import {ChangeDetectionStrategy, Component} from '@angular/core';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {SchemaValidationExampleReactiveFormPreviewComponent} from './previews/reactive-form/schema-validation-example-reactive-form-preview.component';
import {SchemaValidationExampleTemplateDrivenFormPreviewComponent} from './previews/template-driven-form/schema-validation-example-template-driven-form-preview.component';

@Component({
	selector: 'app-code-example-schema-validation',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class SchemaValidationCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'schema-validation-examples';
	readonly previews: CodeExample[] = [
		{
			component: SchemaValidationExampleReactiveFormPreviewComponent,
			idParts: ['reactive', 'form'],
			title: 'Reactive Form',
			snippets: [
				this.getSnippet('schema-validation', 'reactive-form/schema-validation-example-reactive-form-preview.component.html', 'HTML'),
				this.getSnippet('schema-validation', 'reactive-form/schema-validation-example-reactive-form-preview.component.ts', 'TS')
			]
		},
		{
			component: SchemaValidationExampleTemplateDrivenFormPreviewComponent,
			idParts: ['template', 'driven', 'form'],
			title: 'Template Driven Form',
			snippets: [
				this.getSnippet(
					'schema-validation',
					'template-driven-form/schema-validation-example-template-driven-form-preview.component.html',
					'HTML'
				),
				this.getSnippet(
					'schema-validation',
					'template-driven-form/schema-validation-example-template-driven-form-preview.component.ts',
					'TS'
				)
			]
		}
	];
}
