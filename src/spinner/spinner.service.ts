import {EventEmitter, Injectable, Optional, Inject} from '@angular/core';
import {NotificationService} from '../notification/notification.service';
import {Loading} from './loading';

//TODO: Rethink this concept
/**
 * SpinnerService
 *
 * providers:
 *    spinnerMaxTimeout: max time (in ms) a loading should take
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

	//Workaround to have a private setter
	private setSpinnerActive(val: boolean) {
		this._spinnerActive = val;
		this.onSpinnerStatusChange.emit(val);
	}
}


