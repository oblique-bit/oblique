import {ChangeDetectionStrategy, Component} from '@angular/core';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';

import {CodeExampleComponent} from '../../code-example/code-example.component';
import {ColumnLayoutExampleStackblitzLinkPreviewComponent} from './previews/stackblitz-link/column-layout-example-stackblitz-link-preview.component';
import {ColumnLayoutExampleStackblitzLinkFullHeightPreviewComponent} from './previews/stackblitz-link-full-height/column-layout-example-stackblitz-link-full-height-preview.component';

@Component({
	selector: 'app-code-example-column-layout',
	imports: [IdPipe, CodeExampleComponent],
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnLayoutCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'column-layout-examples';
	readonly previews: CodeExample[] = [
		{
			component: ColumnLayoutExampleStackblitzLinkPreviewComponent,
			idParts: ['stackblitz', 'link'],
			title: 'Link to Stackblitz Example',
		},
		{
			component: ColumnLayoutExampleStackblitzLinkFullHeightPreviewComponent,
			idParts: ['stackblitz', 'link', 'full-height'],
			title: 'Link to Stackblitz Full Height Example',
		},
	];
}
