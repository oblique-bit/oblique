import {async, TestBed, ComponentFixture} from '@angular/core/testing';
import {Component, DebugElement} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {NgbInputDatepicker, NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {DatepickerComponent} from 'oblique-reactive';

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
	let button: DebugElement;

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
		button = fixture.debugElement.query(By.css('button'));

		fixture.whenStable().then(() => {
			datepicker = fixture.debugElement.query(By.directive(DatepickerComponent)).injector.get(DatepickerComponent);
			ngbDatepicker = fixture.debugElement.query(By.directive(NgbInputDatepicker)).injector.get(NgbInputDatepicker);
		});
	}));

	it('should toggle the NgbDatepicker on button click', () => {
		spyOn(ngbDatepicker, 'toggle').and.callThrough();

		button.nativeElement.click();

		expect(ngbDatepicker.toggle).toHaveBeenCalled();
	});

	it('should disable the button, if disable gets set to true', () => {
		datepicker.disabled = true;

		fixture.detectChanges();

		expect(button.properties['disabled']).toBeTruthy();
	});

	it('should disable the input, if disable gets set to true', () => {
		datepicker.disabled = true;

		fixture.detectChanges();

		expect(fixture.debugElement.query(By.css('input')).properties['disabled']).toBeTruthy();
	});

});
