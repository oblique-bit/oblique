import {Injectable} from '@angular/core';
import {ObISpinnerEvent} from './spinner-event';
import {Subject, Observable} from 'rxjs';

/**
 * SpinnerService (TODO: Rethink this concept)
 *
 */
@Injectable({providedIn: 'root'})
export class ObSpinnerService {

	/**
	 * The channel name where spinner events will be broadcasted to.
	 */
	public static CHANNEL = 'default';

	public get events(): Observable<ObISpinnerEvent> {
		return this.events$;
	}

	private readonly eventSubject: Subject<ObISpinnerEvent> = new Subject<ObISpinnerEvent>();
	private readonly events$ = this.eventSubject.asObservable();

	public activate(channel: string = ObSpinnerService.CHANNEL) {
		this.broadcast({
			active: true,
			channel
		});
	}

	public deactivate(channel: string = ObSpinnerService.CHANNEL) {
		this.broadcast({
			active: false,
			channel
		});
	}

	private broadcast(event: ObISpinnerEvent) {
		this.eventSubject.next(event);
	}
}
