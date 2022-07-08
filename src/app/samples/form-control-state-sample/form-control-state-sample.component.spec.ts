import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ObliqueTestingModule} from '@oblique/oblique';
import {FormControlStateSampleComponent} from './form-control-state-sample.component';

describe('ObFormControlStateSampleComponent', () => {
	let component: FormControlStateSampleComponent;
	let fixture: ComponentFixture<FormControlStateSampleComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [FormControlStateSampleComponent],
			imports: [FormsModule, ReactiveFormsModule, ObliqueTestingModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
