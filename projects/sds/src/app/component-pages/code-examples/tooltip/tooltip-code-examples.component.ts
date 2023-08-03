import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {TooltipExamplePositionPreviewComponent} from './previews/position/tooltip-example-position-preview.component';
import {IdPipe} from '../../../shared/id/id.pipe';
import {TooltipExampleBasicPreviewComponent} from './previews/basic/tooltip-example-basic-preview.component';

@Component({
	selector: 'app-code-example-tooltip',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class TooltipCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'tooltip-examples';
	readonly previews: CodeExample[] = [
		{
			component: TooltipExampleBasicPreviewComponent,
			idParts: ['basic'],
			title: 'Tooltip basic',
			snippets: [
				this.getSnippet('tooltip', 'basic/tooltip-example-basic-preview.component.html', 'HTML'),
				this.getSnippet('tooltip', 'basic/tooltip-example-basic-preview.component.ts', 'TS')
			]
		},
		{
			component: TooltipExamplePositionPreviewComponent,
			idParts: ['position'],
			title: 'Tooltip position',
			snippets: [
				this.getSnippet('tooltip', 'position/tooltip-example-position-preview.component.html', 'HTML'),
				this.getSnippet('tooltip', 'position/tooltip-example-position-preview.component.ts', 'TS'),
				this.getSnippet('tooltip', 'position/tooltip-example-position-preview.component.scss', 'SCSS')
			]
		}
	];
}
