import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA} from '@angular/core';
import {ObFileUploadComponent} from './file-upload.component';
import {ObEUploadEventType, ObIUploadEvent} from './file-upload.model';

describe('ObFileUploadComponent', () => {
	let component: ObFileUploadComponent;
	let fixture: ComponentFixture<ObFileUploadComponent>;
	const files = [
		new File(['test'], 'test.txt', {type: 'plain/text', endings: 'native'}),
		new File(['sample'], 'sample.txt', {type: 'plain/text'}),
		new File(['test1'], 'test1.txt', {type: 'plain/text', endings: 'native'}),
		new File(['sample1'], 'sample1.txt', {type: 'plain/text'}),
		new File(['sample2'], 'sample2.jpg', {type: 'image/jpg'})
	];

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ObFileUploadComponent],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ObFileUploadComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have ob-file-upload class', () => {
		expect(fixture.debugElement.nativeElement.classList.contains('ob-file-upload')).toBe(true);
	});

	it('should have a showLoadingBox property', () => {
		expect(component.showLoadingBox).toBe(false);
	});

	it('should have a uploadEvent EventEmitter', () => {
		expect(component.uploadEvent instanceof EventEmitter).toBe(true);
	});

	describe('processEvent', () => {
		describe('chosen event', () => {
			const chosenEvent = {type: ObEUploadEventType.CHOSEN, files};

			describe('with no uploadUrl', () => {
				let event: ObIUploadEvent;
				beforeEach(done => {
					component.uploadUrl = undefined;
					component.uploadEvent.subscribe(evt => {
						event = evt;
						done();
					});
					component.processEvent(chosenEvent);
				});

				it('should be forwarded', () => {
					expect(event).toEqual(chosenEvent);
				});

				it('should not toggle showLoadingBox', () => {
					expect(component.showLoadingBox).toBe(false);
				});

				it('should not populate files property', () => {
					expect(component.files).toBeUndefined();
				});
			});

			describe('with an uploadUrl', () => {
				let event: ObIUploadEvent;
				beforeEach(done => {
					component.uploadUrl = 'some/path';
					component.uploadEvent.subscribe(evt => {
						event = evt;
						done();
					});
					component.processEvent(chosenEvent);
				});

				it('should be forwarded', () => {
					expect(event).toEqual(chosenEvent);
				});

				it('should toggle showLoadingBox', () => {
					expect(component.showLoadingBox).toBe(true);
				});

				it('should populate files property', () => {
					expect(component.files).toBe(files);
				});
			});
		});

		describe('uploaded event', () => {
			const uploadedEvent = {type: ObEUploadEventType.UPLOADED, files};
			let event: ObIUploadEvent;
			beforeEach(done => {
				component.uploadEvent.subscribe(evt => {
					event = evt;
					done();
				});
				component.processEvent(uploadedEvent);
			});

			it('should be forwarded', () => {
				expect(event).toEqual(uploadedEvent);
			});

			it('should not toggle showLoadingBox', () => {
				expect(component.showLoadingBox).toBe(false);
			});

			it('should not populate files property', () => {
				expect(component.files).toBeUndefined();
			});
		});

		describe('other event', () => {
			const uploadedEvent = {type: ObEUploadEventType.DELETED, files};
			let event: ObIUploadEvent;
			beforeEach(done => {
				component.uploadEvent.subscribe(evt => {
					event = evt;
					done();
				});
				component.processEvent(uploadedEvent);
			});

			it('should be forwarded', () => {
				expect(event).toEqual(uploadedEvent);
			});
		});
	});
});
