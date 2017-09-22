import {EventEmitter, Injectable} from '@angular/core';

/**
 * SpinnerService (TODO: Rethink this concept)
 *
 */
@Injectable()
export class SpinnerService {

	public onSpinnerStatusChange: EventEmitter<boolean> = new EventEmitter<boolean>();
	private _spinnerActive = false;

	get isSpinnerActive(): boolean {
		return this._spinnerActive;
	}

	public activateSpinner() {
		this.setSpinnerActive(true);
	}

	public deactivateSpinner() {
		this.setSpinnerActive(false);
	}

	// Workaround to have a private setter:
	private setSpinnerActive(val: boolean) {
		this._spinnerActive = val;
		this.onSpinnerStatusChange.emit(val);
	}
}
