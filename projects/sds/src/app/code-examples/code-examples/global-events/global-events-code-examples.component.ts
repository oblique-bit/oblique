import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {GlobalEventsExamplePropertiesPreviewComponent} from '../global-events/previews/properties/global-events-example-properties-preview.component';
import {GlobalEventsExampleObOutsideFilterPreviewComponent} from '../global-events/previews/ob-outside-filter/global-events-example-ob-outside-filter-preview.component';

@Component({
	selector: 'app-code-example-global-events',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class GlobalEventsCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'global-events-examples';
	readonly previews: CodeExample[] = [
		{
			component: GlobalEventsExamplePropertiesPreviewComponent,
			idParts: ['properties'],
			title: 'Properties',
			snippets: [
				this.getSnippet('global-events', 'properties/global-events-example-properties-preview.component.html', 'HTML'),
				this.getSnippet('global-events', 'properties/global-events-example-properties-preview.component.ts', 'TS'),
				this.getSnippet('global-events', 'global-events-example-preview.component.scss', 'SCSS'),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'Flex Layout')
			]
		},
		{
			component: GlobalEventsExampleObOutsideFilterPreviewComponent,
			idParts: ['ob', 'outside', 'filter'],
			title: 'Outside filter',
			snippets: [
				this.getSnippet('global-events', 'ob-outside-filter/global-events-example-ob-outside-filter-preview.component.html', 'HTML'),
				this.getSnippet('global-events', 'ob-outside-filter/global-events-example-ob-outside-filter-preview.component.ts', 'TS'),
				this.getSnippet('global-events', 'global-events-example-preview.component.scss', 'SCSS'),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'Flex Layout')
			]
		}
	];
}
