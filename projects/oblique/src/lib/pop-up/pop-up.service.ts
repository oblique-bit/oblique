import {Inject, Injectable} from '@angular/core';
import {WINDOW} from '../utilities';

/**
 * @deprecated since version 10.2.1. It will be removed with Oblique 11. WINDOW should be used instead.
 */
@Injectable({
	providedIn: 'root'
})
export class ObPopUpService {
	private readonly window: Window;

	constructor(@Inject(WINDOW) window) {
		this.window = window; // because AoT don't accept interfaces as DI
	}
	public confirm(message?: string): boolean {
		return this.window.confirm(message);
	}

	public alert(message?: any): void {
		this.window.alert(message);
	}

	public prompt(message?: string, _default?: string): string | null {
		return this.window.prompt(message, _default);
	}
}
