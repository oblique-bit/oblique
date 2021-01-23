import {FormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NgbDatepickerModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {ObDatepickerSampleComponent} from './datepicker-sample.component';
import {ObliqueTestingModule} from 'oblique/lib/oblique-testing.module';
import {ObDatepickerModule, ObDatepickerPlaceholderDirective} from 'oblique/lib/datepicker/datepicker.module';

describe('ObDatepickerSampleComponent', () => {
	let component: ObDatepickerSampleComponent;
	let fixture: ComponentFixture<ObDatepickerSampleComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [ObDatepickerSampleComponent],
				imports: [ObDatepickerModule, NgbDatepickerModule, NgbTooltipModule, FormsModule, ObliqueTestingModule],
				schemas: [CUSTOM_ELEMENTS_SCHEMA]
			})
				.overrideModule(ObDatepickerModule, {
					//We don't need this directive in this test
					remove: {
						declarations: [ObDatepickerPlaceholderDirective],
						exports: [ObDatepickerPlaceholderDirective]
					}
				})
				.compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ObDatepickerSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
