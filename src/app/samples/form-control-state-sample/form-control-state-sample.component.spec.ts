import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ObliqueModule, SchemaValidationService} from 'oblique-reactive';
import {MockTranslatePipe} from 'tests';
import {FormControlStateSampleComponent} from './form-control-state-sample.component';


describe('FormControlStateSampleComponent', () => {
	let component: FormControlStateSampleComponent;
	let fixture: ComponentFixture<FormControlStateSampleComponent>;
	let schemaValidationService;

	beforeEach(async(() => {
		schemaValidationService = {
			isRequired: jest.fn()
		};

		TestBed.configureTestingModule({
			declarations: [
				FormControlStateSampleComponent,
				MockTranslatePipe
			],
			providers: [
				{provide: SchemaValidationService, useValue: schemaValidationService}
			],
			imports: [
				FormsModule,
				ReactiveFormsModule,
				ObliqueModule.forRoot()
			]
		})
			.compileComponents();
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
