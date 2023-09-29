import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {ColumnLayoutExampleStackblitzLinkPreviewComponent} from '../column-layout/previews/stackblitz-link/column-layout-example-stackblitz-link-preview.component';

@Component({
	selector: 'app-code-example-column-layout',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class ColumnLayoutCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'column-layout-examples';
	readonly previews: CodeExample[] = [
		{
			component: ColumnLayoutExampleStackblitzLinkPreviewComponent,
			idParts: ['stackblitz', 'link'],
			title: 'Link to Stackblitz Example',
			snippets: []
		}
	];
}
