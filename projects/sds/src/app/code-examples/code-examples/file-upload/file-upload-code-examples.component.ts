import {ChangeDetectionStrategy, Component} from '@angular/core';
import {type CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {FileUploadBasicOptionsPreviewComponent} from './previews/basic-options/file-upload-basic-options-preview.component';
import {FileUploadUploadEventPreviewComponent} from './previews/upload-event/file-upload-upload-event-preview.component';
import {FileUploadMapFunctionAndObFileInfoPreviewComponent} from './previews/map-function-and-ob-file-info/file-upload-map-function-and-ob-file-info-preview.component';
import {FileUploadFullyFunctioningPreviewComponent} from './previews/fully-functioning/file-upload-fully-functioning-preview.component';
import {FileUploadCancelUploadPreviewComponent} from './previews/cancel-upload/file-upload-cancel-upload-preview.component';
import {FileUploadFullyFunctioningWithCustomDeletePreviewComponent} from './previews/fully-functioning-with-custom-delete/file-upload-fully-functioning-with-custom-delete-preview.component';

@Component({
	selector: 'app-code-example-file-upload',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class FileUploadCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'file-upload-examples';
	readonly previews: CodeExample[] = [
		{
			component: FileUploadBasicOptionsPreviewComponent,
			idParts: ['basic-options'],
			title: 'Basic options',
			snippets: [
				this.getSnippet('file-upload', 'basic-options/file-upload-basic-options-preview.component.html', 'HTML'),
				this.getSnippet('file-upload', 'basic-options/file-upload-basic-options-preview.component.ts', 'TS'),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'Flex Layout')
			]
		},
		{
			component: FileUploadCancelUploadPreviewComponent,
			idParts: ['cancel-upload'],
			title: 'Cancel upload',
			snippets: [
				this.getSnippet('file-upload', 'cancel-upload/file-upload-cancel-upload-preview.component.html', 'HTML'),
				this.getSnippet('file-upload', 'cancel-upload/file-upload-cancel-upload-preview.component.ts', 'TS'),
				this.getSnippet('file-upload', 'cancel-upload/file-upload-cancel-upload-preview.component.scss', 'SCSS')
			]
		},
		{
			component: FileUploadUploadEventPreviewComponent,
			idParts: ['upload-event'],
			title: 'Urls & <code>uploadEvent</code>',
			snippets: [
				this.getSnippet('file-upload', 'upload-event/file-upload-upload-event-preview.component.html', 'HTML'),
				this.getSnippet('file-upload', 'upload-event/file-upload-upload-event-preview.component.ts', 'TS'),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'Flex Layout')
			]
		},
		{
			component: FileUploadMapFunctionAndObFileInfoPreviewComponent,
			idParts: ['map-function-and-ob-file-info'],
			title: 'Urls, <code>mapFunction</code> & <code>ob-file-info</code>',
			snippets: [
				this.getSnippet(
					'file-upload',
					'map-function-and-ob-file-info/file-upload-map-function-and-ob-file-info-preview.component.html',
					'HTML'
				),
				this.getSnippet(
					'file-upload',
					'map-function-and-ob-file-info/file-upload-map-function-and-ob-file-info-preview.component.ts',
					'TS'
				),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'Flex Layout')
			]
		},
		{
			component: FileUploadFullyFunctioningPreviewComponent,
			idParts: ['fully-functioning'],
			title: 'Fully functioning mock example',
			snippets: [
				this.getSnippet('file-upload', 'fully-functioning/file-upload-fully-functioning-preview.component.html', 'HTML'),
				this.getSnippet('file-upload', 'fully-functioning/file-upload-fully-functioning-preview.component.ts', 'TS'),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'Flex Layout')
			]
		},
		{
			component: FileUploadFullyFunctioningWithCustomDeletePreviewComponent,
			idParts: ['fully-functioning-with-custom-delete'],
			title: 'Fully functioning with custom delete mock example',
			snippets: [
				this.getSnippet(
					'file-upload',
					'fully-functioning-with-custom-delete/file-upload-fully-functioning-with-custom-delete-preview.component.html',
					'HTML'
				),
				this.getSnippet(
					'file-upload',
					'fully-functioning-with-custom-delete/file-upload-fully-functioning-with-custom-delete-preview.component.ts',
					'TS'
				),
				this.getSnippet('code-examples', 'code-example-flex-layout.scss', 'Flex Layout')
			]
		}
	];
}
