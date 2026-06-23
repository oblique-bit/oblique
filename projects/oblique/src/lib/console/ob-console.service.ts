import {Injectable, inject} from '@angular/core';
import {OB_CONSOLE_CONFIGURATION} from './ob-console.provider';

@Injectable({
	providedIn: 'root',
})
export class ObConsoleService {
	private readonly consoleConfiguration = inject(OB_CONSOLE_CONFIGURATION, {optional: true});
	private readonly silencedLabels = this.consoleConfiguration?.silencedLabels ?? new Set();

	public warn(label: string, ...args: unknown[]): void {
		this.log(console.warn, label, args);
	}

	public info(label: string, ...args: unknown[]): void {
		this.log(console.info, label, args);
	}

	public error(label: string, ...args: unknown[]): void {
		this.log(console.error, label, args);
	}

	private log(method: (...args: unknown[]) => void, label: string, args: unknown[]): void {
		if (this.isSilenced(label)) {
			return;
		}
		method(label, ...args);
	}

	private isSilenced(label: string): boolean {
		return this.silencedLabels.has(label);
	}
}
