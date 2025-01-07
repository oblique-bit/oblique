import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {TypographyExampleInlineElementsPreviewComponent} from './previews/inline-elements/typography-example-inline-elements-preview.component';
import {TypographyExampleHeadingsPreviewComponent} from './previews/headings/typography-example-headings-preview.component';
import {TypographyExampleMixinsPreviewComponent} from './previews/mixins/typography-example-mixins-preview.component';
import {TypographyExampleBlockElementsPreviewComponent} from './previews/block-elements/typography-example-block-elements-preview.component';
import {TypographyExampleListsPreviewComponent} from '../typography/previews/lists/typography-example-lists-preview.component';

@Component({
	selector: 'app-code-example-typography',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class TypographyCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'typography-examples';
	readonly previews: CodeExample[] = [
		{
			component: TypographyExampleMixinsPreviewComponent,
			idParts: ['mixins'],
			title: 'Typography Mixins',
			snippets: [
				this.getSnippet('typography', 'mixins/typography-example-mixins-preview.component.html', 'HTML'),
				this.getSnippet('typography', 'mixins/typography-example-mixins-preview.component.ts', 'TS'),
				this.getSnippet('typography', 'mixins/typography-example-mixins-preview.component.scss', 'SCSS'),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'Flex Layout')
			]
		},
		{
			component: TypographyExampleHeadingsPreviewComponent,
			idParts: ['headings'],
			title: 'Headings',
			snippets: [
				this.getSnippet('typography', 'headings/typography-example-headings-preview.component.html', 'HTML'),
				this.getSnippet('typography', 'headings/typography-example-headings-preview.component.ts', 'TS')
			]
		},
		{
			component: TypographyExampleInlineElementsPreviewComponent,
			idParts: ['inline', 'elements'],
			title: 'Inline Elements',
			snippets: [
				this.getSnippet('typography', 'inline-elements/typography-example-inline-elements-preview.component.html', 'HTML'),
				this.getSnippet('typography', 'inline-elements/typography-example-inline-elements-preview.component.ts', 'TS'),
				this.getSnippet('typography', 'inline-elements/typography-example-inline-elements-preview.component.scss', 'SCSS')
			]
		},
		{
			component: TypographyExampleBlockElementsPreviewComponent,
			idParts: ['block', 'elements'],
			title: 'Block Elements',
			snippets: [
				this.getSnippet('typography', 'block-elements/typography-example-block-elements-preview.component.html', 'HTML'),
				this.getSnippet('typography', 'block-elements/typography-example-block-elements-preview.component.ts', 'TS'),
				this.getSnippet('typography', 'block-elements/typography-example-block-elements-preview.component.scss', 'SCSS')
			]
		},
		{
			component: TypographyExampleListsPreviewComponent,
			idParts: ['lists'],
			title: 'Lists',
			snippets: [
				this.getSnippet('typography', 'lists/typography-example-lists-preview.component.html', 'HTML'),
				this.getSnippet('typography', 'lists/typography-example-lists-preview.component.ts', 'TS')
			]
		}
	];
}
