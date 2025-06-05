import {ChangeDetectionStrategy, Component} from '@angular/core';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {FocusInvalidExampleDefaultPreviewComponent} from '../focus-invalid/previews/default/focus-invalid-example-default-preview.component';

@Component({
	selector: 'app-code-example-focus-invalid',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class FocusInvalidCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'focus-invalid-examples';
	readonly previews: CodeExample[] = [
		{
			component: FocusInvalidExampleDefaultPreviewComponent,
			idParts: ['default'],
			title: 'Default',
			snippets: [
				this.getSnippet('focus-invalid', 'default/focus-invalid-example-default-preview.component.html', 'HTML'),
				this.getSnippet('focus-invalid', 'default/focus-invalid-example-default-preview.component.ts', 'TS'),
				this.getSnippet('focus-invalid', 'default/focus-invalid-example-default-preview.component.scss', 'SCSS')
			]
		}
	];
}
