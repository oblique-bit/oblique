import {async, TestBed, ComponentFixture} from '@angular/core/testing';
import {DatepickerComponent} from './datepicker.component';
import {FormsModule} from '@angular/forms';
import {Component} from '@angular/core';
import {NgbInputDatepicker, NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {By} from '@angular/platform-browser';

@Component({
	template: `<or-date-picker>
					<input name="date" [(ngModel)]="model" ngbDatepicker>
				</or-date-picker>`
})
class TestComponent {
	model = null;
}

describe('DatepickerSampleComponent', () => {
	let fixture: ComponentFixture<TestComponent>;
	let component: TestComponent;
	let datepicker: DatepickerComponent;
	let ngbDatepicker: NgbInputDatepicker;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TestComponent, DatepickerComponent],
			imports: [FormsModule, NgbDatepickerModule.forRoot()]
		}).compileComponents();
	}));

	beforeEach(async(() => {
		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		fixture.whenStable().then(() => {
			datepicker = fixture.debugElement.query(By.directive(DatepickerComponent)).injector.get(DatepickerComponent);
			ngbDatepicker = fixture.debugElement.query(By.directive(NgbInputDatepicker)).injector.get(NgbInputDatepicker);
		});
	}));

	it('should toggle the NgbDatepicker on button click', () => {
		spyOn(ngbDatepicker, 'toggle').and.callThrough();

		fixture.debugElement.query(By.css('button')).nativeElement.click();

		expect(ngbDatepicker.toggle).toHaveBeenCalled();
	});

	//TODO: what to test here?

});
