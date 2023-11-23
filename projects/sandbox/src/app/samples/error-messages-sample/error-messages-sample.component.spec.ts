import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ErrorMessagesSampleComponent} from './error-messages-sample.component';

describe('ObErrorMessagesSampleComponent', () => {
	let component: ErrorMessagesSampleComponent;
	let fixture: ComponentFixture<ErrorMessagesSampleComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [ReactiveFormsModule, FormsModule, MatSelectModule, MatFormFieldModule, MatInputModule, NoopAnimationsModule],
			declarations: [ErrorMessagesSampleComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ErrorMessagesSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
