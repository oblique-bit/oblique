import {FormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NgbDatepickerModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {DatepickerSampleComponent} from './datepicker-sample.component';
import {DatepickerModule, DatepickerPlaceholderDirective} from 'oblique';
import {ObliqueTestingModule} from 'oblique/lib/oblique-testing.module';

describe('DatepickerSampleComponent', () => {
	let component: DatepickerSampleComponent;
	let fixture: ComponentFixture<DatepickerSampleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DatepickerSampleComponent],
			imports: [DatepickerModule, NgbDatepickerModule, NgbTooltipModule, FormsModule, ObliqueTestingModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		})
			.overrideModule(DatepickerModule, {
				//We don't need this directive in this test
				remove: {
					declarations: [DatepickerPlaceholderDirective],
					exports: [DatepickerPlaceholderDirective]
				}
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DatepickerSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
