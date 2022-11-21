import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {ObMockTranslatePipe, ObMockTranslateService} from '@oblique/oblique';
import {SchemaValidationSampleComponent} from './schema-validation-sample.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';

describe('ObSchemaValidationSampleComponent', () => {
	let component: SchemaValidationSampleComponent;
	let fixture: ComponentFixture<SchemaValidationSampleComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, MatDatepickerModule],
			declarations: [SchemaValidationSampleComponent, ObMockTranslatePipe],
			providers: [{provide: TranslateService, useClass: ObMockTranslateService}],
			schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SchemaValidationSampleComponent);
		component = fixture.componentInstance;
		component.ngOnInit();
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
