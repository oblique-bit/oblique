import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormControlStateSampleComponent} from './form-control-state-sample.component';
import {ObliqueTestingModule} from 'oblique/lib/oblique-testing.module';

describe('FormControlStateSampleComponent', () => {
	let component: FormControlStateSampleComponent;
	let fixture: ComponentFixture<FormControlStateSampleComponent>;
	let schemaValidationService;

	beforeEach(async(() => {
		schemaValidationService = {
			isRequired: jest.fn()
		};

		TestBed.configureTestingModule({
			declarations: [FormControlStateSampleComponent],
			imports: [FormsModule, ReactiveFormsModule, ObliqueTestingModule]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FormControlStateSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
