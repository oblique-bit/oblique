import {TestBed} from '@angular/core/testing';
import {ObMockNotificationService} from '../../notification/_mocks/mock-notification.service';
import {ObNotificationService} from '../../notification/notification.service';
import {ObValidationService} from './validation.service';

describe(ObValidationService.name, () => {
	let service: ObValidationService;
	let notification: ObNotificationService;
	const files = [new File(['text'], 'sample.txt', {type: 'text/plain'}), new File(['image'], 'sample.jpg', {type: 'text/plain'})];

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ObValidationService, {provide: ObNotificationService, useClass: ObMockNotificationService}]
		});
		service = TestBed.inject(ObValidationService);
		notification = TestBed.inject(ObNotificationService);
	});

	test('that an instance is created', () => {
		expect(service).toBeTruthy();
	});

	describe('filterInvalidFiles', () => {
		test('that current file list is returned if all valid', () => {
			expect(service.filterInvalidFiles(files, undefined, 50, true)).toEqual(files);
		});

		test('that uppercase types are accepted', () => {
			const testFiles = [new File(['text'], 'sample.TXT', {type: 'text/plain'})];
			const filteredFiles = service.filterInvalidFiles(testFiles, ['.txt'], 50, true);
			expect(filteredFiles[0]?.name).toBe('sample.TXT');
		});

		describe('overflowing', () => {
			let filteredFiles;
			beforeEach(() => {
				jest.spyOn(notification, 'error');
				filteredFiles = service.filterInvalidFiles(files, ['*'], 50, false);
			});

			test('that 1st file is returned', () => {
				expect(filteredFiles.length).toBe(1);
			});

			test('that error is displayed', () => {
				expect(notification.error).toHaveBeenCalledWith({
					message: 'i18n.oblique.file-upload.error.single',
					messageParams: {ignoredFiles: 'sample.jpg'},
					title: 'i18n.oblique.file-upload.error.title'
				});
			});
		});

		describe('invalid extension', () => {
			let filteredFiles;
			beforeEach(() => {
				jest.spyOn(notification, 'error');
				filteredFiles = service.filterInvalidFiles(files, ['.txt'], 50, true);
			});

			test('that first file is returned', () => {
				expect(filteredFiles.length).toBe(1);
			});

			test('that error is displayed', () => {
				expect(notification.error).toHaveBeenCalledWith({
					message: 'i18n.oblique.file-upload.error.type',
					messageParams: {ignoredFiles: 'sample.jpg', supportedTypes: '.txt'},
					title: 'i18n.oblique.file-upload.error.title'
				});
			});
		});

		describe('invalid mime', () => {
			beforeEach(() => {
				jest.spyOn(notification, 'error');
			});

			describe('accepting text', () => {
				test('that first file is returned', () => {
					const filteredFiles = service.filterInvalidFiles(files, ['text/plain'], 50, true);
					expect(filteredFiles.length).toBe(1);
				});

				test('that mime error is displayed', () => {
					service.filterInvalidFiles(files, ['text/plain'], 50, true);
					expect(notification.error).toHaveBeenCalledWith({
						message: 'i18n.oblique.file-upload.error.type',
						messageParams: {ignoredFiles: 'sample.jpg', supportedTypes: 'text/plain'},
						title: 'i18n.oblique.file-upload.error.title'
					});
				});

				test('that generic mime error is displayed', () => {
					service.filterInvalidFiles(files, ['text/*'], 50, true);
					expect(notification.error).toHaveBeenCalledWith({
						message: 'i18n.oblique.file-upload.error.type',
						messageParams: {ignoredFiles: 'sample.jpg', supportedTypes: 'text/*'},
						title: 'i18n.oblique.file-upload.error.title'
					});
				});

				test('that unknown mime error is displayed', () => {
					service.filterInvalidFiles(files, ['text/unknown'], 50, true);
					expect(notification.error).toHaveBeenCalledWith({
						message: 'i18n.oblique.file-upload.error.type',
						messageParams: {ignoredFiles: 'sample.txt, sample.jpg', supportedTypes: 'text/unknown'},
						title: 'i18n.oblique.file-upload.error.title'
					});
				});
			});

			describe('accepting image with wild card', () => {
				test('that second file is returned', () => {
					const filteredFiles = service.filterInvalidFiles(files, ['image/*'], 50, true);
					expect(filteredFiles.length).toBe(1);
				});

				test('that generic mime error is displayed', () => {
					service.filterInvalidFiles(files, ['image/*'], 50, true);
					expect(notification.error).toHaveBeenCalledWith({
						message: 'i18n.oblique.file-upload.error.type',
						messageParams: {ignoredFiles: 'sample.txt', supportedTypes: 'image/*'},
						title: 'i18n.oblique.file-upload.error.title'
					});
				});
			});

			test('that unknown generic mime error is displayed', () => {
				service.filterInvalidFiles(files, ['unknown/*'], 50, true);
				expect(notification.error).toHaveBeenCalledWith({
					message: 'i18n.oblique.file-upload.error.type',
					messageParams: {ignoredFiles: 'sample.txt, sample.jpg', supportedTypes: 'unknown/*'},
					title: 'i18n.oblique.file-upload.error.title'
				});
			});
		});

		describe('tooLarge', () => {
			let filteredFiles;
			beforeEach(() => {
				jest.spyOn(notification, 'error');
				filteredFiles = service.filterInvalidFiles(files, ['*'], 0.000004, true);
			});

			test('that first file is returned', () => {
				expect(filteredFiles.length).toBe(1);
			});

			test('that error is displayed', () => {
				expect(notification.error).toHaveBeenCalledWith({
					message: 'i18n.oblique.file-upload.error.size',
					messageParams: {ignoredFiles: 'sample.jpg (0.00 MB)', maxSize: 0.000004},
					title: 'i18n.oblique.file-upload.error.title'
				});
			});
		});
	});
});
