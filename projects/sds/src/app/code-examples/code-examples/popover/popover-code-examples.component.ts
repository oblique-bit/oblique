import {ChangeDetectionStrategy, Component} from '@angular/core';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {PopoverExampleDefaultPreviewComponent} from './previews/default/popover-example-default-preview.component';
import {PopoverExampleOtherOptionsPreviewComponent} from './previews/other-options/popover-example-other-options-preview.component';

@Component({
	selector: 'app-code-example-popover',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class PopoverCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'popover-examples';
	readonly previews: CodeExample[] = [
		{
			component: PopoverExampleDefaultPreviewComponent,
			idParts: ['default'],
			title: 'Default',
			snippets: [
				this.getSnippet('popover', 'default/popover-example-default-preview.component.html', 'HTML'),
				this.getSnippet('popover', 'default/popover-example-default-preview.component.ts', 'TS'),
				this.getSnippet('popover-12', 'default/popover12-example-default-preview.component.scss', 'SCSS'),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'Flex Layout')
			]
		},
		{
			component: PopoverExampleOtherOptionsPreviewComponent,
			idParts: ['other', 'options'],
			title: 'Other options',
			snippets: [
				this.getSnippet('popover', 'other-options/popover-example-other-options-preview.component.html', 'HTML'),
				this.getSnippet('popover', 'other-options/popover-example-other-options-preview.component.ts', 'TS'),
				this.getSnippet('popover', 'other-options/popover-example-other-options-preview.component.scss', 'SCSS'),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'Flex Layout')
			]
		}
	];
}
