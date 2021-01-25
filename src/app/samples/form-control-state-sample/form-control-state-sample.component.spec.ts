import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ObFormControlStateSampleComponent} from './form-control-state-sample.component';
import {ObliqueTestingModule} from 'oblique/lib/oblique-testing.module';

describe('ObFormControlStateSampleComponent', () => {
	let component: ObFormControlStateSampleComponent;
	let fixture: ComponentFixture<ObFormControlStateSampleComponent>;
	let schemaValidationService;

	beforeEach(async(() => {
		schemaValidationService = {
			isRequired: jest.fn()
		};

		TestBed.configureTestingModule({
			declarations: [ObFormControlStateSampleComponent],
			imports: [FormsModule, ReactiveFormsModule, ObliqueTestingModule]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ObFormControlStateSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
