import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DatepickerComponent} from './datepicker.component';
import {DatepickerModule} from '../../../../src/datepicker/datepicker.module';
import {FormsModule} from '@angular/forms';
import {MockTranslatePipe} from '../../../../testhelpers';

describe('DatepickerComponent', () => {
	let component: DatepickerComponent;
	let fixture: ComponentFixture<DatepickerComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [DatepickerComponent, MockTranslatePipe],
			imports: [DatepickerModule, FormsModule]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DatepickerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
