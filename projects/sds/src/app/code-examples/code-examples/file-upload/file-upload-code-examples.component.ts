import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {FileUploadExampleFirstPreviewComponent} from './previews/first/file-upload-example-first-preview.component';
import {FileUploadExampleSecondPreviewComponent} from './previews/second/file-upload-example-second-preview.component';
import {FileUploadExampleThirdPreviewComponent} from './previews/third/file-upload-example-third-preview.component';
import {FileUploadExampleFourthPreviewComponent} from './previews/fourth/file-upload-example-fourth-preview.component';

@Component({
	selector: 'app-code-example-file-upload',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class FileUploadCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'file-upload-examples';
	readonly previews: CodeExample[] = [
		{
			component: FileUploadExampleFirstPreviewComponent,
			idParts: ['first'],
			title: 'Basic options',
			snippets: [
				this.getSnippet('file-upload', 'first/file-upload-example-first-preview.component.html', 'HTML'),
				this.getSnippet('file-upload', 'first/file-upload-example-first-preview.component.ts', 'TS')
			]
		},
		{
			component: FileUploadExampleSecondPreviewComponent,
			idParts: ['second'],
			title: 'Urls & <code>uploadEvent</code>',
			snippets: [
				this.getSnippet('file-upload', 'second/file-upload-example-second-preview.component.html', 'HTML'),
				this.getSnippet('file-upload', 'second/file-upload-example-second-preview.component.ts', 'TS')
			]
		},
		{
			component: FileUploadExampleThirdPreviewComponent,
			idParts: ['third'],
			title: 'Urls, <code>mapFunction</code> & <code>ob-file-info</code>',
			snippets: [
				this.getSnippet('file-upload', 'third/file-upload-example-third-preview.component.html', 'HTML'),
				this.getSnippet('file-upload', 'third/file-upload-example-third-preview.component.ts', 'TS')
			]
		},
		{
			component: FileUploadExampleFourthPreviewComponent,
			idParts: ['fourth'],
			title: 'Fully functioning mock example',
			snippets: [
				this.getSnippet('file-upload', 'fourth/file-upload-example-fourth-preview.component.html', 'HTML'),
				this.getSnippet('file-upload', 'fourth/file-upload-example-fourth-preview.component.ts', 'TS')
			]
		}
	];
}
