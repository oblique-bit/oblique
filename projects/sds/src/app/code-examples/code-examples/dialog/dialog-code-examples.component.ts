import {ChangeDetectionStrategy, Component} from '@angular/core';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {DialogExampleDefaultComponent} from './previews/default/dialog-example-default.component';
import {DialogExampleSpinnerComponent} from './previews/spinner/dialog-example-spinner.component';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';

@Component({
	selector: 'app-dialog-code-example',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CodeExampleComponent, CommonModule, IdPipe]
})
export class DialogCodeExamplesComponent extends CodeExamples {
	readonly previews: CodeExample[] = [
		{
			component: DialogExampleDefaultComponent,
			idParts: ['default'],
			title: 'Default',
			snippets: [
				this.getSnippet('dialog', 'default/dialog-example-default.component.html', 'HTML'),
				this.getSnippet('dialog', 'default/dialog-example-default.component.ts', 'TS'),
				this.getSnippet('dialog', 'default/example-dialog/example-dialog.component.html', 'HTML (DIALOG)'),
				this.getSnippet('dialog', 'default/example-dialog/example-dialog.component.ts', 'TS (DIALOG)')
			]
		},
		{
			component: DialogExampleSpinnerComponent,
			idParts: ['spinner'],
			title: 'Spinner',
			snippets: [
				this.getSnippet('dialog', 'spinner/dialog-example-spinner.component.html', 'HTML'),
				this.getSnippet('dialog', 'spinner/dialog-example-spinner.component.ts', 'TS'),
				this.getSnippet('dialog', 'spinner/example-dialog-spinner/example-dialog-spinner.component.html', 'HTML (DIALOG)'),
				this.getSnippet('dialog', 'spinner/example-dialog-spinner/example-dialog-spinner.component.ts', 'TS (DIALOG)')
			]
		}
	];
}
