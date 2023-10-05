import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {GridSystemExampleGridPreviewComponent} from '../grid-system/previews/grid/grid-system-example-grid-preview.component';
import {GridSystemExampleFlexPreviewComponent} from '../grid-system/previews/flex/grid-system-example-flex-preview.component';

@Component({
	selector: 'app-code-example-grid-system',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class GridSystemCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'grid-system-examples';
	readonly directory: string = 'grid-system';

	readonly previews: CodeExample[] = [
		{
			component: GridSystemExampleGridPreviewComponent,
			idParts: ['grid', 'system'],
			title: 'Grid system',
			snippets: [
				this.getSnippet(this.directory, 'grid/grid-system-example-grid-preview.component.html', 'HTML'),
				this.getSnippet(this.directory, 'grid/grid-system-example-grid-preview.component.ts', 'TS'),
				this.getSnippet(this.directory, 'grid-system.scss', 'SCSS')
			]
		},
		{
			component: GridSystemExampleFlexPreviewComponent,
			idParts: ['flex', 'system'],
			title: 'Flex system',
			snippets: [
				this.getSnippet(this.directory, 'flex/grid-system-example-flex-preview.component.html', 'HTML'),
				this.getSnippet(this.directory, 'flex/grid-system-example-flex-preview.component.ts', 'TS'),
				this.getSnippet(this.directory, 'grid-system.scss', 'SCSS')
			]
		}
	];
}
