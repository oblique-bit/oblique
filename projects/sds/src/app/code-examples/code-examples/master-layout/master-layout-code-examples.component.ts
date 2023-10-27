import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {MasterLayoutExampleStackblitzLinkPreviewComponent} from './previews/stackblitz-link/master-layout-example-stackblitz-link-preview.component';

@Component({
	selector: 'app-code-example-master-layout',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class MasterLayoutCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'master-layout-examples';
	readonly previews: CodeExample[] = [
		{
			component: MasterLayoutExampleStackblitzLinkPreviewComponent,
			idParts: ['stackblitz', 'link'],
			title: 'Link to Stackblitz Example',
			snippets: []
		}
	];
}
