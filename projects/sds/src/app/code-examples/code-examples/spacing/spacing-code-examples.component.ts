import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {SpacingExampleSpacingPreviewComponent} from './previews/spacing/spacing-example-spacing-preview.component';

@Component({
	selector: 'app-code-example-spacing-and-layout',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class SpacingCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'spacing-examples';
	readonly previews: CodeExample[] = [
		{
			component: SpacingExampleSpacingPreviewComponent,
			idParts: ['spacing'],
			title: 'Spacing',
			snippets: [
				this.getSnippet('spacing', 'spacing/spacing-example-spacing-preview.component.html', 'HTML'),
				this.getSnippet('spacing', 'spacing/spacing-example-spacing-preview.component.ts', 'TS'),
				this.getSnippet('spacing', 'spacing/spacing-example-spacing-preview.component.scss', 'SCSS'),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'Flex Layout')
			]
		}
	];
}
