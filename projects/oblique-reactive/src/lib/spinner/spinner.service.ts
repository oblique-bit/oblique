import {EventEmitter, Injectable} from '@angular/core';
import {SpinnerEvent} from './spinner-event';

/**
 * SpinnerService (TODO: Rethink this concept)
 *
 */
@Injectable({providedIn: 'root'})
export class SpinnerService {

	/**
	 * The channel name where spinner events will be broadcasted to.
	 */
	public static CHANNEL = 'default';

	public events: EventEmitter<SpinnerEvent> = new EventEmitter<SpinnerEvent>();

	public activate(channel: string = SpinnerService.CHANNEL) {
		this.broadcast({
			active: true,
			channel
		});
	}

	public deactivate(channel: string = SpinnerService.CHANNEL) {
		this.broadcast({
			active: false,
			channel
		});
	}

	private broadcast(event: SpinnerEvent) {
		this.events.emit(event);
	}
}
