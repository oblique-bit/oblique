import {Component} from '@angular/core';
import {ObIFileDescription, ObIUploadEvent} from '@oblique/oblique';

@Component({
	selector: 'ob-file-upload-sample',
	templateUrl: './file-upload-sample.component.html',
	styleUrls: ['./file-upload-sample.component.scss']
})
export class ObFileUploadSampleComponent {
	uploadUrl: string;
	deleteUrl = 'http://localhost:8080/delete';
	getUrl = 'http://localhost:8080/files';
	maxFileSize = 5;
	multipleFile = true;
	singleRequest = true;
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
