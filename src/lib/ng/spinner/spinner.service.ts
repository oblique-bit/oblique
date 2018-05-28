import {EventEmitter, Injectable} from '@angular/core';
import {SpinnerEvent} from './spinner-event';

/**
 * SpinnerService (TODO: Rethink this concept)
 *
 */
@Injectable()
export class SpinnerService {

	/**
	 * The channel name where spinner events will be broadcasted to.
	 *
	 * @type {string}
	 */
	public static CHANNEL = 'default';

	public events: EventEmitter<SpinnerEvent> = new EventEmitter<SpinnerEvent>();

	public activate(channel: string = SpinnerService.CHANNEL) {
		this.broadcast({
			active: true,
			channel: channel
		});
	}

	public deactivate(channel: string = SpinnerService.CHANNEL) {
		this.broadcast({
			active: false,
			channel: channel
		});
	}

	// Workaround to have a private setter:
	private broadcast(event: SpinnerEvent) {
		this.events.emit(event);
	}
}
