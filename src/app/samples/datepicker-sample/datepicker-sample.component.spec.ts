import {FormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NgbDatepickerModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {DatepickerSampleComponent} from './datepicker-sample.component';
import {ObDatepickerModule, ObDatepickerPlaceholderDirective, ObliqueTestingModule} from '@oblique/oblique';

describe('ObDatepickerSampleComponent', () => {
	let component: DatepickerSampleComponent;
	let fixture: ComponentFixture<DatepickerSampleComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [DatepickerSampleComponent],
				imports: [ObDatepickerModule, NgbDatepickerModule, NgbTooltipModule, FormsModule, ObliqueTestingModule],
				schemas: [CUSTOM_ELEMENTS_SCHEMA]
			})
				.overrideModule(ObDatepickerModule, {
					// We don't need this directive in this test
					remove: {
						declarations: [ObDatepickerPlaceholderDirective],
						exports: [ObDatepickerPlaceholderDirective]
					}
				})
				.compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(DatepickerSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
