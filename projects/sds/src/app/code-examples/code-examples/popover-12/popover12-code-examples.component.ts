import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {Popover12ExampleDefaultPreviewComponent} from './previews/default/popover12-example-default-preview.component';
import {Popover12ExampleOtherOptionsPreviewComponent} from './previews/other-options/popover12-example-other-options-preview.component';
import {Popover12ExampleEventsPreviewComponent} from './previews/events/popover12-example-events-preview.component';

@Component({
	selector: 'app-code-example-popover12',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class Popover12CodeExamplesComponent extends CodeExamples {
	readonly componentId = 'popover-examples';
	readonly previews: CodeExample[] = [
		{
			component: Popover12ExampleDefaultPreviewComponent,
			idParts: ['default'],
			title: 'Default',
			snippets: [
				this.getSnippet('popover-12', 'default/popover12-example-default-preview.component.html', 'HTML'),
				this.getSnippet('popover-12', 'default/popover12-example-default-preview.component.ts', 'TS')
			]
		},
		{
			component: Popover12ExampleOtherOptionsPreviewComponent,
			idParts: ['other', 'options'],
			title: 'Other options',
			snippets: [
				this.getSnippet('popover-12', 'other-options/popover12-example-other-options-preview.component.html', 'HTML'),
				this.getSnippet('popover-12', 'other-options/popover12-example-other-options-preview.component.ts', 'TS'),
				this.getSnippet('popover-12', 'other-options/popover12-example-other-options-preview.component.scss', 'SCSS'),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'Flex Layout')
			]
		},
		{
			component: Popover12ExampleEventsPreviewComponent,
			idParts: ['events'],
			title: 'Events',
			snippets: [
				this.getSnippet('popover-12', 'events/popover12-example-events-preview.component.html', 'HTML'),
				this.getSnippet('popover-12', 'events/popover12-example-events-preview.component.ts', 'TS'),
				this.getSnippet('popover-12', 'events/popover12-example-events-preview.component.scss', 'SCSS')
			]
		}
	];
}
