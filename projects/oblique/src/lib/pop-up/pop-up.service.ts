import {Injectable} from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class PopUpService {
	public confirm(message?: string): boolean {
		return window ? window.confirm(message) : true;
	}

	public alert(message?: any): void {
		if (window) {
			window.alert(message);
		}
	}

	public prompt(message?: string, _default?: string): string | null {
		return window ? window.prompt(message, _default) : null;
	}
}
