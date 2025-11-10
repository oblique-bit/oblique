import {Injectable} from '@angular/core';
import {
	type HttpEvent,
	HttpEventType,
	type HttpHandler,
	type HttpInterceptor,
	type HttpProgressEvent,
	type HttpRequest,
	HttpResponse,
} from '@angular/common/http';
import type {ObIFileDescription} from '@oblique/oblique';
import {map, takeWhile} from 'rxjs/operators';
import {type Observable, concatWith, interval, of, tap} from 'rxjs';

export const mockUploadURL = 'mockUploadURL';
export const mockGetUploadedFilesURL = 'mockGetUploadedFilesURL';
export const mockDeleteURL = 'mockDeleteURL';
export const mockCustomDeleteURL = 'mockCustomDeleteURL';

type UploadEvent = HttpProgressEvent | HttpResponse<unknown>;

@Injectable()
export class UploadInterceptor implements HttpInterceptor {
	private readonly uploadedFiles: Record<string, ObIFileDescription[]> = {};

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		const [baseUrl, id, files] = request.url.split('/');

		switch (baseUrl) {
			case mockUploadURL:
				return this.mockUpload(id, request.body);
			case mockGetUploadedFilesURL:
				return this.mockGetUploadedFiles(id);
			case mockDeleteURL:
				return this.mockDelete(id, JSON.parse(atob(files)) as string[]);
			case mockCustomDeleteURL:
				return this.mockDelete(id, files.split(':'));
			default:
				return next.handle(request);
		}
	}

	private mockUpload(id: string, body: unknown): Observable<UploadEvent> {
		if (!body || !(body instanceof FormData)) {
			return of(new HttpResponse({status: 200}));
		}
		const files = body
			.getAll(body.has('files[]') ? 'files[]' : 'file')
			.map(file => (file instanceof File ? {name: file.name, size: file.size} : {name: file, size: 0}));
		const totalSize = files.reduce((size, file) => size + file.size, 0);
		const progressEvents = this.buildProgressEvents(totalSize, 5);
		const responseEvent = of(new HttpResponse()).pipe(tap(() => this.updateUploadedFiles(files, id)));

		return progressEvents.pipe(concatWith(responseEvent));
	}

	private mockGetUploadedFiles(id: string): Observable<HttpResponse<ObIFileDescription[]>> {
		return of(
			new HttpResponse({
				status: 200,
				body: this.uploadedFiles[id],
			})
		);
	}

	private mockDelete(id: string, files: string[]): Observable<HttpEvent<unknown>> {
		this.uploadedFiles[id] = this.uploadedFiles[id].filter(file => files.includes(file.name));

		return of(new HttpResponse({status: 200}));
	}

	private buildProgressEvents(size: number, chunksNumber: number): Observable<HttpProgressEvent> {
		const chunkSize = Math.floor(size / chunksNumber);

		return interval(400).pipe(
			map(index => this.buildUploadProgressEvent(Math.min(chunkSize * (index + 1), size), size)),
			takeWhile(event => event.loaded < size, true)
		);
	}

	private buildUploadProgressEvent(loaded: number, total: number): HttpProgressEvent {
		return {
			type: HttpEventType.UploadProgress,
			loaded,
			total,
		};
	}

	private updateUploadedFiles(files: ObIFileDescription[], id: string): void {
		files.forEach(file => {
			if (!this.uploadedFiles[id]) {
				this.uploadedFiles[id] = [];
			}
			if (!this.uploadedFiles[id].find(uploadedFile => uploadedFile.name === file.name)) {
				this.uploadedFiles[id].push({name: file.name});
			}
		});
	}
}
