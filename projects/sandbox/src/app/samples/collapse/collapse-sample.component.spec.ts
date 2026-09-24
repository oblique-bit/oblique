import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CollapseSampleComponent} from './collapse-sample.component';
import {MatSelectModule} from '@angular/material/select';

describe(CollapseSampleComponent.name, () => {
	let component: CollapseSampleComponent;
	let fixture: ComponentFixture<CollapseSampleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ReactiveFormsModule, MatSelectModule],
			declarations: [CollapseSampleComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CollapseSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should display activeChange events', () => {
		component.recordActiveChange(true);
		fixture.detectChanges();

		const eventDisplay = fixture.nativeElement.querySelector('[data-test="collapse-active-change"]');

		expect(eventDisplay.getAttribute('data-active')).toBe('true');
		expect(eventDisplay.getAttribute('data-count')).toBe('1');
		expect(eventDisplay.textContent).toContain('activeChange: true');
	});

	it('should toggle the active signal', () => {
		expect(component.active()).toBeFalsy();

		component.toggleActive();
		expect(component.active()).toBeTruthy();

		component.toggleActive();
		expect(component.active()).toBeFalsy();
	});
});
