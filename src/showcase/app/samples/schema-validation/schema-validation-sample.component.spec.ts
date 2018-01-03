import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ErrorMessagesModule, SchemaValidationModule, FormControlStateModule} from '../../../../lib';
import {MockTranslatePipe} from '../../../../../testhelpers';
import {SchemaValidationSampleComponent} from './schema-validation-sample.component';

describe('SchemaValidationComponent', () => {
	let component: SchemaValidationSampleComponent;
	let fixture: ComponentFixture<SchemaValidationSampleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				SchemaValidationModule,
				FormsModule,
				ErrorMessagesModule.forRoot(),
				FormControlStateModule.forRoot()
			],
			declarations: [
				SchemaValidationSampleComponent,
				MockTranslatePipe
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

	// it('should create', () => {
	// 	expect(component).toBeTruthy();
	// });
});
