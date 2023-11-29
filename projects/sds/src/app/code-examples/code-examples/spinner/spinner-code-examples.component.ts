import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {CustomChannelPreviewComponent} from './previews/custom-channel/custom-channel-preview.component';
import {MultipleActivationsPreviewComponent} from './previews/multiple-activations/multiple-activations-preview.component';

@Component({
	selector: 'app-spinner-code-examples',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CodeExampleComponent, CommonModule, IdPipe],
	standalone: true
})
export class SpinnerCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'spinner-examples';
	readonly previews: CodeExample[] = [
		{
			component: CustomChannelPreviewComponent,
			idParts: ['channel'],
			title: 'Spinner in a custom channel',
			snippets: [
				this.getSnippet('spinner', 'custom-channel/custom-channel-preview.component.html', 'HTML'),
				this.getSnippet('spinner', 'custom-channel/custom-channel-preview.component.ts', 'TS'),
				this.getSnippet('spinner', 'custom-channel/custom-channel-preview.component.scss', 'SCSS')
			]
		},
		{
			component: MultipleActivationsPreviewComponent,
			idParts: ['multiples', 'calls'],
			title: 'Spinner with multiple activations',
			snippets: [
				this.getSnippet('spinner', 'multiple-activations/multiple-activations-preview.component.html', 'HTML'),
				this.getSnippet('spinner', 'multiple-activations/multiple-activations-preview.component.ts', 'TS'),
				this.getSnippet('spinner', 'multiple-activations/multiple-activations-preview.component.scss', 'SCSS')
			]
		}
	];
}
