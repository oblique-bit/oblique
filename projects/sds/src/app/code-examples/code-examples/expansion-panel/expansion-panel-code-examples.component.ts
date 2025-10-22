import {ChangeDetectionStrategy, Component} from '@angular/core';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {ExpansionPanelExampleTogglePreviewComponent} from './previews/toggle/expansion-panel-example-toggle-preview.component';
import {ExpansionPanelExampleBasicPreviewComponent} from './previews/basic/expansion-panel-example-basic-preview.component';
import {ExpansionPanelExampleOtherOptionsPreviewComponent} from './previews/other-options/expansion-panel-example-other-options-preview.component';

@Component({
	selector: 'app-code-example-expansion-panel',
	imports: [CommonModule, IdPipe, CodeExampleComponent],
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpansionPanelCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'expansion-panel-examples';
	readonly previews: CodeExample[] = [
		{
			component: ExpansionPanelExampleBasicPreviewComponent,
			idParts: ['basic'],
			title: 'Basic',
			snippets: [
				this.getSnippet('expansion-panel', 'basic/expansion-panel-example-basic-preview.component.html', 'HTML'),
				this.getSnippet('expansion-panel', 'basic/expansion-panel-example-basic-preview.component.ts', 'TS')
			]
		},
		{
			component: ExpansionPanelExampleTogglePreviewComponent,
			idParts: ['toggle'],
			title: 'Toggle Position',
			snippets: [
				this.getSnippet('expansion-panel', 'toggle/expansion-panel-example-toggle-preview.component.html', 'HTML'),
				this.getSnippet('expansion-panel', 'toggle/expansion-panel-example-toggle-preview.component.ts', 'TS')
			]
		},
		{
			component: ExpansionPanelExampleOtherOptionsPreviewComponent,
			idParts: ['other', 'options'],
			title: 'Other Options',
			snippets: [
				this.getSnippet('expansion-panel', 'other-options/expansion-panel-example-other-options-preview.component.html', 'HTML'),
				this.getSnippet('expansion-panel', 'other-options/expansion-panel-example-other-options-preview.component.ts', 'TS')
			]
		}
	];
}
