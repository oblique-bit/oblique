import {HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpUserEvent} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Subject, of} from 'rxjs';
import {catchError, filter} from 'rxjs/operators';
import {ObNotificationService} from '../notification/notification.service';
import {ObIFileDescription, ObTEventType} from './file-upload.model';

@Injectable({providedIn: 'root'})
export class ObFileUploadService {
	public uploadComplete$: Observable<void>;
	private readonly uploadComplete = new Subject<void>();
	private readonly events = [HttpEventType.UploadProgress, HttpEventType.Response];

	constructor(private readonly httpClient: HttpClient, private readonly notification: ObNotificationService) {
		this.uploadComplete$ = this.uploadComplete.asObservable();
	}

	public multiUpload(uploadUrl: string, files: File[]): Observable<HttpEvent<ObTEventType>> {
		const formData = new FormData();
		files.forEach(file => formData.append('files[]', file, file.name));
		return this.sendUploadRequest(formData, uploadUrl, files);
	}

	public upload(uploadUrl: string, file: File): Observable<HttpEvent<ObTEventType>> {
		const formData = new FormData();
		formData.append('file', file, file.name);
		return this.sendUploadRequest(formData, uploadUrl, [file]);
	}

	public notifyUploadComplete(): void {
		this.uploadComplete.next();
	}

	public getUploadedFiles(getUploadedFilesUrl: string): Observable<ObIFileDescription[]> {
		return this.httpClient.get<ObIFileDescription[]>(getUploadedFilesUrl);
	}

	public delete(deleteUrl: string, files: string[]): Observable<Object> {
		return this.httpClient.delete(`${deleteUrl}/${btoa(JSON.stringify(files))}`);
	}

	private sendUploadRequest(formData: FormData, uploadUrl: string, files: File[]): Observable<HttpEvent<ObTEventType>> {
		const request = new HttpRequest('POST', uploadUrl, formData, {reportProgress: true});
		return this.httpClient.request<HttpEventType.UploadProgress | HttpEventType.Response>(request).pipe(
			filter(event => this.events.includes(event.type)),
			catchError(() => {
				this.notification.error({
					message: 'i18n.oblique.file-upload.error.failed',
					messageParams: {errors: files.map(file => file.name).join(', ')},
					title: 'i18n.oblique.file-upload.error.title'
				});
				return of({type: HttpEventType.User, files} as HttpUserEvent<{type: HttpEventType; files: File[]}>);
			})
		);
	}
}
