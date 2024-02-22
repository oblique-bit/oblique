import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {TranslateParamsExampleDefaultPreviewComponent} from '../translate-params/previews/default/translate-params-example-default-preview.component';

@Component({
	selector: 'app-code-example-translate-params',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class TranslateParamsCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'translate-params-examples';
	readonly previews: CodeExample[] = [
		{
			component: TranslateParamsExampleDefaultPreviewComponent,
			idParts: ['default'],
			title: 'Default',
			snippets: [
				this.getSnippet('translate-params', 'default/translate-params-example-default-preview.component.html', 'HTML'),
				this.getSnippet('translate-params', 'default/translate-params-example-default-preview.component.ts', 'TS'),
				this.getJsonSnippet('i18n', 'en.json', 'JSON')
			]
		}
	];
}
