import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ObSchemaValidationSampleComponent} from './schema-validation-sample.component';
import {ObliqueTestingModule} from 'projects/oblique/src/lib/oblique-testing.module';

describe('ObSchemaValidationSampleComponent', () => {
	let component: ObSchemaValidationSampleComponent;
	let fixture: ComponentFixture<ObSchemaValidationSampleComponent>;
	let mockNotificationService;

	beforeEach(() => {
		mockNotificationService = {
			warning: jest.fn(),
			error: jest.fn(),
			success: jest.fn(),
			info: jest.fn()
		};

		TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, NgbModule, ObliqueTestingModule],
			declarations: [ObSchemaValidationSampleComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ObSchemaValidationSampleComponent);
		component = fixture.componentInstance;
		// Initialize the component to avoid async failure:
		component.ngOnInit();
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
