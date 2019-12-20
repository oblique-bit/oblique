import {Inject, Injectable} from '@angular/core';
import {WINDOW} from '../utilities';

@Injectable({
	providedIn: 'root'
})
export class PopUpService {
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
