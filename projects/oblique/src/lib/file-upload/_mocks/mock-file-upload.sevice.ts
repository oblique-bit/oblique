import {Injectable} from '@angular/core';
import {HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Injectable()
export class ObMockFileUploadService {
	uploadComplete$ = new Observable<void>();

	delete(deleteUrl: string, files: string[]): Observable<unknown> {
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
