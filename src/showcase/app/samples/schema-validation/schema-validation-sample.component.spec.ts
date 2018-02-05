import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ErrorMessagesModule, SchemaValidationModule, FormControlStateModule} from '../../../../lib';
import {MockTranslatePipe} from '../../../../../testhelpers';
import {SchemaValidationSampleComponent} from './schema-validation-sample.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SchemaValidationService} from '../../../../lib/ng/schema-validation';
import {NotificationService} from '../../../../lib/ng/notification';

describe('SchemaValidationComponent', () => {
	let component: SchemaValidationSampleComponent;
	let fixture: ComponentFixture<SchemaValidationSampleComponent>;
	let mockNotificationService;

	beforeEach(async(() => {
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
			providers: [SchemaValidationService,
				{provide: NotificationService, useValue: mockNotificationService}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SchemaValidationSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
