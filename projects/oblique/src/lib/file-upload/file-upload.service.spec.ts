import {HttpClient, HttpEvent, HttpEventType} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {Observable, firstValueFrom, of, throwError} from 'rxjs';
import {ObFileUploadService} from './file-upload.service';
import {ObMockNotificationService} from '../notification/_mocks/mock-notification.service';
import {ObNotificationService} from '../notification/notification.service';

describe('ObFilesUploadService', () => {
	let service: ObFileUploadService;
	let httpMock: HttpClient;
	let notification: ObNotificationService;
	const baseServerUrl = 'http://localhost:8080';
	const sampleFile = new File(['sample'], 'sample.txt', {type: 'text/plain'});

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [ObFileUploadService, {provide: ObNotificationService, useClass: ObMockNotificationService}],
		});
		service = TestBed.inject(ObFileUploadService);
		httpMock = TestBed.inject(HttpClient);
		notification = TestBed.inject(ObNotificationService);
	});

	it('should be FileUploadService created', () => {
		expect(service).toBeTruthy();
	});

	it('should have an uploadComplete$ observable', () => {
		expect(service.uploadComplete$ instanceof Observable).toBe(true);
	});

	describe('multiUpload', () => {
		it('should post data', () => {
			jest.spyOn(httpMock, 'request');
			service.multiUpload(baseServerUrl, [sampleFile]);
			expect(httpMock.request).toHaveBeenCalled();
		});

		it('should ignore Sent event type', () => {
			jest.spyOn(httpMock, 'request').mockReturnValue(of({type: HttpEventType.Sent}));
			let emitted = false;
			service.multiUpload(baseServerUrl, [sampleFile]).subscribe(() => {
				emitted = true;
			});
			expect(emitted).toBe(false);
		});

		it('should ignore ResponseHeader event type', () => {
			jest.spyOn(httpMock, 'request').mockReturnValue(of({type: HttpEventType.ResponseHeader}));
			let emitted = false;
			service.multiUpload(baseServerUrl, [sampleFile]).subscribe(() => {
				emitted = true;
			});
			expect(emitted).toBe(false);
		});

		it('should ignore User event type', () => {
			jest.spyOn(httpMock, 'request').mockReturnValue(of({type: HttpEventType.User}));
			let emitted = false;
			service.multiUpload(baseServerUrl, [sampleFile]).subscribe(() => {
				emitted = true;
			});
			expect(emitted).toBe(false);
		});

		it('should ignore DownloadProgress event type', () => {
			jest.spyOn(httpMock, 'request').mockReturnValue(of({type: HttpEventType.DownloadProgress}));
			let emitted = false;
			service.multiUpload(baseServerUrl, [sampleFile]).subscribe(() => {
				emitted = true;
			});
			expect(emitted).toBe(false);
		});

		it('should forward UploadProgress event type', async () => {
			jest.spyOn(httpMock, 'request').mockReturnValue(of({type: HttpEventType.UploadProgress}));

			const event = await firstValueFrom(service.multiUpload(baseServerUrl, [sampleFile]));
			expect(event).toBeDefined();
		});

		it('should forward Response event type', async () => {
			jest.spyOn(httpMock, 'request').mockReturnValue(of({type: HttpEventType.Response}));

			const event = await firstValueFrom(service.multiUpload(baseServerUrl, [sampleFile]));
			expect(event).toBeDefined();
		});

		describe('error', () => {
			let event: HttpEvent<any>;

			beforeEach(async () => {
				jest.spyOn(httpMock, 'request').mockReturnValue(throwError(new Error('test')));
				jest.spyOn(notification, 'error');

				event = await firstValueFrom(service.multiUpload(baseServerUrl, [sampleFile]));
			});

			it('should emit an event', () => {
				expect(event).toBeDefined();
			});

			it('should emit an event of type User', () => {
				expect(event.type).toBe(HttpEventType.User);
			});

			it('should emit an event with errored files', () => {
				expect((event as any).files).toEqual([sampleFile]);
			});

			it('should notify an error', () => {
				expect(notification.error).toHaveBeenCalled();
			});
		});
	});

	describe('upload', () => {
		it('should post data', () => {
			jest.spyOn(httpMock, 'request');
			service.upload(baseServerUrl, sampleFile);
			expect(httpMock.request).toHaveBeenCalled();
		});

		it('should ignore Sent event type', () => {
			jest.spyOn(httpMock, 'request').mockReturnValue(of({type: HttpEventType.Sent}));
			let emitted = false;
			service.upload(baseServerUrl, sampleFile).subscribe(() => {
				emitted = true;
			});
			expect(emitted).toBe(false);
		});

		it('should ignore ResponseHeader event type', () => {
			jest.spyOn(httpMock, 'request').mockReturnValue(of({type: HttpEventType.ResponseHeader}));
			let emitted = false;
			service.upload(baseServerUrl, sampleFile).subscribe(() => {
				emitted = true;
			});
			expect(emitted).toBe(false);
		});

		it('should ignore User event type', () => {
			jest.spyOn(httpMock, 'request').mockReturnValue(of({type: HttpEventType.User}));
			let emitted = false;
			service.upload(baseServerUrl, sampleFile).subscribe(() => {
				emitted = true;
			});
			expect(emitted).toBe(false);
		});

		it('should ignore DownloadProgress event type', () => {
			jest.spyOn(httpMock, 'request').mockReturnValue(of({type: HttpEventType.DownloadProgress}));
			let emitted = false;
			service.upload(baseServerUrl, sampleFile).subscribe(() => {
				emitted = true;
			});
			expect(emitted).toBe(false);
		});

		it('should forward UploadProgress event type', async () => {
			jest.spyOn(httpMock, 'request').mockReturnValue(of({type: HttpEventType.UploadProgress}));

			const event = await firstValueFrom(service.upload(baseServerUrl, sampleFile));
			expect(event).toBeDefined();
		});

		it('should forward Response event type', async () => {
			jest.spyOn(httpMock, 'request').mockReturnValue(of({type: HttpEventType.Response}));

			const event = await firstValueFrom(service.upload(baseServerUrl, sampleFile));
			expect(event).toBeDefined();
		});

		describe('error', () => {
			let event: HttpEvent<any>;

			beforeEach(async () => {
				jest.spyOn(httpMock, 'request').mockReturnValue(throwError(new Error('test')));
				jest.spyOn(notification, 'error');

				event = await firstValueFrom(service.multiUpload(baseServerUrl, [sampleFile]));
			});

			it('should emit an event', () => {
				expect(event).toBeDefined();
			});

			it('should emit an event of type User', () => {
				expect(event.type).toBe(HttpEventType.User);
			});

			it('should emit an event with errored files', () => {
				expect((event as any).files).toEqual([sampleFile]);
			});

			it('should notify an error', () => {
				service.upload(baseServerUrl, sampleFile).subscribe();
			});
		});
	});

	describe('notifyUploadComplete', () => {
		it('should emit uploadComplete', done => {
			service.uploadComplete$.subscribe(() => {
				expect(true).toBe(true);
				done();
			});
			service.notifyUploadComplete();
		});
	});

	describe('getUploadedFiles', () => {
		it('should get data', () => {
			jest.spyOn(httpMock, 'get');
			service.getUploadedFiles(baseServerUrl);
			expect(httpMock.get).toHaveBeenCalledWith(baseServerUrl);
		});

		it('should emit', async () => {
			jest.spyOn(httpMock, 'get').mockReturnValue(of([]));

			const event = await firstValueFrom(service.getUploadedFiles(baseServerUrl));
			expect(event).toBeDefined();
		});
	});

	describe('delete', () => {
		describe('with an array of files', () => {
			it('should delete data', () => {
				jest.spyOn(httpMock, 'delete');
				service.delete(baseServerUrl, ['test.txt']);
				expect(httpMock.delete).toHaveBeenCalledWith(`${baseServerUrl}/${btoa(JSON.stringify(['test.txt']))}`);
			});

			it('should emit', async () => {
				jest.spyOn(httpMock, 'delete').mockReturnValue(of([]));

				const event = await firstValueFrom(service.delete(baseServerUrl, ['test.txt']));
				expect(event).toBeDefined();
			});
		});

		describe('with a stringified file', () => {
			it('should delete data', () => {
				jest.spyOn(httpMock, 'delete');
				service.delete(baseServerUrl, '1-2-3');
				expect(httpMock.delete).toHaveBeenCalledWith(`${baseServerUrl}/1-2-3`);
			});

			it('should emit', async () => {
				jest.spyOn(httpMock, 'delete').mockReturnValue(of([]));

				const event = await firstValueFrom(service.delete(baseServerUrl, '1-2-3'));
				expect(event).toBeDefined();
			});
		});
	});
});
