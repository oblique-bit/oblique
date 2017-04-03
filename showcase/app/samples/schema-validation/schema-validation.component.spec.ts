/* tslint:disable:no-unused-variable */
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';

import {SchemaValidationComponent} from './schema-validation.component';
import {MockTranslatePipe} from '../../../../testhelpers';
import {SchemaValidationModule} from '../../../../src/schema-validation/schema-validation.module';

describe('SchemaValidationComponent', () => {
	let component: SchemaValidationComponent;
	let fixture: ComponentFixture<SchemaValidationComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [SchemaValidationModule, FormsModule],
			declarations: [SchemaValidationComponent, MockTranslatePipe],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SchemaValidationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
