import {Injectable, OnDestroy} from '@angular/core';
import {HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {ObIFileDescription} from '@oblique/oblique';
import {map, take, takeUntil} from 'rxjs/operators';
import {BehaviorSubject, Observable, Subject, combineLatest, interval, of} from 'rxjs';

const mockUploadURL = 'mockUploadURL';
const mockGetUploadedFilesURL = 'mockGetUploadedFilesURL';
const mockDeleteURL = 'mockDeleteURL';

@Injectable()
export class UploadInterceptor implements HttpInterceptor, OnDestroy {
	private readonly unsubscribe = new Subject<void>();
	private readonly uploadedFiles: BehaviorSubject<Record<string, ObIFileDescription[]>> = new BehaviorSubject<
		Record<string, ObIFileDescription[]>
	>({} as Record<string, ObIFileDescription[]>);
	private readonly uploadingFiles: BehaviorSubject<Record<string, ObIFileDescription[]>> = new BehaviorSubject<
		Record<string, ObIFileDescription[]>
	>({} as Record<string, ObIFileDescription[]>);

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	intercept(req: HttpRequest<Request>, next: HttpHandler): Observable<HttpEvent<any>> {
		const urlParts = req.url.split('/');
		const baseUrl = urlParts[0];
		const idx = urlParts[1];
		this.initUploadedFilesIdx(idx);
		this.initUploadingFilesIdx(idx);

		switch (baseUrl) {
			case mockUploadURL:
				return this.mockUpload(req.body.has('files[]') ? req.body.getAll('files[]') : req.body.getAll('file'), idx);
			case mockGetUploadedFilesURL:
				return this.mockGetUploadedFiles(idx);
			case mockDeleteURL:
				return this.mockDelete(JSON.parse(atob(urlParts[2])) as string[], idx);
			default:
				return next.handle(req);
		}
	}

	mockCancel(files: File[], idx: number): void {
		const index = (idx + 1).toString();
		this.getUploadingFiles(index)
			.pipe(take(1), takeUntil(this.unsubscribe))
			.subscribe(uploadingFiles => {
				this.updateUploadingFiles(
					uploadingFiles.filter(uploadingFile => !files.map(canceledFile => canceledFile.name).includes(uploadingFile.name)),
					index
				);
			});
	}

	private mockDelete(files: string[], idx: string): Observable<HttpEvent<unknown>> {
		this.getUploadedFiles(idx)
			.pipe(take(1), takeUntil(this.unsubscribe))
			.subscribe(uploadedFiles => {
				this.updateUploadedFiles(
					uploadedFiles.filter(uploadedFile => !files.includes(uploadedFile.name)),
					idx
				);
			});

		return of(new HttpResponse({status: 200}));
	}

	private mockGetUploadedFiles(idx: string): Observable<HttpEvent<ObIFileDescription[]>> {
		return this.getUploadedFiles(idx).pipe(
			take(1),
			map(
				uploadedFiles =>
					new HttpResponse({
						status: 200,
						body: uploadedFiles
					})
			)
		);
	}

	private mockUpload(files: File[], idx: string): Observable<HttpEvent<HttpEventType.Response | HttpEventType.UploadProgress>> {
		const obFileDescriptions = files.map(file => ({name: file.name}));
		this.getUploadingFiles(idx)
			.pipe(take(1), takeUntil(this.unsubscribe))
			.subscribe(uploadingFiles => {
				this.updateUploadingFiles([...uploadingFiles, ...obFileDescriptions], idx);
			});
		const totalSize = files.reduce((size, file) => size + file.size, 0);
		const events = this.buildHttpEvents(totalSize);

		const allUploadEvents$ = interval(Math.ceil(totalSize / 100)).pipe(
			take(events.length),
			takeUntil(this.unsubscribe),
			map(eventIdx => events[eventIdx])
		);

		allUploadEvents$.pipe(takeUntil(this.unsubscribe)).subscribe({
			complete: () => {
				combineLatest([this.getUploadedFiles(idx), this.getUploadingFiles(idx)])
					.pipe(take(1), takeUntil(this.unsubscribe))
					.subscribe(([uploadedFiles, uploadingFiles]) => {
						this.updateUploadedFiles(
							[
								...uploadedFiles,
								...uploadingFiles.filter(file => obFileDescriptions.map(obFileDescription => obFileDescription.name).includes(file.name))
							].filter((file, index, arr) => arr.findIndex(item => item.name === file.name) === index),
							idx
						);
					});
			}
		});

		return allUploadEvents$;
	}

	private buildHttpEvents(totalSize: number): HttpEvent<HttpEventType.Response | HttpEventType.UploadProgress>[] {
		const chunksNumber = 5;
		const chunkSize = Math.ceil(totalSize / chunksNumber);
		return [...Array(chunksNumber).keys()]
			.reverse()
			.reduce(
				(tot, current) => [this.buildUploadProgressEvent(chunkSize * (current + 1), totalSize), ...tot],
				[{type: HttpEventType.Response} as HttpEvent<HttpEventType.Response | HttpEventType.UploadProgress>]
			);
	}

	private buildUploadProgressEvent(loaded: number, total: number): HttpEvent<HttpEventType.UploadProgress> {
		return {type: HttpEventType.UploadProgress, loaded, total};
	}

	private getUploadingFiles(idx: string): Observable<ObIFileDescription[]> {
		return this.uploadingFiles.pipe(
			take(1),
			takeUntil(this.unsubscribe),
			map(uploadingFiles => uploadingFiles[idx] ?? [])
		);
	}

	private getUploadedFiles(idx: string): Observable<ObIFileDescription[]> {
		return this.uploadedFiles.pipe(
			take(1),
			takeUntil(this.unsubscribe),
			map(uploadedFiles => uploadedFiles[idx] ?? [])
		);
	}

	private initUploadedFilesIdx(idx: string): void {
		this.getUploadedFiles(idx)
			.pipe(take(1), takeUntil(this.unsubscribe))
			.subscribe(uploadedFiles => {
				if (!uploadedFiles || uploadedFiles.length < 1) {
					this.updateUploadedFiles([], idx);
				}
			});
	}

	private initUploadingFilesIdx(idx: string): void {
		this.getUploadingFiles(idx)
			.pipe(take(1), takeUntil(this.unsubscribe))
			.subscribe(uploadingFiles => {
				if (!uploadingFiles || uploadingFiles.length < 1) {
					this.updateUploadingFiles([], idx);
				}
			});
	}

	private updateUploadedFiles(files: ObIFileDescription[], idx: string): void {
		this.uploadedFiles.pipe(take(1), takeUntil(this.unsubscribe)).subscribe(uploadedFiles => {
			uploadedFiles[idx] = files;
			this.uploadedFiles.next(uploadedFiles);
		});
	}

	private updateUploadingFiles(files: ObIFileDescription[], idx: string): void {
		this.uploadingFiles.pipe(take(1), takeUntil(this.unsubscribe)).subscribe(uploadingFiles => {
			uploadingFiles[idx] = files;
			this.uploadingFiles.next(uploadingFiles);
		});
	}
}

export const mockUrls: UploadGetUploadedFilesDelete[] = [...Array(3).keys()].map(idx => {
	const index = idx + 1;
	return {
		upload: `${mockUploadURL}/${index}`,
		getUploadedFiles: `${mockGetUploadedFilesURL}/${index}`,
		delete: `${mockDeleteURL}/${index}`
	};
});

interface UploadGetUploadedFilesDelete {
	upload: string;
	getUploadedFiles: string;
	delete: string;
}

interface Request {
	url: string;
	has: (str: string) => boolean;
	getAll: (str: string) => File[];
}
