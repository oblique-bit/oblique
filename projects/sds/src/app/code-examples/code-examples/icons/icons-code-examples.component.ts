import {ChangeDetectionStrategy, Component} from '@angular/core';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {IconsExampleDefaultPreviewComponent} from './previews/default/icons-example-default-preview.component';
import {IconsExampleFontSizePreviewComponent} from './previews/font-size/icons-example-font-size-preview.component';
import {IconsExampleTextPreviewComponent} from './previews/text/icons-example-text-preview.component';

@Component({
	selector: 'app-code-example-icons',
	imports: [CommonModule, IdPipe, CodeExampleComponent],
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconsCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'icons-examples';
	readonly previews: CodeExample[] = [
		{
			component: IconsExampleDefaultPreviewComponent,
			idParts: ['default'],
			title: 'Icon Default',
			snippets: [
				this.getSnippet('icons', 'default/icons-example-default-preview.component.html', 'HTML'),
				this.getSnippet('icons', 'default/icons-example-default-preview.component.ts', 'TS'),
			],
		},
		{
			component: IconsExampleTextPreviewComponent,
			idParts: ['text'],
			title: 'Icon text',
			snippets: [
				this.getSnippet('icons', 'text/icons-example-text-preview.component.html', 'HTML'),
				this.getSnippet('icons', 'text/icons-example-text-preview.component.ts', 'TS'),
			],
		},
		{
			component: IconsExampleFontSizePreviewComponent,
			idParts: ['font', 'size'],
			title: 'Icon Font Size',
			snippets: [
				this.getSnippet('icons', 'font-size/icons-example-font-size-preview.component.html', 'HTML'),
				this.getSnippet('icons', 'font-size/icons-example-font-size-preview.component.ts', 'TS'),
				this.getSnippet('icons', 'font-size/icons-example-font-size-preview.component.scss', 'SCSS'),
			],
		},
	];
}
