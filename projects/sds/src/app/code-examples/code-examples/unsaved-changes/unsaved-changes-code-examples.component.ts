import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {UnsavedChangesExampleStackblitzLinkPreviewComponent} from '../unsaved-changes/previews/stackblitz-link/unsaved-changes-example-stackblitz-link-preview.component';

@Component({
	selector: 'app-code-example-unsaved-changes',
	imports: [CommonModule, IdPipe, CodeExampleComponent],
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnsavedChangesCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'unsaved-changes-examples';
	readonly previews: CodeExample[] = [
		{
			component: UnsavedChangesExampleStackblitzLinkPreviewComponent,
			idParts: ['stackblitz', 'link'],
			title: 'Link to Stackblitz Example',
		},
	];
}
