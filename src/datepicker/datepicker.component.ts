import {Component, ContentChild} from '@angular/core';
import {NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';

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