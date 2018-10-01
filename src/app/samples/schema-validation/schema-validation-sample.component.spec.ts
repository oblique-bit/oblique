import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
	ErrorMessagesModule,
	FormControlStateModule,
	NotificationService,
	SchemaValidationModule,
	SchemaValidationService
} from 'oblique-reactive';
import {MockTranslatePipe} from 'tests';
import {SchemaValidationSampleComponent} from './schema-validation-sample.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

describe('SchemaValidationSampleComponent', () => {
	let component: SchemaValidationSampleComponent;
	let fixture: ComponentFixture<SchemaValidationSampleComponent>;
	let mockNotificationService;

	beforeEach(() => {
		mockNotificationService = jasmine.createSpyObj('NotificationService', ['']);
		TestBed.configureTestingModule({
			imports: [
				SchemaValidationModule,
				FormsModule,
				ReactiveFormsModule,
				ErrorMessagesModule.forRoot(),
				FormControlStateModule.forRoot(),
				NgbModule.forRoot()
			],
			declarations: [
				SchemaValidationSampleComponent,
				MockTranslatePipe
			],
			providers: [
				SchemaValidationService,
				{
					provide: NotificationService,
					useValue: mockNotificationService
				}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SchemaValidationSampleComponent);
		component = fixture.componentInstance;
		// Initialize the component to avoid async failure:
		component.ngOnInit();
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
