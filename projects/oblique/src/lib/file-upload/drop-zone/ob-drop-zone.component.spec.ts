import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Pipe, PipeTransform} from '@angular/core';
import {first, skip} from 'rxjs/operators';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {ObIUploadEvent} from '../file-upload.model';
import {ObDropZoneComponent} from './ob-drop-zone.component';
import {ObValidationService} from './validation.service';
import {By} from '@angular/platform-browser';

@Pipe({
	name: 'obAcceptAll'
})
export class ObMockAreAllTypesAllowedPipe implements PipeTransform {
	transform(): boolean {
		return true;
	}
}

describe('DropZoneComponent', () => {
	let component: ObDropZoneComponent;
	let fixture: ComponentFixture<ObDropZoneComponent>;
	const service = {filterInvalidFiles: jest.fn()} as unknown as ObValidationService;
	const files = [
		new File(['text'], 'sample.txt', {type: 'text/plain'}),
		new File(['image'], 'sample.jpg', {type: 'text/plain'})
	] as unknown as FileList;

	beforeEach(async () => {
		TestBed.overrideProvider(ObValidationService, {useValue: service});
		await TestBed.configureTestingModule({
			declarations: [ObDropZoneComponent, ObMockTranslatePipe, ObMockAreAllTypesAllowedPipe],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ObDropZoneComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have ob-alert class', () => {
		expect(fixture.debugElement.nativeElement.classList.contains('ob-drop-zone')).toBe(true);
	});

	it('should have a uploadEvent EventEmitter', () => {
		expect(component.uploadEvent instanceof EventEmitter).toBe(true);
	});

	describe('addFiles', () => {
		it('should filter out invalid files', () => {
			jest.spyOn(service, 'filterInvalidFiles').mockReturnValue([]);
			component.addFiles(files);
			expect(service.filterInvalidFiles).toHaveBeenCalled();
		});

		describe('uploadEvent with only valid files', () => {
			let event: ObIUploadEvent;
			beforeEach(done => {
				jest.spyOn(service, 'filterInvalidFiles').mockReturnValue(Array.from(files));
				component.uploadEvent.subscribe(evt => {
					event = evt;
					done();
				});
				component.addFiles(files);
			});

			it('should emit once', () => {
				expect(event).toBeDefined();
			});

			it('should emit an ObIUploadEvent of type chosen', () => {
				expect(event.type).toBe('chosen');
			});

			it('should emit an ObIUploadEvent with all files', () => {
				expect(event.files).toEqual(files);
			});
			it('should reset fileinput', () => {
				const fileInput = fixture.debugElement.query(By.css('input[type=file]'));
				expect(fileInput.properties.value).toEqual('');
			});
		});

		describe('uploadEvent with no valid files', () => {
			let event: ObIUploadEvent;
			beforeEach(done => {
				jest.spyOn(service, 'filterInvalidFiles').mockReturnValue([]);
				component.uploadEvent.subscribe(evt => {
					event = evt;
					done();
				});
				component.addFiles(files);
			});

			it('should emit once', () => {
				expect(event).toBeDefined();
			});

			it('should emit an ObIUploadEvent of type chosen', () => {
				expect(event.type).toBe('errored');
			});

			it('should emit an ObIUploadEvent with all files', () => {
				expect(event.files).toEqual(files);
			});
			it('should reset fileinput', () => {
				const fileInput = fixture.debugElement.query(By.css('input[type=file]'));
				expect(fileInput.properties.value).toEqual('');
			});
		});

		describe('uploadEvent with both valid and invalid files', () => {
			beforeEach(() => {
				jest.spyOn(service, 'filterInvalidFiles').mockReturnValue([files[0]]);
			});

			describe('chosen event', () => {
				let event: ObIUploadEvent;
				beforeEach(done => {
					component.uploadEvent.pipe(first()).subscribe(evt => {
						event = evt;
						done();
					});
					component.addFiles(files);
				});

				it('should emit', () => {
					expect(event).toBeDefined();
				});

				it('should emit an ObIUploadEvent of type chosen', () => {
					expect(event.type).toBe('chosen');
				});

				it('should emit an ObIUploadEvent with valid files', () => {
					expect(event.files).toEqual([files[0]]);
				});
				it('should reset fileinput', () => {
					const fileInput = fixture.debugElement.query(By.css('input[type=file]'));
					expect(fileInput.properties.value).toEqual('');
				});
			});

			describe('errored event', () => {
				let event: ObIUploadEvent;
				beforeEach(done => {
					component.uploadEvent.pipe(skip(1)).subscribe(evt => {
						event = evt;
						done();
					});
					component.addFiles(files);
				});

				it('should emit', () => {
					expect(event).toBeDefined();
				});

				it('should emit an ObIUploadEvent of type errored', () => {
					expect(event.type).toBe('errored');
				});

				it('should emit an ObIUploadEvent with valid files', () => {
					expect(event.files).toEqual([files[1]]);
				});
				it('should reset fileinput', () => {
					const fileInput = fixture.debugElement.query(By.css('input[type=file]'));
					expect(fileInput.properties.value).toEqual('');
				});
			});
		});
	});
});
