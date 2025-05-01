import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {GridSystemExampleGridPreviewComponent} from './previews/grid/grid-system-example-grid-preview.component';
import {GridSystemExampleFlexPreviewComponent} from './previews/flex/grid-system-example-flex-preview.component';

@Component({
	selector: 'app-code-example-grid-system',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
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
				this.getSnippet(this.directory, 'grid/grid-system-example-grid-preview.component.scss', 'SCSS')
			]
		},
		{
			component: GridSystemExampleFlexPreviewComponent,
			idParts: ['flex', 'system'],
			title: 'Flex system',
			snippets: [
				this.getSnippet(this.directory, 'flex/grid-system-example-flex-preview.component.html', 'HTML'),
				this.getSnippet(this.directory, 'flex/grid-system-example-flex-preview.component.scss', 'SCSS')
			]
		}
	];
}
