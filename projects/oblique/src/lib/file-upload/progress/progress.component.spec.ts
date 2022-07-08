import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {HttpEventType} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {of} from 'rxjs';
import {first} from 'rxjs/operators';
import {WINDOW} from '../../utilities';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {ObMockFileUploadService} from '../_mocks/mock-file-upload.sevice';
import {ObMockTranslateService} from '../../_mocks/mock-translate.service';
import {ObPopUpService} from '../../pop-up/pop-up.service';
import {ObMockPopUpService} from '../../pop-up/_mocks/mock-pop-up.service';
import {ObFileUploadService} from '../file-upload.service';
import {ObEUploadEventType, ObIFile, ObIUploadEvent} from '../file-upload.model';
import {ObProgressComponent} from './progress.component';

describe('ObProgressComponent', () => {
	const files = [
		new File(['test'], 'test.txt', {type: 'plain/text', endings: 'native'}),
		new File(['sample'], 'sample.txt', {type: 'plain/text'}),
		new File(['test1'], 'test1.txt', {type: 'plain/text', endings: 'native'}),
		new File(['sample1'], 'sample1.txt', {type: 'plain/text'}),
		new File(['sample2'], 'sample2.jpg', {type: 'image/jpg'})
	];
	let component: ObProgressComponent;
	let fixture: ComponentFixture<ObProgressComponent>;
	let uploadService: ObFileUploadService;
	let popupService: ObPopUpService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ObProgressComponent, ObMockTranslatePipe],
			providers: [
				{provide: ObFileUploadService, useClass: ObMockFileUploadService},
				{provide: ObPopUpService, useClass: ObMockPopUpService},
				{provide: TranslateService, useClass: ObMockTranslateService},
				{provide: WINDOW, useValue: window}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
		}).compileComponents();
		uploadService = TestBed.inject(ObFileUploadService);
		popupService = TestBed.inject(ObPopUpService);
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ObProgressComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
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
			component.singleRequest = false;
		});

		describe('files', () => {
			beforeEach(fakeAsync(() => {
				jest.spyOn(uploadService, 'upload').mockReturnValue(of({} as any));
				component.files = files;
				tick(1);
			}));

			it('should set the file count', () => {
				expect(component.uploadedFiles.fileCount).toBe(5);
			});

			it('should set the files array', () => {
				expect(component.uploadedFiles.files.length).toBe(5);
			});

			describe('cancelUpload', () => {
				describe('uncompleted file', () => {
					it('should ask for confirmation', () => {
						jest.spyOn(popupService, 'confirm');
						component.cancelUpload(component.uploadedFiles.files[0]);
						expect(popupService.confirm).toHaveBeenCalled();
					});

					describe('when confirmed', () => {
						let file: ObIFile;
						let event: ObIUploadEvent;
						beforeEach(done => {
							file = component.uploadedFiles.files[0];
							jest.spyOn(popupService, 'confirm').mockReturnValue(true);
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
							jest.spyOn(popupService, 'confirm').mockReturnValue(false);
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
					// @ts-expect-error
					jest.spyOn(component, 'uploadSingleFile');
				});

				it('should reupload erroneous file', () => {
					component.retryUpload(component.uploadedFiles.files[0]);
					// @ts-expect-error
					expect(component.uploadSingleFile).toHaveBeenCalledWith({
						index: 0,
						name: component.uploadedFiles.files[0].name,
						completed: false,
						progress: 0,
						hasError: false,
						binary: component.uploadedFiles.files[0].binary,
						subscription: undefined
					});
				});

				it('should do nothing with file without error', () => {
					component.retryUpload(component.uploadedFiles.files[1]);
					// @ts-expect-error
					expect(component.uploadSingleFile).not.toHaveBeenCalled();
				});
			});
		});

		describe('progress', () => {
			beforeEach(fakeAsync(() => {
				jest.spyOn(uploadService, 'upload').mockReturnValue(of({type: HttpEventType.UploadProgress, loaded: 1, total: 2} as any));
				component.files = files;
				tick(1);
			}));

			it('should sets progress', () => {
				expect(component.uploadedFiles.files[0].progress).toBe(50);
			});
		});

		describe('once completed', () => {
			let event: ObIUploadEvent;
			beforeEach(fakeAsync(() => {
				jest.spyOn(uploadService, 'upload').mockReturnValue(of({type: HttpEventType.Response} as any));
				jest.spyOn(uploadService, 'notifyUploadComplete');
				component.uploadEvent.subscribe(evt => {
					event = evt;
				});
				component.files = files;
				tick(1000);
			}));

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
			beforeEach(fakeAsync(() => {
				jest.spyOn(uploadService, 'upload').mockReturnValue(of({type: HttpEventType.User, files}));
				component.uploadEvent.pipe(first()).subscribe(evt => {
					event = evt;
				});
				component.files = files;
				tick(1);
				file = component.uploadedFiles.files[0];
				tick(1000);
			}));

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
			component.singleRequest = true;
		});

		describe('files', () => {
			beforeEach(fakeAsync(() => {
				jest.spyOn(uploadService, 'multiUpload').mockReturnValue(of({} as any));
				component.files = files;
				tick(1);
			}));

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
						expect(component.uploadEvent.emit).not.toHaveBeenCalledWith({type: ObEUploadEventType.CANCELED, files: file.binary});
					});
				});
			});

			describe('retryUpload', () => {
				beforeEach(() => {
					// @ts-expect-error
					jest.spyOn(component, 'uploadFilesTogether');
				});

				it('should reupload erroneous file', () => {
					component.uploadedFiles.files[0].hasError = true;
					component.retryUpload(component.uploadedFiles.files[0]);
					// @ts-expect-error
					expect(component.uploadFilesTogether).toHaveBeenCalledWith(component.uploadedFiles.files[0].binary);
				});

				it('should reupload erroneous file', () => {
					component.uploadedFiles.files[0].hasError = false;
					component.retryUpload(component.uploadedFiles.files[0]);
					// @ts-expect-error
					expect(component.uploadFilesTogether).not.toHaveBeenCalledWith(component.uploadedFiles.files[0].binary);
				});
			});
		});

		describe('progress', () => {
			beforeEach(fakeAsync(() => {
				jest.spyOn(uploadService, 'multiUpload').mockReturnValue(of({type: HttpEventType.UploadProgress, loaded: 1, total: 2} as any));
				component.files = files;
				tick(1);
			}));

			it('should sets progress', () => {
				expect(component.uploadedFiles.files[0].progress).toBe(50);
			});
		});

		describe('once completed', () => {
			let event: ObIUploadEvent;
			beforeEach(fakeAsync(() => {
				jest.spyOn(uploadService, 'multiUpload').mockReturnValue(of({type: HttpEventType.Response} as any));
				jest.spyOn(uploadService, 'notifyUploadComplete');
				component.uploadEvent.subscribe(evt => {
					event = evt;
				});
				component.files = files;
				tick(1000);
			}));

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
			beforeEach(fakeAsync(() => {
				jest.spyOn(uploadService, 'multiUpload').mockReturnValue(of({type: HttpEventType.User, files}));
				component.uploadEvent.pipe(first()).subscribe(evt => {
					event = evt;
				});
				component.files = files;
				tick(1);
				file = component.uploadedFiles.files[0];
				tick(1000);
			}));

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
