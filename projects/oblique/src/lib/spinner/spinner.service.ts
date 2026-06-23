import {Injectable, inject} from '@angular/core';
import {ObISpinnerEvent} from './spinner.model';
import {Observable, Subject} from 'rxjs';
import {ObSpinnerRegistry} from './spinner.registry';
import {ObConsoleService} from '../console/ob-console.service';

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

	private calls: Record<string, number> = {};
	private readonly events: Subject<ObISpinnerEvent> = new Subject<ObISpinnerEvent>();
	private readonly spinnerRegistry = inject(ObSpinnerRegistry);
	private readonly obConsole = inject(ObConsoleService);

	constructor() {
		this.events$ = this.events.asObservable();
	}

	public activate(channel = ObSpinnerService.CHANNEL): void {
		if (!this.spinnerRegistry.hasChannel(channel)) {
			this.obConsole.warn('ObSpinnerService activate()', 'Attempt to activate a channel that does not exist:', channel);
		}

		if (this.increase(channel) === 1) {
			this.broadcast({
				active: true,
				channel,
			});
		}
	}

	public deactivate(channel = ObSpinnerService.CHANNEL): void {
		if (!this.spinnerRegistry.hasChannel(channel)) {
			this.obConsole.warn(
				'ObSpinnerService deactivate()',
				'Attempt to deactivate a channel that does not exist:',
				channel
			);
		}

		if (this.decrease(channel) === 0) {
			this.broadcast({
				active: false,
				channel,
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

	private increase(channel: string): number {
		this.calls[channel] = (this.calls[channel] || 0) + 1;
		return this.calls[channel];
	}

	private decrease(channel: string): number {
		this.calls[channel] = (this.calls[channel] || 1) - 1;
		return this.calls[channel];
	}
}
