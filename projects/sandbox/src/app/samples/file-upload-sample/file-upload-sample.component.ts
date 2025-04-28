import {Component} from '@angular/core';
import {ObIFileDescription, ObIUploadEvent} from '@oblique/oblique';

@Component({
	selector: 'sb-file-upload-sample',
	templateUrl: './file-upload-sample.component.html',
	styleUrl: './file-upload-sample.component.scss',
	standalone: false
})
export class FileUploadSampleComponent {
	uploadUrl: string;
	deleteUrl = 'http://localhost:8080/delete';
	getUrl = 'http://localhost:8080/files';
	maxFileSize = 5;
	maxFileAmount = 0;
	multipleFile = true;
	singleRequest = true;
	toggleCustomMapForDelete = false;
	cancelConfirmation = true;
	acceptFilesOptions = [
		['*'],
		['.txt', '.ts'],
		['.txt', '.ts', '.xlsx'],
		['.txt', '.ts', '.xlsx', '.exe'],
		['.txt', '.ts', '.cs', '.xlsx', '.exe', 'text/html', '.tgz', '.zip']
	];
	acceptFiles = this.acceptFilesOptions[0];

	constructor() {
		this.setUploadURL();
	}

	customMapForDelete = (files: ObIFileDescription[]): string => files.map((file, index) => index).join(':');

	setUploadURL(): void {
		this.uploadUrl = this.singleRequest ? 'http://localhost:8080/multi-upload' : 'http://localhost:8080/upload';
	}

	uploadEvent(event: ObIUploadEvent): void {
		console.info(event);
	}

	mapData(files: ObIFileDescription[]): ObIFileDescription[] {
		return files.map(file => ({...file, test: 'test'}));
	}
}
