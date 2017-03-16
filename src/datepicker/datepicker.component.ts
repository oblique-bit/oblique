import {Component, ViewChild, AfterViewInit, forwardRef} from '@angular/core';
import {ControlValueAccessor, NgModel, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
    selector: 'date-picker',
    /* tslint:disable no-access-missing-member */ //TODO: remove this, as soon as we use codelyzer 3.*
    template: `
        <div class="input-group">
            <input class="form-control" placeholder="yyyy-mm-dd"
                 name="dp" [(ngModel)]="model" ngbDatepicker #datePicker="ngbDatepicker">
            <div class="input-group-addon" (click)="datePicker.toggle()" >
                <img src="img/calendar-icon.svg" style="width: 1.2rem; height: 1rem; cursor: pointer;"/>
            </div>
        </div>`,
    /* tslint:enable no-access-missing-member */
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatepickerComponent),
            multi: true
        }
    ]
})
export class DatepickerComponent implements ControlValueAccessor, AfterViewInit {
    @ViewChild(NgModel) ngModel: NgModel;

    model: any;

    propagateChanges = (_: any) => {/**/};

    propagateTouch = () => {/**/};

    ngAfterViewInit(): void {
        this.ngModel.update.subscribe(val => {
            this.propagateChanges(val);
        });
        this.ngModel.valueAccessor.registerOnTouched(() => {
            this.propagateTouch();
        });
    }

    writeValue(obj: any): void {
        this.model = obj;
    }

    registerOnChange(fn: any): void {
        this.propagateChanges = fn;
    }

    registerOnTouched(fn: any): void {
        this.propagateTouch = fn;
    }

}