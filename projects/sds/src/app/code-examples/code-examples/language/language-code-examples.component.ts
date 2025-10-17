import {ChangeDetectionStrategy, Component} from '@angular/core';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {LanguageExampleDefaultPreviewComponent} from './previews/default/language-example-default-preview.component';

@Component({
	selector: 'app-code-example-langugage',
	imports: [CommonModule, IdPipe, CodeExampleComponent],
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'language-examples';
	readonly previews: CodeExample[] = [
		{
			component: LanguageExampleDefaultPreviewComponent,
			idParts: ['default'],
			title: 'Language default',
			snippets: [
				this.getSnippet('language', 'default/language-example-default-preview.component.html', 'HTML'),
				this.getSnippet('language', 'default/language-example-default-preview.component.ts', 'TS')
			]
		}
	];
}
