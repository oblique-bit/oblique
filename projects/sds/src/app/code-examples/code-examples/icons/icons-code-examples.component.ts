import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {IconsExampleDefaultPreviewComponent} from './previews/default/icons-example-default-preview.component';
import {IconsExampleFontSizePreviewComponent} from './previews/font-size/icons-example-font-size-preview.component';
import {IconsExampleIconsGalleryPreviewComponent} from './previews/icons-gallery/icons-example-icons-gallery-preview.component';

@Component({
	selector: 'app-code-example-icons',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
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
				this.getSnippet('icons', 'default/icons-example-default-preview.component.ts', 'TS')
			]
		},
		{
			component: IconsExampleFontSizePreviewComponent,
			idParts: ['font', 'size'],
			title: 'Icon Font Size',
			snippets: [
				this.getSnippet('icons', 'font-size/icons-example-font-size-preview.component.html', 'HTML'),
				this.getSnippet('icons', 'font-size/icons-example-font-size-preview.component.ts', 'TS'),
				this.getSnippet('icons', 'font-size/icons-example-font-size-preview.component.scss', 'SCSS')
			]
		},
		{
			component: IconsExampleIconsGalleryPreviewComponent,
			idParts: ['icons', 'gallery'],
			title: 'Icon Gallery'
		}
	];
}
