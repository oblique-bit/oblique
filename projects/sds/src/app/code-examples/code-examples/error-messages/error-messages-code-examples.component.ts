import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {ErrorMessagesExampleTemplateDrivenFormPreviewComponent} from './previews/template-driven-form/error-messages-example-template-driven-form-preview.component';
import {ErrorMessagesExampleReactiveFormPreviewComponent} from './previews/reactive-form/error-messages-example-reactive-form-preview.component';

@Component({
	selector: 'app-code-example-error-messages',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class ErrorMessagesCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'error-messages-examples';
	readonly previews: CodeExample[] = [
		{
			component: ErrorMessagesExampleTemplateDrivenFormPreviewComponent,
			idParts: ['template', 'driven', 'form'],
			title: 'Template Driven Form',
			snippets: [
				this.getSnippet(
					'error-messages',
					'template-driven-form/error-messages-example-template-driven-form-preview.component.html',
					'HTML'
				),
				this.getSnippet('error-messages', 'template-driven-form/error-messages-example-template-driven-form-preview.component.ts', 'TS')
			]
		},
		{
			component: ErrorMessagesExampleReactiveFormPreviewComponent,
			idParts: ['reactive', 'form'],
			title: 'Reactive Form',
			snippets: [
				this.getSnippet('error-messages', 'reactive-form/error-messages-example-reactive-form-preview.component.html', 'HTML'),
				this.getSnippet('error-messages', 'reactive-form/error-messages-example-reactive-form-preview.component.ts', 'TS')
			]
		}
	];
}
