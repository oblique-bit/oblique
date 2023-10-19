import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {OffCanvasExampleStackblitzLinkPreviewComponent} from '../off-canvas/previews/stackblitz-link/off-canvas-example-stackblitz-link-preview.component';

@Component({
	selector: 'app-code-example-off-canvas',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class OffCanvasCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'off-canvas-examples';
	readonly previews: CodeExample[] = [
		{
			component: OffCanvasExampleStackblitzLinkPreviewComponent,
			idParts: ['stackblitz', 'link'],
			title: 'Link to Stackblitz Example',
			snippets: [
				this.getSnippet('off-canvas', 'stackblitz-link/off-canvas-example-stackblitz-link-preview.component.html', 'HTML'),
				this.getSnippet('off-canvas', 'stackblitz-link/off-canvas-example-stackblitz-link-preview.component.ts', 'TS')
			]
		}
	];
}
