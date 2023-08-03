import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {ProgressBarExampleColorsPreviewComponent} from './previews/colors/progress-bar-example-colors-preview.component';
import {ProgressBarExampleModesPreviewComponent} from './previews/modes/progress-bar-example-modes-preview.component';

@Component({
	selector: 'app-code-example-progress-bar',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class ProgressBarCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'progress-bar-examples';
	readonly previews: CodeExample[] = [
		{
			component: ProgressBarExampleColorsPreviewComponent,
			idParts: ['colors'],
			title: 'Progress bar colors',
			snippets: [
				this.getSnippet('progress-bar', 'colors/progress-bar-example-colors-preview.component.html', 'HTML'),
				this.getSnippet('progress-bar', 'colors/progress-bar-example-colors-preview.component.ts', 'TS'),
				this.getSnippet('progress-bar', 'colors/progress-bar-example-colors-preview.component.scss', 'SCSS')
			]
		},
		{
			component: ProgressBarExampleModesPreviewComponent,
			idParts: ['modes'],
			title: 'Progress bar modes',
			snippets: [
				this.getSnippet('progress-bar', 'modes/progress-bar-example-modes-preview.component.html', 'HTML'),
				this.getSnippet('progress-bar', 'modes/progress-bar-example-modes-preview.component.ts', 'TS'),
				this.getSnippet('progress-bar', 'modes/progress-bar-example-modes-preview.component.scss', 'SCSS')
			]
		}
	];
}
