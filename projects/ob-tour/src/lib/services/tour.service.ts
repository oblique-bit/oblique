import {Injectable, signal} from '@angular/core';
import {ObToursConfig} from './../models/tour-config.model';

@Injectable({
	providedIn: 'root'
})
export class ObTourService {
	private readonly config = signal<ObToursConfig | null>(null);

	init(config: ObToursConfig): void {
		this.config.set(config);
	}

	getConfig(): ObToursConfig | null {
		return this.config();
	}
}
