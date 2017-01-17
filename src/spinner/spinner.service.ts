import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class SpinnerService {

    public onSpinnerStatusChange : EventEmitter<boolean> = new EventEmitter<boolean>();
    private spinnerActive : boolean = false;

    public activateSpinner() {
        this.spinnerActive = true;
        this.onSpinnerStatusChange.emit(true);
    }

    public deactivateSpinner() {
        this.spinnerActive = false;
        this.onSpinnerStatusChange.emit(false);
    }

}
