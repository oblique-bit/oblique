import {Injectable} from '@angular/core';
import {ObSpinnerComponent} from './spinner.component';

@Injectable({providedIn: 'root'})
export class ObSpinnerRegistry {
	private readonly spinners: ObSpinnerComponent[] = [];

	register(spinner: ObSpinnerComponent): void {
		this.spinners.push(spinner);
	}

	unregister(spinner: ObSpinnerComponent): void {
		const index = this.spinners.indexOf(spinner);
		if (index !== -1) {
			this.spinners.splice(index, 1);
		}
	}

	hasChannel(channelName: string): boolean {
		return this.spinners.some(spinners => spinners.channel() === channelName);
	}
}
