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
	public spinnerActive = false;

	private loadingId = 0;
	private loadings: Loading[] = [];

	constructor(private notificationService: NotificationService, @Optional() @Inject('spinnerMaxTimeout') private maxTimeout: number) {
		if (!maxTimeout) {
			this.maxTimeout = 10000;
		}
	}

	public activateSpinner() {
		this.spinnerActive = true;
		this.onSpinnerStatusChange.emit(true);

		const id = this.loadingId;
		// Create timeout and fail in case request takes too long to execute:
		this.loadings.push(new Loading(
			this.loadingId,
			setTimeout(() => {
				// when timeout, search if timeout is still active, when yes show error
				const currentLoading = this.loadings.filter((loading) => {
					return loading.id === id;
				});

				if (typeof currentLoading !== 'undefined') {
					this.deactivateSpinner();
					this.notificationService.error('i18n.error.other.timeout');
				}

			}, this.maxTimeout)
		));
		this.loadingId++;
		this.spinnerActive = this.loadings.length > 0;
	}

	public deactivateSpinner() {
		if (this.loadings.length > 0) {
			clearTimeout(this.loadings.shift().timeout);
			this.spinnerActive = this.loadings.length > 0;
			this.onSpinnerStatusChange.emit(false);
		}
	}
}


