import {Injectable, signal} from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class AppStateService {
	readonly showCustomHeader = signal(false);
	readonly showCustomHeaderLogo = signal(false);
}
