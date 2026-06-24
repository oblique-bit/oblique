import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {HttpEvent, HttpEventType, HttpResponse} from '@angular/common/http';
import {of} from 'rxjs';
import {first} from 'rxjs/operators';
import {provideObliqueTestingConfiguration} from '../../utilities';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {ObMockFileUploadService} from '../_mocks/mock-file-upload.sevice';
import {ObFileUploadService} from '../file-upload.service';
import {ObEUploadEventType, ObIFile, ObIUploadEvent, ObTEventType} from '../file-upload.model';
import {ObProgressComponent} from './progress.component';

interface ObProgressComponentPrivate {
	uploadSingleFile: (file: ObIFile) => void;
	uploadFilesTogether: (files: File[]) => void;
}

describe('ObProgressComponent', () => {
	const files = [
		new File(['test'], 'test.txt', {type: 'plain/text', endings: 'native'}),
		new File(['sample'], 'sample.txt', {type: 'plain/text'}),
		new File(['test1'], 'test1.txt', {type: 'plain/text', endings: 'native'}),
		new File(['sample1'], 'sample1.txt', {type: 'plain/text'}),
		new File(['sample2'], 'sample2.jpg', {type: 'image/jpg'}),
	];
	const uploadProgressEvent: HttpEvent<ObTEventType> = {type: HttpEventType.UploadProgress, loaded: 1, total: 2};
	const uploadResponseEvent: HttpEvent<ObTEventType> = new HttpResponse<ObTEventType>();
	let component: ObProgressComponent;
	let fixture: ComponentFixture<ObProgressComponent>;
	let uploadService: ObFileUploadService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObProgressComponent, ObMockTranslatePipe],
			providers: [
				provideObliqueTestingConfiguration(),
				{provide: ObFileUploadService, useClass: ObMockFileUploadService},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
		}).compileComponents();
		uploadService = TestBed.inject(ObFileUploadService);
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ObProgressComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have ob-progress class', () => {
		expect(fixture.debugElement.nativeElement.classList.contains('ob-progress')).toBe(true);
	});

	it('should have an uploadedFiles property', () => {
		expect(component.uploadedFiles).toBeTruthy();
	});

	describe('without singleRequest', () => {
		beforeEach(() => {
			fixture.componentRef.setInput('singleRequest', false);
			fixture.componentRef.changeDetectorRef.detectChanges();
		});

		describe('files', () => {
			beforeEach(() => {
				jest.useFakeTimers();
				jest.spyOn(uploadService, 'upload').mockReturnValue(of(uploadProgressEvent));
				component.files = files;
				jest.advanceTimersByTime(1);
			});

			it('should set the file count', () => {
				expect(component.uploadedFiles.fileCount).toBe(5);
			});

			it('should set the files array', () => {
				expect(component.uploadedFiles.files.length).toBe(5);
			});

			describe('cancelUpload', () => {
				describe('uncompleted file', () => {
					describe('with cancelConfirmation not set', () => {
						it('should ask for confirmation', () => {
							jest.spyOn(window, 'confirm');
							component.cancelUpload(component.uploadedFiles.files[0]);
							expect(window.confirm).toHaveBeenCalled();
						});

						describe('when confirmed', () => {
							let file: ObIFile;
							let event: ObIUploadEvent;
							beforeEach(done => {
								file = component.uploadedFiles.files[0];
								jest.spyOn(window, 'confirm').mockReturnValue(true);
								jest.spyOn(file.subscription, 'unsubscribe');
								component.uploadEvent.subscribe(evt => {
									event = evt;
									done();
								});
								component.cancelUpload(file);
							});

							it('should unsubscribe', () => {
								expect(file.subscription.unsubscribe).toHaveBeenCalled();
							});

							it('should reduce the files array', () => {
								expect(component.uploadedFiles.files.length).toBe(4);
							});

							it('should remove the file from the file list', () => {
								expect(component.uploadedFiles.files.find(uploadedFile => uploadedFile.index === 0)).toBeUndefined();
							});

							it('should reduce the file count', () => {
								expect(component.uploadedFiles.fileCount).toBe(4);
							});

							it('should emit an event', () => {
								expect(event).toBeDefined();
							});

							it('should emit an event of type canceled', () => {
								expect(event.type).toBe(ObEUploadEventType.CANCELED);
							});

							it('should emit an event with canceled files', () => {
								expect(event.files).toEqual([file.binary]);
							});
						});

						describe('when not confirmed', () => {
							let file: ObIFile;
							beforeEach(() => {
								file = component.uploadedFiles.files[0];
								jest.spyOn(window, 'confirm').mockReturnValue(false);
								jest.spyOn(file.subscription, 'unsubscribe');
								jest.spyOn(component.uploadEvent, 'emit');
								component.cancelUpload(file);
							});

							it('should not unsubscribe', () => {
								expect(file.subscription.unsubscribe).not.toHaveBeenCalled();
							});

							it('should not reduce the files array', () => {
								expect(component.uploadedFiles.files.length).toBe(5);
							});

							it('should not remove the file from the file list', () => {
								expect(component.uploadedFiles.files.find(localFile => localFile.index === 0)).toBeDefined();
							});

							it('should not reduce the file count', () => {
								expect(component.uploadedFiles.fileCount).toBe(5);
							});

							it('should not emit an event', () => {
								expect(component.uploadEvent.emit).not.toHaveBeenCalled();
							});
						});
					});

					describe('with cancelConfirmation set to true', () => {
						beforeEach(() => {
							fixture.componentRef.setInput('cancelConfirmation', true);
							fixture.detectChanges();
						});

						it('should ask for confirmation', () => {
							jest.spyOn(window, 'confirm');
							component.cancelUpload(component.uploadedFiles.files[0]);
							expect(window.confirm).toHaveBeenCalled();
						});

						describe('when confirmed', () => {
							let file: ObIFile;
							let event: ObIUploadEvent;
							beforeEach(done => {
								file = component.uploadedFiles.files[0];
								jest.spyOn(window, 'confirm').mockReturnValue(true);
								jest.spyOn(file.subscription, 'unsubscribe');
								component.uploadEvent.subscribe(evt => {
									event = evt;
									done();
								});
								component.cancelUpload(file);
							});

							it('should unsubscribe', () => {
								expect(file.subscription.unsubscribe).toHaveBeenCalled();
							});

							it('should reduce the files array', () => {
								expect(component.uploadedFiles.files.length).toBe(4);
							});

							it('should remove the file from the file list', () => {
								expect(component.uploadedFiles.files.find(uploadedFile => uploadedFile.index === 0)).toBeUndefined();
							});

							it('should reduce the file count', () => {
								expect(component.uploadedFiles.fileCount).toBe(4);
							});

							it('should emit an event', () => {
								expect(event).toBeDefined();
							});

							it('should emit an event of type canceled', () => {
								expect(event.type).toBe(ObEUploadEventType.CANCELED);
							});

							it('should emit an event with canceled files', () => {
								expect(event.files).toEqual([file.binary]);
							});
						});

						describe('when not confirmed', () => {
							let file: ObIFile;
							beforeEach(() => {
								file = component.uploadedFiles.files[0];
								jest.spyOn(window, 'confirm').mockReturnValue(false);
								jest.spyOn(file.subscription, 'unsubscribe');
								jest.spyOn(component.uploadEvent, 'emit');
								component.cancelUpload(file);
							});

							it('should not unsubscribe', () => {
								expect(file.subscription.unsubscribe).not.toHaveBeenCalled();
							});

							it('should not reduce the files array', () => {
								expect(component.uploadedFiles.files.length).toBe(5);
							});

							it('should not remove the file from the file list', () => {
								expect(component.uploadedFiles.files.find(localFile => localFile.index === 0)).toBeDefined();
							});

							it('should not reduce the file count', () => {
								expect(component.uploadedFiles.fileCount).toBe(5);
							});

							it('should not emit an event', () => {
								expect(component.uploadEvent.emit).not.toHaveBeenCalled();
							});
						});
					});

					describe('with cancelConfirmation set to false', () => {
						beforeEach(() => {
							fixture.componentRef.setInput('cancelConfirmation', false);
							fixture.detectChanges();
						});

						it('should not ask for confirmation', () => {
							jest.spyOn(window, 'confirm').mockReset();
							component.cancelUpload(component.uploadedFiles.files[0]);
							expect(window.confirm).toHaveBeenCalledTimes(0);
						});

						describe('when cancelled', () => {
							let file: ObIFile;
							let event: ObIUploadEvent;
							beforeEach(done => {
								file = component.uploadedFiles.files[0];
								jest.spyOn(file.subscription, 'unsubscribe');
								jest.spyOn(window, 'confirm').mockReturnValue(true);
								component.uploadEvent.subscribe(evt => {
									event = evt;
									done();
								});
								component.cancelUpload(file);
							});

							it('should unsubscribe', () => {
								expect(file.subscription.unsubscribe).toHaveBeenCalled();
							});

							it('should reduce the files array', () => {
								expect(component.uploadedFiles.files.length).toBe(4);
							});

							it('should remove the file from the file list', () => {
								expect(component.uploadedFiles.files.find(uploadedFile => uploadedFile.index === 0)).toBeUndefined();
							});

							it('should reduce the file count', () => {
								expect(component.uploadedFiles.fileCount).toBe(4);
							});

							it('should emit an event', () => {
								expect(event).toBeDefined();
							});

							it('should emit an event of type canceled', () => {
								expect(event.type).toBe(ObEUploadEventType.CANCELED);
							});

							it('should emit an event with canceled files', () => {
								expect(event.files).toEqual([file.binary]);
							});
						});

						it('should cancel a file that is missing from the current upload list', done => {
							const file = {...component.uploadedFiles.files[0], index: component.uploadedFiles.files.length + 1};
							component.uploadEvent.pipe(first()).subscribe(evt => {
								expect(evt).toEqual({type: ObEUploadEventType.CANCELED, files: [file.binary]});
								done();
							});

							component.cancelUpload(file);
						});
					});
				});

				describe('completed file', () => {
					let file: ObIFile;
					beforeEach(() => {
						file = component.uploadedFiles.files[0];
						file.completed = true;
						jest.spyOn(file.subscription, 'unsubscribe');
						jest.spyOn(component.uploadEvent, 'emit');
						component.cancelUpload(file);
					});

					it('should not unsubscribe', () => {
						expect(file.subscription.unsubscribe).not.toHaveBeenCalled();
					});

					it('should not reduce the files array', () => {
						expect(component.uploadedFiles.files.length).toBe(5);
					});

					it('should not remove the file from the file list', () => {
						expect(component.uploadedFiles.files.find(localFile => localFile.index === 0)).toBeDefined();
					});

					it('should not reduce the file count', () => {
						expect(component.uploadedFiles.fileCount).toBe(5);
					});

					it('should not emit an event', () => {
						expect(component.uploadEvent.emit).not.toHaveBeenCalled();
					});
				});
			});

			describe('retryUpload', () => {
				beforeEach(() => {
					component.uploadedFiles.files[0].hasError = true;
					jest.spyOn(component as unknown as ObProgressComponentPrivate, 'uploadSingleFile');
				});

				it('should reupload erroneous file', () => {
					component.retryUpload(component.uploadedFiles.files[0]);
					expect((component as unknown as ObProgressComponentPrivate).uploadSingleFile).toHaveBeenCalledWith({
						index: 0,
						name: component.uploadedFiles.files[0].name,
						completed: false,
						progress: 0,
						hasError: false,
						binary: component.uploadedFiles.files[0].binary,
						subscription: undefined,
					});
				});

				it('should do nothing with file without error', () => {
					component.retryUpload(component.uploadedFiles.files[1]);
					expect((component as unknown as ObProgressComponentPrivate).uploadSingleFile).not.toHaveBeenCalled();
				});
			});
		});

		describe('progress', () => {
			beforeEach(() => {
				jest.useFakeTimers();
				jest.spyOn(uploadService, 'upload').mockReturnValue(of(uploadProgressEvent));
				component.files = files;
				jest.advanceTimersByTime(1);
			});

			it('should sets progress', () => {
				expect(component.uploadedFiles.files[0].progress).toBe(50);
			});
		});

		describe('once completed', () => {
			let event: ObIUploadEvent;
			beforeEach(() => {
				jest.useFakeTimers();
				jest.spyOn(uploadService, 'upload').mockReturnValue(of(uploadResponseEvent));
				jest.spyOn(uploadService, 'notifyUploadComplete');
				component.uploadEvent.subscribe(evt => {
					event = evt;
				});
				component.files = files;
				jest.advanceTimersByTime(1001);
			});

			it('should reset fileCount', () => {
				expect(component.uploadedFiles.fileCount).toBe(0);
			});

			it('should empty files', () => {
				expect(component.uploadedFiles.files.length).toBe(0);
			});

			it('should emit an event', () => {
				expect(event).toBeDefined();
			});

			it('should emit an event of type uploaded', () => {
				expect(event.type).toBe(ObEUploadEventType.UPLOADED);
			});

			it('should emit an event with uploaded files', () => {
				expect(event.files).toEqual(files);
			});

			it('should notify', () => {
				expect(uploadService.notifyUploadComplete).toHaveBeenCalled();
			});
		});

		describe('error', () => {
			let event: ObIUploadEvent;
			let file: ObIFile;
			beforeEach(() => {
				jest.useFakeTimers();
				jest.spyOn(uploadService, 'upload').mockReturnValue(of({type: HttpEventType.User, files}));
				component.uploadEvent.pipe(first()).subscribe(evt => {
					event = evt;
				});
				component.files = files;
				jest.advanceTimersByTime(1);
				file = component.uploadedFiles.files[0];
			});

			it('should set hasError property', () => {
				expect(file.hasError).toBe(true);
			});

			it('should emit an event', () => {
				expect(event).toBeDefined();
			});

			it('should emit an event of type canceled', () => {
				expect(event.type).toBe(ObEUploadEventType.ERRORED);
			});

			it('should emit an event with errored files', () => {
				expect(event.files).toEqual(files);
			});
		});
	});

	describe('with combine progressbar', () => {
		beforeEach(() => {
			fixture.componentRef.setInput('singleRequest', true);
			fixture.componentRef.changeDetectorRef.detectChanges();
		});

		describe('files', () => {
			beforeEach(() => {
				jest.useFakeTimers();
				jest.spyOn(uploadService, 'multiUpload').mockReturnValue(of(uploadProgressEvent));
				component.files = files;
				jest.advanceTimersByTime(1);
			});

			it('should set the file count', () => {
				expect(component.uploadedFiles.fileCount).toBe(5);
			});

			it('should set the files array', () => {
				expect(component.uploadedFiles.files.length).toBe(1);
			});

			describe('cancelUpload', () => {
				describe('uncompleted file', () => {
					let file: ObIFile;
					let event: ObIUploadEvent;
					beforeEach(done => {
						file = component.uploadedFiles.files[0];
						jest.spyOn(file.subscription, 'unsubscribe');
						component.uploadEvent.pipe(first()).subscribe(evt => {
							event = evt;
							done();
						});
						component.cancelUpload(file);
					});

					it('should unsubscribe', () => {
						expect(file.subscription.unsubscribe).toHaveBeenCalled();
					});

					it('should reduce the files array', () => {
						expect(component.uploadedFiles.files.length).toBe(0);
					});

					it('should remove the file from the file list', () => {
						expect(component.uploadedFiles.files.find(localFile => localFile.index === 0)).toBeUndefined();
					});

					it('should reduce the file count', () => {
						expect(component.uploadedFiles.fileCount).toBe(4);
					});

					it('should emit an event', () => {
						expect(event).toBeDefined();
					});

					it('should emit an event of type canceled', () => {
						expect(event.type).toBe(ObEUploadEventType.CANCELED);
					});

					it('should emit an event with canceled files', () => {
						expect(event.files).toEqual(file.binary);
					});
				});

				describe('completed file', () => {
					let file;
					beforeEach(() => {
						file = component.uploadedFiles.files[0];
						file.completed = true;
						jest.spyOn(file.subscription, 'unsubscribe');
						jest.spyOn(component.uploadEvent, 'emit');
						component.cancelUpload(file);
					});

					it('should unsubscribe', () => {
						expect(file.subscription.unsubscribe).not.toHaveBeenCalled();
					});

					it('should not reduce the files array', () => {
						expect(component.uploadedFiles.files.length).toBe(1);
					});

					it('should not remove the file from the file list', () => {
						expect(component.uploadedFiles.files.find(localFile => localFile.index === 0)).toBeDefined();
					});

					it('should not reduce the file count', () => {
						expect(component.uploadedFiles.fileCount).toBe(5);
					});

					it('should not emit a cancel event', () => {
						expect(component.uploadEvent.emit).not.toHaveBeenCalledWith({
							type: ObEUploadEventType.CANCELED,
							files: file.binary,
						});
					});
				});
			});

			describe('retryUpload', () => {
				beforeEach(() => {
					jest.spyOn(component as unknown as ObProgressComponentPrivate, 'uploadFilesTogether');
				});

				it('should reupload erroneous file', () => {
					component.uploadedFiles.files[0].hasError = true;
					component.retryUpload(component.uploadedFiles.files[0]);
					expect((component as unknown as ObProgressComponentPrivate).uploadFilesTogether).toHaveBeenCalledWith(
						component.uploadedFiles.files[0].binary
					);
				});

				it('should reupload erroneous file', () => {
					component.uploadedFiles.files[0].hasError = false;
					component.retryUpload(component.uploadedFiles.files[0]);
					expect((component as unknown as ObProgressComponentPrivate).uploadFilesTogether).not.toHaveBeenCalledWith(
						component.uploadedFiles.files[0].binary
					);
				});
			});
		});

		describe('progress', () => {
			beforeEach(() => {
				jest.useFakeTimers();
				jest.spyOn(uploadService, 'multiUpload').mockReturnValue(of(uploadProgressEvent));
				component.files = files;
				jest.advanceTimersByTime(1);
			});

			it('should sets progress', () => {
				expect(component.uploadedFiles.files[0].progress).toBe(50);
			});
		});

		describe('once completed', () => {
			let event: ObIUploadEvent;
			beforeEach(() => {
				jest.useFakeTimers();
				jest.spyOn(uploadService, 'multiUpload').mockReturnValue(of(uploadResponseEvent));
				jest.spyOn(uploadService, 'notifyUploadComplete');
				component.uploadEvent.subscribe(evt => {
					event = evt;
				});
				component.files = files;
				jest.advanceTimersByTime(1001);
			});

			it('should reset fileCount', () => {
				expect(component.uploadedFiles.fileCount).toBe(0);
			});

			it('should empty files', () => {
				expect(component.uploadedFiles.files.length).toBe(0);
			});

			it('should emit an event', () => {
				expect(event).toBeDefined();
			});

			it('should emit an event of type uploaded', () => {
				expect(event.type).toBe(ObEUploadEventType.UPLOADED);
			});

			it('should emit an event with uploaded files', () => {
				expect(event.files).toEqual(files);
			});

			it('should notify', () => {
				expect(uploadService.notifyUploadComplete).toHaveBeenCalled();
			});
		});

		describe('error', () => {
			let event: ObIUploadEvent;
			let file: ObIFile;
			beforeEach(() => {
				jest.useFakeTimers();
				jest.spyOn(uploadService, 'multiUpload').mockReturnValue(of({type: HttpEventType.User, files}));
				component.uploadEvent.pipe(first()).subscribe(evt => {
					event = evt;
				});
				component.files = files;
				jest.advanceTimersByTime(1);
				file = component.uploadedFiles.files[0];
			});

			it('should set hasError property', () => {
				expect(file.hasError).toBe(true);
			});

			it('should emit an event', () => {
				expect(event).toBeDefined();
			});

			it('should emit an event of type canceled', () => {
				expect(event.type).toBe(ObEUploadEventType.ERRORED);
			});

			it('should emit an event with errored files', () => {
				expect(event.files).toEqual(files);
			});
		});
	});
});
