import {Injectable} from '@angular/core';
import {HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class ObMockFileUploadService {
	uploadComplete$ = new Observable<void>();

	delete(deleteUrl: string, files: string[]): Observable<any> {
		return undefined;
	}

	getUploadedFiles(getUploadedFilesUrl: string): Observable<any> {
		return undefined;
	}

	multiUpload(uploadUrl: string, files: File[]): Observable<HttpEvent<unknown> | undefined> {
		return undefined;
	}

	notifyUploadComplete(): void {}

	upload(uploadUrl: string, file: File): Observable<HttpEvent<unknown> | undefined> {
		return undefined;
	}
}
