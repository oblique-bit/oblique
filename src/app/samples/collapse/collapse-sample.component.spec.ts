import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {CollapseSampleComponent} from './collapse-sample.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';

describe('ObCollapseSampleComponent', () => {
	let component: CollapseSampleComponent;
	let fixture: ComponentFixture<CollapseSampleComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [ReactiveFormsModule, MatSelectModule],
			declarations: [CollapseSampleComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CollapseSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
