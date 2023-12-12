import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {TypographyExampleTypographyPreviewComponent} from './previews/typography/typography-example-typography-preview.component';

@Component({
	selector: 'app-code-example-typography',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class TypographyCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'typography-examples';
	readonly previews: CodeExample[] = [
		{
			component: TypographyExampleTypographyPreviewComponent,
			idParts: ['typography'],
			snippets: [
				this.getSnippet('typography', 'typography/typography-example-typography-preview.component.html', 'HTML'),
				this.getSnippet('typography', 'typography/typography-example-typography-preview.component.ts', 'TS'),
				this.getSnippet('typography', 'typography/typography-example-typography-preview.component.scss', 'SCSS')
			]
		}
	];
}
