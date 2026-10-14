import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, OutputEmitterRef, Pipe, PipeTransform} from '@angular/core';
import {outputToObservable} from '@angular/core/rxjs-interop';
import {firstValueFrom, take, toArray} from 'rxjs';
import {ObIUploadEvent} from '../file-upload.model';
import {ObDropZoneComponent} from './ob-drop-zone.component';
import {ObValidationService} from './validation.service';
import {By} from '@angular/platform-browser';
import {provideObliqueTestingConfiguration} from '../../utilities';

@Pipe({
	name: 'obAcceptAll',
	standalone: false,
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
		new File(['image'], 'sample.jpg', {type: 'text/plain'}),
	] as unknown as FileList;

	beforeEach(async () => {
		TestBed.overrideProvider(ObValidationService, {useValue: service});
		await TestBed.configureTestingModule({
			imports: [ObDropZoneComponent],
			declarations: [ObMockAreAllTypesAllowedPipe],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [provideObliqueTestingConfiguration()],
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

	it('should have a uploadEvent OutputEmitterRef', () => {
		expect(component.uploadEvent instanceof OutputEmitterRef).toBe(true);
	});

	describe('accept', () => {
		it('should not contain a type hint if all types are accepted', () => {
			fixture.componentRef.setInput('accept', ['*']);
			fixture.detectChanges();
			const hintContainer = fixture.debugElement.query(By.css('.ob-drop-zone-hints'));
			expect(hintContainer.nativeElement.textContent).not.toContain('i18n.oblique.file-upload.hint.type');
		});

		it('should contain a type hint with accepted types', () => {
			fixture.componentRef.setInput('accept', ['.txt']);
			fixture.detectChanges();
			const hintContainer = fixture.debugElement.query(By.css('.ob-drop-zone-hints'));
			expect(hintContainer.nativeElement.textContent).toContain('i18n.oblique.file-upload.hint.type .txt');
		});
	});

	describe('multiple', () => {
		it.each([
			{case: '', multiple: true, attribute: ''},
			{case: 'not', multiple: false, attribute: undefined},
		])('should $case have the multiple attribute', ({multiple, attribute}) => {
			fixture.componentRef.setInput('multiple', multiple);
			fixture.detectChanges();
			const inputElement = fixture.debugElement.query(By.css('.ob-drop-zone-text > input'));
			expect(inputElement.attributes['multiple']).toBe(attribute);
		});
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
				outputToObservable(component.uploadEvent).subscribe(evt => {
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
				outputToObservable(component.uploadEvent).subscribe(evt => {
					event = evt;
					done();
				});
				component.addFiles(files);
			});

			it('should emit once', () => {
				expect(event).toBeDefined();
			});

			it('should emit an ObIUploadEvent of type errored', () => {
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
			const chosenEvent = {files: [files[0]], type: 'chosen'};
			const erroredEvent = {files: [files[1]], type: 'errored'};
			let events: ObIUploadEvent[];

			beforeEach(async () => {
				jest.spyOn(service, 'filterInvalidFiles').mockReturnValue([files[0]]);
				const eventPromise = firstValueFrom(outputToObservable(component.uploadEvent).pipe(take(2), toArray()));
				component.addFiles(files);
				events = await eventPromise;
			});

			describe('chosen event', () => {
				let event: ObIUploadEvent;

				beforeEach(() => {
					event = events[0];
				});

				it('should emit', () => {
					expect(event).toBeDefined();
				});

				it('should emit an ObIUploadEvent of type chosen', () => {
					expect(event.type).toEqual(chosenEvent.type);
				});

				it('should emit an ObIUploadEvent with valid files', () => {
					expect(event.files).toEqual(chosenEvent.files);
				});

				it('should reset fileinput', () => {
					const fileInput = fixture.debugElement.query(By.css('input[type=file]'));
					expect(fileInput.properties.value).toEqual('');
				});
			});

			describe('errored event', () => {
				let event: ObIUploadEvent;

				beforeEach(() => {
					event = events[1];
				});

				it('should emit', () => {
					expect(event).toBeDefined();
				});

				it('should emit an ObIUploadEvent of type errored', () => {
					expect(event.type).toEqual(erroredEvent.type);
				});

				it('should emit an ObIUploadEvent with valid files', () => {
					expect(event.files).toEqual(erroredEvent.files);
				});

				it('should reset fileinput', () => {
					const fileInput = fixture.debugElement.query(By.css('input[type=file]'));
					expect(fileInput.properties.value).toEqual('');
				});
			});
		});
	});
});
