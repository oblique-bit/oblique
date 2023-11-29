import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {UnsavedChangesExampleStackblitzLinkPreviewComponent} from '../unsaved-changes/previews/stackblitz-link/unsaved-changes-example-stackblitz-link-preview.component';

@Component({
	selector: 'app-code-example-unsaved-changes',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class UnsavedChangesCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'unsaved-changes-examples';
	readonly previews: CodeExample[] = [
		{
			component: UnsavedChangesExampleStackblitzLinkPreviewComponent,
			idParts: ['stackblitz', 'link'],
			title: 'Link to Stackblitz Example',
			snippets: []
		}
	];
}
