import {Component, ViewChild, AfterViewInit, forwardRef, ContentChild} from '@angular/core';
import {ControlValueAccessor, NgModel, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'date-picker',
    template: `
        <div class="input-group">
            <ng-content></ng-content>
            <button role="button" class="input-group-addon" (click)="ngbDatePicker.toggle()" >
                <span class="fa fa-calendar"></span>
            </button>
        </div>`,

})
export class DatepickerComponent {
    @ContentChild(NgbInputDatepicker) ngbDatePicker;
}