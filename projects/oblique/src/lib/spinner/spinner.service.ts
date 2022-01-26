import {Injectable} from '@angular/core';
import {ObISpinnerEvent} from './spinner.model';
import {Observable, Subject} from 'rxjs';

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

	public readonly events$: Observable<ObISpinnerEvent>;

	private calls: {[key: string]: number} = {};
	private readonly events: Subject<ObISpinnerEvent> = new Subject<ObISpinnerEvent>();

	constructor() {
		this.events$ = this.events.asObservable();
	}

	public activate(channel = ObSpinnerService.CHANNEL): void {
		if (this.increase(channel) === 1) {
			this.broadcast({
				active: true,
				channel
			});
		}
	}

	public deactivate(channel = ObSpinnerService.CHANNEL): void {
		if (this.decrease(channel) === 0) {
			this.broadcast({
				active: false,
				channel
			});
		}
	}

	public forceDeactivate(channel = ObSpinnerService.CHANNEL): void {
		this.calls[channel] = 0;
		this.deactivate(channel);
	}

	private broadcast(event: ObISpinnerEvent): void {
		this.events.next(event);
	}

	private increase(channel: string = ObSpinnerService.CHANNEL): number {
		return (this.calls[channel] = (this.calls[channel] || 0) + 1);
	}

	private decrease(channel: string = ObSpinnerService.CHANNEL): number {
		return (this.calls[channel] = (this.calls[channel] || 1) - 1);
	}
}
