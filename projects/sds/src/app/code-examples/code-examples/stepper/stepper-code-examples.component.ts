import {ChangeDetectionStrategy, Component} from '@angular/core';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {StepperExampleDefaultPreviewComponent} from './previews/default/stepper-example-default-preview.component';
import {StepperExampleOtherOptionsPreviewComponent} from './previews/other-options/stepper-example-other-options-preview.component';
import {StepperExampleErrorPreviewComponent} from '../stepper/previews/error/stepper-example-error-preview.component';

@Component({
	selector: 'app-code-example-stepper',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class StepperCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'stepper-examples';
	readonly previews: CodeExample[] = [
		{
			component: StepperExampleDefaultPreviewComponent,
			idParts: ['default'],
			title: 'Default',
			snippets: [
				this.getSnippet('stepper', 'default/stepper-example-default-preview.component.html', 'HTML'),
				this.getSnippet('stepper', 'default/stepper-example-default-preview.component.ts', 'TS'),
				this.getSnippet('stepper', 'default/stepper-example-default-preview.component.scss', 'SCSS')
			]
		},
		{
			component: StepperExampleOtherOptionsPreviewComponent,
			idParts: ['other', 'options'],
			title: 'Other options',
			snippets: [
				this.getSnippet('stepper', 'other-options/stepper-example-other-options-preview.component.html', 'HTML'),
				this.getSnippet('stepper', 'other-options/stepper-example-other-options-preview.component.ts', 'TS'),
				this.getSnippet('stepper', 'other-options/stepper-example-other-options-preview.component.scss', 'SCSS')
			]
		},
		{
			component: StepperExampleErrorPreviewComponent,
			idParts: ['error'],
			title: 'Error icon',
			snippets: [
				this.getSnippet('stepper', 'error/stepper-example-error-preview.component.html', 'HTML'),
				this.getSnippet('stepper', 'error/stepper-example-error-preview.component.ts', 'TS')
			]
		}
	];
}
