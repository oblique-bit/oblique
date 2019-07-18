import {Injectable} from '@angular/core';
import {SpinnerEvent} from './spinner-event';
import {Subject, Observable} from 'rxjs';

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

	public get events(): Observable<SpinnerEvent> {
		return this.events$;
	}

	private readonly eventSubject: Subject<SpinnerEvent> = new Subject<SpinnerEvent>();
	private readonly events$ = this.eventSubject.asObservable();

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
		this.eventSubject.next(event);
	}
}
