import {ChangeDetectionStrategy, Component} from '@angular/core';
import {type CodeExample, CodeExamples} from '../../code-examples.model';

import {CodeExampleComponent} from '../../code-example/code-example.component';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {TranslationsExampleStaticStackblitzLinkPreviewComponent} from './previews/stackblitz-link/translations-example-static-stackblitz-link-preview.component';
import {TranslationsExampleDynamicStackblitzLinkPreviewComponent} from './previews/stackblitz-link/translations-example-dynamic-stackblitz-link-preview.component';

@Component({
	selector: 'app-code-example-translations',
	imports: [CommonModule, IdPipe, CodeExampleComponent],
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslationsCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'translations-examples';
	readonly previews: CodeExample[] = [
		{
			component: TranslationsExampleStaticStackblitzLinkPreviewComponent,
			idParts: ['stackblitz', 'link', 'static'],
			title: 'Static language loading',
		},
		{
			component: TranslationsExampleDynamicStackblitzLinkPreviewComponent,
			idParts: ['stackblitz', 'link', 'dynamic'],
			title: 'Dynamic language loading',
		},
		{
			idParts: ['files'],
			title: 'Oblique translation files',
			snippets: [
				this.getJsonSnippet('oblique/src/assets/i18n', 'oblique-de.json', 'oblique-de.json'),
				this.getJsonSnippet('oblique/src/assets/i18n', 'oblique-en.json', 'oblique-en.json'),
				this.getJsonSnippet('oblique/src/assets/i18n', 'oblique-fr.json', 'oblique-fr.json'),
				this.getJsonSnippet('oblique/src/assets/i18n', 'oblique-it.json', 'oblique-it.json'),
			],
		},
	];
}
