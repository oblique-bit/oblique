import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';

import {CodeExampleComponent} from '../../code-example/code-example.component';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {TranslationsExampleStackblitzLinkPreviewComponent} from '../translations/previews/stackblitz-link/translations-example-stackblitz-link-preview.component';

@Component({
	selector: 'app-code-example-translations',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class TranslationsCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'translations-examples';
	readonly previews: CodeExample[] = [
		{
			component: TranslationsExampleStackblitzLinkPreviewComponent,
			idParts: ['stackblitz', 'link'],
			title: 'Link to Stackblitz Example',
			snippets: []
		},
		{
			idParts: ['files'],
			title: 'Oblique translation files',
			snippets: [
				this.getJsonSnippet('node_modules/@oblique/oblique/src/assets/i18n', 'oblique-de.json', 'oblique-de.json'),
				this.getJsonSnippet('node_modules/@oblique/oblique/src/assets/i18n', 'oblique-en.json', 'oblique-en.json'),
				this.getJsonSnippet('node_modules/@oblique/oblique/src/assets/i18n', 'oblique-fr.json', 'oblique-fr.json'),
				this.getJsonSnippet('node_modules/@oblique/oblique/src/assets/i18n', 'oblique-it.json', 'oblique-it.json')
			]
		}
	];
}
