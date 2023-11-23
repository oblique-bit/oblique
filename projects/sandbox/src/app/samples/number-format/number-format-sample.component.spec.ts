import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ObliqueTestingModule} from '@oblique/oblique';
import {NumberFormatSampleComponent} from './number-format-sample.component';

describe(NumberFormatSampleComponent.name, () => {
	let component: NumberFormatSampleComponent;
	let fixture: ComponentFixture<NumberFormatSampleComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, ObliqueTestingModule],
			declarations: [NumberFormatSampleComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NumberFormatSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
