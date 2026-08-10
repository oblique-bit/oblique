import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {provideObliqueTestingConfiguration} from '@oblique/oblique';
import {NumberFormatSampleComponent} from './number-format-sample.component';
import {TranslatePipe} from '@ngx-translate/core';

describe(NumberFormatSampleComponent.name, () => {
	let component: NumberFormatSampleComponent;
	let fixture: ComponentFixture<NumberFormatSampleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, TranslatePipe],
			declarations: [NumberFormatSampleComponent],
			providers: [provideObliqueTestingConfiguration()],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NumberFormatSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should update the form field number5', () => {
		component.setNumber5();

		expect(component.formData.value.number5).toBe(6.2356487);
	});

	it('should update number6', () => {
		component.setNumber6();

		expect(component.formData.value.number6).toBe(6.2356487);
	});
});
