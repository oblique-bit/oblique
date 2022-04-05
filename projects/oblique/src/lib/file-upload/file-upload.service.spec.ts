import {HttpClient, HttpEvent, HttpEventType} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TestBed, fakeAsync, tick} from '@angular/core/testing';
import {Observable, of, throwError} from 'rxjs';
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
			providers: [ObFileUploadService, {provide: ObNotificationService, useClass: ObMockNotificationService}]
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

		it('should ignore Sent event type', fakeAsync(() => {
			jest.spyOn(httpMock, 'request').mockReturnValue(of({type: HttpEventType.Sent}));
			let emitted = false;
			service.multiUpload(baseServerUrl, [sampleFile]).subscribe(() => {
				emitted = true;
			});
			tick(0);
			expect(emitted).toBe(false);
		}));

		it('should ignore ResponseHeader event type', fakeAsync(() => {
			jest.spyOn(httpMock, 'request').mockReturnValue(of({type: HttpEventType.ResponseHeader}));
			let emitted = false;
			service.multiUpload(baseServerUrl, [sampleFile]).subscribe(() => {
				emitted = true;
			});
			tick(0);
			expect(emitted).toBe(false);
		}));

		it('should ignore User event type', fakeAsync(() => {
			jest.spyOn(httpMock, 'request').mockReturnValue(of({type: HttpEventType.User}));
			let emitted = false;
			service.multiUpload(baseServerUrl, [sampleFile]).subscribe(() => {
				emitted = true;
			});
			tick(0);
			expect(emitted).toBe(false);
		}));

		it('should ignore DownloadProgress event type', fakeAsync(() => {
			jest.spyOn(httpMock, 'request').mockReturnValue(of({type: HttpEventType.DownloadProgress}));
			let emitted = false;
			service.multiUpload(baseServerUrl, [sampleFile]).subscribe(() => {
				emitted = true;
			});
			tick(0);
			expect(emitted).toBe(false);
		}));

		it('should forward UploadProgress event type', done => {
			jest.spyOn(httpMock, 'request').mockReturnValue(of({type: HttpEventType.UploadProgress}));

			service.multiUpload(baseServerUrl, [sampleFile]).subscribe(evt => {
				expect(evt).toBeDefined();
				done();
			});
		});

		it('should forward Response event type', done => {
			jest.spyOn(httpMock, 'request').mockReturnValue(of({type: HttpEventType.Response}));

			service.multiUpload(baseServerUrl, [sampleFile]).subscribe(evt => {
				expect(evt).toBeDefined();
				done();
			});
		});

		describe('error', () => {
			let event: HttpEvent<any>;
			beforeEach(done => {
				jest.spyOn(httpMock, 'request').mockReturnValue(throwError(new Error('test')));
				jest.spyOn(notification, 'error');
				service.multiUpload(baseServerUrl, [sampleFile]).subscribe(evt => {
					event = evt;
					done();
				});
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

		it('should ignore Sent event type', fakeAsync(() => {
			jest.spyOn(httpMock, 'request').mockReturnValue(of({type: HttpEventType.Sent}));
			let emitted = false;
			service.upload(baseServerUrl, sampleFile).subscribe(() => {
				emitted = true;
			});
			tick(0);
			expect(emitted).toBe(false);
		}));

		it('should ignore ResponseHeader event type', fakeAsync(() => {
			jest.spyOn(httpMock, 'request').mockReturnValue(of({type: HttpEventType.ResponseHeader}));
			let emitted = false;
			service.upload(baseServerUrl, sampleFile).subscribe(() => {
				emitted = true;
			});
			tick(0);
			expect(emitted).toBe(false);
		}));

		it('should ignore User event type', fakeAsync(() => {
			jest.spyOn(httpMock, 'request').mockReturnValue(of({type: HttpEventType.User}));
			let emitted = false;
			service.upload(baseServerUrl, sampleFile).subscribe(() => {
				emitted = true;
			});
			tick(0);
			expect(emitted).toBe(false);
		}));

		it('should ignore DownloadProgress event type', fakeAsync(() => {
			jest.spyOn(httpMock, 'request').mockReturnValue(of({type: HttpEventType.DownloadProgress}));
			let emitted = false;
			service.upload(baseServerUrl, sampleFile).subscribe(() => {
				emitted = true;
			});
			tick(0);
			expect(emitted).toBe(false);
		}));

		it('should forward UploadProgress event type', done => {
			jest.spyOn(httpMock, 'request').mockReturnValue(of({type: HttpEventType.UploadProgress}));

			service.upload(baseServerUrl, sampleFile).subscribe(evt => {
				expect(evt).toBeDefined();
				done();
			});
		});

		it('should forward Response event type', done => {
			jest.spyOn(httpMock, 'request').mockReturnValue(of({type: HttpEventType.Response}));

			service.upload(baseServerUrl, sampleFile).subscribe(evt => {
				expect(evt).toBeDefined();
				done();
			});
		});

		describe('error', () => {
			let event: HttpEvent<any>;
			beforeEach(done => {
				jest.spyOn(httpMock, 'request').mockReturnValue(throwError(new Error('test')));
				jest.spyOn(notification, 'error');
				service.multiUpload(baseServerUrl, [sampleFile]).subscribe(evt => {
					event = evt;
					done();
				});
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

		it('should emit', done => {
			jest.spyOn(httpMock, 'get').mockReturnValue(of([]));

			service.getUploadedFiles(baseServerUrl).subscribe(evt => {
				expect(evt).toBeDefined();
				done();
			});
		});
	});

	describe('delete', () => {
		it('should delete data', () => {
			jest.spyOn(httpMock, 'delete');
			service.delete(baseServerUrl, ['test.txt']);
			expect(httpMock.delete).toHaveBeenCalledWith(`${baseServerUrl}/${btoa(JSON.stringify(['test.txt']))}`);
		});

		it('should emit', done => {
			jest.spyOn(httpMock, 'delete').mockReturnValue(of([]));

			service.delete(baseServerUrl, ['test.txt']).subscribe(evt => {
				expect(evt).toBeDefined();
				done();
			});
		});
	});
});
