import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {TranslateService} from '@ngx-translate/core';
import {ObDatepickerModule, ObMockTranslatePipe, ObMockTranslateService} from '@oblique/oblique';
import {SchemaValidationSampleComponent} from './schema-validation-sample.component';

describe(SchemaValidationSampleComponent.name, () => {
	let component: SchemaValidationSampleComponent;
	let fixture: ComponentFixture<SchemaValidationSampleComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				ObMockTranslatePipe,
				FormsModule,
				ReactiveFormsModule,
				HttpClientTestingModule,
				RouterTestingModule,
				ObDatepickerModule,
				MatMomentDateModule
			],
			declarations: [SchemaValidationSampleComponent],
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
