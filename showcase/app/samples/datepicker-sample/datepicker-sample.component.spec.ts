import {ComponentFixture, TestBed, async} from '@angular/core/testing';

import {DatepickerSampleComponent} from './datepicker-sample.component';
import {ObliqueModule} from '../../../../src/index';
import {FormsModule} from '@angular/forms';
import {MockTranslatePipe} from '../../../../testhelpers';
import {NgbDatepickerModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

describe('DatepickerSampleComponent', () => {
	let component: DatepickerSampleComponent;
	let fixture: ComponentFixture<DatepickerSampleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DatepickerSampleComponent, MockTranslatePipe],
			imports: [
				ObliqueModule.forRoot(),
				NgbDatepickerModule.forRoot(),
				NgbTooltipModule.forRoot(),
				FormsModule
			]
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
