import {ChangeDetectionStrategy, Component} from '@angular/core';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {SlideToggleExampleFirstColorsPreviewComponent} from './previews/first-colors/slide-toggle-example-first-colors-preview.component';
import {SlideToggleExampleSecondPreviewComponent} from './previews/second/slide-toggle-example-second-preview.component';

@Component({
	selector: 'app-code-example-slide-toggle',
	imports: [CommonModule, IdPipe, CodeExampleComponent],
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideToggleCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'slide-toggle-examples';
	readonly previews: CodeExample[] = [
		{
			component: SlideToggleExampleFirstColorsPreviewComponent,
			idParts: ['colors'],
			title: 'Colors',
			snippets: [
				this.getSnippet(
					'slide-toggle',
					'first-colors/slide-toggle-example-first-colors-preview.component.html',
					'HTML'
				),
				this.getSnippet('slide-toggle', 'first-colors/slide-toggle-example-first-colors-preview.component.ts', 'TS'),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'Flex Layout'),
			],
		},
		{
			component: SlideToggleExampleSecondPreviewComponent,
			idParts: ['other', 'options'],
			title: 'Other options',
			snippets: [
				this.getSnippet('slide-toggle', 'second/slide-toggle-example-second-preview.component.html', 'HTML'),
				this.getSnippet('slide-toggle', 'second/slide-toggle-example-second-preview.component.ts', 'TS'),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'Flex Layout'),
			],
		},
	];
}
