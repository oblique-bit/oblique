import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {FocusWithOutlineExampleDefaultPreviewComponent} from './previews/default/focus-with-outline-example-default-preview.component';

@Component({
	selector: 'app-code-example-focus-with-outline',
	imports: [CommonModule, IdPipe, CodeExampleComponent],
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FocusWithOutlineExamplesComponent extends CodeExamples {
	readonly componentId = 'focus-with-outline-examples';
	readonly previews: CodeExample[] = [
		{
			component: FocusWithOutlineExampleDefaultPreviewComponent,
			idParts: ['default'],
			title: 'Default',
			snippets: [
				this.getSnippet('focus-with-outline', 'default/focus-with-outline-example-default-preview.component.html', 'HTML'),
				this.getSnippet('focus-with-outline', 'default/focus-with-outline-example-default-preview.component.ts', 'TS')
			]
		}
	];
}
