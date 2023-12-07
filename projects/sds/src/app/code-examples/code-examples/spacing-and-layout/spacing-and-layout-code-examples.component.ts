import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {SpacingAndLayoutExampleLayoutPreviewComponent} from './previews/layout/spacing-and-layout-example-layout-preview.component';
import {SpacingAndLayoutExampleSpacingPreviewComponent} from './previews/spacing/spacing-and-layout-example-spacing-preview.component';

@Component({
	selector: 'app-code-example-spacing-and-layout',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class SpacingAndLayoutCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'spacing-and-layout-examples';
	readonly previews: CodeExample[] = [
		{
			component: SpacingAndLayoutExampleSpacingPreviewComponent,
			idParts: ['spacing'],
			title: 'Spacing',
			snippets: [
				this.getSnippet('spacing-and-layout', 'spacing/spacing-and-layout-example-spacing-preview.component.html', 'HTML'),
				this.getSnippet('spacing-and-layout', 'spacing/spacing-and-layout-example-spacing-preview.component.ts', 'TS'),
				this.getSnippet('spacing-and-layout', 'spacing/spacing-and-layout-example-spacing-preview.component.scss', 'SCSS')
			]
		},
		{
			component: SpacingAndLayoutExampleLayoutPreviewComponent,
			idParts: ['layout'],
			title: 'Layout',
			snippets: [
				this.getSnippet('spacing-and-layout', 'layout/spacing-and-layout-example-layout-preview.component.html', 'HTML'),
				this.getSnippet('spacing-and-layout', 'layout/spacing-and-layout-example-layout-preview.component.ts', 'TS'),
				this.getSnippet('spacing-and-layout', 'layout/spacing-and-layout-example-layout-preview.component.scss', 'SCSS')
			]
		}
	];
}
