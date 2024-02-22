import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {TabsExampleBasicPreviewComponent} from './previews/basic/tabs-example-basic-preview.component';
import {TabsExampleVariationsPreviewComponent} from './previews/variations/tabs-example-variations-preview.component';

@Component({
	selector: 'app-code-example-tabs',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class TabsCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'tabs-examples';
	readonly previews: CodeExample[] = [
		{
			component: TabsExampleBasicPreviewComponent,
			idParts: ['basic'],
			title: 'Tabs basic',
			snippets: [
				this.getSnippet('tabs', 'basic/tabs-example-basic-preview.component.html', 'HTML'),
				this.getSnippet('tabs', 'basic/tabs-example-basic-preview.component.ts', 'TS')
			]
		},
		{
			component: TabsExampleVariationsPreviewComponent,
			idParts: ['variations'],
			title: 'Tabs variations',
			snippets: [
				this.getSnippet('tabs', 'variations/tabs-example-variations-preview.component.html', 'HTML'),
				this.getSnippet('tabs', 'variations/tabs-example-variations-preview.component.ts', 'TS'),
				this.getSnippet('tabs', 'variations/tabs-example-variations-preview.component.scss', 'SCSS')
			]
		}
	];
}
