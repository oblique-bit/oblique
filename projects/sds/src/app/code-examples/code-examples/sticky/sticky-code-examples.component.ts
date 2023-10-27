import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {StickyExampleDefaultPreviewComponent} from './previews/default/sticky-example-default-preview.component';
import {StickyExampleSizesPreviewComponent} from './previews/sizes/sticky-example-sizes-preview.component';

@Component({
	selector: 'app-code-example-sticky',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class StickyCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'sticky-examples';
	readonly previews: CodeExample[] = [
		{
			component: StickyExampleDefaultPreviewComponent,
			idParts: ['default'],
			title: 'Default',
			snippets: [
				this.getSnippet('sticky', 'default/sticky-example-default-preview.component.html', 'HTML'),
				this.getSnippet('sticky', 'default/sticky-example-default-preview.component.ts', 'TS')
			]
		},
		{
			component: StickyExampleSizesPreviewComponent,
			idParts: ['sizes'],
			title: 'Sizes',
			snippets: [
				this.getSnippet('sticky', 'sizes/sticky-example-sizes-preview.component.html', 'HTML'),
				this.getSnippet('sticky', 'sizes/sticky-example-sizes-preview.component.ts', 'TS')
			]
		}
	];
}
