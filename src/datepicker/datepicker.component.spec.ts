import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import {DatepickerComponent} from './datepicker.component';
import {FormsModule} from '@angular/forms';
import {Component} from "@angular/core";

@Component({
    template: `

            `
})
class TestComponent {

}

describe('DatepickerComponent', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let datepicker: DatepickerComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent, DatepickerComponent],
            imports: [FormsModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        datepicker = fixture.componentRef.injector.get(DatepickerComponent);
    });

});